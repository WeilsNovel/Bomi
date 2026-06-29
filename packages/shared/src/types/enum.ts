/**
 * 业务通用枚举 - 前后端共享
 * 模块专属状态枚举（如 USER_STATUS / MEAL_TYPE）放在 constants/business.ts
 */

/** 通用启用 / 禁用状态 */
export enum EnableStatus {
  DISABLED = 0,
  ENABLED = 1,
}

/** 是 / 否 */
export enum YesNo {
  NO = 0,
  YES = 1,
}

/** 软删除标记 */
export enum DeletedFlag {
  NORMAL = 0,
  DELETED = 1,
}

/** 性别 */
export enum Gender {
  UNKNOWN = 0,
  MALE = 1,
  FEMALE = 2,
}

/** 活动水平（用于基础代谢 / 计划生成） */
export enum ActivityLevel {
  /** 久坐 */
  SEDENTARY = 1,
  /** 轻度活动 */
  LIGHT = 2,
  /** 中度活动 */
  MODERATE = 3,
  /** 高度活动 */
  HIGH = 4,
}
