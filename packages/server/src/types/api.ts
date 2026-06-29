/**
 * 服务端 API 类型入口 - references/01 §2.7 types/api.ts
 * 复用 shared 类型，禁止服务端单独定义接口结构（references/07 §11.4）
 */
export type { BaseApiResponse, PageData, PageQuery } from '@bomi/shared';
