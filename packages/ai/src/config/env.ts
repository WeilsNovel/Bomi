/**
 * AI 层环境动态参数 - references/01 §2.8 + references/08 §11.10
 *
 * 【Key 安全强制】(references/08 §11.10)：
 * 1. API Key 仅从 process.env 读取，禁止硬编码
 * 2. .env 已加入 .gitignore（根目录），提供 .env.example
 * 3. shared 包不放任何密钥
 * 4. 前端禁直连 AI 供应商，统一经 server 转发
 */
import { AI_DEFAULT_PARAMS, AI_MODEL, type AiProvider } from '@bomi/shared';

export type AiEnvName = 'development' | 'test' | 'production';

/** AI 环境变量键名常量 */
export const AI_ENV_KEYS = {
  AI_API_KEY_DEV: 'AI_API_KEY_DEV',
  AI_API_KEY_PROD: 'AI_API_KEY_PROD',
  AI_BASE_URL_DEV: 'AI_BASE_URL_DEV',
  AI_BASE_URL_PROD: 'AI_BASE_URL_PROD',
  AI_DEFAULT_MODEL_DEV: 'AI_DEFAULT_MODEL_DEV',
  AI_DEFAULT_MODEL_PROD: 'AI_DEFAULT_MODEL_PROD',
  AI_DEFAULT_TEMPERATURE: 'AI_DEFAULT_TEMPERATURE',
  AI_DEFAULT_MAX_TOKENS: 'AI_DEFAULT_MAX_TOKENS',
  AI_REQUEST_TIMEOUT_MS: 'AI_REQUEST_TIMEOUT_MS',
  AI_RETRY_TIMES: 'AI_RETRY_TIMES',
  AI_RETRY_BASE_DELAY_MS: 'AI_RETRY_BASE_DELAY_MS',
} as const;

/** AI 运行时配置（解析后供 AiClient 使用） */
export interface AiEnvRuntime {
  /** 当前环境 */
  env: AiEnvName;
  /** 当前启用的供应商 */
  provider: AiProvider;
  /** API Key（从 process.env 读取，禁止硬编码） */
  apiKey: string;
  /** OpenAI 兼容接口 Base URL */
  baseUrl: string;
  /** 对话默认模型 */
  defaultChatModel: string;
  /** 食物识别 VLM 默认模型（DECISIONS D003） */
  defaultVlmModel: string;
  /** 计划生成默认模型 */
  defaultPlanModel: string;
  /** 是否启用流式 */
  enableStream: boolean;
  /** 请求超时（毫秒） */
  timeoutMs: number;
  /** 重试次数 */
  retryTimes: number;
  /** 重试基础退避（毫秒） */
  retryBaseDelayMs: number;
}

/** DashScope OpenAI 兼容接口默认 Base URL（DECISIONS D003） */
const DEFAULT_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

function readString(key: string, fallback = ''): string {
  const v = process.env[key];
  return v && v.length > 0 ? v : fallback;
}

function readInt(key: string, fallback: number): number {
  const v = process.env[key];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

function requireString(key: string): string {
  const v = process.env[key];
  if (!v || v.length === 0) {
    throw new Error(`[bomi/ai] Missing required env var: ${key}`);
  }
  return v;
}

/**
 * 从 process.env 解析 AI 运行时配置
 * @param nodeEnv 环境名（默认读 NODE_ENV）
 */
export function loadAiEnv(nodeEnv: string = process.env['NODE_ENV'] || 'development'): AiEnvRuntime {
  const env: AiEnvName =
    nodeEnv === 'production' ? 'production' : nodeEnv === 'test' ? 'test' : 'development';
  const isProd = env === 'production';

  const apiKey = requireString(
    isProd ? AI_ENV_KEYS.AI_API_KEY_PROD : AI_ENV_KEYS.AI_API_KEY_DEV,
  );
  const baseUrl = readString(
    isProd ? AI_ENV_KEYS.AI_BASE_URL_PROD : AI_ENV_KEYS.AI_BASE_URL_DEV,
    DEFAULT_BASE_URL,
  );
  const defaultModel = readString(
    isProd ? AI_ENV_KEYS.AI_DEFAULT_MODEL_PROD : AI_ENV_KEYS.AI_DEFAULT_MODEL_DEV,
    AI_MODEL.QWEN_VL_MAX,
  );

  return {
    env,
    provider: 'qwen',
    apiKey,
    baseUrl,
    defaultChatModel: defaultModel,
    defaultVlmModel: AI_MODEL.QWEN_VL_MAX,
    defaultPlanModel: AI_MODEL.QWEN_MAX,
    enableStream: AI_DEFAULT_PARAMS.ENABLE_STREAM,
    timeoutMs: readInt(AI_ENV_KEYS.AI_REQUEST_TIMEOUT_MS, AI_DEFAULT_PARAMS.REQUEST_TIMEOUT_MS),
    retryTimes: readInt(AI_ENV_KEYS.AI_RETRY_TIMES, AI_DEFAULT_PARAMS.RETRY_TIMES),
    retryBaseDelayMs: readInt(
      AI_ENV_KEYS.AI_RETRY_BASE_DELAY_MS,
      AI_DEFAULT_PARAMS.RETRY_BASE_DELAY_MS,
    ),
  };
}

/** 懒加载单例（避免模块导入即触发 env 校验，便于测试与延迟初始化） */
let _aiEnv: AiEnvRuntime | null = null;

export function getAiEnv(): AiEnvRuntime {
  if (_aiEnv) return _aiEnv;
  _aiEnv = loadAiEnv();
  return _aiEnv;
}

/** 测试/手动注入用：重置单例 */
export function resetAiEnv(): void {
  _aiEnv = null;
}
