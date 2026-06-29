/**
 * 业务异常 - references/01 §2.7 common/
 * 携带 shared ERROR_CODE，由全局异常过滤器统一转响应体
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_CODE, ERROR_MESSAGE_MAP, type ErrorCode } from '@bomi/shared';

export interface BusinessExceptionOptions {
  /** 业务错误码（shared ERROR_CODE） */
  code: ErrorCode;
  /** 自定义提示文案（不传则取 ERROR_MESSAGE_MAP[code]） */
  message?: string;
  /** HTTP 状态码（默认 200，业务错误码在响应体 code 字段表达） */
  httpStatus?: HttpStatus;
  /** 原始错误，用于日志 */
  cause?: unknown;
}

/**
 * 业务异常基类
 * - HTTP 状态码默认 200（业务错误通过响应体 code 区分，对齐前端统一处理）
 * - 过滤器读取 .code 与 .bizMessage 输出 BaseApiResponse
 */
export class BusinessException extends HttpException {
  readonly code: ErrorCode;
  readonly bizMessage: string;

  constructor(opts: BusinessExceptionOptions) {
    const message = opts.message ?? ERROR_MESSAGE_MAP[opts.code] ?? '未知错误';
    super({ code: opts.code, message }, opts.httpStatus ?? HttpStatus.OK);
    this.code = opts.code;
    this.bizMessage = message;
    if (opts.cause !== undefined) {
      (this as { cause?: unknown }).cause = opts.cause;
    }
  }
}
