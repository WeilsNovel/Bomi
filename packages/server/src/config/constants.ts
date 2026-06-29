/**
 * 服务端静态全局参数 - references/01 §2.7 config/constants.ts
 * 端口/超时/分页/前缀等抽参到本文件，禁止硬编码
 */

/** 服务端基础配置 */
export const SERVER_CONFIG = {
  /** 默认端口 */
  DEFAULT_PORT: 3000,
  /** 默认 CORS 来源（dev） */
  DEFAULT_CORS_ORIGIN: 'http://localhost:5173',
  /** API 全局前缀（与 shared AI_API_PATH 对齐） */
  API_PREFIX: 'api',
} as const;

/** JWT 配置（密钥不在本文件，从 process.env.JWT_SECRET 读取） */
export const JWT_CONFIG = {
  /** 默认过期时间 */
  DEFAULT_EXPIRES_IN: '7d',
  /** Passport 策略名 */
  STRATEGY_NAME: 'jwt',
} as const;

/** 分页配置 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_NUM: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/** 服务端 HTTP 请求超时（毫秒） */
export const REQUEST_TIMEOUT_MS = 15000;

/**
 * .env 文件候选路径（按顺序加载首个找到的）
 * - '.env'：当前 CWD（packages/server 本地或部署目录）
 * - '../../.env'：Monorepo 根（dev 从 packages/server 启动时）
 * - 支持 process.env.DOTENV_PATH 覆盖（生产部署指定路径）
 * 生产环境若用编排系统注入 env vars，可设置 DOTENV_PATH 或忽略
 */
export const ENV_FILE_PATHS: readonly string[] = (
  process.env['DOTENV_PATH']
    ? [process.env['DOTENV_PATH']]
    : ['.env', '../../.env']
) as readonly string[];
