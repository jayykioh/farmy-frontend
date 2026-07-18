import { api, getAccessToken, getCsrfToken } from "./client";

export type ChatRole = "user" | "assistant" | "system";
export type ChatMessageStatus = "pending" | "completed" | "failed";

export type ChatSession = {
  _id: string;
  title?: string;
  last_message_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type ChatCitation = {
  source_id: string;
  source_type: "diary_log" | "knowledge_source";
  chunk_index: number;
  score: number;
  title?: string;
  url?: string;
};

export type ChatMessage = {
  _id: string;
  role: ChatRole;
  content: string;
  status?: ChatMessageStatus;
  reply_to_message_id?: string;
  created_at?: string;
  citations?: ChatCitation[];
};

export type ChatFeedbackPayload = {
  session_id: string;
  message_id: string;
  rating: number;
  helpful?: boolean;
  comment?: string;
};

export type ChatFeedbackResponse = {
  success: boolean;
  message?: string;
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
  citations?: ChatCitation[];
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

const unwrapResponse = <T>(response: WrappedResponse<T>): T => {
  if (response && typeof response === "object" && "data" in response) {
    return response.data as T;
  }

  return response as T;
};

const normalizePaginated = <T>(
  response: WrappedResponse<PaginatedResponse<T> | T[]>,
): PaginatedResponse<T> => {
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
  const baseUrl = String(api.defaults.baseURL ?? "").replace(/\/$/, "");
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const createClientMessageId = () => {
  if ("randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const fetchChatSessions = async (page = 1, limit = 20) => {
  const { data } = await api.get<
    WrappedResponse<PaginatedResponse<ChatSession> | ChatSession[]>
  >("/chat/sessions", {
    params: { page, limit },
  });

  return normalizePaginated<ChatSession>(data);
};

export const fetchChatMessages = async (
  sessionId: string,
  page = 1,
  limit = 100,
) => {
  const { data } = await api.get<
    WrappedResponse<PaginatedResponse<ChatMessage> | ChatMessage[]>
  >(`/chat/sessions/${sessionId}/messages`, { params: { page, limit } });

  return normalizePaginated<ChatMessage>(data);
};

export const deleteChatSession = async (sessionId: string) => {
  await api.delete(`/chat/sessions/${sessionId}`);
};

export const renameChatSession = async (sessionId: string, title: string) => {
  const { data } = await api.patch<WrappedResponse<ChatSession>>(
    `/chat/sessions/${sessionId}`,
    { title },
  );

  return unwrapResponse(data);
};

export const submitChatFeedback = async (payload: ChatFeedbackPayload) => {
  const { data } = await api.post<ChatFeedbackResponse>(
    "/chat/feedback",
    payload,
  );
  return data;
};

export const streamChatMessage = async (
  message: string,
  sessionId: string | undefined,
  handlers: StreamChatHandlers,
) => {
  let settled = false;
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

  const finish = () => {
    if (settled) return;
    settled = true;
    if (reader) {
      reader.cancel().catch((err) => console.error(err));
    }
    handlers.signal?.removeEventListener("abort", handleAbort);
  };

  const handleAbort = () => {
    finish();
  };

  handlers.signal?.addEventListener("abort", handleAbort, { once: true });

  try {
    const accessToken = getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    headers["X-XSRF-TOKEN"] = await getCsrfToken();

    const response = await fetch(getApiUrl("/chat/stream"), {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({
        message,
        client_message_id: createClientMessageId(),
        ...(sessionId ? { session_id: sessionId } : {}),
      }),
      signal: handlers.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const block of lines) {
        if (!block.trim()) continue;

        const eventMatch = block.match(/event:\s*(.+)/);
        const dataMatch = block.match(/data:\s*(.+)/);

        if (eventMatch && dataMatch) {
          const eventName = eventMatch[1].trim();
          const eventData = dataMatch[1].trim();

          try {
            if (eventName === "meta") {
              handlers.onMeta?.(JSON.parse(eventData) as StreamMeta);
            } else if (eventName === "token") {
              const payload = JSON.parse(eventData) as { delta?: string };
              handlers.onToken?.(payload.delta ?? "");
            } else if (eventName === "done") {
              handlers.onDone?.(JSON.parse(eventData) as StreamDone);
              finish();
              return;
            } else if (eventName === "error") {
              const payload = JSON.parse(eventData) as StreamError;
              throw new Error(payload.message || "Không thể tạo phản hồi AI.");
            }
          } catch (err) {
            if (err instanceof Error && eventName === "error") {
              throw err;
            }
            console.error("Error parsing stream event:", err);
          }
        }
      }
    }
    finish();
  } catch (err) {
    finish();
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    if (
      err instanceof Error &&
      err.message !== "Failed to fetch" &&
      !err.message.includes("HTTP Error")
    ) {
      throw err;
    }
    throw new Error("Không thể kết nối Chat SSE.");
  }
};
