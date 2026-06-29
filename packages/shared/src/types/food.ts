/**
 * 食物模块共享类型 - 前后端共享
 * 破例占位，待整合方 review
 *
 * 食物识别 VLM 返回结构、营养素、识别接口契约
 */

/** 营养素 - 单位见字段注释 */
export interface Nutrition {
  /** 热量（千卡 kcal） */
  calories: number;
  /** 蛋白质（克 g） */
  protein: number;
  /** 脂肪（克 g） */
  fat: number;
  /** 碳水化合物（克 g） */
  carbohydrate: number;
  /** 膳食纤维（克 g），可选 */
  fiber?: number;
  /** 糖（克 g），可选 */
  sugar?: number;
  /** 钠（毫克 mg），可选 */
  sodium?: number;
}

/** 单个食物项 - VLM 识别结果单元 */
export interface FoodItem {
  /** 食物名称（中文） */
  name: string;
  /** 份量描述（如 "100g" / "半碗" / "1 个"） */
  portion: string;
  /** 数量（可选，默认 1） */
  quantity?: number;
  /** 营养素 */
  nutrition: Nutrition;
  /** 置信度 0-1 */
  confidence: number;
}

/** 食物识别请求 - 前端发、服务端收 */
export interface FoodRecognizeRequest {
  /** 公网可访问图片 URL（与 imageBase64 二选一） */
  imageUrl?: string;
  /** base64 编码图片（不带 data: 前缀，与 imageUrl 二选一） */
  imageBase64?: string;
}

/** 食物识别响应 - ai 层返回、server 透传 */
export interface FoodRecognizeResponse {
  /** 识别到的食物列表 */
  items: FoodItem[];
  /** 总营养素（所有 items 求和） */
  totalNutrition: Nutrition;
  /** 使用的模型名 */
  model: string;
}
