/**
 * 健康计划推荐模块 DTO - 前后端共享
 */
import type { PageData, PageQuery } from './api';
import type { Gender, ActivityLevel } from './enum';
import type { NutritionInfo } from './food';

/** 计划类型 */
export enum PlanType {
  /** 减脂 */
  FAT_LOSS = 1,
  /** 增肌 */
  MUSCLE_GAIN = 2,
  /** 维持 / 健康 */
  MAINTAIN = 3,
}

/** 用户健康档案（用于生成计划） */
export interface HealthProfile {
  userId: number;
  gender: Gender;
  age: number;
  /** 身高 cm */
  height: number;
  /** 体重 kg */
  weight: number;
  /** 目标体重 kg */
  targetWeight?: number;
  activityLevel: ActivityLevel;
  planType: PlanType;
}

/** 生成计划请求（前端 → server） */
export interface GeneratePlanRequest {
  /** 健康档案（前端传，或服务端读取已有档案） */
  profile: HealthProfile;
}

/** 单日计划 */
export interface DayPlan {
  /** 第几天 */
  day: number;
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 当日目标营养素 */
  targetNutrition: NutritionInfo;
  /** 三餐建议 */
  meals: Array<{
    /** 对应 MealType */
    mealType: number;
    suggestion: string;
    targetNutrition: NutritionInfo;
  }>;
}

/** 生成计划响应 */
export interface GeneratePlanResponse {
  /** 计划 ID */
  planId: string;
  /** 计划名称 */
  planName: string;
  /** 计划周期天数 */
  totalDays: number;
  /** 每日目标营养素 */
  dailyTarget: NutritionInfo;
  /** 每日明细 */
  days: DayPlan[];
  /** AI 生成的整体建议 */
  advice: string;
}

/** 计划列表项 */
export interface PlanItem {
  id: number;
  userId: number;
  planName: string;
  planType: PlanType;
  totalDays: number;
  dailyTarget: NutritionInfo;
  startDate: string;
  endDate: string;
  createdAt: string;
}

/** 计划列表查询入参 */
export interface PlanListRequest extends PageQuery {
  planType?: PlanType;
}

export type PlanListResponse = PageData<PlanItem>;
