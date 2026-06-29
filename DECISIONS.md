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

## D005 · 分支策略与防乱机制（2026-06-29）

**结论**：特性分支 + 整合方合并；整合方接管分支命名；合并顺序固定。

**5 道防线**：
1. **包路径物理隔离**：miniapp/admin/server/ai 各自独立目录，三端改的文件不重叠，合并零冲突
2. **shared 整合方独占**：三端改 shared 必须提案，整合方落地，单一事实来源不分裂
3. **整合方是合并唯一仲裁者**：三端只往 feat 分支提交，合并到 main 只能整合方做
4. **顺序合并**：shared → server → 前端（契约先稳，前端再对齐）
5. **Conventional Commits**：`feat(server):` / `fix(miniapp):` 前缀，追溯归属

**分支模型**：
```
三端对话                           整合方                    origin
──────────                         ──────────                ──────
feat/miniapp-stageN ──┐
feat/admin-stageN   ──┼──→ 审查 + 按序合并 ──→ main ──→ push
feat/server-stageN  ──┘        (shared→server→前端)
```

**分支命名规则**：
- 三端对话接到 prompt 后第一动作：`git branch -m trae/agent-* feat/{端}-stageN`
  - 对话①：`feat/miniapp-stage1`、`feat/miniapp-stage2`...
  - 对话②：`feat/admin-stage1`、`feat/admin-stage2`...
  - 对话③：`feat/server-stage1`、`feat/server-stage2`...
- main 受保护，三端禁止直接提交

**三端铁律**：
1. 只在自己的 `feat/{端}-stageN` 提交，禁止碰 main
2. 禁止改 `packages/shared/`（提案给整合方）
3. 禁止跨端目录（miniapp 不碰 admin/server/ai 的代码）
4. 阶段完成向整合方报告，合并由整合方做

**理由**：
- Monorepo 包隔离使三端代码物理不交叉，"乱"的根源被消除
- 唯一高风险文件 shared 由单点控制
- 整合方仲裁避免三端互相覆盖、乱合
- TRAE 沙箱会自动建 `trae/agent-*` 随机分支，必须接管命名否则后期无法追溯归属

**替代方案**：dev 集成分支流（多一层维护，本项目规模不必要）/ 单分支直接提交（main 不稳，回滚难）—— 均否决
