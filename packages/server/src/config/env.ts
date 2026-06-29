/**
 * 服务端环境动态参数 - references/01 §2.7 config/env.ts
 * 所有密钥从 process.env 读取，禁止硬编码（references/06 NestJS 约定）
 */
import { registerAs } from '@nestjs/config';
import { SERVER_CONFIG, JWT_CONFIG } from './constants';

/** 配置命名空间（注入后用 config.get('app.xxx') 读取） */
export const APP_CONFIG_NAMESPACE = 'app';

/** 环境变量键名常量（避免散落字符串） */
export const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
  SERVER_PORT: 'SERVER_PORT',
  SERVER_CORS_ORIGIN: 'SERVER_CORS_ORIGIN',
  JWT_SECRET: 'JWT_SECRET',
  JWT_EXPIRES_IN: 'JWT_EXPIRES_IN',
  WX_APP_ID: 'WX_APP_ID',
  WX_APP_SECRET: 'WX_APP_SECRET',
  SMS_PROVIDER: 'SMS_PROVIDER',
  SMS_ACCESS_KEY_ID: 'SMS_ACCESS_KEY_ID',
  SMS_ACCESS_KEY_SECRET: 'SMS_ACCESS_KEY_SECRET',
  SMS_SIGN_NAME: 'SMS_SIGN_NAME',
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USERNAME: 'DB_USERNAME',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_DATABASE: 'DB_DATABASE',
} as const;

export type AppEnv = 'development' | 'test' | 'production';

export interface ServerConfig {
  port: number;
  corsOrigin: string;
}
export interface JwtConfig {
  secret: string;
  expiresIn: string;
}
export interface WxConfig {
  appId: string;
  appSecret: string;
}
export interface SmsConfig {
  provider: string;
  accessKeyId: string;
  accessKeySecret: string;
  signName: string;
}
export interface DbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
export interface AppConfig {
  env: AppEnv;
  server: ServerConfig;
  jwt: JwtConfig;
  wx: WxConfig;
  sms: SmsConfig;
  db: DbConfig;
}

function readString(key: string, fallback = ''): string {
  const v = process.env[key];
  return v && v.length > 0 ? v : fallback;
}

function readInt(key: string, fallback: number): number {
  const v = process.env[key];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? fallback : n;
}

/** 必填环境变量：缺失即抛错（fail-fast，避免运行时才暴露配置缺失） */
function requireString(key: string): string {
  const v = process.env[key];
  if (!v || v.length === 0) {
    throw new Error(`[bomi] Missing required env var: ${key}`);
  }
  return v;
}

/**
 * AppConfig 加载器 - 注册到 ConfigModule.forRoot({ load: [appConfigLoader] })
 * 注入后用 config.get<AppConfig>('app') 获取
 */
export const appConfigLoader = registerAs(APP_CONFIG_NAMESPACE, (): AppConfig => {
  const env = (process.env[ENV_KEYS.NODE_ENV] as AppEnv) || 'development';
  return {
    env,
    server: {
      port: readInt(ENV_KEYS.SERVER_PORT, SERVER_CONFIG.DEFAULT_PORT),
      corsOrigin: readString(ENV_KEYS.SERVER_CORS_ORIGIN, SERVER_CONFIG.DEFAULT_CORS_ORIGIN),
    },
    jwt: {
      secret: requireString(ENV_KEYS.JWT_SECRET),
      expiresIn: readString(ENV_KEYS.JWT_EXPIRES_IN, JWT_CONFIG.DEFAULT_EXPIRES_IN),
    },
    wx: {
      appId: readString(ENV_KEYS.WX_APP_ID),
      appSecret: readString(ENV_KEYS.WX_APP_SECRET),
    },
    sms: {
      provider: readString(ENV_KEYS.SMS_PROVIDER),
      accessKeyId: readString(ENV_KEYS.SMS_ACCESS_KEY_ID),
      accessKeySecret: readString(ENV_KEYS.SMS_ACCESS_KEY_SECRET),
      signName: readString(ENV_KEYS.SMS_SIGN_NAME),
    },
    db: {
      host: readString(ENV_KEYS.DB_HOST, '127.0.0.1'),
      port: readInt(ENV_KEYS.DB_PORT, 3306),
      username: readString(ENV_KEYS.DB_USERNAME),
      password: readString(ENV_KEYS.DB_PASSWORD),
      database: readString(ENV_KEYS.DB_DATABASE, 'bomi'),
    },
  };
});
