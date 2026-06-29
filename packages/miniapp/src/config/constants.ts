/**
 * 全局静态参数 - 第一层（禁止硬编码）
 *
 * 全项目共享的固定常量：分页、主题色、尺寸、超时、rpx 基准、默认文案、存储 key、接口路径。
 * 业务状态枚举（USER_STATUS / MEAL_TYPE / PLAN_TYPE 等）已在 @bomi/shared，此处不重复定义。
 * AI 接口路径引用 shared 的 AI_API_PATH，非 AI 路径集中在本文件 API_PATH。
 */

/** 分页配置 */
export const PAGINATION_CONFIG = {
  /** 默认页码 */
  DEFAULT_PAGE_NUM: 1,
  /** 默认每页条数 */
  DEFAULT_PAGE_SIZE: 20,
  /** 每页条数可选项 */
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/** 主题色配置（与 uni.scss 中 $uni-color-* 对齐，便于 JS 引用） */
export const THEME_COLOR_CONFIG = {
  /** 主色 */
  PRIMARY: '#1677FF',
  /** 成功色 */
  SUCCESS: '#00B42A',
  /** 警告色 */
  WARNING: '#FF7D00',
  /** 危险色 */
  DANGER: '#F53F3F',
  /** 默认/辅助色 */
  DEFAULT: '#86909C',
} as const;

/** 弹窗 / 卡片基础尺寸（单位 rpx，小程序专用） */
export const DIALOG_SIZE_CONFIG = {
  /** 小弹窗宽度 */
  SMALL_WIDTH: 480,
  /** 中弹窗宽度 */
  MEDIUM_WIDTH: 600,
  /** 大弹窗宽度 */
  LARGE_WIDTH: 640,
  /** 圆角 */
  BORDER_RADIUS: 16,
} as const;

/** 通用间距尺寸（单位 rpx） */
export const SIZE_CONFIG = {
  /** 页面左右内边距 */
  PAGE_PADDING: 32,
  /** 卡片内边距 */
  CARD_PADDING: 24,
  /** 元素间距 - 小 */
  SPACING_SM: 8,
  /** 元素间距 - 中 */
  SPACING_MD: 16,
  /** 元素间距 - 大 */
  SPACING_LG: 24,
} as const;

/** rpx 换算基准（Uni-app 默认设计稿宽度 750rpx = 屏幕宽度） */
export const RPX_BASE_CONFIG = {
  /** 设计稿宽度 */
  DESIGN_WIDTH: 750,
} as const;

/** 请求超时时间（毫秒） */
export const REQUEST_TIMEOUT = 15000;

/** 本地存储 key（统一管理，避免散落字符串） */
export const STORAGE_KEYS = {
  /** 登录 token */
  TOKEN: 'bomi_token',
  /** 用户信息缓存 */
  USER_INFO: 'bomi_user_info',
} as const;

/** 全局事件名（uni.$emit / uni.$on，避免散落字符串） */
export const APP_EVENT = {
  /** 鉴权失效（40101 未登录 / 40102 token 过期）→ 全局监听后跳登录页 */
  UNAUTHORIZED: 'bomi:auth:unauthorized',
} as const;

/**
 * 非 AI 业务接口路径（AI 接口路径引用 shared 的 AI_API_PATH）。
 * 路径与 docs/api-contract.md 对齐；新增接口先改本文件再调用。
 */
export const API_PATH = {
  // Auth 认证模块
  AUTH_WX_LOGIN: '/api/auth/wx-login',
  AUTH_SEND_SMS: '/api/auth/send-sms',
  AUTH_PHONE_LOGIN: '/api/auth/phone-login',
  AUTH_LOGOUT: '/api/auth/logout',
  // User 用户模块
  USER_PROFILE: '/api/user/profile',
  USER_HEALTH_PROFILE: '/api/user/health-profile',
  // Diet 饮食打卡模块
  DIET_UPLOAD: '/api/diet/upload',
  DIET_RECORDS: '/api/diet/records',
  DIET_DAILY_SUMMARY: '/api/diet/daily-summary',
  // Plan 健康计划模块
  PLAN_LIST: '/api/plan/list',
} as const;

/** tabBar 样式配置（pages.json 中 tabBar 需手动保持同步，Uni-app 限制 JSON 不能引用 TS） */
export const TAB_BAR_STYLE_CONFIG = {
  /** 文字默认色 */
  COLOR: '#86909C',
  /** 文字选中色 */
  SELECTED_COLOR: '#1677FF',
  /** 背景色 */
  BACKGROUND_COLOR: '#FFFFFF',
  /** 边框色 */
  BORDER_STYLE: 'white' as 'white' | 'black',
} as const;

/** 默认文案（禁止在模板中直写中文，统一引用此处） */
export const DEFAULT_TEXT_CONFIG = {
  /** 确认按钮 */
  CONFIRM_TEXT: '确认',
  /** 取消按钮 */
  CANCEL_TEXT: '取消',
  /** 加载中 */
  LOADING_TEXT: '加载中...',
  /** 空数据 */
  EMPTY_TEXT: '暂无数据',
  /** 网络异常 */
  NETWORK_ERROR_TEXT: '网络异常，请稍后重试',
  /** 应用名称 */
  APP_NAME: 'bomi',
} as const;
