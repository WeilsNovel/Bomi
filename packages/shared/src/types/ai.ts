/**
 * AI 共享类型 - 前后端共享
 * 来源：references/08 §11.11
 * 破例占位，待整合方 review
 */

/** AI 消息角色 */
export type AiMessageRole = 'system' | 'user' | 'assistant' | 'tool';

/** AI 消息结构 - 前端发、服务端收、ai 层执行 */
export interface AiMessage {
  /** 角色 */
  role: AiMessageRole;
  /** 内容（文本；多模态时为序列化后的字符串，由 ai 层解析） */
  content: string;
  /** 工具调用ID（role=tool 时必填） */
  toolCallId?: string;
}

/** AI token 用量统计 - 用于计费/统计 */
export interface AiTokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** 工具调用结构 */
export interface AiToolCall {
  /** 工具名称 */
  name: string;
  /** 调用参数 */
  arguments: Record<string, unknown>;
}

/** AI 请求参数 - 前端发、服务端收、ai 层执行 */
export interface AiRequest {
  /** 会话ID */
  sessionId: string;
  /** 消息列表 */
  messages: AiMessage[];
  /** 模型名称（覆盖默认） */
  model?: string;
  /** 温度（0-2） */
  temperature?: number;
  /** 最大 token */
  maxTokens?: number;
  /** 是否流式返回 */
  stream?: boolean;
  /** 启用的工具列表 */
  tools?: string[];
}

/** AI 响应结构（非流式） */
export interface AiResponse {
  /** 会话ID */
  sessionId: string;
  /** 回复内容 */
  content: string;
  /** 使用的模型 */
  model: string;
  /** token 用量 */
  usage: AiTokenUsage;
  /** 工具调用结果（如有） */
  toolCalls?: AiToolCall[];
}

/** AI 流式响应分片（stream=true 时 SSE 单帧 data 解包后结构） */
export interface AiStreamChunk {
  /** 本次增量内容 */
  content: string;
  /** 是否结束 */
  done: boolean;
}
