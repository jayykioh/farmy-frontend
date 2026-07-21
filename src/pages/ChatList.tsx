/* Hallmark · page: chat-list · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  WarningCircle,
  Check,
  NotePencil,
  Leaf,
  CircleNotch,
  ChatCircleText,
  Plus,
  Trash,
  X,
} from '@phosphor-icons/react';
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
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main pb-24 text-left font-sans relative">
      
      {/* Apple-Style Clean Header */}
      <header className="relative w-full pt-16 md:pt-24 pb-8 md:pb-12 px-6 md:px-10 flex flex-col items-center md:items-start max-w-4xl mx-auto z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full gap-6 md:gap-0">
          <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-border-main shadow-sm px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#008A5E] w-fit">
              <Leaf className="h-3.5 w-3.5 text-[#008A5E]" weight="duotone" />
              Sổ tay đồng áng
            </div>
            <h1 className="text-[36px] md:text-[44px] font-black tracking-tight text-text-h leading-tight">
              Lịch sử tư vấn
            </h1>
            <p className="text-[15px] font-bold text-text-secondary">
              Xem lại các ghi chú canh tác cùng Bé Thóc.
            </p>
          </div>
          
          <div className="w-24 h-24 md:w-32 md:h-32 card-bubble bg-white flex items-center justify-center p-2 shadow-sm shrink-0">
             <PetMascot status={petStatus} size={110} className="drop-shadow-xl" />
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-12 min-h-[50svh] flex flex-col relative z-20">
        
        {/* Quick Suggestions / Layout Enhancement */}
        <section className="mb-10 px-2 md:px-4">
          <h2 className="text-[13px] font-black uppercase tracking-widest text-text-secondary mb-4">Gợi ý cho bạn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            <button 
              onClick={() => navigate('/chat/active')} 
              className="card-bubble card-bubble--pear group flex flex-col text-left p-5 cursor-pointer select-none active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#E8F8F5] border border-border-main/50 flex items-center justify-center mb-3 transition-colors duration-300">
                <Leaf className="w-5 h-5 text-[#248A3D] transition-colors duration-300" weight="duotone" />
              </div>
              <h3 className="text-[16px] font-extrabold text-text-h mb-1">Cách ủ phân hữu cơ</h3>
              <p className="text-[13px] text-text-secondary line-clamp-2 font-medium">Hướng dẫn chi tiết cách tận dụng phế phẩm nông nghiệp.</p>
            </button>
            <button 
              onClick={() => navigate('/chat/active')} 
              className="card-bubble card-bubble--coral group flex flex-col text-left p-5 cursor-pointer select-none active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#FFF3E0] border border-border-main/50 flex items-center justify-center mb-3 transition-colors duration-300">
                <WarningCircle className="w-5 h-5 text-[#E67300] transition-colors duration-300" weight="duotone" />
              </div>
              <h3 className="text-[16px] font-extrabold text-text-h mb-1">Bệnh vàng lá thối rễ</h3>
              <p className="text-[13px] text-text-secondary line-clamp-2 font-medium">Dấu hiệu nhận biết sớm và biện pháp xử lý kịp thời.</p>
            </button>
            <button 
              onClick={() => navigate('/chat/active')} 
              className="card-bubble card-bubble--cyan group hidden sm:flex flex-col text-left p-5 cursor-pointer select-none active:scale-95 transition-all"
            >
              <div className="w-10 h-10 rounded-[14px] bg-[#E5F1FF] border border-border-main/50 flex items-center justify-center mb-3 transition-colors duration-300">
                <ChatCircleText className="w-5 h-5 text-[#0066CC] transition-colors duration-300" weight="duotone" />
              </div>
              <h3 className="text-[16px] font-extrabold text-text-h mb-1">Tối ưu lịch tưới</h3>
              <p className="text-[13px] text-text-secondary line-clamp-2 font-medium">Lên lịch tưới phù hợp với từng giai đoạn sinh trưởng.</p>
            </button>
          </div>
        </section>

        <div className="flex justify-between items-center mb-6 px-2 md:px-4">
          <h2 className="text-[20px] font-black text-text-h">Gần đây</h2>
          <button 
            onClick={() => navigate('/chat/active')}
            className="btn btn--cyan flex items-center gap-1.5 px-5 py-2.5 font-bold cursor-pointer active:scale-95"
          >
            <Plus className="w-5 h-5 text-white" weight="bold" />
            Chat mới
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-text-secondary font-bold">
            <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
            Đang tải lịch sử...
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-5 flex items-start gap-3 font-bold">
            <WarningCircle className="w-5 h-5 shrink-0 mt-0.5" weight="duotone" />
            {errorMessage}
          </div>
        ) : sessions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {sessions.map(session => (
              <article
                key={session._id}
                className="card-bubble bg-white/70 hover:bg-white text-left cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center justify-between gap-4 p-4 md:px-5 md:py-4">
                  {editingSessionId === session._id ? (
                    <div className="min-w-0 flex-1 w-full">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary ml-1" htmlFor={`chat-title-${session._id}`}>
                        Đổi tên cuộc trò chuyện
                      </label>
                      <input
                        id={`chat-title-${session._id}`}
                        aria-label="Tên cuộc trò chuyện"
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        maxLength={60}
                        autoFocus
                        className="mt-1.5 w-full rounded-[16px] border-2 border-border-main bg-white px-4 py-3 text-[15px] font-bold text-text-main outline-none transition focus:border-primary focus:ring-4 focus:ring-primary-light/20 shadow-sm"
                      />
                      <div className="mt-3 flex flex-wrap gap-2 ml-1">
                        <button
                          type="button"
                          onClick={() => void handleRenameSession(session._id)}
                          disabled={savingSessionId === session._id}
                          className="btn btn--cyan px-4 py-2 text-xs font-extrabold cursor-pointer flex items-center gap-1.5 active:scale-95"
                        >
                          {savingSessionId === session._id ? (
                            <CircleNotch className="h-3.5 w-3.5 animate-spin" weight="bold" />
                          ) : (
                            <Check className="h-3.5 w-3.5" weight="bold" />
                          )}
                          Lưu tên
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSessionId(null);
                            setDraftTitle('');
                          }}
                          className="btn btn--soft px-4 py-2 text-xs font-bold cursor-pointer flex items-center gap-1.5 active:scale-95"
                        >
                          <X className="h-3.5 w-3.5" weight="bold" />
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
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-bg-surface-2 border border-border-main/50 px-2.5 py-1 text-[11px] font-bold text-text-main">
                            <ChatCircleText className="h-3.5 w-3.5 text-[#008A5E]" weight="duotone" />
                            Bé Thóc
                          </span>
                          <span className="text-[13px] font-bold text-text-secondary font-mono">
                            {formatRelativeDate(session.last_message_at ?? session.updated_at ?? session.created_at)}
                          </span>
                        </div>
                        <h3 className="text-[18px] font-extrabold leading-snug tracking-tight text-text-h truncate">
                          {session.title || 'Cuộc trò chuyện với Bé Thóc'}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-[14px] font-medium text-text-secondary w-full">
                          Mở lại mạch tư vấn cũ, giữ nguyên bối cảnh nông trại.
                        </p>
                      </div>

                      {/* Actions show on hover */}
                      <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 bg-white/50 backdrop-blur-md group-hover:bg-white shadow-sm border border-border-main/50 p-1.5 rounded-full">
                        <button
                          type="button"
                          aria-label="Đổi tên cuộc trò chuyện"
                          onClick={(e) => { e.stopPropagation(); startEditingSession(session); }}
                          className="p-2 rounded-full text-text-secondary transition-all hover:bg-bg-surface-2 hover:text-text-main active:scale-95 cursor-pointer"
                        >
                          <NotePencil className="h-[18px] w-[18px]" weight="bold" />
                        </button>
                        <button
                          type="button"
                          aria-label="Xóa cuộc trò chuyện"
                          onClick={(e) => { e.stopPropagation(); setConfirmingSessionId(session._id); }}
                          className="p-2 rounded-full text-text-secondary transition-all hover:bg-red-50 hover:text-[#FF3B30] active:scale-95 cursor-pointer"
                        >
                          <Trash className="h-[18px] w-[18px]" weight="bold" />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {confirmingSessionId === session._id ? (
                  <div className="relative mx-4 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-red-200 bg-red-50/90 px-4 py-3">
                    <p className="text-sm font-bold text-red-700">
                      Xóa cuộc trò chuyện này khỏi lịch sử?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmingSessionId(null)}
                        className="btn btn--soft px-4 py-2 text-xs font-bold cursor-pointer active:scale-95"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteSession(session._id)}
                        disabled={deletingSessionId === session._id}
                        className="btn btn--coral px-4 py-2 text-xs font-extrabold cursor-pointer active:scale-95"
                      >
                        {deletingSessionId === session._id && (
                          <CircleNotch className="h-4 w-4 animate-spin mr-1" weight="bold" />
                        )}
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
                <PetMascot className="w-full h-full drop-shadow-lg animate-bounce" status={petStatus} size={112} />
              </div>
              <div className="card-bubble bg-white absolute -top-8 left-1/2 -translate-x-1/2 px-5 py-2 rounded-[20px] rounded-br-sm whitespace-nowrap shadow-sm">
                <p className="text-text-h font-black text-sm">Bé Thóc luôn lắng nghe bạn!</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm mt-4 text-center max-w-[260px] font-bold">
              Lịch sử trò chuyện của bạn sẽ xuất hiện tại đây sau câu hỏi đầu tiên.
            </p>
            <button
              onClick={() => navigate('/chat/active')}
              className="btn btn--cyan mt-6 px-6 py-3.5 font-extrabold active:scale-95"
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
