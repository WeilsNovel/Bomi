/**
 * AI 常量 - 前后端共享
 * 来源：references/08 §11.11
 * 破例占位，待整合方 review
 *
 * 注意：本文件只放类型与枚举常量，禁止放任何 API Key（Key 仅在 packages/ai/config/env.ts）
 */

/** AI 供应商枚举 - 前后端共享 */
export const AI_PROVIDER = {
  OPENAI: 'openai',
  CLAUDE: 'claude',
  QWEN: 'qwen',
  ZHIPU: 'zhipu',
  DOUBAO: 'doubao',
} as const;

export type AiProvider = (typeof AI_PROVIDER)[keyof typeof AI_PROVIDER];

/** AI 模型枚举 - 前后端共享 */
export const AI_MODEL = {
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
  CLAUDE_35_SONNET: 'claude-3-5-sonnet',
  QWEN_MAX: 'qwen-max',
  /** 食物识别默认 VLM 模型（DECISIONS D003） */
  QWEN_VL_MAX: 'qwen-vl-max',
} as const;

export type AiModelId = (typeof AI_MODEL)[keyof typeof AI_MODEL];

/** AI 默认调用参数 - packages/ai/config/constants.ts 默认值引用本对象 */
export const AI_DEFAULT_PARAMS = {
  /** 默认温度 */
  TEMPERATURE: 0.2,
  /** 默认最大 token */
  MAX_TOKENS: 2048,
  /** 请求超时（毫秒） */
  REQUEST_TIMEOUT_MS: 30000,
  /** 重试次数 */
  RETRY_TIMES: 2,
  /** 重试基础退避（毫秒） */
  RETRY_BASE_DELAY_MS: 500,
  /** 默认是否启用流式 */
  ENABLE_STREAM: true,
} as const;

/** AI 接口路径常量 - server controller 路径与前端 api 路径必须引用本常量 */
export const AI_API_PATH = {
  /** AI 对话 */
  CHAT: '/api/ai/chat',
  /** 食物照片识别 */
  FOOD_RECOGNIZE: '/api/ai/food/recognize',
  /** 健康计划生成 */
  PLAN_GENERATE: '/api/ai/plan/generate',
} as const;

/** 食物识别默认 VLM 模型（DECISIONS D003：qwen-vl-max） */
export const AI_FOOD_VISION_MODEL: AiModelId = AI_MODEL.QWEN_VL_MAX;

/** 健康计划生成默认模型 */
export const AI_PLAN_MODEL: AiModelId = AI_MODEL.QWEN_MAX;

/** AI 对话默认模型 */
export const AI_CHAT_MODEL: AiModelId = AI_MODEL.QWEN_MAX;
