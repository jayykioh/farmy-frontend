/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SnapCard } from '../components/SnapCard';
import { SnapCaptureModal } from '../components/SnapCaptureModal';
import { MascotLottie } from '../components/MascotLottie';
import { mockSnaps } from '../mocks/snapData';
import type { FarmSnap } from '../types/farmSnap';
import { SnapFAB } from '../components/SnapFAB';
import { Camera, Sprout, Leaf, AlertTriangle, Wheat, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
export const FarmFeed: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'healthy' | 'issue' | 'harvest' | 'mine'>('all');
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [snaps] = useState<FarmSnap[]>(mockSnaps);

  const getFilteredSnaps = () => {
    switch (filter) {
      case 'healthy': return snaps.filter(s => s.condition === 'healthy');
      case 'issue': return snaps.filter(s => s.condition === 'issue');
      case 'harvest': return snaps.filter(s => s.condition === 'harvest');
      case 'mine': return snaps.filter(s => s.userId === 'user-1'); // Mock current user
      default: return snaps;
    }
  };

  const filteredSnaps = getFilteredSnaps();

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
                onClick={() => setFilter(f.id as any)}
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
        {filteredSnaps.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {filteredSnaps.map(snap => (
              <div key={snap.id} className="break-inside-avoid">
                <SnapCard 
                  snap={snap} 
                  onClick={() => navigate(`/snap/${snap.id}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          (<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1 border border-border-main/50 mb-4 shadow-sm">
              <MascotLottie className="w-full h-full" />
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
        )}
        
        {/* Infinite Scroll Shimmer Mock */}
        {filteredSnaps.length > 0 ? (<div className="py-8 text-center text-text-main/50 font-bold text-sm">Đã xem hết feed
                    </div>) : null}

      </main>
      <SnapCaptureModal 
        isOpen={isCaptureOpen} 
        onClose={() => setIsCaptureOpen(false)}
        onSuccess={() => {
          // In a real app, we would fetch the latest feed or optimistic update
        }}
      />
      <SnapFAB />
    </div>
  );
};

export default FarmFeed;
