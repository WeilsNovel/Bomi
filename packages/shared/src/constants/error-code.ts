/**
 * 业务错误码 - 前后端共享
 * 来源：references/07 §11.3
 * 破例占位，待整合方 review/扩充
 *
 * 服务端抛错必须使用本枚举，禁止硬编码数字；
 * 前端异常处理统一引用 ERROR_MESSAGE_MAP，禁止散落中文文案。
 */

export const ERROR_CODE = {
  /** 成功 */
  SUCCESS: 0,
  /** 参数校验失败 */
  PARAM_INVALID: 40001,
  /** 未登录 */
  UNAUTHORIZED: 40101,
  /** token 已过期 */
  TOKEN_EXPIRED: 40102,
  /** 短信验证码错误 */
  SMS_CODE_INVALID: 40201,
  /** 短信验证码已过期 */
  SMS_CODE_EXPIRED: 40202,
  /** 无权限 */
  FORBIDDEN: 40301,
  /** 资源不存在 */
  NOT_FOUND: 40401,
  /** 用户不存在 */
  USER_NOT_FOUND: 40402,
  /** 业务限流 */
  RATE_LIMIT: 42901,
  /** 服务器错误 */
  SERVER_ERROR: 50001,
  /** AI 服务请求失败 */
  AI_REQUEST_FAILED: 50301,
  /** AI 响应解析失败 */
  AI_RESPONSE_PARSE_FAILED: 50302,
  /** AI 调用限流 */
  AI_RATE_LIMIT: 50303,
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

/** 错误码对应文案 - 前端展示用 */
export const ERROR_MESSAGE_MAP: Record<number, string> = {
  [ERROR_CODE.SUCCESS]: '操作成功',
  [ERROR_CODE.PARAM_INVALID]: '参数错误',
  [ERROR_CODE.UNAUTHORIZED]: '请先登录',
  [ERROR_CODE.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [ERROR_CODE.SMS_CODE_INVALID]: '验证码错误',
  [ERROR_CODE.SMS_CODE_EXPIRED]: '验证码已过期',
  [ERROR_CODE.FORBIDDEN]: '无操作权限',
  [ERROR_CODE.NOT_FOUND]: '资源不存在',
  [ERROR_CODE.USER_NOT_FOUND]: '用户不存在',
  [ERROR_CODE.RATE_LIMIT]: '操作过于频繁',
  [ERROR_CODE.SERVER_ERROR]: '服务器异常，请稍后重试',
  [ERROR_CODE.AI_REQUEST_FAILED]: 'AI 服务请求失败',
  [ERROR_CODE.AI_RESPONSE_PARSE_FAILED]: 'AI 响应解析失败',
  [ERROR_CODE.AI_RATE_LIMIT]: 'AI 调用过于频繁',
};
