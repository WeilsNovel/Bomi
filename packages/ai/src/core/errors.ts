/**
 * AI 层错误类型 - references/01 §2.8 core/
 * 用于 retry.ts 与 client.ts 的错误识别与传播
 */

/** AI HTTP 调用错误（携带状态码与响应体） */
export class AiHttpError extends Error {
  readonly status: number;
  readonly body: string;
  constructor(status: number, body: string, message?: string) {
    super(message ?? `AI HTTP ${status}`);
    this.name = 'AiHttpError';
    this.status = status;
    this.body = body;
  }
}

/** AI 响应解析错误（模型输出不符合预期 JSON schema） */
export class AiParseError extends Error {
  readonly raw: string;
  constructor(raw: string, message?: string) {
    super(message ?? 'AI response parse failed');
    this.name = 'AiParseError';
    this.raw = raw;
  }
}
