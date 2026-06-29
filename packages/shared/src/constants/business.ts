/**
 * 业务常量 - 前后端共享
 * 来源：references/07 §11.6
 * 破例占位，待整合方 review/扩充
 *
 * 服务端数据库存储的状态值必须与本文件一致；
 * 前端筛选、展示、判断状态必须引用本文件常量，禁止硬编码数字。
 */

/** 用户状态 - 前后端共享 */
export const USER_STATUS = {
  ENABLED: 1,
  DISABLED: 0,
} as const;

/** 短信验证码场景 */
export const SMS_SCENE = {
  /** 登录 */
  LOGIN: 'login',
  /** 绑定手机号 */
  BIND: 'bind',
} as const;

/** 登录方式（DECISIONS D004：微信 + 手机号） */
export const LOGIN_TYPE = {
  WX: 'wx',
  PHONE: 'phone',
} as const;

/** 性别 */
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
} as const;

/** 活动水平 */
export const ACTIVITY_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

/** 健康目标 */
export const HEALTH_GOAL = {
  LOSE_FAT: 'lose_fat',
  MAINTAIN: 'maintain',
  GAIN_MUSCLE: 'gain_muscle',
  IMPROVE_HEALTH: 'improve_health',
} as const;

/** 餐次类型 */
export const MEAL_TYPE = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
} as const;
