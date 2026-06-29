/**
 * 数据库连接配置 - references/01 §2.7 database/
 * Stage 1 仅占位（TypeORM/Prisma 集成在 Stage 2 auth 模块落地）
 *
 * 从 app.db 读取连接参数，扩展连接池大小等 ORM 专属参数
 */
import type { ConfigService } from '@nestjs/config';
import type { DbConfig } from '../config/env';

/** 数据库连接池大小（Stage 2 引入 ORM 时使用） */
export const DB_POOL_SIZE = 10;

export interface DbConnectionConfig extends DbConfig {
  poolSize: number;
}

/** 从 ConfigService 读取数据库连接配置 */
export function loadDbConfig(configService: ConfigService): DbConnectionConfig {
  const db = configService.get<DbConfig>('app.db');
  if (!db) {
    throw new Error('[bomi] DB config not loaded');
  }
  return { ...db, poolSize: DB_POOL_SIZE };
}
