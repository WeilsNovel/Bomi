/**
 * 全局异常过滤器 - references/01 §2.7 core/filters
 * 将各类异常映射到 shared ERROR_CODE 并输出 BaseApiResponse（references/07 §11.3）
 *
 * 映射规则：
 * - BusinessException → 用其 code/message，HTTP 200
 * - HttpException 4xx → 按 status 映射对应 ERROR_CODE
 * - class-validator 校验失败 → ERROR_CODE.PARAM_INVALID + 首条错误信息
 * - 其他 → ERROR_CODE.SERVER_ERROR，HTTP 500
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ERROR_CODE, ERROR_MESSAGE_MAP, type BaseApiResponse, type ErrorCode } from '@bomi/shared';
import { BusinessException } from '../../common/exceptions/business.exception';

interface MappedError {
  code: ErrorCode;
  message: string;
  httpStatus: HttpStatus;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const mapped = this.mapException(exception);

    if (mapped.httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${req.method} ${req.url}] code=${mapped.code} msg=${mapped.message}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(`[${req.method} ${req.url}] code=${mapped.code} msg=${mapped.message}`);
    }

    const body: BaseApiResponse<null> = {
      code: mapped.code,
      message: mapped.message,
      data: null,
      traceId: req.traceId,
      timestamp: Date.now(),
    };
    res.status(mapped.httpStatus).json(body);
  }

  private mapException(exception: unknown): MappedError {
    if (exception instanceof BusinessException) {
      return {
        code: exception.code,
        message: exception.bizMessage,
        httpStatus: exception.getStatus() as HttpStatus,
      };
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus() as HttpStatus;
      const resp = exception.getResponse();
      if (status === HttpStatus.BAD_REQUEST) {
        return { code: ERROR_CODE.PARAM_INVALID, message: extractValidationMessage(resp), httpStatus: status };
      }
      const mapped = mapByHttpStatus(status);
      return { code: mapped.code, message: mapped.message, httpStatus: status };
    }
    return {
      code: ERROR_CODE.SERVER_ERROR,
      message: ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR],
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}

function mapByHttpStatus(status: HttpStatus): MappedError {
  switch (status) {
    case HttpStatus.UNAUTHORIZED:
      return {
        code: ERROR_CODE.UNAUTHORIZED,
        message: ERROR_MESSAGE_MAP[ERROR_CODE.UNAUTHORIZED],
        httpStatus: status,
      };
    case HttpStatus.FORBIDDEN:
      return {
        code: ERROR_CODE.FORBIDDEN,
        message: ERROR_MESSAGE_MAP[ERROR_CODE.FORBIDDEN],
        httpStatus: status,
      };
    case HttpStatus.NOT_FOUND:
      return {
        code: ERROR_CODE.NOT_FOUND,
        message: ERROR_MESSAGE_MAP[ERROR_CODE.NOT_FOUND],
        httpStatus: status,
      };
    case HttpStatus.TOO_MANY_REQUESTS:
      return {
        code: ERROR_CODE.RATE_LIMIT,
        message: ERROR_MESSAGE_MAP[ERROR_CODE.RATE_LIMIT],
        httpStatus: status,
      };
    default:
      return {
        code: ERROR_CODE.SERVER_ERROR,
        message: ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR],
        httpStatus: status,
      };
  }
}

/** 从 class-validator ValidationError 或字符串响应中提取首条错误文案 */
function extractValidationMessage(resp: unknown): string {
  if (typeof resp === 'string') {
    return resp;
  }
  if (Array.isArray(resp)) {
    const first = resp[0] as { message?: string | string[] } | undefined;
    if (first?.message) {
      return Array.isArray(first.message) ? first.message[0] : first.message;
    }
  }
  if (typeof resp === 'object' && resp !== null && 'message' in resp) {
    const m = (resp as { message: unknown }).message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m) && m.length > 0) return String(m[0]);
  }
  return ERROR_MESSAGE_MAP[ERROR_CODE.PARAM_INVALID];
}
