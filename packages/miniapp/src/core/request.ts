/**
 * 请求封装 - 底层通用工具
 *
 * 职责：
 * 1. 拼接 ENV_CONFIG.apiBaseUrl + 业务 url
 * 2. 统一注入 Authorization: Bearer <token>（除 skipAuth）
 * 3. 解包 BaseApiResponse<T>：code === 0 返回 data，code !== 0 抛 RequestError
 * 4. 鉴权失效（40101 / 40102）清 token 并广播 APP_EVENT.UNAUTHORIZED，由全局监听跳登录页
 * 5. 错误文案引用 shared 的 ERROR_MESSAGE_MAP，禁止硬编码中文
 *
 * 接口 DTO 类型一律引用 @bomi/shared，本文件只定义请求层私有类型。
 */
import { ENV_CONFIG } from '@/config/env';
import { REQUEST_TIMEOUT, APP_EVENT } from '@/config/constants';
import { getToken, clearToken } from '@/core/storage';
import {
  ERROR_CODE,
  ERROR_MESSAGE_MAP,
  type BaseApiResponse,
} from '@bomi/shared';

/** 请求方法 */
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** 请求基础参数（请求层私有类型，非接口 DTO） */
export interface RequestOptions {
  /** 业务路径（不含域名），如 /api/auth/wx-login */
  url: string;
  /** 请求方法，默认 GET */
  method?: RequestMethod;
  /** 请求参数（GET 作为 query，其余作为 body；DTO 类型由 api 函数签名约束） */
  data?: unknown;
  /** 自定义请求头 */
  header?: Record<string, string>;
  /** 自定义超时（毫秒），默认 REQUEST_TIMEOUT */
  timeout?: number;
  /** 是否跳过自动注入 Authorization（登录类接口设 true） */
  skipAuth?: boolean;
}

/** 业务错误（携带错误码与文案，调用方可按 code 分支处理） */
export class RequestError extends Error {
  /** 业务错误码（对齐 shared ERROR_CODE） */
  readonly code: number;
  /** 服务端返回的 traceId（如有） */
  readonly traceId?: string;

  constructor(code: number, message: string, traceId?: string) {
    super(message);
    this.name = 'RequestError';
    this.code = code;
    this.traceId = traceId;
  }
}

/**
 * 取错误文案：优先 ERROR_MESSAGE_MAP，其次服务端 message，最后兜底网络异常文案。
 */
function resolveErrorMessage(code: number, serverMessage: string): string {
  return ERROR_MESSAGE_MAP[code] ?? (serverMessage || ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR]);
}

/**
 * 处理鉴权失效：清 token + 广播事件（全局监听者负责跳登录页，解耦路径硬编码）。
 */
function handleUnauthorized(): void {
  clearToken();
  uni.$emit(APP_EVENT.UNAUTHORIZED);
}

/**
 * 标准化请求：解包 BaseApiResponse<T>，code !== 0 抛 RequestError。
 * @param options 请求参数对象
 * @returns Promise<data 字段>
 */
export function request<T = unknown>(options: RequestOptions): Promise<T> {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    timeout = REQUEST_TIMEOUT,
    skipAuth = false,
  } = options;

  // 注入鉴权头
  const finalHeader: Record<string, string> = { ...header };
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      finalHeader.Authorization = `Bearer ${token}`;
    }
  }

  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: `${ENV_CONFIG.apiBaseUrl}${url}`,
      method,
      data: data as string | AnyObject | ArrayBuffer | undefined,
      header: finalHeader,
      timeout,
      success: (res) => {
        const body = res.data as BaseApiResponse<T> | undefined;
        // 非 2xx HTTP 状态或异常结构兜底
        if (!body || typeof body.code !== 'number') {
          reject(new RequestError(ERROR_CODE.SERVER_ERROR, ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR]));
          return;
        }
        // 鉴权失效统一处理
        if (body.code === ERROR_CODE.UNAUTHORIZED || body.code === ERROR_CODE.TOKEN_EXPIRED) {
          handleUnauthorized();
        }
        if (body.code !== ERROR_CODE.SUCCESS) {
          reject(new RequestError(body.code, resolveErrorMessage(body.code, body.message), body.traceId));
          return;
        }
        resolve(body.data);
      },
      fail: (err) => {
        // 网络层失败（超时 / 断网 / 域名不可达）
        reject(new RequestError(ERROR_CODE.SERVER_ERROR, ERROR_MESSAGE_MAP[ERROR_CODE.SERVER_ERROR], err.errMsg));
      },
    });
  });
}
