/**
 * 请求追踪 ID 工具 - references/01 §2.7 common/
 * 用于 BaseApiResponse.traceId 字段
 */
import { randomUUID } from 'node:crypto';

/** 追踪 ID 请求头名 */
export const TRACE_ID_HEADER = 'x-trace-id';

/** 生成追踪 ID（32 位无连字符 UUID） */
export function generateTraceId(): string {
  return randomUUID().replace(/-/g, '');
}
