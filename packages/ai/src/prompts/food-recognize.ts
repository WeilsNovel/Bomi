/**
 * 食物识别 VLM Prompt 模板 - references/08 §11.10 + references/01 §2.8 prompts/
 *
 * 要求模型严格输出 JSON（FoodItem[] + totalNutrition）。
 * Prompt 文本参数化在本文件，禁止散落到 client.ts 逻辑里。
 */
import type { FoodItem, Nutrition } from '@bomi/shared';

export interface FoodRecognizePrompt {
  /** system 角色 prompt */
  system: string;
  /** user 角色 prompt（含 JSON schema 说明） */
  user: string;
}

/**
 * 食物识别 Prompt - 调用 qwen-vl-max（DECISIONS D003）
 * 模型输出严格 JSON：
 *   { "items": FoodItem[], "totalNutrition": Nutrition }
 */
export function foodRecognizePrompt(): FoodRecognizePrompt {
  const system =
    '你是专业的食物营养识别助手。任务：识别用户上传的食物图片，' +
    '返回每道食物的名称、份量、营养素（热量/蛋白质/脂肪/碳水等）。' +
    '必须严格输出 JSON，禁止任何解释文字、禁止 markdown 代码块。';

  const user = [
    '请识别图片中的食物，输出以下 JSON 结构（仅 JSON，无其他文字）：',
    '{',
    '  "items": [',
    '    {',
    '      "name": "食物名（中文）",',
    '      "portion": "份量描述（如 100g / 半碗 / 1 个）",',
    '      "quantity": 1,',
    '      "nutrition": {',
    '        "calories": 0,',
    '        "protein": 0,',
    '        "fat": 0,',
    '        "carbohydrate": 0,',
    '        "fiber": 0,',
    '        "sugar": 0,',
    '        "sodium": 0',
    '      },',
    '      "confidence": 0.9',
    '    }',
    '  ],',
    '  "totalNutrition": {',
    '    "calories": 0,',
    '    "protein": 0,',
    '    "fat": 0,',
    '    "carbohydrate": 0,',
    '    "fiber": 0,',
    '    "sugar": 0,',
    '    "sodium": 0',
    '  }',
    '}',
    '字段约束：',
    '- items[].name/portion/nutrition 必填；quantity 默认 1；fiber/sugar/sodium 可省略',
    '- nutrition 单位：calories 千卡(kcal)，protein/fat/carbohydrate/fiber/sugar 克(g)，sodium 毫克(mg)',
    '- confidence 范围 0-1，表示识别置信度',
    '- totalNutrition 必须等于所有 items 营养素之和',
    '- 若无法识别任何食物，返回 {"items":[],"totalNutrition":{...全0}}',
    '- 仅输出 JSON，禁止 markdown 代码块、禁止解释',
  ].join('\n');

  return { system, user };
}

/** 模型输出 JSON 的解析目标结构 */
export interface FoodRecognizeModelOutput {
  items: FoodItem[];
  totalNutrition: Nutrition;
}
