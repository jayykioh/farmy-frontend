import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PetMascot } from '../features/pet/components/PetMascot';
import { SnapCard } from '../components/SnapCard';
import { useReminders } from '../hooks/useReminders';
import { ReminderCard } from '../components/ReminderCard';
import { completeReminder } from '../api/reminders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isToday } from 'date-fns';
import { fetchSnapFeed } from '../api/snaps';
import { useQuery } from '@tanstack/react-query';
import { SnapFAB } from '../components/SnapFAB';
import { Flame, Drop, Scan, ChatCircleText, PencilSimpleLine, Plant, CaretRight } from '@phosphor-icons/react';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { Button } from '../components/ui/Button';
import { useGetPlotsQuery, useGetDiariesQuery } from '../store/api/farmApi';
import { CreateSeasonModal } from '../components/modals';

type SetupState = 'loading' | 'NO_PLOT' | 'NO_ACTIVE_DIARY' | 'READY';

interface StarBurst { id: number; x: number; y: number; }

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const nextStarburstId = useRef(0);
  const [starBursts, setStarBursts] = useState<StarBurst[]>([]);

  const { data: snapFeedData } = useQuery({ queryKey: ['snapFeed', { limit: 5 }], queryFn: () => fetchSnapFeed({ limit: 5 }) });
  const snaps = snapFeedData?.data || [];

  const { data: petStatusRaw } = usePetStatus();
  const { data: pendingReminders = [] } = useReminders({ status: 'pending' });
  const todayReminders = pendingReminders.filter(r => isToday(new Date(r.remind_at)) || new Date(r.remind_at) < new Date());

  const completeMutation = useMutation({
    mutationFn: completeReminder,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['reminders'] }); },
  });

  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;
  const streak = petStatus.streakCount;
  const bubbleMessage = petStatus.bubbleMessage;

  const [showCreateSeasonModal, setShowCreateSeasonModal] = useState(false);
  const [createSeasonMode, setCreateSeasonMode] = useState<'first-time' | 'add-season'>('first-time');
  const [setupState, setSetupState] = useState<SetupState>('loading');

  const { data: plots = [], isLoading: plotsLoading } = useGetPlotsQuery();
  const { data: diaries = [], isLoading: diariesLoading } = useGetDiariesQuery();

  useEffect(() => {
    if (plotsLoading || diariesLoading) { setSetupState('loading'); return; }
    if (plots.length === 0) { setSetupState('NO_PLOT'); }
    else if (diaries.length === 0) { setSetupState('NO_ACTIVE_DIARY'); }
    else { setSetupState('READY'); }
  }, [plots, diaries, plotsLoading, diariesLoading]);

  const openCreateSeason = (mode: 'first-time' | 'add-season') => { setCreateSeasonMode(mode); setShowCreateSeasonModal(true); };
  const handleSeasonCreated = () => { setShowCreateSeasonModal(false); queryClient.invalidateQueries({ queryKey: ['diaries'] }); };

  const triggerStarburst = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newBurst: StarBurst = { id: nextStarburstId.current++, x, y };
    setStarBursts(prev => [...prev, newBurst]);
    setTimeout(() => { setStarBursts(prev => prev.filter(b => b.id !== newBurst.id)); }, 420);
  };

  const moodReasonMap: Record<string, string> = {
    USER_LOGGED_DIARY_TODAY: 'Da ghi nhat ky hom nay',
    STREAK_MILESTONE: 'Dat cot moc chuoi ngay!',
    MISSED_MULTIPLE_DAYS: 'Da bo lo nhieu ngay...',
    MISSED_ONE_DAY: 'Hom qua quen ghi nhat ky',
    LATE_DAY_NO_DIARY: 'Hay ghi nhat ky hom nay nhe',
    NEEDS_DAILY_DIARY: 'Can ghi nhat ky moi ngay',
    DEFAULT_STATE: 'Gan len cap roi! Tiep tuc ghi nhat ky nhe.',
  };

  return (
    <div className="relative w-full flex flex-col gap-6 md:gap-8 px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto min-h-screen bg-[var(--color-paper)] font-sans text-[var(--color-ink)]">
      <CreateSeasonModal isOpen={showCreateSeasonModal} onClose={() => setShowCreateSeasonModal(false)} onSuccess={handleSeasonCreated} mode={createSeasonMode} />

      {setupState === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-[70svh] gap-6 animate-pulse">
          <div className="w-40 h-40 bg-[var(--color-paper-3)] rounded-full mb-4"></div>
          <div className="w-48 h-6 bg-[var(--color-paper-3)] rounded-full mb-2"></div>
          <div className="w-64 h-4 bg-[var(--color-paper-3)] rounded-full"></div>
        </div>
      )}

      {setupState === 'NO_PLOT' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 25 }} className="flex flex-col items-center justify-center min-h-[70svh] text-center gap-6">
          <PetMascot status={{ ...petStatus, bubbleMessage: 'Chao mung ban! 🌱' }} size={180} className="relative drop-shadow-xl" />
          <div className="flex flex-col gap-2 max-w-xs">
            <h1 className="text-2xl font-extrabold text-[var(--color-ink)] tracking-tight">Chao mung den FARMY!</h1>
            <p className="text-sm text-[var(--color-ink-2)] font-medium leading-relaxed">Hay tao manh vuon dau tien va bat dau vu mua de Be Thoc co the theo doi cay trong cung ban.</p>
          </div>
          <button onClick={() => openCreateSeason('first-time')} className="btn btn--cyan py-4 px-8 text-[15px] cursor-pointer active:scale-95">
            <Plant size={22} weight="duotone" />
            Bat dau vu mua dau tien
          </button>
        </motion.div>
      )}

      {setupState === 'NO_ACTIVE_DIARY' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 25 }} className="flex flex-col items-center justify-center min-h-[70svh] text-center gap-6">
          <PetMascot status={{ ...petStatus, bubbleMessage: 'Vuon cho canh tac! 🌿' }} size={180} className="relative drop-shadow-xl" />
          <div className="flex flex-col gap-2 max-w-xs">
            <h1 className="text-2xl font-extrabold text-[var(--color-ink)] tracking-tight">Chua co vu mua nao</h1>
            <p className="text-sm text-[var(--color-ink-2)] font-medium leading-relaxed">Ban da co manh vuon roi. Hay tao mot vu mua moi de bat dau ghi nhat ky!</p>
          </div>
          <p className="text-xs font-mono font-bold text-[var(--color-ink-2)] mt-1">{moodReasonMap[petStatus.moodReason] || '...'}</p>
          <button onClick={() => openCreateSeason('add-season')} className="btn btn--cyan py-4 px-8 text-[15px] cursor-pointer active:scale-95">
            <Plant size={22} weight="duotone" />
            Tao vu mua moi
          </button>
        </motion.div>
      )}

      {setupState === 'READY' && (
        <>
          <section className="flex flex-col items-center md:items-start text-center md:text-left mt-2 md:mt-0">
            <div className="inline-flex items-center gap-2 bg-white border border-[var(--color-border-main)] shadow-xs rounded-full px-4 py-1.5 mb-4">
              <Flame size={18} weight="duotone" className="text-[var(--color-accent-3)]" />
              <span className="font-mono text-xs font-bold text-[var(--color-ink)]">{streak} ngày liên tiếp</span>
            </div>
            <h2 className="text-[32px] md:text-[44px] font-extrabold text-[var(--color-ink)] tracking-tight leading-tight">
              Chào buổi sáng,<br /> <span className="hl">{(user as any)?.displayName || user?.email?.split('@')[0] || 'Nông Dân'}</span>!
            </h2>
            <p className="text-[var(--color-ink-2)] mt-2 font-medium text-[16px]">Bạn đã sẵn sàng để chăm sóc nông trại hôm nay chưa?</p>
          </section>

          <section className="flex flex-col items-center justify-center w-full mt-4 md:mt-2 mb-8 md:mb-6">
            <div className="relative w-full aspect-square max-h-[300px] md:max-h-[360px] max-w-[280px] md:max-w-[400px]">
              <div onClick={(e) => triggerStarburst(e)} className="w-full h-full rounded-[36px] bg-white border border-[var(--color-border-main)] shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-center p-4 md:p-8 cursor-pointer relative">
                <PetMascot status={petStatus} size={220} className="w-full h-full drop-shadow-xl" />
                {starBursts.map(burst => (<span key={burst.id} className="star-burst" style={{ left: burst.x, top: burst.y }} />))}
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.8, x: -20, y: 10 }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }} className="absolute -top-6 -right-6 md:top-4 md:-right-12 bg-white border border-[var(--color-border-main)] rounded-[24px] rounded-bl-sm px-5 py-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.06)] animate-[bounce_4s_ease-in-out_infinite] max-w-[220px] md:max-w-[260px] z-10 text-left">
                <p className="font-bold text-[var(--color-ink)] text-[13.5px] leading-snug tracking-tight">{bubbleMessage}</p>
              </motion.div>
            </div>
          </section>

          <section className="w-full md:hidden">
            <button onClick={(e) => { triggerStarburst(e); setTimeout(() => navigate('/diary/create'), 350); }} className="btn btn--cyan w-full py-4 text-base relative cursor-pointer active:scale-95">
              <PencilSimpleLine size={20} weight="bold" />
              <span>Ghi nhat ky</span>
              <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-[8px] text-[10px] font-bold border border-white/10">+30XP</span>
              {starBursts.map(burst => (<span key={burst.id} className="star-burst" style={{ left: burst.x, top: burst.y }} />))}
            </button>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 w-full text-left">
            <section className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[15px] font-bold text-[var(--color-ink)] flex items-center gap-2">
                  🔔 Nhắc nhở hôm nay
                  {todayReminders.length > 0 && (<span className="bg-[var(--color-accent-3)] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center font-mono">{todayReminders.length}</span>)}
                </h3>
                <button onClick={() => navigate('/reminders')} className="text-[var(--color-accent-2)] font-bold text-[12px] hover:underline cursor-pointer">Xem tất cả &rsaquo;</button>
              </div>
              {todayReminders.length === 0 ? (
                <div className="card-bubble bg-white rounded-[24px] px-4 py-5 flex flex-col items-center justify-center gap-1.5 flex-1 min-h-[220px]">
                  <span className="text-2xl">🌱</span>
                  <p className="text-[14px] text-[var(--color-ink-2)] font-medium">Hom nay khong co lich hen</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {todayReminders.slice(0, 3).map(r => (<ReminderCard key={r._id} reminder={r} onDone={() => completeMutation.mutate(r._id)} />))}
                </div>
              )}
            </section>

            <section className="flex flex-col gap-3">
              <div className="px-1"><h3 className="text-[15px] font-bold text-[var(--color-ink)]">Thao tac nhanh</h3></div>
              <div className="flex flex-col gap-3">
                <div onClick={() => navigate('/reminders')} className="card-bubble card-bubble--cyan bg-white p-4 cursor-pointer flex items-center gap-4 text-left select-none">
                  <div className="w-12 h-12 rounded-[16px] bg-[var(--color-accent-2)]/10 flex items-center justify-center shrink-0"><Drop size={24} weight="duotone" className="text-[var(--color-accent-2)]" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[16px] font-bold text-[var(--color-ink)] tracking-tight">Tưới nước</p><p className="text-[13px] text-[var(--color-ink-2)] font-medium mt-0.5">Đặt lịch tưới hôm nay</p></div>
                  <div className="w-8 h-8 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-main)] flex items-center justify-center"><CaretRight size={16} weight="bold" className="text-[var(--color-ink-2)]" /></div>
                </div>
                <div onClick={() => navigate('/scan')} className="card-bubble card-bubble--pear bg-white p-4 cursor-pointer flex items-center gap-4 text-left select-none">
                  <div className="w-12 h-12 rounded-[16px] bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0"><Scan size={24} weight="duotone" className="text-[var(--color-ink)]" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[16px] font-bold text-[var(--color-ink)] tracking-tight">Quét cây</p><p className="text-[13px] text-[var(--color-ink-2)] font-medium mt-0.5">Chẩn đoán sâu bệnh AI</p></div>
                  <div className="w-8 h-8 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-main)] flex items-center justify-center"><CaretRight size={16} weight="bold" className="text-[var(--color-ink-2)]" /></div>
                </div>
                <div onClick={() => navigate('/chat')} className="card-bubble card-bubble--pear bg-white p-4 cursor-pointer flex items-center gap-4 text-left select-none">
                  <div className="w-12 h-12 rounded-[16px] bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0"><ChatCircleText size={24} weight="duotone" className="text-[var(--color-ink)]" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[16px] font-bold text-[var(--color-ink)] tracking-tight">Trợ lý Bé Thóc</p><p className="text-[13px] text-[var(--color-ink-2)] font-medium mt-0.5">Hỏi đáp nông nghiệp 24/7</p></div>
                  <div className="w-8 h-8 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-main)] flex items-center justify-center"><CaretRight size={16} weight="bold" className="text-[var(--color-ink-2)]" /></div>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      <SnapFAB />

      <section className="w-full mt-4 md:mt-8 text-left">
        <div className="flex justify-between items-end mb-5 px-1">
          <h3 className="text-[20px] font-bold text-[var(--color-ink)] tracking-tight flex items-center gap-2">
            Farm Feed gần đây
            <Plant size={22} weight="duotone" className="text-[#008A5E]" />
          </h3>
          <button onClick={() => navigate('/farm-feed')} className="text-[var(--color-ink-2)] hover:text-[var(--color-ink)] font-bold text-[13px] flex items-center gap-0.5 cursor-pointer">
            Xem tất cả
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-1">
          {snaps.length > 0 ? (
            snaps.map(snap => (<SnapCard key={snap.id} snap={snap} mini={true} onClick={() => navigate(`/snap/${snap.id}`)} />))
          ) : (
            <div className="text-[var(--color-ink-2)] text-sm italic py-4">Chưa có ảnh nào. Hãy là người đầu tiên chụp!</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;