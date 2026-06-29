/**
 * 食物识别 / 饮食打卡模块 DTO - 前后端共享
 */
import type { PageData, PageQuery } from './api';

/** 营养素信息（按份量估算） */
export interface NutritionInfo {
  /** 热量 kcal */
  calories: number;
  /** 蛋白质 g */
  protein: number;
  /** 脂肪 g */
  fat: number;
  /** 碳水 g */
  carbohydrate: number;
}

/** 用餐类型 */
export enum MealType {
  BREAKFAST = 1,
  LUNCH = 2,
  DINNER = 3,
  SNACK = 4,
}

/** 食物项（AI 识别结果中的单条食物） */
export interface FoodItem {
  /** 食物名称 */
  name: string;
  /** 估算份量描述，如 "1 个中等大小 / 150g" */
  portion: string;
  /** 营养素（按份量估算） */
  nutrition: NutritionInfo;
  /** AI 置信度 0-1 */
  confidence: number;
}

/** 食物识别请求入参（前端 → server） */
export interface FoodRecognizeRequest {
  /** 图片 URL（已上传后），或本次上传的临时标识 */
  imageUrl: string;
  /** 用餐类型 */
  mealType: MealType;
  /** 拍照时间（缺省用服务端时间） */
  takenAt?: string;
}

/** 食物识别响应（server → 前端） */
export interface FoodRecognizeResponse {
  /** 识别 ID（用于关联打卡记录） */
  recognizeId: string;
  /** 识别到的食物列表 */
  foods: FoodItem[];
  /** 本次总营养素 */
  totalNutrition: NutritionInfo;
  /** AI 识别耗时 ms */
  durationMs: number;
  /** 识别日期 YYYY-MM-DD */
  date: string;
}

/** 饮食打卡记录（落库 + 前端展示） */
export interface DietRecordItem {
  id: number;
  userId: number;
  /** 用餐类型 */
  mealType: MealType;
  /** 图片 URL */
  imageUrl: string;
  /** 识别结果摘要 */
  foods: FoodItem[];
  /** 本次总营养素 */
  totalNutrition: NutritionInfo;
  /** 拍照日期 YYYY-MM-DD */
  date: string;
  /** 拍照时间 */
  takenAt: string;
  createdAt: string;
}

/** 打卡列表查询入参 */
export interface DietRecordListRequest extends PageQuery {
  /** 单日筛选 YYYY-MM-DD */
  date?: string;
  /** 日期范围起 */
  startDate?: string;
  /** 日期范围止 */
  endDate?: string;
  mealType?: MealType;
}

export type DietRecordListResponse = PageData<DietRecordItem>;

/** 每日营养汇总 */
export interface DailyNutritionSummary {
  date: string;
  nutrition: NutritionInfo;
  /** 各餐明细 */
  meals: Array<{
    mealType: MealType;
    nutrition: NutritionInfo;
    records: DietRecordItem[];
  }>;
}
