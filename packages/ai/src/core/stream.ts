/**
 * SSE 流式响应解析 - references/08 §11.12
 * 解析 OpenAI 兼容接口的 text/event-stream，逐帧产出 data 内容
 */
import { SSE_DONE_MARKER } from '../config/constants';

/**
 * 解析 SSE 流，逐帧返回 data 字段内容（字符串）。
 * 遇到 [DONE] 标记或流结束则停止。
 *
 * @param body ReadableStream（fetch res.body）
 * @yields data 字段内容（不含 "data: " 前缀）
 */
export async function* parseSseStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string, void, unknown> {
  const decoder = new TextDecoder('utf-8');
  const reader = body.getReader();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE 帧以双换行分隔
      let sepIndex: number;
      while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, sepIndex);
        buffer = buffer.slice(sepIndex + 2);
        const data = extractDataField(frame);
        if (data === null) continue;
        if (data === SSE_DONE_MARKER) return;
        yield data;
      }
    }
    // flush 残余
    if (buffer.trim().length > 0) {
      const data = extractDataField(buffer);
      if (data !== null && data !== SSE_DONE_MARKER) yield data;
    }
  } finally {
    reader.releaseLock();
  }
}

/** 从一个 SSE 帧中提取 data 字段（多行 data: 拼接） */
function extractDataField(frame: string): string | null {
  const lines = frame.split('\n');
  const dataLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('data:')) {
      dataLines.push(trimmed.slice('data:'.length).trim());
    }
  }
  if (dataLines.length === 0) return null;
  return dataLines.join('\n');
}
