import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Check,
  ChevronRight,
  Pencil,
  Leaf,
  Loader2,
  MessageCircle,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { PetMascot } from '../features/pet/components/PetMascot';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { PageHeader } from '../components/PageHeader';
import {
  deleteChatSession,
  fetchChatSessions,
  renameChatSession,
  type ChatSession,
} from '../api/chat';

const formatRelativeDate = (value?: string) => {
  if (!value) return '';

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmingSessionId, setConfirmingSessionId] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [savingSessionId, setSavingSessionId] = useState<string | null>(null);

  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  useEffect(() => {
    let cancelled = false;

    fetchChatSessions()
      .then(response => {
        if (cancelled) return;
        setSessions(response.items);
      })
      .catch(err => {
        if (cancelled) return;
        console.error(err);
        setErrorMessage('Không thể tải lịch sử trò chuyện.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeleteSession = async (sessionId: string) => {
    setDeletingSessionId(sessionId);
    setErrorMessage('');

    try {
      await deleteChatSession(sessionId);
      setSessions((current) => current.filter((session) => session._id !== sessionId));
      setConfirmingSessionId(null);
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể xóa cuộc trò chuyện. Bạn thử lại sau nhé.');
    } finally {
      setDeletingSessionId(null);
    }
  };

  const startEditingSession = (session: ChatSession) => {
    setConfirmingSessionId(null);
    setEditingSessionId(session._id);
    setDraftTitle(session.title || 'Cuộc trò chuyện với Bé Thóc');
    setErrorMessage('');
  };

  const handleRenameSession = async (sessionId: string) => {
    const title = draftTitle.trim();
    if (!title) {
      setErrorMessage('Tên cuộc trò chuyện không được để trống.');
      return;
    }

    setSavingSessionId(sessionId);
    setErrorMessage('');

    try {
      const updated = await renameChatSession(sessionId, title);
      setSessions((current) =>
        current.map((session) =>
          session._id === sessionId ? { ...session, ...updated } : session,
        ),
      );
      setEditingSessionId(null);
      setDraftTitle('');
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể đổi tên cuộc trò chuyện. Bạn thử lại sau nhé.');
    } finally {
      setSavingSessionId(null);
    }
  };

  return (
    <div className="w-full h-full min-h-[100svh] bg-[#f4f1e8] text-left font-sans pb-[100px] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-32 right-[-80px] h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0))]" />
      </div>
      <PageHeader title="Tri Kỷ AI" leftButton="none" />

      <main className="w-full max-w-3xl mx-auto px-4 md:px-8 pt-24 pb-12 relative min-h-[100svh] flex flex-col">
        <section className="mb-7 rounded-[32px] border border-white/80 bg-white/70 p-5 shadow-[0_18px_50px_rgba(59,79,42,0.10)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-primary-container">
                <Leaf className="h-3.5 w-3.5" />
                Sổ tay đồng áng
              </div>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-[-0.04em] text-text-main">
                Lịch sử tư vấn
              </h2>
              <p className="mt-2 max-w-md text-sm font-semibold leading-relaxed text-text-main/65">
                Mỗi cuộc trò chuyện được giữ lại như một ghi chú canh tác, có thể mở tiếp hoặc dọn bớt khi đã xử lý xong.
              </p>
            </div>
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-[#e7dcc5] text-primary-container shadow-inner md:flex">
              <MessageCircle className="h-7 w-7" />
            </div>
          </div>
        </section>

        <div className="flex justify-end mb-5">
          <button 
            onClick={() => navigate('/chat/active')}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white rounded-full font-bold shadow-md active:scale-95 hover:bg-primary-container transition-all"
          >
            <Plus className="w-5 h-5" />
            Chat mới
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-text-main/60 font-bold">
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang tải lịch sử...
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-5 flex items-start gap-3 font-bold">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            {errorMessage}
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map(session => (
              <article
                key={session._id}
                className="group relative overflow-hidden rounded-[28px] border border-white/80 bg-[#fffdf6]/90 p-1 shadow-[0_18px_42px_rgba(73,89,54,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_54px_rgba(73,89,54,0.16)]"
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary via-secondary to-[#c69c48]" />
                <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full border border-primary/10 bg-primary/5" />
                <div className="relative flex items-stretch gap-2 p-4">
                  {editingSessionId === session._id ? (
                    <div className="min-w-0 flex-1">
                      <label className="text-[12px] font-black uppercase tracking-[0.16em] text-primary-container" htmlFor={`chat-title-${session._id}`}>
                        Tên cuộc trò chuyện
                      </label>
                      <input
                        id={`chat-title-${session._id}`}
                        aria-label="Tên cuộc trò chuyện"
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        maxLength={60}
                        className="mt-2 w-full rounded-2xl border border-primary/20 bg-white px-4 py-3 text-lg font-black text-text-main outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void handleRenameSession(session._id)}
                          disabled={savingSessionId === session._id}
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm active:scale-95 disabled:opacity-70"
                        >
                          {savingSessionId === session._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Lưu tên
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSessionId(null);
                            setDraftTitle('');
                          }}
                          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-text-main shadow-sm active:scale-95"
                        >
                          <X className="h-4 w-4" />
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(`/chat/active/${session._id}`)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5de] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary-container">
                          <MessageCircle className="h-3.5 w-3.5" />
                          AI
                        </span>
                        <span className="text-[12px] font-bold text-text-main/45">
                          {formatRelativeDate(session.last_message_at ?? session.updated_at ?? session.created_at)}
                        </span>
                      </div>
                      <h3 className="mt-3 line-clamp-2 text-xl font-black leading-snug tracking-[-0.03em] text-text-main">
                        {session.title || 'Cuộc trò chuyện với Bé Thóc'}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-relaxed text-text-main/62">
                        Mở lại mạch tư vấn cũ, giữ nguyên bối cảnh nông trại và các ghi chú trước đó.
                      </p>
                    </button>
                  )}

                  <div className="flex shrink-0 flex-col items-end justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        aria-label="Đổi tên cuộc trò chuyện"
                        onClick={() => startEditingSession(session)}
                        className="rounded-full border border-primary/10 bg-white/85 p-2.5 text-primary-container shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 active:scale-95"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Xóa cuộc trò chuyện"
                        onClick={() => setConfirmingSessionId(session._id)}
                        className="rounded-full border border-red-100 bg-white/85 p-2.5 text-red-500 shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 active:scale-95"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <ChevronRight className="h-5 w-5 text-text-main/25 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {confirmingSessionId === session._id ? (
                  <div className="relative mx-4 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50/90 px-4 py-3">
                    <p className="text-sm font-bold text-red-700">
                      Xóa cuộc trò chuyện này khỏi lịch sử?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmingSessionId(null)}
                        className="rounded-full bg-white px-4 py-2 text-sm font-bold text-text-main shadow-sm active:scale-95"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteSession(session._id)}
                        disabled={deletingSessionId === session._id}
                        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm active:scale-95 disabled:opacity-70"
                      >
                        {deletingSessionId === session._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : null}
                        Xóa hẳn
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
                <PetMascot className="w-full h-full drop-shadow-lg" status={petStatus} size={112} />
              </div>
              <div className="bg-white border border-border-main/50 absolute -top-8 left-1/2 -translate-x-1/2 px-5 py-2 rounded-[20px] rounded-br-sm whitespace-nowrap shadow-sm">
                <p className="text-text-main font-bold text-sm">Bé Thóc luôn lắng nghe bạn!</p>
              </div>
            </div>
            <p className="text-text-main/70 text-sm mt-4 text-center max-w-[260px]">
              Lịch sử trò chuyện của bạn sẽ xuất hiện tại đây sau câu hỏi đầu tiên.
            </p>
            <button
              onClick={() => navigate('/chat/active')}
              className="mt-6 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-md active:scale-95 hover:bg-primary-container transition-all"
            >
              Bắt đầu trò chuyện
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatList;
