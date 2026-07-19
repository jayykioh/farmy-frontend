import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Check,
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
    <div className="w-full h-full min-h-[100svh] bg-[#fbfbfd] text-left font-sans pb-[100px] overflow-x-hidden">
      {/* Custom Spotify-Style Header */}
      <header className="relative w-full h-[280px] md:h-[380px] overflow-hidden mb-0 flex-shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.65),_transparent_34%),radial-gradient(circle_at_85%_20%,_rgba(255,255,255,0.35),_transparent_22%),linear-gradient(135deg,_#dbf4d8_0%,_#e9f7d8_40%,_#f8f6d0_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_42%,rgba(251,251,253,0.98)_100%)]" />
        <div className="absolute -top-10 -left-10 h-36 w-36 rounded-full bg-[#34C759]/10 blur-3xl" />
        <div className="absolute top-10 right-0 h-44 w-44 rounded-full bg-[#F7C948]/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(251,251,253,0)_0%,rgba(251,251,253,0.7)_52%,rgba(251,251,253,1)_100%)]" />
        <div className="absolute inset-x-0 bottom-8 flex justify-center opacity-70">
          <div className="h-24 w-[28rem] max-w-[90vw] rounded-full bg-[#34C759]/10 blur-2xl" />
        </div>

        <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-4xl flex-col justify-end gap-4 px-4 sm:px-6 md:px-10 pb-8 md:pb-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex min-w-0 flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#1d1d1f] w-fit border border-white/60 backdrop-blur-md shadow-sm">
                <Leaf className="h-3 w-3 text-[#34C759]" />
                Sổ tay đồng áng
              </div>
              <h1 className="max-w-[min(100%,20rem)] text-[32px] md:max-w-none md:text-[52px] font-black leading-[1.05] tracking-[-0.03em] text-[#1d1d1f]">
                Lịch sử tư vấn
              </h1>
              <p className="max-w-[22rem] text-[14px] font-medium text-[#5f6368]">
                Xem lại các ghi chú canh tác cùng Bé Thóc.
              </p>
            </div>

            <div className="hidden sm:flex items-end gap-3 shrink-0">
              <div className="rounded-[28px] border border-white/70 bg-white/70 px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#34C759]">AI Pet</p>
                <p className="text-sm font-medium text-[#1d1d1f]">Bé Thóc đang chờ bạn hỏi</p>
              </div>
              <div className="h-28 w-28 md:h-36 md:w-36 shrink-0 rounded-full bg-white/65 border border-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.08)] backdrop-blur-md flex items-center justify-center">
                <PetMascot status={petStatus} size={144} className="drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-12 min-h-[50svh] flex flex-col relative z-20">
        <div className="mb-6 flex items-center justify-between gap-3 px-2 md:px-4">
          <h2 className="text-[20px] font-bold text-[#1d1d1f]">Gần đây</h2>
          <button 
            onClick={() => navigate('/chat/active')}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#34C759] px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(52,199,89,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(52,199,89,0.4)] active:scale-95 cursor-pointer max-[380px]:px-3 max-[380px]:py-2"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span className="hidden min-[381px]:inline">Chat mới</span>
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
                className="group relative flex flex-col rounded-[20px] transition-all duration-200 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-transparent hover:border-black/[0.04]"
              >
                <div className="flex items-center justify-between gap-4 p-4 md:px-5 md:py-4">
                  {editingSessionId === session._id ? (
                    <div className="min-w-0 flex-1 w-full">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] ml-1" htmlFor={`chat-title-${session._id}`}>
                        Đổi tên cuộc trò chuyện
                      </label>
                      <input
                        id={`chat-title-${session._id}`}
                        aria-label="Tên cuộc trò chuyện"
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        maxLength={60}
                        autoFocus
                        className="mt-1.5 w-full rounded-[16px] border border-black/[0.08] bg-white px-4 py-3 text-[15px] font-medium text-[#1d1d1f] outline-none transition focus:border-[#34C759] focus:ring-4 focus:ring-[#34C759]/10 shadow-sm"
                      />
                      <div className="mt-3 flex flex-wrap gap-2 ml-1">
                        <button
                          type="button"
                          onClick={() => void handleRenameSession(session._id)}
                          disabled={savingSessionId === session._id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#34C759] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_2px_8px_rgba(52,199,89,0.3)] active:scale-95 disabled:opacity-70 transition-all hover:shadow-[0_4px_12px_rgba(52,199,89,0.4)] cursor-pointer"
                        >
                          {savingSessionId === session._id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Lưu tên
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSessionId(null);
                            setDraftTitle('');
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-4 py-2 text-[13px] font-semibold text-[#1d1d1f] active:scale-95 transition-all hover:bg-[#e8e8ed] cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        onClick={() => navigate(`/chat/active/${session._id}`)}
                        className="min-w-0 flex-1 flex flex-col text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-white border border-black/[0.04] shadow-sm px-2 py-0.5 text-[11px] font-semibold text-[#1d1d1f]">
                            <MessageCircle className="h-3.5 w-3.5 text-[#34C759]" />
                            Bé Thóc
                          </span>
                          <span className="text-[13px] font-medium text-[#86868b]">
                            {formatRelativeDate(session.last_message_at ?? session.updated_at ?? session.created_at)}
                          </span>
                        </div>
                        <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-[#1d1d1f] truncate group-hover:text-[#34C759] transition-colors">
                          {session.title || 'Cuộc trò chuyện với Bé Thóc'}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-[14px] font-medium text-[#86868b] w-full">
                          Mở lại mạch tư vấn cũ, giữ nguyên bối cảnh nông trại.
                        </p>
                      </div>

                      {/* Actions show on hover */}
                      <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 bg-[#fbfbfd]/80 backdrop-blur-sm group-hover:bg-white/80 p-1 rounded-full">
                        <button
                          type="button"
                          aria-label="Đổi tên cuộc trò chuyện"
                          onClick={(e) => { e.stopPropagation(); startEditingSession(session); }}
                          className="p-2.5 rounded-full text-[#86868b] transition-all hover:bg-black/[0.04] hover:text-[#1d1d1f] active:scale-95 cursor-pointer"
                        >
                          <Pencil className="h-[18px] w-[18px]" />
                        </button>
                        <button
                          type="button"
                          aria-label="Xóa cuộc trò chuyện"
                          onClick={(e) => { e.stopPropagation(); setConfirmingSessionId(session._id); }}
                          className="p-2.5 rounded-full text-[#86868b] transition-all hover:bg-red-50 hover:text-[#FF3B30] active:scale-95 cursor-pointer"
                        >
                          <Trash2 className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                    </>
                  )}
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
          <div className="mt-12 flex flex-col items-center text-center px-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#1d1d1f] shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-black/[0.04] whitespace-nowrap">
                  Bé Thóc luôn lắng nghe bạn!
                </div>
                <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
                  <PetMascot className="w-full h-full drop-shadow-lg" status={petStatus} size={112} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-[18px] font-bold text-[#1d1d1f]">Chưa có cuộc trò chuyện nào</h3>
                <p className="text-text-main/70 text-sm text-center max-w-[280px] leading-6">
                  Lịch sử trò chuyện của bạn sẽ xuất hiện tại đây sau câu hỏi đầu tiên.
                </p>
              </div>
              <button
                onClick={() => navigate('/chat/active')}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#34C759] px-6 py-3 font-semibold text-white shadow-[0_4px_16px_rgba(52,199,89,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(52,199,89,0.4)] active:scale-95 cursor-pointer"
              >
                Bắt đầu trò chuyện
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatList;
