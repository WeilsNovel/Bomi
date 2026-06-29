/**
 * AI 接口契约 - 前端调用 server 的 AI 接口定义
 * server 实现必须严格对齐；前端 api 模块按此声明。
 */
import type { BaseApiResponse } from './api';
import type { AiRequest, AiResponse } from './ai';
import type { FoodRecognizeRequest, FoodRecognizeResponse } from './food';
import type { GeneratePlanRequest, GeneratePlanResponse } from './plan';

/** AI 对话接口（通用聊天 / 流式） */
export interface AiChatEndpoint {
  path: '/api/ai/chat';
  request: AiRequest;
  /** 非流式响应 */
  response: BaseApiResponse<AiResponse>;
  /** 流式响应（stream=true 时，SSE 分片） */
  streamChunk: BaseApiResponse<{ content: string; done: boolean }>;
}

/** 食物识别接口 */
export interface FoodRecognizeEndpoint {
  path: '/api/ai/food/recognize';
  request: FoodRecognizeRequest;
  response: BaseApiResponse<FoodRecognizeResponse>;
}

/** 健康计划生成接口 */
export interface GeneratePlanEndpoint {
  path: '/api/ai/plan/generate';
  request: GeneratePlanRequest;
  response: BaseApiResponse<GeneratePlanResponse>;
}

/** 所有 AI 接口路径集合（供前端 api 模块统一引用） */
export const AI_API_PATH = {
  CHAT: '/api/ai/chat',
  FOOD_RECOGNIZE: '/api/ai/food/recognize',
  PLAN_GENERATE: '/api/ai/plan/generate',
} as const;
