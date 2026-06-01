import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SnapCard } from '../components/SnapCard';
import { SnapCaptureModal } from '../components/SnapCaptureModal';
import { MascotLottie } from '../components/MascotLottie';
import { mockSnaps } from '../mocks/snapData';
import type { FarmSnap } from '../types/farmSnap';
import { SnapFAB } from '../components/SnapFAB';

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
        title="Farm Feed 🌱" 
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
            <button 
              onClick={() => setIsCaptureOpen(true)}
              className="bg-primary text-white font-bold text-sm px-4 py-2 rounded-full flex items-center gap-2 active:scale-95 transition-transform shadow-[0_4px_12px_rgba(8,168,85,0.3)]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Chụp ngay
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'healthy', label: '🌿 Khỏe' },
              { id: 'issue', label: '⚠️ Vấn đề' },
              { id: 'harvest', label: '🌾 Thu hoạch' },
              { id: 'mine', label: '👤 Của tôi' },
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
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center p-1 border border-border-main/50 mb-4 shadow-sm">
              <MascotLottie className="w-full h-full" />
            </div>
            <h3 className="text-xl font-bold text-text-h mb-2">Chưa có snap nào!</h3>
            <p className="text-text-main/70 mb-6 max-w-sm">
              Hãy là người đầu tiên chia sẻ hình ảnh vườn ruộng của bạn 🌾
            </p>
            <button 
              onClick={() => setIsCaptureOpen(true)}
              className="bg-primary text-white font-bold text-lg px-8 py-3 rounded-full active:scale-95 transition-transform shadow-[0_4px_12px_rgba(8,168,85,0.3)]"
            >
              Chụp Farm Snap đầu tiên
            </button>
          </div>
        )}
        
        {/* Infinite Scroll Shimmer Mock */}
        {filteredSnaps.length > 0 && (
          <div className="py-8 text-center text-text-main/50 font-bold text-sm">
            Đã xem hết feed
          </div>
        )}

      </main>

      <SnapCaptureModal 
        isOpen={isCaptureOpen} 
        onClose={() => setIsCaptureOpen(false)}
        onSuccess={() => {
          // In a real app, we would fetch the latest feed or optimistic update
          console.log('Snap published!');
        }}
      />
      <SnapFAB />
    </div>
  );
};

export default FarmFeed;
