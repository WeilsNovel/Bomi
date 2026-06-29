/**
 * AI 层静态参数 - references/01 §2.8 + references/08 §11.11
 * 默认值引用 shared AI_DEFAULT_PARAMS（单一事实来源，禁止重复定义）
 */
import {
  AI_DEFAULT_PARAMS,
  AI_FOOD_VISION_MODEL,
  AI_PLAN_MODEL,
  AI_CHAT_MODEL,
} from '@bomi/shared';

/** AI 客户端默认调用参数（值来自 shared AI_DEFAULT_PARAMS） */
export const AI_CLIENT_DEFAULTS = {
  TEMPERATURE: AI_DEFAULT_PARAMS.TEMPERATURE,
  MAX_TOKENS: AI_DEFAULT_PARAMS.MAX_TOKENS,
  RETRY_TIMES: AI_DEFAULT_PARAMS.RETRY_TIMES,
  RETRY_BASE_DELAY_MS: AI_DEFAULT_PARAMS.RETRY_BASE_DELAY_MS,
  ENABLE_STREAM: AI_DEFAULT_PARAMS.ENABLE_STREAM,
} as const;

/** 各场景默认模型（DECISIONS D003：食物识别 qwen-vl-max） */
export const AI_MODELS = {
  /** 食物识别 VLM */
  VISION: AI_FOOD_VISION_MODEL,
  /** 计划生成 */
  PLAN: AI_PLAN_MODEL,
  /** 对话 */
  CHAT: AI_CHAT_MODEL,
} as const;

/** AI 接口路径常量（与 server controller 路径对齐） */
export { AI_API_PATH } from '@bomi/shared';

/** OpenAI 兼容接口 chat/completions 路径（拼接在 baseUrl 后） */
export const OPENAI_COMPAT_PATH = '/chat/completions';

/** SSE 流式响应结束标记 */
export const SSE_DONE_MARKER = '[DONE]';
