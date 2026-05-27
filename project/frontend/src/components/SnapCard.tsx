import React from 'react';
import type { FarmSnap } from '../types/farmSnap';
import { useNavigate } from 'react-router-dom';
import { Heart, ThumbsUp, AlertTriangle, MessageSquare } from 'lucide-react';

interface SnapCardProps {
  snap: FarmSnap;
  onClick?: () => void;
  mini?: boolean;
}

export const SnapCard: React.FC<SnapCardProps> = ({ snap, onClick, mini = false }) => {
  const navigate = useNavigate();

  const handleAiClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to chat with pre-filled context (mock)
    navigate('/chat/active');
  };

  const getConditionColor = () => {
    switch (snap.condition) {
      case 'healthy': return 'bg-green-500 text-white';
      case 'issue': return 'bg-yellow-500 text-white';
      case 'harvest': return 'bg-amber-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getConditionLabel = () => {
    switch (snap.condition) {
      case 'healthy': return '🌿 Khỏe';
      case 'issue': return '⚠️ Vấn đề';
      case 'harvest': return '🌾 Thu hoạch';
      default: return '🌱 Khác';
    }
  };

  // Format relative time (mock logic)
  const getRelativeTime = () => {
    const hours = Math.round((Date.now() - new Date(snap.capturedAt).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  if (mini) {
    return (
      <div 
        onClick={onClick}
        className="w-[160px] h-[220px] rounded-[20px] overflow-hidden relative cursor-pointer flex-shrink-0 snap-center shadow-sm border border-border-main/20 hover:-translate-y-1 transition-transform"
      >
        <img src={snap.imageUrl} alt={snap.cropType} className="w-full h-full object-cover" />
        
        {/* Top Pills */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${getConditionColor()}`}>
            {getConditionLabel()}
          </span>
        </div>

        {/* Bottom Gradient & Info */}
        <div className="absolute bottom-0 left-0 right-0 pt-12 pb-3 px-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <p className="text-white text-xs font-bold line-clamp-2 leading-tight mb-1">
            {snap.caption || `Ảnh ${snap.cropType} của ${snap.userName}`}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-[10px] font-medium">{getRelativeTime()}</span>
            <div className="flex items-center gap-1">
              <span className="text-white text-[10px] font-bold flex items-center">
                👍 {snap.reactions.reduce((sum, r) => sum + r.count, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="w-full aspect-[4/5] rounded-[24px] overflow-hidden relative cursor-pointer shadow-sm border border-border-main/20 mb-4 hover:shadow-md transition-shadow group"
    >
      <img src={snap.imageUrl} alt={snap.cropType} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      
      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-4 flex gap-2 justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex gap-2">
          <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/20">
            🌾 {snap.cropType}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 ${getConditionColor()}`}>
            {getConditionLabel()}
          </span>
        </div>
      </div>

      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        
        {/* Caption */}
        {snap.caption && (
          <p className="text-white text-sm md:text-base font-bold line-clamp-2 mb-2 leading-snug drop-shadow-md">
            {snap.caption}
          </p>
        )}

        {/* User & Meta */}
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2">
            <img src={snap.userAvatar} alt={snap.userName} className="w-6 h-6 rounded-full border border-white/20" />
            <div className="flex flex-col">
              <span className="text-white text-xs font-bold drop-shadow-md">{snap.userName}</span>
              <span className="text-white/70 text-[10px] font-medium drop-shadow-sm">
                {snap.location?.province} • {getRelativeTime()}
              </span>
            </div>
          </div>
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center gap-1.5 text-white/95 hover:text-white active:scale-90 transition-transform"
              aria-label="Like Snap"
            >
              <Heart className={`w-4 h-4 ${snap.reactions.find(r => r.type === 'like')?.userReacted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              <span className="text-xs font-extrabold">
                {snap.reactions.find(r => r.type === 'like')?.count || 0}
              </span>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center gap-1.5 text-white/95 hover:text-white active:scale-90 transition-transform"
              aria-label="Mark helpful"
            >
              <ThumbsUp className={`w-4 h-4 ${snap.reactions.find(r => r.type === 'helpful')?.userReacted ? 'fill-primary-light text-primary-light' : 'text-white'}`} />
              <span className="text-xs font-extrabold">
                {snap.reactions.find(r => r.type === 'helpful')?.count || 0}
              </span>
            </button>
            {snap.condition === 'issue' && (
              <button 
                onClick={(e) => e.stopPropagation()} 
                className="flex items-center gap-1.5 text-white/95 hover:text-white active:scale-90 transition-transform"
                aria-label="Worry about issue"
              >
                <AlertTriangle className={`w-4 h-4 ${snap.reactions.find(r => r.type === 'worry')?.userReacted ? 'fill-amber-500 text-amber-500' : 'text-white'}`} />
                <span className="text-xs font-extrabold">
                  {snap.reactions.find(r => r.type === 'worry')?.count || 0}
                </span>
              </button>
            )}
          </div>

          <button 
            onClick={handleAiClick}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary-light fill-primary-light/10" />
            Hỏi AI
          </button>
        </div>

      </div>
    </div>
  );
};
