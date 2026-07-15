import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { PetMascot } from '../features/pet/components/PetMascot';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { PageHeader } from '../components/PageHeader';
import { fetchChatSessions, type ChatSession } from '../api/chat';

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

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-surface-1 text-left font-sans pb-[100px] relative overflow-hidden">
      <PageHeader title="Tri Kỷ AI" leftButton="none" />

      <main className="w-full max-w-3xl mx-auto px-4 md:px-8 pt-24 pb-12 relative min-h-[100svh] flex flex-col">
        <div className="flex justify-end mb-6">
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
              <button
                key={session._id}
                type="button"
                onClick={() => navigate(`/chat/active/${session._id}`)}
                className="w-full text-left bg-white border border-border-main/50 p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <span className="px-2 py-1 bg-primary-lightest/30 border border-primary-lightest/50 text-primary-container text-[11px] font-extrabold rounded-lg uppercase tracking-wider">
                    AI
                  </span>
                  <span className="text-text-main/50 text-[12px] font-bold whitespace-nowrap">
                    {formatRelativeDate(session.last_message_at ?? session.updated_at ?? session.created_at)}
                  </span>
                </div>
                <div className="mt-1">
                  <p className="text-text-main font-extrabold text-lg line-clamp-1">
                    {session.title || 'Cuộc trò chuyện với Bé Thóc'}
                  </p>
                  <p className="text-text-main/80 text-sm line-clamp-2 mt-1">
                    Mở lại cuộc trò chuyện để tiếp tục nhận tư vấn theo ngữ cảnh cũ.
                  </p>
                </div>
              </button>
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
