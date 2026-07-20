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
    <div className="w-full h-full min-h-[100svh] bg-[#fbfbfd] text-left font-sans pb-[100px] overflow-x-hidden relative">
      {/* Subtle background glow to reduce emptiness */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#34C759]/[0.03] to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#007AFF]/[0.02] blur-[120px] rounded-full pointer-events-none" />
      
      {/* Apple-Style Clean Header */}
      <header className="relative w-full pt-16 md:pt-24 pb-8 md:pb-12 px-6 md:px-10 flex flex-col items-center md:items-start max-w-4xl mx-auto z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full gap-6 md:gap-0">
          <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#86868b] w-fit">
              <Leaf className="h-3.5 w-3.5 text-[#34C759]" />
              Sổ tay đồng áng
            </div>
            <h1 className="text-[36px] md:text-[44px] font-bold tracking-tight text-[#1d1d1f] leading-tight">
              Lịch sử tư vấn
            </h1>
            <p className="text-[15px] font-medium text-[#86868b]">
              Xem lại các ghi chú canh tác cùng Bé Thóc.
            </p>
          </div>
          
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[28px] p-2 flex items-center justify-center">
             <PetMascot status={petStatus} size={110} className="drop-shadow-xl" />
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-12 min-h-[50svh] flex flex-col relative z-20">
        
        {/* Quick Suggestions / Layout Enhancement */}
        <section className="mb-10 px-2 md:px-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-[#86868b] mb-4">Gợi ý cho bạn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <button 
              onClick={() => navigate('/chat/active')} 
              className="group flex flex-col text-left p-4 rounded-[24px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#E8F8F5] flex items-center justify-center mb-3 group-hover:bg-[#34C759] transition-colors duration-300">
                <Leaf className="w-5 h-5 text-[#248A3D] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1d1d1f] mb-1">Cách ủ phân hữu cơ</h3>
              <p className="text-[13px] text-[#86868b] line-clamp-2">Hướng dẫn chi tiết cách tận dụng phế phẩm nông nghiệp.</p>
            </button>
            <button 
              onClick={() => navigate('/chat/active')} 
              className="group flex flex-col text-left p-4 rounded-[24px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#FFF3E0] flex items-center justify-center mb-3 group-hover:bg-[#FF9500] transition-colors duration-300">
                <AlertCircle className="w-5 h-5 text-[#E67300] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1d1d1f] mb-1">Bệnh vàng lá thối rễ</h3>
              <p className="text-[13px] text-[#86868b] line-clamp-2">Dấu hiệu nhận biết sớm và biện pháp xử lý kịp thời.</p>
            </button>
            <button 
              onClick={() => navigate('/chat/active')} 
              className="group hidden sm:flex flex-col text-left p-4 rounded-[24px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#E5F1FF] flex items-center justify-center mb-3 group-hover:bg-[#007AFF] transition-colors duration-300">
                <MessageCircle className="w-5 h-5 text-[#0066CC] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-[16px] font-bold text-[#1d1d1f] mb-1">Tối ưu lịch tưới</h3>
              <p className="text-[13px] text-[#86868b] line-clamp-2">Lên lịch tưới phù hợp với từng giai đoạn sinh trưởng.</p>
            </button>
          </div>
        </section>

        <div className="flex justify-between items-center mb-6 px-2 md:px-4">
          <h2 className="text-[20px] font-bold text-[#1d1d1f]">Gần đây</h2>
          <button 
            onClick={() => navigate('/chat/active')}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#34C759] text-white rounded-full font-semibold shadow-[0_4px_16px_rgba(52,199,89,0.3)] active:scale-95 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(52,199,89,0.4)] cursor-pointer"
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
          <div className="flex flex-col gap-3">
            {sessions.map(session => (
              <article
                key={session._id}
                className="group relative flex flex-col rounded-[24px] bg-white/60 backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 border border-white/50 hover:border-white"
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
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-black/[0.04] shadow-sm px-2.5 py-1 text-[11px] font-bold text-[#1d1d1f]">
                            <MessageCircle className="h-3.5 w-3.5 text-[#34C759]" />
                            Bé Thóc
                          </span>
                          <span className="text-[13px] font-medium text-[#86868b]">
                            {formatRelativeDate(session.last_message_at ?? session.updated_at ?? session.created_at)}
                          </span>
                        </div>
                        <h3 className="text-[17px] font-bold leading-snug tracking-tight text-[#1d1d1f] truncate transition-colors">
                          {session.title || 'Cuộc trò chuyện với Bé Thóc'}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-[14px] font-medium text-[#86868b] w-full">
                          Mở lại mạch tư vấn cũ, giữ nguyên bối cảnh nông trại.
                        </p>
                      </div>

                      {/* Actions show on hover */}
                      <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 bg-white/50 backdrop-blur-md group-hover:bg-white shadow-sm border border-black/[0.03] p-1.5 rounded-full">
                        <button
                          type="button"
                          aria-label="Đổi tên cuộc trò chuyện"
                          onClick={(e) => { e.stopPropagation(); startEditingSession(session); }}
                          className="p-2 rounded-full text-[#86868b] transition-all hover:bg-black/[0.04] hover:text-[#1d1d1f] active:scale-95 cursor-pointer"
                        >
                          <Pencil className="h-[18px] w-[18px]" />
                        </button>
                        <button
                          type="button"
                          aria-label="Xóa cuộc trò chuyện"
                          onClick={(e) => { e.stopPropagation(); setConfirmingSessionId(session._id); }}
                          className="p-2 rounded-full text-[#86868b] transition-all hover:bg-red-50 hover:text-[#FF3B30] active:scale-95 cursor-pointer"
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
              className="mt-6 px-6 py-3 bg-[#34C759] text-white rounded-full font-semibold shadow-[0_4px_16px_rgba(52,199,89,0.3)] active:scale-95 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(52,199,89,0.4)] transition-all cursor-pointer"
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
