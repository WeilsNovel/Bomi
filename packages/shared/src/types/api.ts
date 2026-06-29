/**
 * 统一接口契约 - 前后端共享
 * 服务端全局响应拦截器必须输出 BaseApiResponse<T>，controller 禁止返回裸数据。
 * 前端 core/request.ts 解包 BaseApiResponse<T>，code !== 0 走异常。
 */

/** 统一响应结构 */
export interface BaseApiResponse<T = unknown> {
  /** 业务状态码（0 = 成功，非 0 = 失败，对齐服务端 ERROR_CODE） */
  code: number;
  /** 提示消息（前端可直出，文案以 ERROR_MESSAGE_MAP 为准） */
  message: string;
  /** 业务数据 */
  data: T;
  /** 请求追踪 ID（服务端生成，前端日志记录） */
  traceId?: string;
  /** 服务器时间戳（毫秒，用于时间同步校验） */
  timestamp?: number;
}

/** 分页响应结构 */
export interface PageData<T = unknown> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/** 通用分页请求入参 */
export interface PageQuery {
  pageNum: number;
  pageSize: number;
}

/** 通用 ID 入参 */
export interface IdParam {
  id: number;
}
