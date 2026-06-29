/**
 * 健康计划生成 Prompt 模板 - references/08 §11.10 + references/01 §2.8 prompts/
 *
 * 基于用户 HealthProfile，输出多日计划 JSON。
 */
import type { HealthProfile, PlanItem } from '@bomi/shared';

export interface PlanGeneratePrompt {
  system: string;
  user: string;
}

/**
 * 计划推荐 Prompt - 调用 qwen-max
 * 模型输出严格 JSON：{ "plan": PlanItem }
 */
export function planGeneratePrompt(profile: HealthProfile, days: number): PlanGeneratePrompt {
  const system =
    '你是专业营养师。任务：根据用户健康档案生成饮食计划。' +
    '必须严格输出 JSON，禁止任何解释文字、禁止 markdown 代码块。' +
    '热量目标基于用户 BMR（Mifflin-St Jeor 公式）与活动水平计算。';

  const user = [
    '用户健康档案：',
    JSON.stringify(profile, null, 2),
    '',
    `请生成 ${days} 天的饮食计划，输出以下 JSON 结构（仅 JSON，无其他文字）：`,
    '{',
    '  "plan": {',
    '    "days": [',
    '      {',
    '        "date": "YYYY-MM-DD",',
    '        "meals": [',
    '          {',
    '            "mealType": "breakfast|lunch|dinner|snack",',
    '            "foods": [ { "name": "食物名", "portion": "份量" } ],',
    '            "calories": 0',
    '          }',
    '        ],',
    '        "totalCalories": 0,',
    '        "note": "当日饮食建议（可选）"',
    '      }',
    '    ],',
    '    "summary": "计划总述",',
    '    "targetDailyCalories": 0',
    '  }',
    '}',
    '字段约束：',
    '- date 从今天开始连续递增',
    '- mealType ∈ breakfast | lunch | dinner | snack',
    `- days 数组长度等于 ${days}`,
    '- 每日 totalCalories 必须等于该日各餐 calories 之和',
    '- targetDailyCalories 基于用户 BMR × 活动系数与目标（减脂/维持/增肌/改善健康）',
    '- 仅输出 JSON，禁止 markdown 代码块、禁止解释',
  ].join('\n');

  return { system, user };
}

/** 模型输出 JSON 的解析目标结构 */
export interface PlanGenerateModelOutput {
  plan: PlanItem;
}
