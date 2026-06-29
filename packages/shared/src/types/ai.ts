/**
 * AI 调用共享类型 - 前后端共享
 * 前端发、server 收、ai 层执行，三端结构一致。
 */

/** AI 消息角色 */
export type AiMessageRole = 'system' | 'user' | 'assistant' | 'tool';

/** AI 消息结构 */
export interface AiMessage {
  role: AiMessageRole;
  content: string;
  /** 工具调用 ID（role = tool 时） */
  toolCallId?: string;
}

/** AI 请求参数 */
export interface AiRequest {
  /** 会话 ID */
  sessionId: string;
  /** 消息列表 */
  messages: AiMessage[];
  /** 模型名称（覆盖默认） */
  model?: string;
  /** 温度 0-2 */
  temperature?: number;
  /** 最大 token */
  maxTokens?: number;
  /** 是否流式返回 */
  stream?: boolean;
  /** 启用的工具列表 */
  tools?: string[];
}

/** AI 响应结构 */
export interface AiResponse {
  sessionId: string;
  /** 回复内容 */
  content: string;
  /** 使用的模型 */
  model: string;
  /** token 用量（计费 / 统计） */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  /** 工具调用结果（如有） */
  toolCalls?: AiToolCall[];
}

/** 工具调用结构 */
export interface AiToolCall {
  name: string;
  arguments: Record<string, unknown>;
}
