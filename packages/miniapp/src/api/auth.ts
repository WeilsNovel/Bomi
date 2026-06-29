/**
 * 认证接口模块
 *
 * 路径引用 API_PATH（与 docs/api-contract.md 对齐），DTO 引用 @bomi/shared。
 * 登录类接口 skipAuth: true，避免循环依赖（登录前尚无 token）。
 *
 * 登录方式（D004）：微信授权登录 + 手机号验证码登录，两者都要。
 *   - 微信登录：wx.login 拿 code → /api/auth/wx-login
 *   - 手机号登录：/api/auth/send-sms → /api/auth/phone-login
 *   - token 由调用方写入 storage（core/storage.setToken），请求头由 core/request 自动注入
 */
import { request } from '@/core/request';
import { API_PATH } from '@/config/constants';
import type {
  WxLoginRequest,
  PhoneLoginRequest,
  SendSmsCodeRequest,
  LoginResponse,
} from '@bomi/shared';

/**
 * 发送短信验证码响应。
 * FIXME(技术债): shared/types/user.ts 暂缺此响应类型，已列入 shared 同步需求提案；
 *               整合方落地后改为从 @bomi/shared 引用，删除本地定义。
 */
export interface SendSmsCodeResponse {
  /** 验证码有效时长（秒） */
  expireSeconds: number;
}

/**
 * 微信授权登录
 * @param params wx.login 返回的 code + 可选授权信息
 */
export function wxLoginApi(params: WxLoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>({
    url: API_PATH.AUTH_WX_LOGIN,
    method: 'POST',
    data: params,
    skipAuth: true,
  });
}

/**
 * 发送短信验证码
 * @param params 手机号 + 场景（login / bind）
 */
export function sendSmsCodeApi(params: SendSmsCodeRequest): Promise<SendSmsCodeResponse> {
  return request<SendSmsCodeResponse>({
    url: API_PATH.AUTH_SEND_SMS,
    method: 'POST',
    data: params,
    skipAuth: true,
  });
}

/**
 * 手机号验证码登录
 * @param params 手机号 + 验证码
 */
export function phoneLoginApi(params: PhoneLoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>({
    url: API_PATH.AUTH_PHONE_LOGIN,
    method: 'POST',
    data: params,
    skipAuth: true,
  });
}

/**
 * 退出登录
 */
export function logoutApi(): Promise<null> {
  return request<null>({
    url: API_PATH.AUTH_LOGOUT,
    method: 'POST',
  });
}
