/**
 * 健康计划模块共享类型 - 前后端共享
 * 破例占位，待整合方 review
 *
 * 计划生成接口契约、计划结构
 */

import type { HealthProfile } from './user';

/** 餐次类型，引用 MEAL_TYPE 常量（如需） */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/** 单餐建议 */
export interface PlanMeal {
  /** 餐次 */
  mealType: MealType;
  /** 推荐食物列表 */
  foods: { name: string; portion: string }[];
  /** 本餐热量（千卡） */
  calories: number;
}

/** 单日计划 */
export interface PlanDay {
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 当日各餐 */
  meals: PlanMeal[];
  /** 当日总热量（千卡） */
  totalCalories: number;
  /** 备注（如饮食建议） */
  note?: string;
}

/** 完整健康计划 */
export interface PlanItem {
  /** 多日计划 */
  days: PlanDay[];
  /** 计划总述 */
  summary: string;
  /** 目标每日热量（千卡） */
  targetDailyCalories: number;
}

/** 计划生成请求 - 前端发、服务端收 */
export interface PlanGenerateRequest {
  /** 用户健康档案 */
  profile: HealthProfile;
  /** 生成多少天的计划 */
  days: number;
}

/** 计划生成响应 - ai 层返回、server 透传 */
export interface PlanGenerateResponse {
  /** 生成的计划 */
  plan: PlanItem;
  /** 使用的模型名 */
  model: string;
}
