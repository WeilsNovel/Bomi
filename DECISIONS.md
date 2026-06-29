# bomi 关键技术决策（DECISIONS.md）

> 破例占位：本文件原应由整合方维护。Stage 1 因环境缺失由 server 端补齐占位，
> 下列 D003/D004/D005 内容依据 server.md prompt 推断，**待整合方确认/接管**。

## D003 - AI 视觉模型选型（待整合方确认）
- **决策**：食物照片识别默认使用 `qwen-vl-max`（通义千问视觉模型），通过 OpenAI 兼容接口调用（DashScope compatible-mode）。
- **理由**：国内可用、中文食物识别效果好、兼容 OpenAI SDK 协议降低封装成本。
- **影响**：packages/ai/core/client.ts 多供应商适配层默认 provider=qwen，VLM 走兼容接口。

## D004 - 登录方式与账号关联（待整合方确认）
- **决策**：支持微信登录 + 手机号登录两种方式，用户表同时存储 `openid` 与 `phone`，支持两种登录方式关联同一账号。
- **理由**：用户首次用微信登录后，可绑定手机号；后续可用手机号验证码登录同一账号。
- **影响**：user 表需同时含 openid/phone 字段并加唯一索引；auth 模块需处理「关联已存在账号」逻辑。

## D005 - 分支策略（强制执行）
- **决策**：Monorepo 多端协同采用按端按阶段命名分支。
  - server 端：`feat/server-stageN` / `fix/server-*` / `chore(server):` 提交前缀
  - ai 端：并入 server 分支（ai 是 server 的依赖包），用 `feat(ai):` / `chore(ai):` 前缀
  - shared 包：整合方维护，独立分支 `feat/shared-*`
  - 前端：miniapp/admin 各自分支 `feat/miniapp-*` / `feat/admin-*`
- **铁律**：
  1. main 受保护，仅整合方按序合并（顺序：shared → server → 前端）
  2. 各端不得跨端目录改动
  3. Conventional Commits 前缀强制
  4. 不得自行合并到 main
