/**
 * TraceId 中间件 - references/01 §2.7 common/middleware
 * 在请求最早期生成/复用 traceId 并注入 req.traceId + 响应头，
 * 确保异常路径（绕过响应拦截器）也能在 BaseApiResponse.traceId 中输出。
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { generateTraceId, TRACE_ID_HEADER } from '../utils/trace-id';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    if (!req.traceId) {
      const fromHeader = req.headers[TRACE_ID_HEADER];
      req.traceId =
        typeof fromHeader === 'string' && fromHeader.length > 0
          ? fromHeader
          : generateTraceId();
      res.setHeader(TRACE_ID_HEADER, req.traceId);
    }
    next();
  }
}
