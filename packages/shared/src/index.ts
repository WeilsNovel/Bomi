/**
 * @bomi/shared - 多端共享层（整合方维护，单一事实来源）
 *
 * 仅导出类型与常量，不放业务逻辑、不放密钥。
 * 三端（miniapp / admin / server / ai）一律从此引用，禁止重复定义。
 */

// ===== 类型 =====
export * from './types/api';
export * from './types/enum';
export * from './types/user';
export * from './types/food';
export * from './types/plan';
export * from './types/ai';
export * from './types/ai-api';

// ===== 常量 =====
export * from './constants/error-code';
export * from './constants/business';
export * from './constants/ai';
