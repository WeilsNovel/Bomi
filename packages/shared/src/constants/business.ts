/**
 * 业务状态枚举 - 前后端共享
 * 数据库存储值必须与此一致；前端筛选 / 展示 / 判断必须引用此常量。
 */

/** 用户状态 */
export const USER_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const;

/** 短信验证码场景 */
export const SMS_SCENE = {
  LOGIN: 'login',
  BIND: 'bind',
} as const;

/** 用餐类型（与 MealType 枚举值对齐，常量形式便于非 TS 模块引用） */
export const MEAL_TYPE = {
  BREAKFAST: 1,
  LUNCH: 2,
  DINNER: 3,
  SNACK: 4,
} as const;

/** 计划类型（与 PlanType 枚举值对齐） */
export const PLAN_TYPE = {
  FAT_LOSS: 1,
  MUSCLE_GAIN: 2,
  MAINTAIN: 3,
} as const;

/** 用餐类型展示文案（前端展示用） */
export const MEAL_TYPE_LABEL: Record<number, string> = {
  [MEAL_TYPE.BREAKFAST]: '早餐',
  [MEAL_TYPE.LUNCH]: '午餐',
  [MEAL_TYPE.DINNER]: '晚餐',
  [MEAL_TYPE.SNACK]: '加餐',
};

/** 计划类型展示文案（前端展示用） */
export const PLAN_TYPE_LABEL: Record<number, string> = {
  [PLAN_TYPE.FAT_LOSS]: '减脂',
  [PLAN_TYPE.MUSCLE_GAIN]: '增肌',
  [PLAN_TYPE.MAINTAIN]: '健康维持',
};

/** 活动水平展示文案 */
export const ACTIVITY_LEVEL_LABEL: Record<number, string> = {
  1: '久坐',
  2: '轻度活动',
  3: '中度活动',
  4: '高度活动',
};
