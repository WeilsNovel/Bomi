/**
 * AI 模型 / 供应商枚举 - 前后端共享
 * 真实 API Key 仅在 packages/ai/config/env.ts 从 process.env 读取，禁止出现在本文件。
 */

/** AI 供应商 */
export const AI_PROVIDER = {
  OPENAI: 'openai',
  CLAUDE: 'claude',
  QWEN: 'qwen',
  ZHIPU: 'zhipu',
  DOUBAO: 'doubao',
} as const;

/** AI 供应商展示文案（管理后台展示用） */
export const AI_PROVIDER_LABEL: Record<string, string> = {
  [AI_PROVIDER.OPENAI]: 'OpenAI',
  [AI_PROVIDER.CLAUDE]: 'Claude',
  [AI_PROVIDER.QWEN]: '通义千问',
  [AI_PROVIDER.ZHIPU]: '智谱 GLM',
  [AI_PROVIDER.DOUBAO]: '豆包',
};

/** AI 模型枚举（食物识别用 VLM 视觉模型） */
export const AI_MODEL = {
  QWEN_VL_MAX: 'qwen-vl-max',
  QWEN_VL_PLUS: 'qwen-vl-plus',
  DOUBAO_VISION: 'doubao-vision-pro',
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
  CLAUDE_35_SONNET: 'claude-3-5-sonnet',
} as const;

/** AI 任务类型（用于路由到不同 Prompt 模板） */
export const AI_TASK = {
  FOOD_RECOGNIZE: 'food-recognize',
  PLAN_GENERATE: 'plan-generate',
  CHAT: 'chat',
} as const;

/** AI 调用默认参数（server / ai 层兜底用，前端不直接用） */
export const AI_DEFAULT_PARAMS = {
  /** 默认温度 */
  TEMPERATURE: 0.3,
  /** 默认最大 token */
  MAX_TOKENS: 2000,
  /** 流式默认开关 */
  STREAM: false,
  /** 重试次数 */
  RETRY_COUNT: 2,
  /** 调用超时 ms */
  TIMEOUT_MS: 30000,
} as const;
