import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockSnaps } from '../mocks/snapData';
import { Heart, ThumbsUp, AlertTriangle, MessageSquare, ArrowLeft, MoreVertical, Leaf, Sprout, Wheat } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SnapDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [now] = React.useState(() => Date.now());
  
  const snap = mockSnaps.find(s => s.id === id);

  if (!snap) {
    return (
      <div className="w-full h-[100svh] bg-black text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy Snap</h2>
        <Button onClick={() => navigate('/farm-feed')}>
          Quay lại Feed
        </Button>
      </div>
    );
  }

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
      case 'healthy': return <><Leaf className="w-3 h-3" /> Khỏe</>;
      case 'issue': return <><AlertTriangle className="w-3 h-3" /> Vấn đề</>;
      case 'harvest': return <><Wheat className="w-3 h-3" /> Thu hoạch</>;
      default: return <><Sprout className="w-3 h-3" /> Khác</>;
    }
  };

  const getRelativeTime = () => {
    const hours = Math.round((now - new Date(snap.capturedAt).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  return (
    <div className="w-full h-[100svh] bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background Image (Blurred for aesthetics if aspect ratio doesn't fill) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-110"
        style={{ backgroundImage: `url(${snap.imageUrl})` }}
      ></div>
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-black/40 rounded-full backdrop-blur-sm active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-white/20">
            <Wheat className="w-3 h-3" /> {snap.cropType}
          </span>
          <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 ${getConditionColor()}`}>
            {getConditionLabel()}
          </span>
        </div>

        <button className="p-2 text-white/80 active:scale-95">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>
      {/* Main Image */}
      <div className="flex-1 w-full flex items-center justify-center z-10 relative">
        <img 
          src={snap.imageUrl} 
          alt={snap.caption || 'Farm Snap'} 
          className="w-full max-h-[80svh] object-contain"
        />
      </div>
      {/* Bottom Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-20 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
        
        {/* Caption */}
        {snap.caption ? (<p className="text-white text-base md:text-lg font-bold mb-4 drop-shadow-md">
          {snap.caption}
        </p>) : null}

        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <img src={snap.userAvatar} alt={snap.userName} className="w-10 h-10 rounded-full border border-white/30" />
          <div className="flex flex-col flex-1">
            <span className="text-white text-sm font-bold">{snap.userName}</span>
            <span className="text-white/60 text-xs font-medium">
              {snap.location?.province} • {getRelativeTime()}
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 pb-2">
          
          <div className="flex gap-5">
            <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform" aria-label="Like Snap">
              <Heart className={`w-6 h-6 ${snap.reactions.find(r => r.type === 'like')?.userReacted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              <span className="text-[11px] font-extrabold text-white/80">{snap.reactions.find(r => r.type === 'like')?.count || 0}</span>
            </button>
            <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform" aria-label="Mark helpful">
              <ThumbsUp className={`w-6 h-6 ${snap.reactions.find(r => r.type === 'helpful')?.userReacted ? 'fill-primary-light text-primary-light' : 'text-white'}`} />
              <span className="text-[11px] font-extrabold text-white/80">{snap.reactions.find(r => r.type === 'helpful')?.count || 0}</span>
            </button>
            {snap.condition === 'issue' ? (<button className="flex flex-col items-center gap-1 active:scale-95 transition-transform" aria-label="Worry about issue">
              <AlertTriangle className={`w-6 h-6 ${snap.reactions.find(r => r.type === 'worry')?.userReacted ? 'fill-amber-500 text-amber-500' : 'text-white'}`} />
              <span className="text-[11px] font-extrabold text-white/80">{snap.reactions.find(r => r.type === 'worry')?.count || 0}</span>
            </button>) : null}
          </div>

          <Button 
            onClick={() => navigate('/chat/active')}
            icon={<MessageSquare className="w-4 h-4 text-white fill-white/10" />}
            className="text-sm shadow-[0_0_15px_rgba(8,168,85,0.4)]"
          >
            Hỏi AI
          </Button>

        </div>
      </div>
    </div>
  );
};

export default SnapDetail;
