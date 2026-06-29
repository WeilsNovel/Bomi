# bomi · 技术债（TECH_DEBT.md）

> 整合方维护。记录已知技术债、临时妥协、待优化项。
> 三端对话遇到必须临时妥协时，标注 `// FIXME:` 或 `// TODO(技术债):` 并在此登记。

## 当前技术债

### TD-001 · packages/{miniapp,admin,server} 包级占位待 CLI 初始化
- **状态**：待处理（Stage 1）
- **说明**：当前仅 `package.json` 占位，scripts 为 echo 占位，无实际代码
- **处理计划**：Stage 1 由各对话用对应 CLI 初始化内部结构
- **影响范围**：miniapp / admin / server 三个包

### TD-002 · AI 层仅有入口占位
- **状态**：待处理（Stage 1）
- **说明**：`packages/ai/src/index.ts` 仅导出常量，无 client/prompt/tool/retry/stream 实现
- **处理计划**：Stage 1 由对话③按 references/08 实现完整 AI 层
- **影响范围**：packages/ai

## 已清偿

（无）
