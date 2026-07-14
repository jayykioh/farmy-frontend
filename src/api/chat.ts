import { api, getAccessToken } from "./client";

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

const createEventSourceStreamUrl = (message: string, sessionId?: string) => {
  const params = new URLSearchParams({
    message,
    client_message_id: createClientMessageId(),
  });
  const accessToken = getAccessToken();

  if (sessionId) {
    params.set("session_id", sessionId);
  }

  if (accessToken) {
    params.set("access_token", accessToken);
  }

  return `${getApiUrl("/chat/stream/events")}?${params.toString()}`;
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
  await new Promise<void>((resolve, reject) => {
    const eventSource = new EventSource(
      createEventSourceStreamUrl(message, sessionId),
      {
        withCredentials: true,
      },
    );
    let settled = false;

    const close = () => {
      eventSource.close();
      handlers.signal?.removeEventListener("abort", handleAbort);
    };

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      close();
      callback();
    };

    const parseEvent = <T>(event: MessageEvent<string>) =>
      JSON.parse(event.data) as T;

    const handleAbort = () => {
      finish(() =>
        reject(new DOMException("Chat stream aborted", "AbortError")),
      );
    };

    handlers.signal?.addEventListener("abort", handleAbort, { once: true });

    eventSource.addEventListener("meta", (event) => {
      handlers.onMeta?.(parseEvent<StreamMeta>(event as MessageEvent<string>));
    });

    eventSource.addEventListener("token", (event) => {
      const payload = parseEvent<{ delta?: string }>(
        event as MessageEvent<string>,
      );
      handlers.onToken?.(payload.delta ?? "");
    });

    eventSource.addEventListener("done", (event) => {
      handlers.onDone?.(parseEvent<StreamDone>(event as MessageEvent<string>));
      finish(resolve);
    });

    eventSource.addEventListener("error", (event) => {
      if ("data" in event && typeof event.data === "string" && event.data) {
        const payload = parseEvent<StreamError>(event as MessageEvent<string>);
        finish(() =>
          reject(new Error(payload.message || "Không thể tạo phản hồi AI.")),
        );
        return;
      }

      finish(() => reject(new Error("Không thể kết nối Chat SSE.")));
    });
  });
};
