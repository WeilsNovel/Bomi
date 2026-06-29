/**
 * 服务端全局类型声明 - references/01 §2.7 types/global.d.ts
 *
 * - 扩展 Express.User（passport 注入的 req.user）携带 JwtPayload 字段
 * - 扩展 Express.Request 注入 traceId（响应拦截器使用）
 *
 * 注：不重声明 Request.user（passport @types 已声明 user?: User），
 *     改为合并 Express.User 接口，避免字段重复声明冲突。
 */
import type { JwtPayload } from '@bomi/shared';

declare global {
  namespace Express {
    /** passport 注入的 req.user 类型（合并 JwtPayload 字段） */
    interface User extends JwtPayload {}
    interface Request {
      /** 请求追踪 ID（响应拦截器生成或读取 x-trace-id 头） */
      traceId?: string;
    }
  }
}

export {};
