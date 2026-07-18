/* eslint-disable */
import React, { useState, useEffect } from 'react';
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
import { Flame, Droplets, ScanLine, MessageSquare, PenLine, Sprout, ChevronRight } from 'lucide-react';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { Button } from '../components/ui/Button';
import { useGetPlotsQuery, useGetDiariesQuery } from '../store/api/farmApi';
import { CreateSeasonModal } from '../components/modals';

// ─── Dashboard Setup States ─────────────────────────────────────
type SetupState = 'loading' | 'NO_PLOT' | 'NO_ACTIVE_DIARY' | 'READY';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: snapFeedData } = useQuery({
    queryKey: ['snapFeed', { limit: 5 }],
    queryFn: () => fetchSnapFeed({ limit: 5 }),
  });
  const snaps = snapFeedData?.data || [];

  // Fetch authoritative pet status from backend
  const { data: petStatusRaw } = usePetStatus();

  const queryClient = useQueryClient();
  const { data: pendingReminders = [] } = useReminders({ status: 'pending' });
  const todayReminders = pendingReminders.filter(
    r => isToday(new Date(r.remind_at)) || new Date(r.remind_at) < new Date()
  );

  const completeMutation = useMutation({
    mutationFn: completeReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;
  const streak = petStatus.streakCount;
  const bubbleMessage = petStatus.bubbleMessage;

  const [showCreateSeasonModal, setShowCreateSeasonModal] = useState(false);
  const [createSeasonMode, setCreateSeasonMode] = useState<'first-time' | 'add-season'>('first-time');
  const [setupState, setSetupState] = useState<SetupState>('loading');

  const { data: plots = [] } = useGetPlotsQuery();
  const { data: diaries = [] } = useGetDiariesQuery();

  useEffect(() => {
    if (plots.length === 0) {
      setSetupState('NO_PLOT');
    } else if (diaries.length === 0) {
      setSetupState('NO_ACTIVE_DIARY');
    } else {
      setSetupState('READY');
    }
  }, [plots, diaries]);

  const openCreateSeason = (mode: 'first-time' | 'add-season') => {
    setCreateSeasonMode(mode);
    setShowCreateSeasonModal(true);
  };

  const handleSeasonCreated = () => {
    setShowCreateSeasonModal(false);
    queryClient.invalidateQueries({ queryKey: ['diaries'] });
  };

  const moodReasonMap: Record<string, string> = {
    USER_LOGGED_DIARY_TODAY: '✅ Đã ghi nhật ký hôm nay',
    STREAK_MILESTONE: '🎉 Đạt cột mốc chuỗi ngày!',
    MISSED_MULTIPLE_DAYS: '💔 Đã bỏ lỡ nhiều ngày...',
    MISSED_ONE_DAY: '⚠️ Hôm qua quên ghi nhật ký',
    LATE_DAY_NO_DIARY: '📝 Hãy ghi nhật ký hôm nay nhé',
    NEEDS_DAILY_DIARY: '🌱 Cần ghi nhật ký mỗi ngày',
    DEFAULT_STATE: '✨ Gần lên cấp rồi! Tiếp tục ghi nhật ký nhé.',
  };

  return (
    <div className="relative w-full flex flex-col gap-6 md:gap-8 px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[760px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

      {/* ── Create Season Modal */}
      <CreateSeasonModal
        isOpen={showCreateSeasonModal}
        onClose={() => setShowCreateSeasonModal(false)}
        onSuccess={handleSeasonCreated}
        mode={createSeasonMode}
      />

      {/* ══ EMPTY STATE: NO PLOT ══════════════════════════════════ */}
      {setupState === 'NO_PLOT' && (
        <div className="flex flex-col items-center justify-center min-h-[70svh] text-center gap-6 animate-in fade-in duration-300">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-150 pointer-events-none" />
            <PetMascot status={{ ...petStatus, bubbleMessage: 'Chào mừng bạn! 🌱' }} size={180} className="relative drop-shadow-xl" />
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <h1 className="text-2xl font-black text-text-h tracking-tight">Chào mừng đến FarmDiaries!</h1>
            <p className="text-base text-text-main/60 font-medium leading-relaxed">
              Hãy tạo mảnh vườn đầu tiên và bắt đầu vụ mùa để Bé Thóc có thể theo dõi cây trồng cùng bạn.
            </p>
          </div>
          <button
            onClick={() => openCreateSeason('first-time')}
            className="flex items-center gap-2 bg-primary-container text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-[0_16px_34px_rgba(0,109,53,0.24)] hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(8,168,85,0.28)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Sprout className="w-5 h-5" />
            Bắt đầu vụ mùa đầu tiên
          </button>
        </div>
      )}

      {/* ══ EMPTY STATE: HAS PLOT, NO ACTIVE DIARY ══════════════ */}
      {setupState === 'NO_ACTIVE_DIARY' && (
        <div className="flex flex-col items-center justify-center min-h-[70svh] text-center gap-6 animate-in fade-in duration-300">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-secondary/10 blur-3xl scale-150 pointer-events-none" />
            <PetMascot status={{ ...petStatus, bubbleMessage: 'Vườn chờ canh tác! 🌿' }} size={180} className="relative drop-shadow-xl" />
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <h1 className="text-2xl font-black text-text-h tracking-tight">Chưa có vụ mùa nào</h1>
            <p className="text-base text-text-main/60 font-medium leading-relaxed">
              Bạn đã có mảnh vườn rồi. Hãy tạo một vụ mùa mới để bắt đầu ghi nhật ký!
            </p>
          </div>
          <p className="text-sm font-medium text-text-main/50 mt-1">
            {moodReasonMap[petStatus.moodReason] || petStatus.moodReason || '✨ Gần lên cấp rồi! Tiếp tục ghi nhật ký nhé.'}
          </p>
          <button
            onClick={() => openCreateSeason('add-season')}
            className="flex items-center gap-2 bg-primary-container text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-[0_16px_34px_rgba(0,109,53,0.24)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Sprout className="w-5 h-5" />
            Tạo vụ mùa mới
          </button>
        </div>
      )}

      {/* ══ READY STATE: Full Dashboard ══════════════════════════ */}
      {setupState === 'READY' && (
        <>
          {/* Header & Streak */}
          <section className="flex flex-col items-center md:items-start text-center md:text-left mt-2 md:mt-0">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md ring-1 ring-slate-200/50 shadow-[0_2px_8px_rgb(0,0,0,0.04)] rounded-full px-4 py-1.5 mb-4 transition-all hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)] hover:ring-slate-200">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="font-bold text-slate-700 text-sm">{streak}-day streak</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight">
              Good morning,<br className="hidden md:block lg:hidden" /> {(user as any)?.displayName || user?.email?.split('@')[0] || 'Nông Dân'}!
            </h2>
            <p className="text-slate-500 mt-3 font-medium text-base md:text-lg">Bạn đã sẵn sàng để chăm sóc nông trại hôm nay chưa?</p>
          </section>

          {/* Mascot Emotional Anchor */}
          <section className="flex justify-center relative w-full aspect-square max-h-[320px] md:aspect-auto md:max-h-none md:h-80 lg:h-96 mt-2 mb-6 md:mb-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[40px] scale-90 blur-2xl opacity-70 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="relative w-full h-full max-w-[280px] md:max-w-[400px] rounded-[32px] md:rounded-[40px] overflow-visible md:overflow-hidden bg-white/40 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.04)] flex items-center justify-center p-4 md:p-8">
              <PetMascot status={petStatus} size={220} className="w-full h-full drop-shadow-xl transition-transform hover:scale-105 duration-500" />
            </div>
            <div className="absolute -top-4 md:top-8 right-0 md:right-8 bg-white/95 backdrop-blur-md ring-1 ring-slate-100/80 rounded-[24px] rounded-bl-sm px-5 py-3.5 shadow-[0_8px_24px_rgb(0,0,0,0.08)] animate-[bounce_4s_ease-in-out_infinite] max-w-[220px] md:max-w-xs z-10">
              <p className="font-semibold text-slate-700 text-sm md:text-base leading-snug">{bubbleMessage}</p>
            </div>
          </section>

          {/* Main CTA Button (Mobile only) */}
          <section className="w-full md:hidden">
            <Button onClick={() => navigate('/diary/create')} size="lg" fullWidth>
              <PenLine className="w-5 h-5" />
              <span className="tracking-wide">Ghi nhật ký</span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-semibold border border-white/10">+30XP</span>
            </Button>
          </section>

          {/* Reminders Today Widget */}
          <section className="w-full mt-2">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-[17px] font-bold text-slate-800 flex items-center gap-2">
                🔔 Nhắc nhở hôm nay
                {todayReminders.length > 0 && (
                  <span className="bg-red-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center -ml-0.5">
                    {todayReminders.length}
                  </span>
                )}
              </h3>
              <button onClick={() => navigate('/reminders')} className="text-primary font-bold text-[13px]">
                Xem tất cả ›
              </button>
            </div>

            {todayReminders.length === 0 ? (
              <div className="bg-white rounded-2xl p-4 border border-border-main/50 text-center flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">🌱</span>
                <p className="text-sm text-text-main/60 font-medium">Hôm nay bạn không có lịch hẹn nào</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {todayReminders.slice(0, 3).map(r => (
                  <ReminderCard
                    key={r._id}
                    reminder={r}
                    onDone={() => completeMutation.mutate(r._id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions Grid */}
          <section className="flex flex-col gap-3 mt-2 md:mt-0">
            <h3 className="hidden md:block text-base font-bold text-slate-800 mb-1 px-1">Thao tác nhanh</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
              <Button
                onClick={() => navigate('/reminders')}
                variant="outline"
                className="justify-start gap-3 h-auto py-3 md:py-4 px-4 md:px-5 w-full bg-white text-slate-700 hover:text-slate-900"
              >
                <Droplets className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <span className="font-medium">Kiểm tra tưới nước</span>
              </Button>

              <Button
                onClick={() => navigate('/scan')}
                variant="outline"
                className="justify-start gap-3 h-auto py-3 md:py-4 px-4 md:px-5 w-full bg-white text-slate-700 hover:text-slate-900"
              >
                <ScanLine className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <span className="font-medium">Quét sức khoẻ cây</span>
              </Button>

              <Button
                onClick={() => navigate('/chat')}
                variant="outline"
                className="col-span-2 md:col-span-1 justify-start gap-3 h-auto py-3 md:py-4 px-4 md:px-5 w-full bg-white text-slate-700 hover:text-slate-900"
              >
                <MessageSquare className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <span className="font-medium">Trợ lý AI</span>
              </Button>
            </div>
          </section>
        </>
      )}

      <SnapFAB />

      {/* Farm Feed Preview Section */}
      <section className="w-full mt-4 md:mt-8">
        <div className="flex justify-between items-end mb-5 px-1">
          <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Farm Feed gần đây
            <Sprout className="w-6 h-6 text-primary" />
          </h3>
          <button
            onClick={() => navigate('/farm-feed')}
            className="group text-primary font-bold text-sm hover:text-primary-dark flex items-center gap-1 active:scale-95 transition-all duration-200"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-1">
          {snaps.length > 0 ? (
            snaps.map(snap => (
              <SnapCard
                key={snap.id}
                snap={snap}
                mini={true}
                onClick={() => navigate(`/snap/${snap.id}`)}
              />
            ))
          ) : (
            <div className="text-gray-400 text-sm italic py-4">Chưa có ảnh nào. Hãy là người đầu tiên chụp!</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
