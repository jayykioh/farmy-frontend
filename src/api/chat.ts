import { api, getAccessToken } from './client';

export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatMessageStatus = 'pending' | 'completed' | 'failed';

export type ChatSession = {
  _id: string;
  title?: string;
  last_message_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type ChatMessage = {
  _id: string;
  role: ChatRole;
  content: string;
  status?: ChatMessageStatus;
  reply_to_message_id?: string;
  created_at?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

export type StreamMeta = {
  session_id: string;
  user_message_id: string;
  retrieval_status?: string;
};

export type StreamDone = {
  assistant_message_id: string;
  citations?: unknown[];
};

export type StreamError = {
  code: string;
  message: string;
  retryable: boolean;
};

export type StreamChatHandlers = {
  signal?: AbortSignal;
  onMeta?: (meta: StreamMeta) => void;
  onToken?: (delta: string) => void;
  onDone?: (done: StreamDone) => void;
};

type WrappedResponse<T> = T | { success: boolean; data: T };

const unwrapResponse = <T,>(response: WrappedResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data as T;
  }

  return response as T;
};

const normalizePaginated = <T,>(response: WrappedResponse<PaginatedResponse<T> | T[]>): PaginatedResponse<T> => {
  const data = unwrapResponse(response);

  if (Array.isArray(data)) {
    return {
      items: data,
      page: 1,
      limit: data.length,
      total: data.length,
    };
  }

  return data;
};

const getApiUrl = (path: string) => {
  const baseUrl = String(api.defaults.baseURL ?? '').replace(/\/$/, '');
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

const parseSseBlock = (block: string) => {
  let event = 'message';
  const dataLines: string[] = [];

  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
      continue;
    }

    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  if (dataLines.length === 0) {
    return null;
  }

  return {
    event,
    data: JSON.parse(dataLines.join('\n')) as unknown,
  };
};

const createClientMessageId = () => {
  if ('randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const fetchChatSessions = async (page = 1, limit = 20) => {
  const { data } = await api.get<WrappedResponse<PaginatedResponse<ChatSession> | ChatSession[]>>('/chat/sessions', {
    params: { page, limit },
  });

  return normalizePaginated<ChatSession>(data);
};

export const fetchChatMessages = async (sessionId: string, page = 1, limit = 100) => {
  const { data } = await api.get<WrappedResponse<PaginatedResponse<ChatMessage> | ChatMessage[]>>(
    `/chat/sessions/${sessionId}/messages`,
    { params: { page, limit } },
  );

  return normalizePaginated<ChatMessage>(data);
};

export const streamChatMessage = async (
  message: string,
  sessionId: string | undefined,
  handlers: StreamChatHandlers,
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
  };
  const accessToken = getAccessToken();

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(getApiUrl('/chat/stream'), {
    method: 'POST',
    headers,
    credentials: 'include',
    signal: handlers.signal,
    body: JSON.stringify({
      message,
      client_message_id: createClientMessageId(),
      session_id: sessionId,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error('Không thể kết nối Chat API.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';

    for (const block of blocks) {
      const parsed = parseSseBlock(block.trim());
      if (!parsed) continue;

      if (parsed.event === 'meta') {
        handlers.onMeta?.(parsed.data as StreamMeta);
      } else if (parsed.event === 'token') {
        const payload = parsed.data as { delta?: string };
        handlers.onToken?.(payload.delta ?? '');
      } else if (parsed.event === 'done') {
        handlers.onDone?.(parsed.data as StreamDone);
      } else if (parsed.event === 'error') {
        const payload = parsed.data as StreamError;
        throw new Error(payload.message || 'Không thể tạo phản hồi AI.');
      }
    }

    if (done) {
      break;
    }
  }
};
