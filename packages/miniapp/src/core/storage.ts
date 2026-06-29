/**
 * 本地存储封装 - 底层通用工具
 *
 * 统一包装 uni.*StorageSync，集中 key 管理（引用 STORAGE_KEYS），
 * 调用方不再散写字符串 key。失败时记录日志并返回安全默认值，不抛异常中断业务。
 */
import { STORAGE_KEYS } from '@/config/constants';

/**
 * 读取存储值（带类型）
 * @param key 存储 key
 * @returns 存储值，不存在或解析失败返回 null
 */
export function getStorage<T>(key: string): T | null {
  try {
    const value = uni.getStorageSync(key);
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    return value as T;
  } catch (error) {
    console.error(`[storage] 读取失败 key=${key}`, error);
    return null;
  }
}

/**
 * 写入存储值
 * @param key 存储 key
 * @param value 任意可序列化值
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    uni.setStorageSync(key, value);
  } catch (error) {
    console.error(`[storage] 写入失败 key=${key}`, error);
  }
}

/**
 * 移除指定存储
 * @param key 存储 key
 */
export function removeStorage(key: string): void {
  try {
    uni.removeStorageSync(key);
  } catch (error) {
    console.error(`[storage] 移除失败 key=${key}`, error);
  }
}

/** 读取登录 token */
export function getToken(): string {
  return getStorage<string>(STORAGE_KEYS.TOKEN) ?? '';
}

/** 写入登录 token */
export function setToken(token: string): void {
  setStorage(STORAGE_KEYS.TOKEN, token);
}

/** 清除登录 token */
export function clearToken(): void {
  removeStorage(STORAGE_KEYS.TOKEN);
}
