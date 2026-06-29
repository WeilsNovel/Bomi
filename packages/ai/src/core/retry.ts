/**
 * AI 重试 + 限流退避 - references/01 §2.8 core/retry + references/08 §11.13
 *
 * 默认重试条件：429 限流 或 5xx 服务端错误
 * 退避策略：指数退避 baseDelayMs * 2^attempt
 */
import { AiHttpError } from './errors';

export interface RetryOptions {
  /** 最大重试次数（不含首次调用） */
  times: number;
  /** 基础退避毫秒 */
  baseDelayMs: number;
  /** 是否应重试（默认：429/5xx） */
  shouldRetry?: (err: unknown, attempt: number) => boolean;
  /** 上限退避毫秒（默认 10s） */
  maxDelayMs?: number;
}

const DEFAULT_MAX_DELAY_MS = 10_000;

export async function callWithRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions,
): Promise<T> {
  const shouldRetry = opts.shouldRetry ?? defaultShouldRetry;
  const maxDelay = opts.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
  let lastErr: unknown;

  for (let attempt = 0; attempt <= opts.times; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt === opts.times || !shouldRetry(err, attempt)) {
        throw err;
      }
      const delay = Math.min(opts.baseDelayMs * Math.pow(2, attempt), maxDelay);
      await sleep(delay);
    }
  }
  throw lastErr;
}

export function defaultShouldRetry(err: unknown): boolean {
  if (err instanceof AiHttpError) {
    return err.status === 429 || err.status >= 500;
  }
  // 网络错误/超时也重试
  if (err instanceof Error) {
    const name = err.name;
    return name === 'TypeError' || name === 'AbortError' || name === 'TimeoutError';
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
