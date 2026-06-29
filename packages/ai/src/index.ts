/**
 * @bomi/ai - AI 调用层入口（references/01 §2.8 + references/08）
 *
 * 对外暴露：AiClient（recognizeFood / generatePlan / chat / chatStream）
 * server controller 通过本包访问 AI 能力，禁止在 controller 直接写 SDK 调用
 * （references/08 §11.12）
 */

export { AiClient } from './core/client';
export { AiHttpError, AiParseError } from './core/errors';
export { callWithRetry, type RetryOptions } from './core/retry';
export { parseSseStream } from './core/stream';
export {
  getAiEnv,
  loadAiEnv,
  type AiEnvRuntime,
  type AiEnvName,
} from './config/env';
export { AI_CLIENT_DEFAULTS, AI_MODELS } from './config/constants';
export { foodRecognizePrompt, type FoodRecognizePrompt } from './prompts/food-recognize';
export { planGeneratePrompt, type PlanGeneratePrompt } from './prompts/plan-generate';
