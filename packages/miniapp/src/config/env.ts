/**
 * 环境动态参数 - 第二层（禁止硬编码）
 *
 * 区分 development / test / production，存放接口域名、功能开关、小程序 AppID。
 *
 * AI 调用红线：本文件只存 useAiProxy: true 标记，绝不出现任何 AI 供应商 API Key。
 * 真实 Key 仅 packages/ai/config/env.ts 从 process.env 读取，前端禁直连供应商。
 *
 * 注意：mp-weixin 编译为静态产物，env 在构建期注入，无运行时切换。
 *       小程序 AppID 同时需在 src/manifest.json 的 mp-weixin.appid 镜像填写（Uni-app 限制 JSON 不能引用 TS）。
 */

/** 环境类型 */
type EnvType = 'development' | 'test' | 'production';

/** 当前环境（由 Vite 构建变量 import.meta.env.MODE 注入） */
const CURRENT_ENV: EnvType = (import.meta.env.MODE as EnvType) || 'development';

/** 单环境配置结构 */
interface EnvConfig {
  /** 接口基础域名（server 地址） */
  apiBaseUrl: string;
  /** 是否开启调试日志 */
  debug: boolean;
  /** 是否开启埋点 */
  enableTrack: boolean;
  /**
   * AI 调用是否走 server 代理。
   * 小程序恒为 true：禁止直连 AI 供应商，统一经 server /api/ai/* 转发。
   */
  useAiProxy: true;
}

/** 环境配置映射 */
const ENV_CONFIG_MAP: Record<EnvType, EnvConfig> = {
  development: {
    apiBaseUrl: 'http://localhost:3000',
    debug: true,
    enableTrack: false,
    useAiProxy: true,
  },
  test: {
    apiBaseUrl: 'https://test-api.bomi.example.com',
    debug: true,
    enableTrack: false,
    useAiProxy: true,
  },
  production: {
    apiBaseUrl: 'https://api.bomi.example.com',
    debug: false,
    enableTrack: true,
    useAiProxy: true,
  },
};

/** 当前环境配置（业务代码统一引用此对象） */
export const ENV_CONFIG: EnvConfig = ENV_CONFIG_MAP[CURRENT_ENV];

/**
 * 微信小程序 AppID（占位，整合方填写真实值）。
 * 同步规则：修改此处需同步修改 src/manifest.json 中 mp-weixin.appid。
 */
export const WX_APP_ID = '__BOMI_WX_APPID_PLACEHOLDER__';

/** 环境判定工具 */
export const IS_DEV = CURRENT_ENV === 'development';
export const IS_PROD = CURRENT_ENV === 'production';
