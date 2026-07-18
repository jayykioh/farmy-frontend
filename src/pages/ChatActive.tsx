/* eslint-disable */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  BookOpen,
  Camera,
  Clock,
  Loader2,
  Send,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { PetMascot } from "../features/pet/components/PetMascot";
import { usePetStatus } from "../features/pet/hooks/usePetStatus";
import { PET_STATUS_FALLBACK } from "../features/pet/types/pet.types";
import { PageHeader } from "../components/PageHeader";
import {
  fetchChatMessages,
  streamChatMessage,
  submitChatFeedback,
  type ChatMessage,
} from "../api/chat";
import { ChatSourceCards } from "../components/chat/ChatSourceCards";

type FeedbackValue = "positive" | "negative";

type UiMessage = ChatMessage & {
  feedback?: FeedbackValue;
  feedbackSubmitting?: boolean;
  localId?: string;
  streaming?: boolean;
};

const createLocalId = () =>
  `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const formatMessageDate = (value?: string) => {
  if (!value) return "Hôm nay";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const parseMessageContent = (content: string) => {
  if (!content) return null;
  const parts = content.split(/(\[\d+\]|\[IMAGE:https?:\/\/[^\]]+\])/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('[IMAGE:')) {
      const url = part.slice(7, -1);
      return (
        <img
          key={index}
          src={url}
          alt="Attached"
          className="max-w-full h-auto max-h-60 rounded-xl mt-2 mb-2 border border-border-main/20 shadow-sm"
        />
      );
    }
    
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      return (
        <sup
          key={index}
          className="text-primary font-bold cursor-pointer hover:underline bg-primary/10 px-1 rounded-sm mx-0.5"
          onClick={() => {
            // Future: Scroll to the corresponding card
          }}
        >
          {match[1]}
        </sup>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export const ChatActive: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId: routeSessionId } = useParams<{ sessionId?: string }>();
  const [sessionId, setSessionId] = useState<string | undefined>(
    routeSessionId,
  );
  const location = useLocation();
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [inputValue, setInputValue] = useState(
    (location.state as any)?.initialMessage || "",
  );
  const [attachedImage, setAttachedImage] = useState<string | null>(
    (location.state as any)?.initialImage || null,
  );
  const [isLoading, setIsLoading] = useState(Boolean(routeSessionId));
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const dateLabel = useMemo(() => {
    const firstMessage = messages.find((message) => message.created_at);
    return formatMessageDate(firstMessage?.created_at);
  }, [messages]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(routeSessionId);

    if (!routeSessionId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setErrorMessage("");

    fetchChatMessages(routeSessionId)
      .then((response) => {
        if (cancelled) return;
        setMessages(response.items);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setErrorMessage("Không thể tải lịch sử trò chuyện.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [routeSessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isStreaming]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const updateMessage = (
    messageId: string,
    updater: (message: UiMessage) => UiMessage,
  ) => {
    setMessages((prev) =>
      prev.map((message) =>
        message._id === messageId || message.localId === messageId
          ? updater(message)
          : message,
      ),
    );
  };

  const handleFeedback = async (
    message: UiMessage,
    feedback: FeedbackValue,
  ) => {
    if (
      !sessionId ||
      message.feedbackSubmitting ||
      message._id.startsWith("local-")
    ) {
      return;
    }

    const previousFeedback = message.feedback;
    updateMessage(message._id, (current) => ({
      ...current,
      feedback,
      feedbackSubmitting: true,
    }));
    setErrorMessage("");

    try {
      await submitChatFeedback({
        session_id: sessionId,
        message_id: message._id,
        rating: feedback === "positive" ? 1 : -1,
        helpful: feedback === "positive",
      });
      updateMessage(message._id, (current) => ({
        ...current,
        feedback,
        feedbackSubmitting: false,
      }));
    } catch (err) {
      console.error(err);
      updateMessage(message._id, (current) => ({
        ...current,
        feedback: previousFeedback,
        feedbackSubmitting: false,
      }));
      setErrorMessage("Không thể gửi phản hồi. Bạn thử lại sau nhé.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputValue.trim();

    if ((!content && !attachedImage) || isStreaming) {
      return;
    }

    let messageContent = content;
    if (attachedImage) {
      messageContent = content ? `${content}\n\n[IMAGE:${attachedImage}]` : `[IMAGE:${attachedImage}]`;
    }

    const userLocalId = createLocalId();
    const assistantLocalId = createLocalId();
    const now = new Date().toISOString();
    const controller = new AbortController();

    abortRef.current?.abort();
    abortRef.current = controller;
    setInputValue("");
    setAttachedImage(null);
    setErrorMessage("");
    setIsStreaming(true);
    setMessages((prev) => [
      ...prev,
      {
        _id: userLocalId,
        localId: userLocalId,
        role: "user",
        content: messageContent,
        status: "completed",
        created_at: now,
      },
      {
        _id: assistantLocalId,
        localId: assistantLocalId,
        role: "assistant",
        content: "",
        status: "pending",
        created_at: now,
        streaming: true,
      },
    ]);

    try {
      await streamChatMessage(messageContent, sessionId, {
        signal: controller.signal,
        onMeta: (meta) => {
          setSessionId(meta.session_id);
          if (!routeSessionId) {
            window.history.replaceState(
              null,
              "",
              `/chat/active/${meta.session_id}`,
            );
          }
        },
        onToken: (delta) => {
          if (!delta) return;
          updateMessage(assistantLocalId, (message) => ({
            ...message,
            content: `${message.content}${delta}`,
          }));
        },
        onDone: (done) => {
          updateMessage(assistantLocalId, (message) => ({
            ...message,
            _id: done.assistant_message_id,
            status: "completed",
            streaming: false,
            citations: done.citations,
          }));
        },
      });
    } catch (err) {
      if (controller.signal.aborted) {
        return;
      }

      console.error(err);
      const errorMessageText = err instanceof Error ? err.message : "Không thể gửi tin nhắn.";
      setErrorMessage(errorMessageText);
      updateMessage(assistantLocalId, (current) => ({
        ...current,
        content:
          current.content || `Lỗi hệ thống: ${errorMessageText}`,
        status: "failed",
        streaming: false,
      }));
    } finally {
      if (!controller.signal.aborted) {
        setIsStreaming(false);
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[100svh] bg-white text-left font-sans flex flex-col overflow-hidden">
      <PageHeader
        title="FarmDiaries AI"
        subtitle={isStreaming ? "Bé Thóc đang trả lời" : "Tri Kỷ AI"}
        leftButton="back"
        rightButton="camera"
        onRightClick={() => navigate("/scan")}
      />

      <main
        ref={scrollRef}
        className="w-full max-w-3xl mx-auto flex-1 pt-[72px] pb-[120px] px-4 md:px-8 flex flex-col gap-6 overflow-y-auto scrollbar-hide bg-white z-0"
      >
        <div className="flex justify-center mt-6">
          <span className="bg-white border border-border-main/50 text-text-main/50 font-bold text-xs px-4 py-1 rounded-full shadow-sm">
            {dateLabel}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-text-main/60 font-bold">
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang tải trò chuyện...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
            <div className="w-28 h-28 mb-4">
              <PetMascot className="w-full h-full drop-shadow-md" status={petStatus} size={112} />
            </div>
            <h2 className="text-2xl font-black text-text-main mb-2">
              Hỏi Bé Thóc về ruộng vườn
            </h2>
            <p className="text-text-main/70 font-medium max-w-sm">
              Nhập câu hỏi về cây trồng, sâu bệnh, lịch chăm sóc hoặc cách xử lý
              tình huống ngoài đồng.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.localId ?? message._id}
              className={`flex flex-col w-full ${message.role === "user" ? "items-end" : "items-start"}`}
            >
              {message.role === "assistant" ? (
                <div className="flex items-end gap-2 mb-1">
                  <div className="w-10 h-10 rounded-full bg-white border border-border-main/50 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                    <PetMascot
                      className={`w-full h-full -mt-1 ${message.streaming ? "animate-pulse" : ""}`}
                      status={petStatus} size={40}
                    />
                  </div>
                  <span className="font-bold text-sm text-text-main/70 ml-2 mb-1">
                    Bé Thóc
                  </span>
                </div>
              ) : null}

              <div
                className={`${message.role === "user" ? "bg-primary-container text-white rounded-br-sm" : "bg-[#fcfaf5] text-text-main rounded-bl-sm border border-border-main/50 ml-12"} p-4 rounded-2xl max-w-[85%]`}
              >
                {message.role === "assistant" && message.citations && message.citations.length > 0 && (
                  <ChatSourceCards citations={message.citations} />
                )}
                <p className="font-medium text-base whitespace-pre-wrap leading-relaxed">
                  {message.content ? parseMessageContent(message.content) :
                    (message.streaming ? "Đang suy nghĩ..." : "")}
                </p>

                {message.role === "assistant" &&
                message.status === "completed" ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => void handleFeedback(message, "positive")}
                      disabled={message.feedbackSubmitting}
                      aria-pressed={message.feedback === "positive"}
                      aria-label="Đánh giá phản hồi hữu ích"
                      className={`bg-white border px-3 py-1.5 rounded-full font-bold text-sm hover:-translate-y-[1px] hover:shadow-sm transition-all active:scale-95 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed ${
                        message.feedback === "positive"
                          ? "text-primary border-primary/40 bg-primary/5"
                          : "text-text-main border-border-main/50"
                      }`}
                    >
                      {message.feedbackSubmitting &&
                      message.feedback === "positive" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ThumbsUp className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleFeedback(message, "negative")}
                      disabled={message.feedbackSubmitting}
                      aria-pressed={message.feedback === "negative"}
                      aria-label="Đánh giá phản hồi chưa hữu ích"
                      className={`bg-white border px-3 py-1.5 rounded-full font-bold text-sm hover:-translate-y-[1px] hover:shadow-sm transition-all active:scale-95 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed ${
                        message.feedback === "negative"
                          ? "text-red-600 border-red-200 bg-red-50"
                          : "text-text-main border-border-main/50"
                      }`}
                    >
                      {message.feedbackSubmitting &&
                      message.feedback === "negative" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ThumbsDown className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => navigate("/diary/create")}
                      className="bg-white text-text-main border border-border-main/50 px-4 py-1.5 rounded-full font-bold text-sm hover:-translate-y-[1px] hover:shadow-sm transition-all active:scale-95 flex items-center gap-1"
                    >
                      <BookOpen className="w-4 h-4 text-primary" />
                      Ghi nhật ký
                    </button>
                    <button
                      onClick={() => navigate("/reminder/create")}
                      className="bg-white text-text-main border border-border-main/50 px-4 py-1.5 rounded-full font-bold text-sm hover:-translate-y-[1px] hover:shadow-sm transition-all active:scale-95 flex items-center gap-1"
                    >
                      <Clock className="w-4 h-4 text-secondary" />
                      Đặt nhắc nhở
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}

        {errorMessage ? (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 font-bold text-sm">
            {errorMessage}
          </div>
        ) : null}

        <div className="h-[20px]" />
      </main>

      <div className="fixed bottom-24 md:bottom-8 left-0 right-0 w-full pt-6 pb-4 px-4 md:px-8 z-30 flex justify-center pointer-events-none">
        <div className="w-full max-w-3xl flex flex-col pointer-events-auto">
          {attachedImage && (
            <div className="relative w-20 h-20 bg-white p-1 rounded-xl shadow-sm border border-border-main/50 group animate-in slide-in-from-bottom-2 fade-in mb-2 ml-4">
              <img src={attachedImage} className="w-full h-full object-cover rounded-lg" alt="Attachment" />
              <button 
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-full flex items-center gap-2 bg-white border border-border-main/50 rounded-full p-1 shadow-sm focus-within:shadow-md focus-within:-translate-y-[1px] transition-all"
          >
          <button
            type="button"
            onClick={() => navigate("/scan")}
            className="p-3 text-text-main/50 hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-bg-surface-1 cursor-pointer"
          >
            <Camera className="w-6 h-6" />
          </button>

          <input
            className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-base text-text-main placeholder:text-border-main h-full py-3 outline-none min-w-0"
            placeholder="Nhắn tin Bé Thóc..."
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isStreaming}
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className="p-3 text-white bg-primary rounded-full hover:bg-primary-container transition-colors flex items-center justify-center mr-1 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ChatActive;
