/* Hallmark · page: farm-feed · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { SnapCard } from '../components/SnapCard';
import { SnapCaptureModal } from '../components/SnapCaptureModal';
import { PetMascot } from '../features/pet/components/PetMascot';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { fetchSnapFeed, reactToSnap } from '../api/snaps';
import type { SnapCondition, SnapReactionType } from '../types/farmSnap';
import { SnapFAB } from '../components/SnapFAB';
import { StoryRingCreateButton } from '../components/StoryRingCreateButton';
import { FeedActivityToast } from '../components/FeedActivityToast';
import {
  Camera, Plant, Leaf, Warning, Grains, User,
  ArrowsClockwise, Sparkle,
} from '@phosphor-icons/react';

type FeedFilter = 'all' | SnapCondition | 'mine';

const FILTERS = [
  { id: 'all',     label: 'Tất cả' },
  { id: 'healthy', label: <span className="flex items-center gap-1"><Leaf size={13} weight="bold" />Khỏe</span> },
  { id: 'issue',   label: <span className="flex items-center gap-1"><Warning size={13} weight="bold" />Vấn đề</span> },
  { id: 'harvest', label: <span className="flex items-center gap-1"><Grains size={13} weight="bold" />Thu hoạch</span> },
  { id: 'mine',    label: <span className="flex items-center gap-1"><User size={13} weight="bold" />Của tôi</span> },
] as const;

export const FarmFeed: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);

  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const feedQuery = useQuery({
    queryKey: ['snaps', 'feed', filter],
    queryFn: () =>
      fetchSnapFeed({
        limit: 20,
        condition: filter === 'mine' || filter === 'all' ? undefined : filter,
        mine: filter === 'mine',
      }),
  });

  const reactionMutation = useMutation({
    mutationFn: ({ snapId, type }: { snapId: string; type: SnapReactionType }) =>
      reactToSnap(snapId, type),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['snaps'] });
    },
  });

  const openCapture = useCallback(() => setIsCaptureOpen(true), []);

  const snaps = feedQuery.data?.data ?? [];

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main font-sans flex flex-col relative pb-24 text-left">
      {/* Activity Toast (invisible, fires periodically) */}
      {snaps.length > 0 && <FeedActivityToast snaps={snaps} />}

      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Bản tin Vườn Ruộng <Plant size={24} weight="duotone" className="text-[#008A5E]" />
          </span>
        }
        subtitle="Khám phá & chia sẻ khoảnh khắc nhà nông"
        leftButton="back"
        rightButton="none"
      />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 flex flex-col">

        {/* ── Story-ring row ───────────────────────────────── */}
        <div className="flex items-center gap-4 py-4 overflow-x-auto scrollbar-hide mb-2">
          <StoryRingCreateButton onClick={openCapture} />

          {/* Live member rings (from feed) */}
          {snaps.slice(0, 5).map((snap, i) => (
            <motion.button
              key={snap.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate(`/snap/${snap.id}`)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-[68px] h-[68px] rounded-full p-[3px] bg-gradient-to-br from-amber-400 to-emerald-500 group-hover:from-emerald-400 group-hover:to-amber-400 transition-all duration-500">
                <div className="w-full h-full rounded-full bg-bg-main p-[2px]">
                  <img
                    src={snap.userAvatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${snap.userId}`}
                    alt={snap.userName}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/9.x/thumbs/svg?seed=${snap.userId}`; }}
                  />
                </div>
              </div>
              <span className="text-[11px] font-black text-text-secondary truncate max-w-[68px] text-center group-hover:text-[#008A5E] transition-colors">
                {snap.userName?.split(' ').slice(-1)[0] ?? 'Nông dân'}
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── Sticky filter bar ────────────────────────────── */}
        <div className="flex flex-col gap-3 mb-6 sticky top-[72px] bg-bg-main/90 backdrop-blur-md z-10 py-3 border-b-2 border-border-main/50">
          <div className="flex justify-between items-center">
            {/* Live activity pill */}
            <AnimatePresence>
              {snaps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-black text-text-secondary">
                    {snaps.length} bài đăng mới nhất
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={openCapture}
              className="btn btn--cyan font-extrabold text-sm px-4 py-2.5 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Camera size={16} weight="bold" /> Chụp ngay
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as FeedFilter)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                  filter === f.id
                    ? 'btn btn--cyan font-extrabold shadow-sm'
                    : 'card-bubble bg-white text-text-secondary border-2 border-border-main hover:text-text-main'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Loading skeleton ─────────────────────────────── */}
        {feedQuery.isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-[28px] bg-bg-surface-2 border-2 border-border-main/40 animate-pulse"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        )}

        {/* ── Error state ──────────────────────────────────── */}
        {feedQuery.isError && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1 border-2 border-border-main mb-4 shadow-sm">
              <PetMascot className="w-full h-full" status={petStatus} size={88} />
            </div>
            <h3 className="text-xl font-black text-text-h mb-2">Chưa tải được Bản tin Vườn</h3>
            <p className="text-text-secondary font-bold mb-6 max-w-sm">
              Kiểm tra kết nối mạng rồi thử lại nhé!
            </p>
            <button
              onClick={() => feedQuery.refetch()}
              className="btn btn--cyan font-extrabold px-6 py-3 cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <ArrowsClockwise size={16} weight="bold" />
              Tải lại bản tin
            </button>
          </div>
        )}

        {/* ── Feed grid ────────────────────────────────────── */}
        {!feedQuery.isLoading && !feedQuery.isError && snaps.length > 0 && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {snaps.map((snap, index) => (
              <div key={snap.id} className="break-inside-avoid">
                <SnapCard
                  snap={snap}
                  index={index}
                  onClick={() => navigate(`/snap/${snap.id}`)}
                  onReact={(type) => reactionMutation.mutate({ snapId: snap.id, type })}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state (upgraded) ───────────────────────── */}
        {!feedQuery.isLoading && !feedQuery.isError && snaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            {/* Mascot in a decorative ring */}
            <div className="relative mb-6">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-amber-100 to-emerald-100 border-4 border-dashed border-[#008A5E]/40 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
                <PetMascot className="w-28 h-28" status={petStatus} size={112} />
              </div>
              {/* Sparkle decorations */}
              <span className="absolute top-1 right-0 text-xl animate-bounce" style={{ animationDelay: '0.3s' }}>✨</span>
              <span className="absolute bottom-2 left-0 text-lg animate-bounce" style={{ animationDelay: '0.7s' }}>🌿</span>
            </div>

            <h3 className="text-2xl font-black text-text-h mb-3 tracking-tight">
              Cộng đồng đang chờ bạn! 🌾
            </h3>
            <p className="text-text-secondary font-bold mb-8 max-w-sm leading-relaxed">
              Hãy là người đầu tiên chia sẻ hình ảnh vườn ruộng của bạn với cộng đồng nông dân Việt Nam.
            </p>

            {/* Two CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openCapture}
                className="btn btn--cyan font-extrabold px-8 py-3.5 text-base cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <Camera size={18} weight="bold" />
                Chụp Farm Snap đầu tiên
              </button>
              <button
                onClick={() => navigate('/chat/active')}
                className="card-bubble bg-white border-2 border-border-main font-extrabold px-8 py-3.5 text-base cursor-pointer active:scale-95 hover:border-[#008A5E] transition-colors flex items-center gap-2 rounded-full text-text-main"
              >
                <Sparkle size={18} weight="duotone" className="text-amber-500" />
                Hỏi AI về cây trồng
              </button>
            </div>

            {/* Social proof hint */}
            <div className="mt-8 flex items-center gap-2 text-text-secondary">
              <div className="flex -space-x-2">
                {['A', 'B', 'C'].map((seed) => (
                  <img
                    key={seed}
                    src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`}
                    alt="Member"
                    className="w-7 h-7 rounded-full border-2 border-bg-main"
                  />
                ))}
              </div>
              <span className="text-xs font-bold">Hàng trăm nông dân đang chia sẻ mỗi ngày</span>
            </div>
          </motion.div>
        )}

        {/* ── End of feed ──────────────────────────────────── */}
        {snaps.length > 0 && (
          <div className="py-8 flex flex-col items-center gap-1.5 text-center">
            <span className="text-xl">✨</span>
            <span className="text-text-secondary font-black text-[13px] tracking-wide">
              Bạn đã theo kịp mọi bài đăng mới nhất!
            </span>
          </div>
        )}

      </main>

      <SnapCaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onSuccess={() => {
          void queryClient.invalidateQueries({ queryKey: ['snaps', 'feed'] });
        }}
      />
      <SnapFAB />
    </div>
  );
};

export default FarmFeed;
