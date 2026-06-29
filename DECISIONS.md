# bomi · 关键技术决策（DECISIONS.md）

> 整合方维护。每次架构决策落地后追加，含决策结论 + 理由 + 替代方案 + 影响范围。
> 三端对话遇到与本文件冲突的做法须停下来向整合方确认。

## D001 · 技术栈选型（2026-06-29）

**结论**：
- 小程序：Uni-app + Vue3 + TS，编译目标 mp-weixin
- 管理后台：Vue3 + Vite + Element Plus
- 服务端：NestJS + TS
- AI 层：独立 TS 包（被 server 调用）
- 仓库：Monorepo（pnpm workspace）

**理由**：
- 全栈 TS 生态，`shared` 类型可被三端无缝引用，契约漂移风险最低
- Uni-app 与 Vue3/TS 同语法，与 NestJS 类型共享顺畅
- NestJS DTO + 校验 + 拦截器完善，与服务端响应拦截器对齐 `BaseApiResponse<T>` 最严格
- Monorepo 单仓，shared 改动即时同步三端，分支统一管理最省心

**替代方案**：Taro（团队不熟 React）/ 原生小程序（跨端弱）/ 分仓+共享 npm 包（版本管理开销大）—— 均否决

**影响**：所有对话须按 multi-terminal-dev-standard skill 的 references 对应架构执行

## D002 · AI 层与服务端对话合并（2026-06-29）

**结论**：AI 作为独立 `packages/ai` 包（架构清晰），但由「服务端」对话③一并负责（协调效率）

**理由**：
- AI 用途聚焦：食物识别（VLM）+ 计划推荐（LLM），中等复杂度，未到需独立对话的程度
- 识别→记录→打卡紧耦合，合并后内部调用契约自然统一，无跨对话协调开销
- 拆分仅当 AI 工作量极大（多模型 failover、复杂 Agent、独立部署微服务）才划算

**影响**：
- 对话③ prompt 同时覆盖 `packages/server` 与 `packages/ai`
- server controller 禁止直写 SDK 调用，必须调 `@bomi/ai` 暴露的服务
- 后续若 AI 复杂度暴涨，可拆为「服务端」「AI」两个对话，shared/ai-api.ts 契约不变

## D003 · AI 供应商选型（2026-06-29）

**结论**：默认通义千问 VL（qwen-vl-max），AI 层按多供应商设计可随时切换

**理由**：
- 食物识别需 VLM 视觉模型，国内合规稳定优先
- 通义千问 VL 视觉识别能力强，OpenAI 兼容接口接入简单
- AI 层 `core/client.ts` 多供应商适配，`.env` 切 `AI_PROVIDER` 即可换豆包/GLM-4V

**影响**：
- `.env.example` 默认 `AI_PROVIDER=qwen`，`AI_DEFAULT_MODEL_DEV=qwen-vl-max`
- shared/constants/ai.ts 预置 5 个供应商枚举与模型枚举

## D004 · 登录方式（2026-06-29）

**结论**：微信授权登录 + 手机号验证码登录，两者都要

**理由**：小程序场景微信登录最便捷，手机号用于跨端账号统一与运营触达

**影响**：
- server `auth` 模块同时支持 `WxLoginRequest` / `PhoneLoginRequest`（shared/types/user.ts 已定义）
- 接入阿里云短信（`.env` 含 SMS_* 占位）
- 用户表需同时存 `openid` 与 `phone`，支持两种登录方式关联同一账号
