/**
 * @bomi/ai - AI 调用层入口（被 server 调用）
 *
 * 对外暴露：食物识别、计划生成、通用对话等服务。
 * 真实 API Key 在 config/env.ts 从 process.env 读取，禁止硬编码。
 *
 * 由对话③负责实现完整内容（client / prompt / tool / retry / stream / agents）。
 */

export const AI_PACKAGE_NAME = '@bomi/ai';
