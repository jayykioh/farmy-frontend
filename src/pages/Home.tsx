/* eslint-disable */
import React, { useState, useEffect } from 'react';
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

  const { data: plots = [], isLoading: plotsLoading } = useGetPlotsQuery();
  const { data: diaries = [], isLoading: diariesLoading } = useGetDiariesQuery();

  useEffect(() => {
    // Wait until both APIs finish loading before determining state to prevent UI flicker
    if (plotsLoading || diariesLoading) {
      setSetupState('loading');
      return;
    }

    if (plots.length === 0) {
      setSetupState('NO_PLOT');
    } else if (diaries.length === 0) {
      setSetupState('NO_ACTIVE_DIARY');
    } else {
      setSetupState('READY');
    }
  }, [plots, diaries, plotsLoading, diariesLoading]);

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
    <div className="relative w-full flex flex-col gap-6 md:gap-8 px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto min-h-screen overflow-hidden bg-[#FBFBFD]">

      {/* ── Create Season Modal */}
      <CreateSeasonModal
        isOpen={showCreateSeasonModal}
        onClose={() => setShowCreateSeasonModal(false)}
        onSuccess={handleSeasonCreated}
        mode={createSeasonMode}
      />

      {/* ══ LOADING STATE ═════════════════════════════════════════ */}
      {setupState === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-[70svh] gap-6 animate-pulse">
          <div className="w-40 h-40 bg-slate-200 rounded-full mb-4"></div>
          <div className="w-48 h-6 bg-slate-200 rounded-full mb-2"></div>
          <div className="w-64 h-4 bg-slate-200 rounded-full"></div>
        </div>
      )}

      {/* ══ EMPTY STATE: NO PLOT ══════════════════════════════════ */}
      {setupState === 'NO_PLOT' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="flex flex-col items-center justify-center min-h-[70svh] text-center gap-6"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
            className="relative"
          >
            <PetMascot status={{ ...petStatus, bubbleMessage: 'Chào mừng bạn! 🌱' }} size={180} className="relative drop-shadow-xl" />
          </motion.div>
          <div className="flex flex-col gap-2 max-w-xs">
            <h1 className="text-2xl font-black text-text-h tracking-tight">Chào mừng đến FarmDiaries!</h1>
            <p className="text-base text-text-main/60 font-medium leading-relaxed">
              Hãy tạo mảnh vườn đầu tiên và bắt đầu vụ mùa để Bé Thóc có thể theo dõi cây trồng cùng bạn.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => openCreateSeason('first-time')}
            className="flex items-center gap-2 bg-slate-900 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-shadow duration-200 cursor-pointer"
          >
            <Sprout className="w-5 h-5" />
            Bắt đầu vụ mùa đầu tiên
          </motion.button>
        </motion.div>
      )}

      {/* ══ EMPTY STATE: HAS PLOT, NO ACTIVE DIARY ══════════════ */}
      {setupState === 'NO_ACTIVE_DIARY' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="flex flex-col items-center justify-center min-h-[70svh] text-center gap-6"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
            className="relative"
          >
            <PetMascot status={{ ...petStatus, bubbleMessage: 'Vườn chờ canh tác! 🌿' }} size={180} className="relative drop-shadow-xl" />
          </motion.div>
          <div className="flex flex-col gap-2 max-w-xs">
            <h1 className="text-2xl font-black text-text-h tracking-tight">Chưa có vụ mùa nào</h1>
            <p className="text-base text-text-main/60 font-medium leading-relaxed">
              Bạn đã có mảnh vườn rồi. Hãy tạo một vụ mùa mới để bắt đầu ghi nhật ký!
            </p>
          </div>
          <p className="text-sm font-medium text-text-main/50 mt-1">
            {moodReasonMap[petStatus.moodReason] || petStatus.moodReason || '✨ Gần lên cấp rồi! Tiếp tục ghi nhật ký nhé.'}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => openCreateSeason('add-season')}
            className="flex items-center gap-2 bg-slate-900 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-shadow duration-200 cursor-pointer"
          >
            <Sprout className="w-5 h-5" />
            Tạo vụ mùa mới
          </motion.button>
        </motion.div>
      )}

      {/* ══ READY STATE: Full Dashboard ══════════════════════════ */}
      {setupState === 'READY' && (
        <>
          {/* Header & Streak */}
          <section className="flex flex-col items-center md:items-start text-center md:text-left mt-2 md:mt-0">
            <div className="inline-flex items-center gap-2 bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-full px-4 py-1.5 mb-4">
              <Flame className="w-4 h-4 text-[#FF9500] fill-[#FF9500]" />
              <span className="font-semibold text-[#1d1d1f] text-[14px]">{streak} ngày liên tiếp</span>
            </div>
            <h2 className="text-[32px] md:text-[44px] font-bold text-[#1d1d1f] tracking-[-0.02em] leading-tight">
              Chào buổi sáng,<br /> <span className="text-[#34C759]">{(user as any)?.displayName || user?.email?.split('@')[0] || 'Nông Dân'}</span>!
            </h2>
            <p className="text-[#86868b] mt-2 font-medium text-[16px]">Bạn đã sẵn sàng để chăm sóc nông trại hôm nay chưa?</p>
          </section>

          {/* Mascot Emotional Anchor */}
          <section className="flex flex-col items-center justify-center w-full mt-4 md:mt-2 mb-8 md:mb-6">
            <div className="relative w-full aspect-square max-h-[300px] md:max-h-[360px] max-w-[280px] md:max-w-[400px]">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
                className="w-full h-full rounded-[36px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)] border border-black/[0.03] flex items-center justify-center p-4 md:p-8"
              >
                <PetMascot status={petStatus} size={220} className="w-full h-full drop-shadow-xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20, y: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
                className="absolute -top-6 -right-6 md:top-4 md:-right-12 bg-white border border-black/[0.04] rounded-[24px] rounded-bl-sm px-5 py-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.08)] animate-[bounce_4s_ease-in-out_infinite] max-w-[220px] md:max-w-[260px] z-10"
              >
                <p className="font-semibold text-[#1d1d1f] text-[13.5px] md:text-[14.5px] leading-snug tracking-tight">
                  {bubbleMessage}
                </p>
              </motion.div>
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

          {/* 2-column: Reminders + Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 w-full">

            {/* LEFT: Reminders Today */}
            <section className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f] flex items-center gap-2">
                  🔔 Nhắc nhở hôm nay
                  {todayReminders.length > 0 && (
                    <span className="bg-[#FF3B30] text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                      {todayReminders.length}
                    </span>
                  )}
                </h3>
                <button onClick={() => navigate('/reminders')} className="text-[#34C759] font-semibold text-[12px] hover:opacity-70 transition-opacity cursor-pointer">
                  Xem tất cả ›
                </button>
              </div>

              {todayReminders.length === 0 ? (
                <div className="bg-white rounded-[18px] px-4 py-5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] text-center flex flex-col items-center justify-center gap-1.5 flex-1 min-h-[220px]">
                  <span className="text-xl">🌱</span>
                  <p className="text-[13px] text-[#86868b] font-medium">Hôm nay không có lịch hẹn</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
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

            {/* RIGHT: Quick Actions — Apple pill-row style */}
            <section className="flex flex-col gap-3">
              <div className="px-1">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Thao tác nhanh</h3>
              </div>
              <div className="flex flex-col gap-2.5">

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/reminders')}
                  className="group w-full flex items-center gap-4 bg-white rounded-[18px] px-5 py-3.5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:bg-[#f9f9fb] transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 rounded-[13px] bg-[#E5F1FF] flex items-center justify-center shrink-0">
                    <Droplets className="w-5 h-5 text-[#0066CC]" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">Tưới nước</p>
                    <p className="text-[12px] text-[#86868b] font-medium mt-0.5">Đặt lịch tưới hôm nay</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#c7c7cc] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/scan')}
                  className="group w-full flex items-center gap-4 bg-white rounded-[18px] px-5 py-3.5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:bg-[#f9f9fb] transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 rounded-[13px] bg-[#E8F8F5] flex items-center justify-center shrink-0">
                    <ScanLine className="w-5 h-5 text-[#248A3D]" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">Quét cây</p>
                    <p className="text-[12px] text-[#86868b] font-medium mt-0.5">Chẩn đoán sâu bệnh</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#c7c7cc] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/chat')}
                  className="group w-full flex items-center gap-4 bg-white rounded-[18px] px-5 py-3.5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] cursor-pointer hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:bg-[#f9f9fb] transition-all duration-200 text-left"
                >
                  <div className="w-10 h-10 rounded-[13px] bg-[#FFF3E0] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-[#E67300]" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">Trợ lý AI</p>
                    <p className="text-[12px] text-[#86868b] font-medium mt-0.5">Hỏi Bé Thóc ngay</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#c7c7cc] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </motion.button>

              </div>
            </section>

          </div>
        </>
      )}

      <SnapFAB />

      {/* Farm Feed Preview Section */}
      <section className="w-full mt-4 md:mt-8">
        <div className="flex justify-between items-end mb-5 px-1">
          <h3 className="text-[20px] font-bold text-[#1d1d1f] tracking-tight flex items-center gap-2">
            Farm Feed gần đây
            <Sprout className="w-5 h-5 text-[#34C759]" />
          </h3>
          <button
            onClick={() => navigate('/farm-feed')}
            className="group text-[#34C759] font-semibold text-[13px] flex items-center gap-1 active:scale-95 transition-all duration-200 hover:opacity-70"
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
