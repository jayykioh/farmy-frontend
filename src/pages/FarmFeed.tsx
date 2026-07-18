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
import { Camera, Sprout, Leaf, AlertTriangle, Wheat, User } from 'lucide-react';
import { Button } from '../components/ui/Button';

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
    <div className="w-full min-h-[100svh] bg-bg-surface-1 font-sans flex flex-col relative pb-[100px]">
      <PageHeader 
        title={
          <span className="flex items-center gap-2">
            Farm Feed <Sprout className="w-6 h-6 text-primary" />
          </span>
        } 
        leftButton="back" 
        rightButton="none"
      />
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-[88px] flex flex-col">
        
        {/* Header Actions & Filters */}
        <div className="flex flex-col gap-4 mb-6 sticky top-[72px] bg-bg-surface-1 z-10 py-2 border-b border-border-main/20">
          <div className="flex justify-between items-center">
            <p className="text-text-main/70 font-medium text-sm">
              Chia sẻ câu chuyện vườn nhà bạn
            </p>
            <Button 
              onClick={() => setIsCaptureOpen(true)}
              className="text-sm px-4 py-2"
              icon={<Camera className="w-4 h-4" />}
            >
              Chụp ngay
            </Button>
          </div>

          {/* Filter Chips */}
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'healthy', label: <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5" /> Khỏe</span> },
              { id: 'issue', label: <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Vấn đề</span> },
              { id: 'harvest', label: <span className="flex items-center gap-1"><Wheat className="w-3.5 h-3.5" /> Thu hoạch</span> },
              { id: 'mine', label: <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Của tôi</span> },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as FeedFilter)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                  filter === f.id 
                    ? 'bg-text-main text-white border-text-main shadow-md' 
                    : 'bg-white text-text-main/70 border-border-main/50 hover:bg-bg-surface-2'
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
                className="aspect-[4/5] rounded-[24px] bg-white/70 border border-border-main/30 animate-pulse"
              />
            ))}
          </div>
        ) : null}

        {feedQuery.isError ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1 border border-border-main/50 mb-4 shadow-sm">
              <PetMascot className="w-full h-full" status={petStatus} size={88} />
            </div>
            <h3 className="text-xl font-bold text-text-h mb-2">Chưa tải được Farm Feed</h3>
            <p className="text-text-main/70 mb-6 max-w-sm">
              Kiểm tra kết nối rồi thử lại.
            </p>
            <Button onClick={() => feedQuery.refetch()} size="lg">
              Tải lại
            </Button>
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
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1 border border-border-main/50 mb-4 shadow-sm">
              <PetMascot className="w-full h-full" status={petStatus} size={88} />
            </div>
            <h3 className="text-xl font-bold text-text-h mb-2">Chưa có snap nào!</h3>
            <p className="text-text-main/70 mb-6 max-w-sm flex items-center justify-center gap-1">
              Hãy là người đầu tiên chia sẻ hình ảnh vườn ruộng của bạn <Wheat className="w-4 h-4" />
            </p>
            <Button 
              onClick={() => setIsCaptureOpen(true)}
              size="lg"
            >
              Chụp Farm Snap đầu tiên
            </Button>
          </div>)
        ) : null}
        
        {snaps.length > 0 ? (
          <div className="py-8 text-center text-text-main/50 font-bold text-sm">
            Đã xem hết feed
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
