/* Hallmark · page: chat-active · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  BookOpen,
  Camera,
  Clock,
  CircleNotch,
  Paperclip,
  PaperPlaneRight,
  ThumbsDown,
  ThumbsUp,
  X,
} from "@phosphor-icons/react";
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
import { uploadImageToR2 } from "../api/uploads";
import { ChatSourceCards } from "../components/chat/ChatSourceCards";
import toast from "react-hot-toast";

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
          className="max-w-full h-auto max-h-60 rounded-xl mt-2 mb-2 border-2 border-border-main shadow-sm"
        />
      );
    }
    
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      return (
        <sup
          key={index}
          className="text-primary font-bold cursor-pointer hover:underline bg-primary-light/20 px-1.5 rounded-md mx-0.5"
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const { publicUrl } = await uploadImageToR2("snap", file);
      setAttachedImage(publicUrl);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "Không thể tải ảnh lên.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const dateLabel = useMemo(() => {
    const firstMessage = messages.find((message) => message.created_at);
    return formatMessageDate(firstMessage?.created_at);
  }, [messages]);

  useEffect(() => {
     
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
        setErrorMessage("Không thể tải tin nhắn cuộc trò chuyện.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [routeSessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  const handleFeedback = async (message: UiMessage, type: FeedbackValue) => {
    const index = messages.findIndex((m) => m._id === message._id);
    if (index === -1) return;

    setMessages((current) =>
      current.map((m) =>
        m._id === message._id
          ? { ...m, feedbackSubmitting: true }
          : m,
      ),
    );

    try {
      await submitChatFeedback({
        session_id: sessionId!,
        message_id: message._id,
        rating: type === "positive" ? 1 : -1,
        helpful: type === "positive",
      });
      setMessages((current) =>
        current.map((m) =>
          m._id === message._id
            ? { ...m, feedback: type }
            : m,
      ),
      );
      toast.success("Cảm ơn bạn đã phản hồi! 🌱");
    } catch (err) {
      console.error(err);
      toast.error("Không thể gửi phản hồi. Vui lòng thử lại sau.");
    } finally {
      setMessages((current) =>
        current.map((m) =>
          m._id === message._id
            ? { ...m, feedbackSubmitting: false }
            : m,
        ),
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = inputValue.trim();
    if ((!text && !attachedImage) || isStreaming || isUploadingImage) return;

    setIsStreaming(true);
    setInputValue("");
    setErrorMessage("");

    const localUserMsgId = createLocalId();
    const localAssistantMsgId = createLocalId();

    const formattedContent = attachedImage ? `[IMAGE:${attachedImage}] ${text}`.trim() : text;

    const userMessage: UiMessage = {
      _id: localUserMsgId,
      localId: localUserMsgId,
      role: "user",
      content: formattedContent,
      status: "completed",
      created_at: new Date().toISOString(),
    };

    const initialAssistantMessage: UiMessage = {
      _id: localAssistantMsgId,
      localId: localAssistantMsgId,
      role: "assistant",
      content: "",
      status: "pending",
      created_at: new Date().toISOString(),
      streaming: true,
    };

    setMessages((current) => [...current, userMessage, initialAssistantMessage]);
    setAttachedImage(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let currentAssistantText = "";
      
      await streamChatMessage(formattedContent, sessionId, {
        signal: controller.signal,
        onMeta: (meta) => {
          if (!sessionId && meta.session_id) {
            setSessionId(meta.session_id);
            window.history.replaceState(null, "", `/chat/active/${meta.session_id}`);
          }
        },
        onToken: (delta) => {
          if (!delta) return;
          currentAssistantText += delta;
          setMessages((current) =>
            current.map((msg) =>
              msg.localId === localAssistantMsgId
                ? { ...msg, content: currentAssistantText }
                : msg,
            ),
          );
        },
        onDone: (done) => {
          setMessages((current) =>
            current.map((msg) =>
              msg.localId === localAssistantMsgId
                ? { ...msg, _id: done.assistant_message_id, streaming: false, status: "completed", citations: done.citations }
                : msg,
            ),
          );
        },
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      console.error(err);
      setErrorMessage(err instanceof Error ? `Lỗi hệ thống: ${err.message}` : "Lỗi hệ thống: Đã xảy ra lỗi kết nối.");
      setMessages((current) =>
        current.filter((msg) => msg.localId !== localAssistantMsgId),
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main pb-32 text-left font-sans relative">
      <PageHeader
        title={sessionId ? "Tư vấn cây trồng" : "Trò chuyện mới"}
        subtitle="Bé Thóc - Trợ lý nông nghiệp AI"
        leftButton="close"
        rightButton="none"
        onLeftClick={() => {
          if (abortRef.current) abortRef.current.abort();
          navigate("/chat");
        }}
      />

      <main className="w-full max-w-3xl mx-auto px-4 md:px-6 pt-24 pb-8 flex-1 flex flex-col gap-6">
        {messages.length > 0 && (
          <div className="w-full flex justify-center px-2">
            <span className="text-xs font-bold text-text-secondary bg-white/70 border border-border-main/50 px-3 py-1 rounded-full font-mono">
              {dateLabel}
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="flex-1 py-32 flex flex-col items-center justify-center gap-3">
            <CircleNotch className="w-8 h-8 animate-spin text-primary" weight="bold" />
            <p className="font-bold text-text-secondary">Đang tải cuộc trò chuyện...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
            <div className="w-28 h-28 mb-4">
              <PetMascot className="w-full h-full drop-shadow-md animate-bounce" status={petStatus} size={112} />
            </div>
            <h2 className="text-[24px] font-black text-text-h mb-2 tracking-tight">
              Hỏi Bé Thóc về ruộng vườn
            </h2>
            <p className="text-text-secondary font-bold text-[15px] max-w-sm leading-relaxed">
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
                <div className="flex items-end gap-2 mb-1.5 ml-1">
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-border-main flex items-center justify-center overflow-hidden shrink-0 p-0.5 shadow-sm">
                    <PetMascot
                      className={`w-full h-full -mt-0.5 ${message.streaming ? "animate-pulse" : ""}`}
                      status={petStatus} size={36}
                    />
                  </div>
                  <span className="font-bold text-[13px] text-text-secondary ml-1 mb-1">
                    Bé Thóc
                  </span>
                </div>
              ) : null}

              <div
                className={`${message.role === "user" ? "bg-[#008A5E] text-white rounded-[20px] rounded-br-[4px] border border-[#008A5E]/10 font-bold" : "bg-white text-text-main rounded-[20px] rounded-bl-[4px] border-2 border-border-main ml-12 shadow-sm"} p-4 max-w-[85%]`}
              >
                {message.role === "assistant" && message.citations && message.citations.length > 0 && (
                  <ChatSourceCards citations={message.citations} />
                )}
                <p className="font-bold text-[15px] whitespace-pre-wrap leading-relaxed">
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
                      className={`bg-white border-2 px-3 py-1.5 rounded-full font-bold text-[13px] shadow-sm transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                        message.feedback === "positive"
                          ? "text-[#008A5E] border-[#008A5E]/30 bg-[#E8F8F5]"
                          : "text-text-secondary border-border-main hover:bg-bg-surface-2"
                      }`}
                    >
                      {message.feedbackSubmitting &&
                      message.feedback === "positive" ? (
                        <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
                      ) : (
                        <ThumbsUp className="w-3.5 h-3.5" weight="duotone" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleFeedback(message, "negative")}
                      disabled={message.feedbackSubmitting}
                      aria-pressed={message.feedback === "negative"}
                      aria-label="Đánh giá phản hồi chưa hữu ích"
                      className={`bg-white border-2 px-3 py-1.5 rounded-full font-bold text-[13px] shadow-sm transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                        message.feedback === "negative"
                          ? "text-[#FF3B30] border-[#FF3B30]/30 bg-[#FF3B30]/5"
                          : "text-text-secondary border-border-main hover:bg-bg-surface-2"
                      }`}
                    >
                      {message.feedbackSubmitting &&
                      message.feedback === "negative" ? (
                        <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
                      ) : (
                        <ThumbsDown className="w-3.5 h-3.5" weight="duotone" />
                      )}
                    </button>
                    <button
                      onClick={() => navigate("/diary/create")}
                      className="bg-white text-text-main border-2 border-border-main px-3 py-1.5 rounded-full font-bold text-[13px] hover:bg-bg-surface-2 shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#008A5E]" weight="duotone" />
                      Ghi nhật ký
                    </button>
                    <button
                      onClick={() => navigate("/reminder/create")}
                      className="bg-white text-text-main border-2 border-border-main px-3 py-1.5 rounded-full font-bold text-[13px] hover:bg-bg-surface-2 shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-secondary" weight="duotone" />
                      Đặt nhắc nhở
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}

        {errorMessage ? (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-4 py-3 font-bold text-sm">
            {errorMessage}
          </div>
        ) : null}

        <div ref={scrollRef} className="h-[20px]" />
      </main>

      <div className="fixed bottom-0 left-0 right-0 w-full pt-10 pb-6 px-4 md:px-8 z-30 flex justify-center pointer-events-none bg-gradient-to-t from-bg-main via-bg-main/95 to-transparent">
        <div className="w-full max-w-3xl flex flex-col pointer-events-auto">
          {attachedImage && (
            <div className="relative w-20 h-20 bg-white p-1 rounded-xl shadow-sm border-2 border-border-main group animate-in slide-in-from-bottom-2 fade-in mb-3 ml-4">
              <img src={attachedImage} className="w-full h-full object-cover rounded-lg" alt="Attachment" />
              <button 
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute -top-2 -right-2 bg-[#FF3B30] text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" weight="bold" />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-full flex items-center gap-1.5 bg-white border-2 border-border-main rounded-full p-2 shadow-sm focus-within:border-primary-light transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage || isStreaming}
              title="Đính kèm ảnh"
              className="p-2.5 text-text-secondary hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-bg-surface-1 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isUploadingImage ? <CircleNotch className="w-[20px] h-[20px] animate-spin text-primary" weight="bold" /> : <Paperclip className="w-[20px] h-[20px]" weight="duotone" />}
            </button>
            <button
              type="button"
              onClick={() => navigate("/scan")}
              title="Chụp ảnh cây trồng (Scan)"
              className="p-2.5 text-text-secondary hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-bg-surface-1 active:scale-95 cursor-pointer"
            >
              <Camera className="w-[20px] h-[20px]" weight="duotone" />
            </button>

            <input
              className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-[15px] text-text-main placeholder:text-text-secondary/60 h-full py-2.5 outline-none min-w-0"
              placeholder="Nhắn tin Bé Thóc..."
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isStreaming || isUploadingImage}
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isStreaming}
              className="p-3 text-white bg-[#008A5E] rounded-full hover:bg-[#248A3D] transition-colors flex items-center justify-center mr-1 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-bg-surface-2 disabled:text-text-secondary"
            >
              {isStreaming ? (
                <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
              ) : (
                <PaperPlaneRight className="w-[20px] h-[20px] ml-0.5" weight="bold" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatActive;
