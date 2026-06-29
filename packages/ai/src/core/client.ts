/**
 * AI 客户端封装 - references/01 §2.8 core/client + references/08 §11.11/11.12
 *
 * 多供应商适配：默认走 OpenAI 兼容接口（通义千问 DashScope compatible-mode，DECISIONS D003）
 * 统一暴露：recognizeFood / generatePlan / chat / chatStream
 *
 * 约束（references/08 §11.13）：
 * - API Key 从 env 读取，禁止硬编码
 * - server controller 禁止直接写 SDK 调用，必须经本客户端
 * - 流式响应用 SSE
 * - 记录 token 用量
 * - 限流+重试在 core/retry.ts
 */
import type {
  AiRequest,
  AiResponse,
  AiStreamChunk,
  AiTokenUsage,
  FoodItem,
  FoodRecognizeRequest,
  FoodRecognizeResponse,
  Nutrition,
  PlanGenerateRequest,
  PlanGenerateResponse,
  PlanItem,
} from '@bomi/shared';
import { getAiEnv, type AiEnvRuntime } from '../config/env';
import { AI_CLIENT_DEFAULTS, AI_MODELS, OPENAI_COMPAT_PATH } from '../config/constants';
import { AiHttpError, AiParseError } from './errors';
import { callWithRetry } from './retry';
import { parseSseStream } from './stream';
import { foodRecognizePrompt, type FoodRecognizeModelOutput } from '../prompts/food-recognize';
import { planGeneratePrompt, type PlanGenerateModelOutput } from '../prompts/plan-generate';

// ---- OpenAI 兼容接口类型 ----

interface OpenAiTextPart {
  type: 'text';
  text: string;
}
interface OpenAiImagePart {
  type: 'image_url';
  image_url: { url: string };
}
type OpenAiContent = string | Array<OpenAiTextPart | OpenAiImagePart>;

interface OpenAiMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: OpenAiContent;
}

interface OpenAiChatRequest {
  model: string;
  messages: OpenAiMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface OpenAiChatResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenAiStreamChunk {
  choices?: Array<{
    delta: { content?: string };
    finish_reason?: string | null;
  }>;
}

// ---- AiClient ----

export class AiClient {
  private readonly env: AiEnvRuntime;

  constructor(env?: AiEnvRuntime) {
    this.env = env ?? getAiEnv();
  }

  /** 当前使用的模型信息（供 server 透传给前端展示） */
  get models(): { chat: string; vision: string; plan: string } {
    return {
      chat: this.env.defaultChatModel,
      vision: this.env.defaultVlmModel,
      plan: this.env.defaultPlanModel,
    };
  }

  // ============ 通用对话 ============

  /** 对话（非流式） */
  async chat(request: AiRequest): Promise<AiResponse> {
    const model = request.model ?? this.env.defaultChatModel;
    const response = await this.postChatWithRetry({
      model,
      messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: request.temperature ?? AI_CLIENT_DEFAULTS.TEMPERATURE,
      max_tokens: request.maxTokens ?? AI_CLIENT_DEFAULTS.MAX_TOKENS,
      stream: false,
    });
    const content = response.choices[0]?.message?.content ?? '';
    return {
      sessionId: request.sessionId,
      content,
      model: response.model,
      usage: mapUsage(response.usage),
    };
  }

