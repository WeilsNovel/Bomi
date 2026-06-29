/**
 * 全局响应拦截器 - references/01 §2.7 core/interceptors
 * 统一输出 BaseApiResponse<T>，禁止 controller 返回裸数据（references/07 §11.2）
 *
 * 装饰器 @SkipResponseWrap() 可跳过包装（如 SSE 流式响应）
 */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, type Observable } from 'rxjs';
import type { Request, Response } from 'express';
import { ERROR_CODE, ERROR_MESSAGE_MAP, type BaseApiResponse } from '@bomi/shared';
import { generateTraceId, TRACE_ID_HEADER } from '../../common/utils/trace-id';

/** 元数据 key：标记跳过响应包装 */
export const SKIP_RESPONSE_WRAP_KEY = 'skipResponseWrap';

/** 装饰器：跳过 BaseApiResponse 包装（用于 SSE / 文件下载等） */
export const SkipResponseWrap = (): MethodDecorator =>
  SetMetadata(SKIP_RESPONSE_WRAP_KEY, true);

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, BaseApiResponse<T> | T> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BaseApiResponse<T> | T> {
    const skip =
      this.reflector.getAllAndOverride<boolean>(SKIP_RESPONSE_WRAP_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    // 注入/复用 traceId
    if (!req.traceId) {
      const fromHeader = req.headers[TRACE_ID_HEADER];
      req.traceId =
        typeof fromHeader === 'string' && fromHeader.length > 0 ? fromHeader : generateTraceId();
      res.setHeader(TRACE_ID_HEADER, req.traceId);
    }

    return next.handle().pipe(
      map((data) => {
        if (skip) {
          return data;
        }
        const body: BaseApiResponse<T> = {
          code: ERROR_CODE.SUCCESS,
          message: ERROR_MESSAGE_MAP[ERROR_CODE.SUCCESS],
          data: (data ?? null) as T,
          traceId: req.traceId,
          timestamp: Date.now(),
        };
        return body;
      }),
    );
  }
}
