/**
 * 统一响应结构 - 前后端共享
 * 来源：references/07 §11.2
 * 破例占位，待整合方 review
 */

/** 统一响应结构 - 前后端共享 */
export interface BaseApiResponse<T = unknown> {
  /** 业务状态码（0=成功，非0=失败，对齐服务端 ERROR_CODE） */
  code: number;
  /** 提示消息 */
  message: string;
  /** 业务数据 */
  data: T;
  /** 请求追踪ID（服务端生成，前端日志记录） */
  traceId?: string;
  /** 服务器时间戳（用于时间同步校验，毫秒） */
  timestamp?: number;
}

/** 分页响应结构 - 前后端共享 */
export interface PageData<T = unknown> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

/** 分页查询入参 - 前后端共享 */
export interface PageQuery {
  pageNum: number;
  pageSize: number;
}
