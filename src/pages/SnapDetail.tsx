 
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  ThumbsUp,
  AlertTriangle,
  MessageSquare,
  ArrowLeft,
  MoreVertical,
  Leaf,
  Sprout,
  Wheat,
  Send,
  Trash2,
  Edit2,
  Archive,
} from 'lucide-react';
import { resolveImageUrl } from '../utils/url';
import { Button } from '../components/ui/Button';
import { createSnapComment, fetchSnap, reactToSnap, deleteSnap } from '../api/snaps';
import { useAuthStore } from '../store/authStore';
import type { SnapReactionType } from '../types/farmSnap';
import toast from 'react-hot-toast';

const getReaction = (
  reactions: Awaited<ReturnType<typeof fetchSnap>>['reactions'],
  type: SnapReactionType,
) => reactions.find((reaction) => reaction.type === type);

export const SnapDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [now] = React.useState(() => Date.now());
  const [comment, setComment] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuthStore();

  const snapQuery = useQuery({
    queryKey: ['snaps', 'detail', id],
    enabled: Boolean(id),
    queryFn: () => fetchSnap(id as string),
  });

  const reactionMutation = useMutation({
    mutationFn: (type: SnapReactionType) => reactToSnap(id as string, type),
    onMutate: async (type) => {
      await queryClient.cancelQueries({ queryKey: ['snaps', 'detail', id] });
      const previousSnap = queryClient.getQueryData(['snaps', 'detail', id]);
      
      queryClient.setQueryData(['snaps', 'detail', id], (old: any) => {
        if (!old) return old;
        const newReactions = old.reactions.map((r: any) => {
          if (r.type === type) {
            return {
              ...r,
              count: r.userReacted ? r.count - 1 : r.count + 1,
              userReacted: !r.userReacted
            };
          }
          return r;
        });
        return { ...old, reactions: newReactions };
      });
      
      return { previousSnap };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousSnap) {
        queryClient.setQueryData(['snaps', 'detail', id], context.previousSnap);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['snaps', 'detail', id] });
      void queryClient.invalidateQueries({ queryKey: ['snaps', 'feed'] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => createSnapComment(id as string, content),
    onSuccess: () => {
      setComment('');
      void queryClient.invalidateQueries({ queryKey: ['snaps'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSnap(id as string),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['snaps', 'feed'] });
      void queryClient.invalidateQueries({ queryKey: ['snapFeed'] });
      navigate('/farm-feed', { replace: true });
    },
  });

  const snap = snapQuery.data;

  if (snapQuery.isLoading) {
    return (
      <div className="w-full h-[100svh] bg-black text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!snap) {
    return (
      <div className="w-full h-[100svh] bg-black text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy Snap</h2>
        <Button onClick={() => navigate('/farm-feed')}>Quay lại Feed</Button>
      </div>
    );
  }

  const getConditionColor = () => {
    switch (snap.condition) {
      case 'healthy':
        return 'bg-green-500 text-white';
      case 'issue':
        return 'bg-yellow-500 text-white';
      case 'harvest':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getConditionLabel = () => {
    switch (snap.condition) {
      case 'healthy':
        return <><Leaf className="w-3 h-3" /> Khỏe</>;
      case 'issue':
        return <><AlertTriangle className="w-3 h-3" /> Vấn đề</>;
      case 'harvest':
        return <><Wheat className="w-3 h-3" /> Thu hoạch</>;
      default:
        return <><Sprout className="w-3 h-3" /> Khác</>;
    }
  };

  const getRelativeTime = (value: string) => {
    const hours = Math.round((now - new Date(value).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  const submitComment = (event: React.FormEvent) => {
    event.preventDefault();
    const content = comment.trim();
    if (!content || commentMutation.isPending) return;
    commentMutation.mutate(content);
  };

  return (
    <div className="w-full h-[100svh] bg-black text-white flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-110"
        style={{ backgroundImage: `url(${resolveImageUrl(snap.imageUrl)})` }}
      />

      <div className="absolute top-0 left-0 right-0 p-4 pt-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-black/40 rounded-full backdrop-blur-sm active:scale-95 transition-transform"
          aria-label="Quay lại"
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

        {snap.userId === user?.id && (
          <div className="relative">
            <button 
              className="p-2 text-white/90 active:scale-95 transition-transform bg-black/40 rounded-full backdrop-blur-sm" 
              aria-label="Tùy chọn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)} 
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                      onClick={() => {
                        setShowDropdown(false);
                        toast('Chức năng chỉnh sửa đang được phát triển', { icon: 'ℹ️' });
                      }}
                    >
                      <Edit2 className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Chỉnh sửa</span>
                    </button>
                    
                    <button
                      className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                      onClick={() => {
                        setShowDropdown(false);
                        toast('Chức năng lưu trữ đang được phát triển', { icon: 'ℹ️' });
                      }}
                    >
                      <Archive className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">Lưu trữ ảnh</span>
                    </button>
                    
                    <div className="h-px bg-slate-100 my-1" />
                    
                    <button
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      onClick={() => {
                        setShowDropdown(false);
                        if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) {
                          deleteMutation.mutate();
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Xóa bài đăng</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 w-full flex items-center justify-center z-10 relative">
        <img
          src={resolveImageUrl(snap.imageUrl)}
          alt={snap.caption || 'Farm Snap'}
          className="w-full max-h-[80svh] object-contain"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=800&auto=format&fit=crop'; }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pt-20 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
        {snap.caption ? (
          <p className="text-white text-base md:text-lg font-bold mb-4 drop-shadow-md">
            {snap.caption}
          </p>
        ) : null}

        <div className="flex items-center gap-3 mb-3">
          <img
            src={snap.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${snap.userId}`}
            alt={snap.userName}
            className="w-10 h-10 rounded-full border border-white/30"
          />
          <div className="flex flex-col flex-1">
            <span className="text-white text-sm font-bold">{snap.userName}</span>
            <span className="text-white/60 text-xs font-medium">
              {snap.location?.province || 'Farmy'} • {getRelativeTime(snap.capturedAt)}
            </span>
          </div>
        </div>

        <div className="max-h-28 overflow-y-auto space-y-2 mb-3 pr-1">
          {(snap.comments ?? []).map((item) => (
            <div key={item.id} className="bg-white/10 border border-white/10 rounded-lg px-3 py-2">
              <div className="flex justify-between gap-3">
                <span className="text-xs font-bold">{item.userName}</span>
                <span className="text-[10px] text-white/50">{getRelativeTime(item.createdAt)}</span>
              </div>
              <p className="text-sm text-white/85">{item.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submitComment} className="flex items-center gap-2 mb-3">
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Viết bình luận..."
            maxLength={500}
            className="min-w-0 flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!comment.trim() || commentMutation.isPending}
            className="w-10 h-10 rounded-full bg-primary disabled:bg-white/15 disabled:text-white/40 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Gửi bình luận"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between border-t border-white/10 pt-4 pb-2">
          <div className="flex gap-5">
            <button
              onClick={() => reactionMutation.mutate('like')}
              className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
              aria-label="Like Snap"
            >
              <Heart className={`w-6 h-6 ${getReaction(snap.reactions, 'like')?.userReacted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              <span className="text-[11px] font-extrabold text-white/80">{getReaction(snap.reactions, 'like')?.count || 0}</span>
            </button>
            <button
              onClick={() => reactionMutation.mutate('helpful')}
              className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
              aria-label="Mark helpful"
            >
              <ThumbsUp className={`w-6 h-6 ${getReaction(snap.reactions, 'helpful')?.userReacted ? 'fill-primary-light text-primary-light' : 'text-white'}`} />
              <span className="text-[11px] font-extrabold text-white/80">{getReaction(snap.reactions, 'helpful')?.count || 0}</span>
            </button>
            {snap.condition === 'issue' ? (
              <button
                onClick={() => reactionMutation.mutate('worry')}
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
                aria-label="Worry about issue"
              >
                <AlertTriangle className={`w-6 h-6 ${getReaction(snap.reactions, 'worry')?.userReacted ? 'fill-amber-500 text-amber-500' : 'text-white'}`} />
                <span className="text-[11px] font-extrabold text-white/80">{getReaction(snap.reactions, 'worry')?.count || 0}</span>
              </button>
            ) : null}
          </div>

          <Button
            onClick={() => navigate('/chat/active', { 
              state: { 
                initialMessage: 'Bạn có thể phân tích bức ảnh này giúp tôi được không?',
                initialImage: resolveImageUrl(snap.imageUrl)
              } 
            })}
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
