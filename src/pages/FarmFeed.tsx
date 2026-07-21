/* Hallmark · page: farm-feed · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SnapCard } from '../components/SnapCard';
import { SnapCaptureModal } from '../components/SnapCaptureModal';
import { PetMascot } from '../features/pet/components/PetMascot';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { fetchSnapFeed, reactToSnap } from '../api/snaps';
import type { SnapCondition, SnapReactionType } from '../types/farmSnap';
import { SnapFAB } from '../components/SnapFAB';
import { Camera, Plant, Leaf, Warning, Grains, User } from '@phosphor-icons/react';

type FeedFilter = 'all' | SnapCondition | 'mine';

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

  const snaps = feedQuery.data?.data ?? [];

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main font-sans flex flex-col relative pb-24 text-left">
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
        
        {/* Header Actions & Filters */}
        <div className="flex flex-col gap-4 mb-6 sticky top-[72px] bg-bg-main/90 backdrop-blur-md z-10 py-3 border-b-2 border-border-main/50">
          <div className="flex justify-between items-center">
            <p className="text-text-secondary font-bold text-sm">
              Chia sẻ hình ảnh nông sản & thành quả chăm sóc
            </p>
            <button 
              onClick={() => setIsCaptureOpen(true)}
              className="btn btn--cyan font-extrabold text-sm px-4 py-2.5 cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Camera size={16} weight="bold" /> Chụp ngay
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'healthy', label: <span className="flex items-center gap-1"><Leaf size={14} weight="bold" /> Khỏe</span> },
              { id: 'issue', label: <span className="flex items-center gap-1"><Warning size={14} weight="bold" /> Vấn đề</span> },
              { id: 'harvest', label: <span className="flex items-center gap-1"><Grains size={14} weight="bold" /> Thu hoạch</span> },
              { id: 'mine', label: <span className="flex items-center gap-1"><User size={14} weight="bold" /> Của tôi</span> },
            ].map(f => (
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

        {/* Feed Grid */}
        {feedQuery.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] rounded-[28px] bg-bg-surface-2 border-2 border-border-main/40 animate-pulse"
              />
            ))}
          </div>
        ) : null}

        {feedQuery.isError ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1 border-2 border-border-main mb-4 shadow-sm">
              <PetMascot className="w-full h-full" status={petStatus} size={88} />
            </div>
            <h3 className="text-xl font-black text-text-h mb-2">Chưa tải được Bản tin Vườn</h3>
            <p className="text-text-secondary font-bold mb-6 max-w-sm">
              Kiểm tra kết nối mạng rồi thử lại nhé!
            </p>
            <button onClick={() => feedQuery.refetch()} className="btn btn--cyan font-extrabold px-6 py-3 cursor-pointer active:scale-95">
              Tải lại bản tin
            </button>
          </div>
        ) : null}

        {!feedQuery.isLoading && !feedQuery.isError && snaps.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {snaps.map(snap => (
              <div key={snap.id} className="break-inside-avoid">
                <SnapCard 
                  snap={snap} 
                  onClick={() => navigate(`/snap/${snap.id}`)}
                  onReact={(type) => reactionMutation.mutate({ snapId: snap.id, type })}
                />
              </div>
            ))}
          </div>
        ) : null}

        {!feedQuery.isLoading && !feedQuery.isError && snaps.length === 0 ? (
          /* Empty State */
          (<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1 border-2 border-border-main mb-4 shadow-sm">
              <PetMascot className="w-full h-full animate-bounce" status={petStatus} size={88} />
            </div>
            <h3 className="text-xl font-black text-text-h mb-2">Chưa có bài đăng Snap nào!</h3>
            <p className="text-text-secondary font-bold mb-6 max-w-sm flex items-center justify-center gap-1">
              Hãy là người đầu tiên chia sẻ hình ảnh vườn ruộng của bạn <Grains size={16} weight="duotone" className="text-amber-500" />
            </p>
            <button 
              onClick={() => setIsCaptureOpen(true)}
              className="btn btn--cyan font-extrabold px-6 py-3.5 text-base cursor-pointer active:scale-95"
            >
              Chụp Farm Snap đầu tiên
            </button>
          </div>)
        ) : null}
        
        {snaps.length > 0 ? (
          <div className="py-8 flex flex-col items-center gap-1.5 text-center">
            <span className="text-xl">✨</span>
            <span className="text-text-secondary font-black text-[13px] tracking-wide">Bạn đã theo kịp mọi bài đăng mới nhất!</span>
          </div>
        ) : null}

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
