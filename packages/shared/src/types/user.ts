/**
 * 用户模块共享类型 - 前后端共享
 * 破例占位，待整合方 review
 *
 * 包含：用户实体、JWT 载荷、健康档案、登录 DTO
 */

/** 用户状态值引用 USER_STATUS 常量（constants/business.ts） */

/** 用户实体 - 前后端共享 */
export interface UserItem {
  id: number;
  /** 微信 openid（DECISIONS D004：可为 null，未绑定微信时） */
  openid: string | null;
  /** 手机号（DECISIONS D004：可为 null，未绑定手机时） */
  phone: string | null;
  nickname: string;
  avatarUrl?: string;
  /** 用户状态，引用 USER_STATUS */
  status: number;
  createdAt: number;
  updatedAt: number;
}

/** JWT 载荷 - server 签发、Guard 解析 */
export interface JwtPayload {
  userId: number;
  /** 签发时间（秒） */
  iat?: number;
  /** 过期时间（秒） */
  exp?: number;
}

/** 用户健康档案 - 用于 AI 健康计划推荐 */
export interface HealthProfile {
  age: number;
  /** 性别，引用 GENDER 常量 */
  gender: 'male' | 'female';
  /** 身高 cm */
  heightCm: number;
  /** 体重 kg */
  weightKg: number;
  /** 活动水平，引用 ACTIVITY_LEVEL 常量 */
  activityLevel: 'low' | 'medium' | 'high';
  /** 健康目标，引用 HEALTH_GOAL 常量 */
  goal: 'lose_fat' | 'maintain' | 'gain_muscle' | 'improve_health';
  /** 饮食偏好（如素食、低糖） */
  dietaryPreference?: string;
  /** 过敏原列表 */
  allergies?: string[];
  /** 既往病史/慢病 */
  medicalConditions?: string[];
}

/** 微信登录入参 - 前端发、服务端收 */
export interface WxLoginRequest {
  /** wx.login 返回的 code */
  code: string;
  /** 昵称（首次登录可选填） */
  nickname?: string;
  avatarUrl?: string;
}

/** 手机号登录入参 - 前端发、服务端收 */
export interface PhoneLoginRequest {
  phone: string;
  /** 短信验证码 */
  smsCode: string;
  /** 场景：登录 / 绑定，引用 SMS_SCENE 常量 */
  scene: 'login' | 'bind';
}

/** 发送短信验证码入参 */
export interface SmsCodeRequest {
  phone: string;
  scene: 'login' | 'bind';
}

/** 登录响应 - server 签发 JWT 后返回 */
export interface LoginResponse {
  /** JWT token */
  token: string;
  /** 用户信息 */
  user: UserItem;
}
