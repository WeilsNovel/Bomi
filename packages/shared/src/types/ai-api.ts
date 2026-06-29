/**
 * AI 接口契约 - 前后端共享
 * 来源：references/08 §11.12 + server.md「接口契约」段
 * 破例占位，待整合方 review
 *
 * 接口路径常量在 constants/ai.ts 的 AI_API_PATH，本文件仅声明类型契约。
 * 完整接口清单见 docs/api-contract.md（待整合方维护）。
 */

import type { BaseApiResponse } from './api';
import type { AiRequest, AiResponse, AiStreamChunk } from './ai';
import type { FoodRecognizeRequest, FoodRecognizeResponse } from './food';
import type { PlanGenerateRequest, PlanGenerateResponse } from './plan';

/** AI 对话接口 - 前端调用 server */
export interface AiChatEndpoint {
  /** 接口路径（与 AI_API_PATH.CHAT 一致） */
  path: '/api/ai/chat';
  /** 请求类型 */
  request: AiRequest;
  /** 响应类型（非流式） */
  response: BaseApiResponse<AiResponse>;
  /** 流式响应类型（stream=true 时，SSE 分片） */
  streamChunk: BaseApiResponse<AiStreamChunk>;
}

/** 食物照片识别接口 - 前端调用 server */
export interface FoodRecognizeEndpoint {
  /** 接口路径（与 AI_API_PATH.FOOD_RECOGNIZE 一致） */
  path: '/api/ai/food/recognize';
  /** 请求类型 */
  request: FoodRecognizeRequest;
  /** 响应类型 */
  response: BaseApiResponse<FoodRecognizeResponse>;
}

/** 健康计划推荐接口 - 前端调用 server */
export interface PlanGenerateEndpoint {
  /** 接口路径（与 AI_API_PATH.PLAN_GENERATE 一致） */
  path: '/api/ai/plan/generate';
  /** 请求类型 */
  request: PlanGenerateRequest;
  /** 响应类型 */
  response: BaseApiResponse<PlanGenerateResponse>;
}