  /** 对话（流式，SSE 分片）- server 转发前端用 */
  async *chatStream(request: AiRequest): AsyncGenerator<AiStreamChunk, void, unknown> {
    const model = request.model ?? this.env.defaultChatModel;
    const url = `${this.env.baseUrl}${OPENAI_COMPAT_PATH}`;
    const body: OpenAiChatRequest = {
      model,
      messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: request.temperature ?? AI_CLIENT_DEFAULTS.TEMPERATURE,
      max_tokens: request.maxTokens ?? AI_CLIENT_DEFAULTS.MAX_TOKENS,
      stream: true,
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: this.buildHeaders({ accept: 'text/event-stream' }),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.env.timeoutMs),
    });
    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new AiHttpError(res.status, text);
    }
    for await (const data of parseSseStream(res.body)) {
      if (data.length === 0) continue;
      try {
        const parsed = JSON.parse(data) as OpenAiStreamChunk;
        const delta = parsed.choices?.[0]?.delta?.content ?? '';
        if (delta) {
          yield { content: delta, done: false };
        }
      } catch {
        // 跳过非 JSON 帧（心跳/注释等）
      }
    }
    yield { content: '', done: true };
  }

  // ============ 食物识别（VLM） ============

  /** 食物照片识别 - qwen-vl-max（DECISIONS D003） */
  async recognizeFood(req: FoodRecognizeRequest): Promise<FoodRecognizeResponse> {
    if (!req.imageUrl && !req.imageBase64) {
      throw new AiParseError('', 'recognizeFood requires imageUrl or imageBase64');
    }
    const prompt = foodRecognizePrompt();
    const userContent: Array<OpenAiTextPart | OpenAiImagePart> = [
      { type: 'text', text: prompt.user },
    ];
    if (req.imageUrl) {
      userContent.push({ type: 'image_url', image_url: { url: req.imageUrl } });
    }
    if (req.imageBase64) {
      userContent.push({
        type: 'image_url',
        image_url: { url: `data:image/jpeg;base64,${req.imageBase64}` },
      });
    }

    const response = await this.postChatWithRetry({
      model: this.env.defaultVlmModel,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: userContent },
      ],
      temperature: AI_CLIENT_DEFAULTS.TEMPERATURE,
      max_tokens: AI_CLIENT_DEFAULTS.MAX_TOKENS,
      stream: false,
    });

    const raw = response.choices[0]?.message?.content ?? '';
    const parsed = this.parseJson<FoodRecognizeModelOutput>(raw, 'food-recognize');
    const items = parsed.items ?? [];
    const totalNutrition = parsed.totalNutrition ?? sumNutrition(items);
    return {
      items,
      totalNutrition,
      model: response.model,
    };
  }

  // ============ 健康计划生成 ============

  /** 健康计划生成 - qwen-max */
  async generatePlan(req: PlanGenerateRequest): Promise<PlanGenerateResponse> {
    const prompt = planGeneratePrompt(req.profile, req.days);
    const response = await this.postChatWithRetry({
      model: this.env.defaultPlanModel,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user },
      ],
      temperature: AI_CLIENT_DEFAULTS.TEMPERATURE,
      max_tokens: 4096,
      stream: false,
    });

    const raw = response.choices[0]?.message?.content ?? '';
    const parsed = this.parseJson<PlanGenerateModelOutput>(raw, 'plan-generate');
    return {
      plan: parsed.plan,
      model: response.model,
    };
  }

  // ============ 内部工具 ============

  private buildHeaders(opts: { accept?: string } = {}): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.env.apiKey}`,
      ...(opts.accept ? { Accept: opts.accept } : {}),
    };
  }

  /** 单次 POST chat/completions（无重试） */
  private async postChat(req: OpenAiChatRequest): Promise<OpenAiChatResponse> {
    const url = `${this.env.baseUrl}${OPENAI_COMPAT_PATH}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(this.env.timeoutMs),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new AiHttpError(res.status, text);
    }
    return (await res.json()) as OpenAiChatResponse;
  }

  /** 带重试的 POST chat/completions */
  private async postChatWithRetry(req: OpenAiChatRequest): Promise<OpenAiChatResponse> {
    return callWithRetry(() => this.postChat(req), {
      times: this.env.retryTimes,
      baseDelayMs: this.env.retryBaseDelayMs,
    });
  }

  /**
   * 解析模型输出的 JSON（剥离 markdown 代码块）
   * 解析失败抛 AiParseError（server 转为 ERROR_CODE.AI_RESPONSE_PARSE_FAILED）
   */
  private parseJson<T>(raw: string, scene: string): T {
    const cleaned = stripCodeFence(raw).trim();
    if (cleaned.length === 0) {
      throw new AiParseError(raw, `[${scene}] empty model output`);
    }
    try {
      return JSON.parse(cleaned) as T;
    } catch (err) {
      throw new AiParseError(raw, `[${scene}] JSON.parse failed: ${(err as Error).message}`);
    }
  }
}

// ---- 纯函数辅助 ----

function mapUsage(
  usage: OpenAiChatResponse['usage'] | undefined,
): AiTokenUsage {
  return {
    promptTokens: usage?.prompt_tokens ?? 0,
    completionTokens: usage?.completion_tokens ?? 0,
    totalTokens: usage?.total_tokens ?? 0,
  };
}

/** 剥离模型输出可能包裹的 markdown 代码块 ```json ... ``` */
function stripCodeFence(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*\n([\s\S]*?)\n```$/i);
  if (fenceMatch) return fenceMatch[1];
  // 容错：模型只输出了开/闭围栏
  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '');
}

/** 计算多个食物项的总营养素 */
function sumNutrition(items: FoodItem[]): Nutrition {
  const total: Nutrition = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrate: 0,
  };
  for (const item of items) {
    const n = item.nutrition;
    total.calories += n.calories ?? 0;
    total.protein += n.protein ?? 0;
    total.fat += n.fat ?? 0;
    total.carbohydrate += n.carbohydrate ?? 0;
    total.fiber = (total.fiber ?? 0) + (n.fiber ?? 0);
    total.sugar = (total.sugar ?? 0) + (n.sugar ?? 0);
    total.sodium = (total.sodium ?? 0) + (n.sodium ?? 0);
  }
  return total;
}

// 重新导出便于 server 单点引用
export type { PlanItem };
export { AI_MODELS };
