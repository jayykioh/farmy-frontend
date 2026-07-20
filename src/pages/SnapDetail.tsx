 
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
      <div className="w-full min-h-[100svh] bg-[#fbfbfd] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black/10 border-t-[#34C759] rounded-full animate-spin" />
      </div>
    );
  }

  if (!snap) {
    return (
      <div className="w-full min-h-[100svh] bg-[#fbfbfd] text-[#1d1d1f] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-6 tracking-tight">Không tìm thấy Snap</h2>
        <button 
          onClick={() => navigate('/farm-feed')}
          className="bg-[#1d1d1f] text-white px-6 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all"
        >
          Quay lại Feed
        </button>
      </div>
    );
  }

  const getConditionColor = () => {
    switch (snap.condition) {
      case 'healthy':
        return 'bg-[#34C759]/10 text-[#248A3D] border-[#34C759]/20';
      case 'issue':
        return 'bg-[#FF9500]/10 text-[#E68600] border-[#FF9500]/20';
      case 'harvest':
        return 'bg-[#AF52DE]/10 text-[#8E43B4] border-[#AF52DE]/20';
      default:
        return 'bg-black/5 text-[#86868b] border-black/10';
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
    if (hours < 24) return `${hours}h trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  const submitComment = (event: React.FormEvent) => {
    event.preventDefault();
    const content = comment.trim();
    if (!content || commentMutation.isPending) return;
    commentMutation.mutate(content);
  };

  return (
    <div className="w-full min-h-[100svh] bg-[#fbfbfd] md:bg-[#f5f5f7] flex items-center justify-center font-sans md:p-6 lg:p-10">
      
      {/* Mobile Back Button - Fixed at top left outside the container on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/20 rounded-full active:scale-90 transition-transform shadow-lg"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="w-full max-w-6xl md:h-[85vh] md:max-h-[900px] bg-white md:rounded-[32px] md:shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row relative">
        
        {/* LEFT PANEL: Media View */}
        <div className="w-full md:w-[55%] lg:w-[60%] h-[55svh] md:h-full relative bg-black flex flex-col border-r border-black/5">
          {/* Desktop Back Button */}
          <div className="hidden md:flex absolute top-6 left-6 z-30">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/20 rounded-full active:scale-90 transition-transform hover:bg-black/60 shadow-lg"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          </div>

          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 blur-[60px] scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${resolveImageUrl(snap.imageUrl)})` }}
          />
          <div className="absolute inset-0 flex items-center justify-center z-10 p-0 md:p-4">
            <img
              src={resolveImageUrl(snap.imageUrl)}
              alt={snap.caption || 'Farm Snap'}
              className="w-full h-full object-contain drop-shadow-2xl"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=800&auto=format&fit=crop'; }}
            />
          </div>
        </div>

        {/* RIGHT PANEL: Interactions */}
        <div className="w-full md:w-[45%] lg:w-[40%] h-[45svh] md:h-full flex flex-col bg-white">
          
          {/* Header: User Info & Options */}
          <div className="flex items-center justify-between p-4 border-b border-black/5 shrink-0 bg-white z-10 sticky top-0">
            <div className="flex items-center gap-3">
              <img
                src={snap.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${snap.userId}`}
                alt={snap.userName}
                className="w-10 h-10 rounded-full border border-black/5 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-[#1d1d1f] text-[15px] font-bold tracking-tight">
                  {snap.userName}
                </span>
                <span className="text-[#86868b] text-[13px] font-medium">
                  {snap.location?.province || 'Nông trại'} • {getRelativeTime(snap.capturedAt)}
                </span>
              </div>
            </div>

            {snap.userId === user?.id && (
              <div className="relative">
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] active:scale-95 transition-colors"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <MoreVertical className="w-5 h-5 text-[#86868b]" />
                </button>
                
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-3xl rounded-2xl shadow-xl ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="py-1">
                        <button
                          className="w-full px-4 py-3 text-left text-[15px] text-[#1d1d1f] hover:bg-black/5 flex items-center gap-3 transition-colors"
                          onClick={() => { setShowDropdown(false); toast('Chức năng chỉnh sửa đang được phát triển', { icon: 'ℹ️' }); }}
                        >
                          <Edit2 className="w-4 h-4 text-[#86868b]" />
                          <span className="font-semibold">Chỉnh sửa</span>
                        </button>
                        <button
                          className="w-full px-4 py-3 text-left text-[15px] text-[#1d1d1f] hover:bg-black/5 flex items-center gap-3 transition-colors"
                          onClick={() => { setShowDropdown(false); toast('Chức năng lưu trữ đang được phát triển', { icon: 'ℹ️' }); }}
                        >
                          <Archive className="w-4 h-4 text-[#86868b]" />
                          <span className="font-semibold">Lưu trữ ảnh</span>
                        </button>
                        <div className="h-px bg-black/5 my-1" />
                        <button
                          className="w-full px-4 py-3 text-left text-[15px] text-[#FF3B30] hover:bg-[#FF3B30]/10 flex items-center gap-3 transition-colors"
                          onClick={() => {
                            setShowDropdown(false);
                            if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) deleteMutation.mutate();
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-[#FF3B30]" />
                          <span className="font-semibold">Xóa bài đăng</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Middle: Caption & Comments List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
            
            {/* Caption & Badges Row */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 bg-black/5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border border-black/5 text-[#48484a]">
                  <Wheat className="w-3 h-3" /> {snap.cropType}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border ${getConditionColor()}`}>
                  {getConditionLabel()}
                </span>
              </div>
              {snap.caption && (
                <p className="text-[#1d1d1f] text-[15px] leading-relaxed">
                  <span className="font-bold mr-2">{snap.userName}</span>
                  {snap.caption}
                </p>
              )}
            </div>

            <div className="h-px w-full bg-black/5 my-1" />

            {/* Comments List */}
            <div className="flex flex-col gap-4">
              {(snap.comments && snap.comments.length > 0) ? (
                snap.comments.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/5 border border-black/5 flex-shrink-0 flex items-center justify-center font-bold text-[#86868b] text-[12px]">
                      {item.userName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[14px] leading-snug">
                        <span className="font-bold text-[#1d1d1f] mr-2">{item.userName}</span>
                        <span className="text-[#1d1d1f]">{item.content}</span>
                      </p>
                      <span className="text-[12px] font-medium text-[#86868b] mt-1">{getRelativeTime(item.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-[#86868b]">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-[14px] font-medium">Chưa có bình luận nào.</p>
                  <p className="text-[13px]">Hãy là người đầu tiên bình luận!</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Footer: Actions & Comment Input */}
          <div className="border-t border-black/5 bg-white p-4 shrink-0">
            {/* Reaction Buttons */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => reactionMutation.mutate('like')}
                  className="flex items-center gap-1.5 active:scale-90 transition-transform group"
                >
                  <Heart className={`w-7 h-7 transition-colors ${getReaction(snap.reactions, 'like')?.userReacted ? 'fill-[#FF2D55] text-[#FF2D55]' : 'text-[#1d1d1f] group-hover:text-[#86868b]'}`} strokeWidth={1.5} />
                  <span className="text-[14px] font-bold text-[#1d1d1f]">{getReaction(snap.reactions, 'like')?.count || 0}</span>
                </button>

                <button
                  onClick={() => reactionMutation.mutate('helpful')}
                  className="flex items-center gap-1.5 active:scale-90 transition-transform group ml-2"
                >
                  <ThumbsUp className={`w-7 h-7 transition-colors ${getReaction(snap.reactions, 'helpful')?.userReacted ? 'fill-[#007AFF] text-[#007AFF]' : 'text-[#1d1d1f] group-hover:text-[#86868b]'}`} strokeWidth={1.5} />
                  <span className="text-[14px] font-bold text-[#1d1d1f]">{getReaction(snap.reactions, 'helpful')?.count || 0}</span>
                </button>

                {snap.condition === 'issue' && (
                  <button
                    onClick={() => reactionMutation.mutate('worry')}
                    className="flex items-center gap-1.5 active:scale-90 transition-transform group ml-2"
                  >
                    <AlertTriangle className={`w-7 h-7 transition-colors ${getReaction(snap.reactions, 'worry')?.userReacted ? 'fill-[#FF9500] text-[#FF9500]' : 'text-[#1d1d1f] group-hover:text-[#86868b]'}`} strokeWidth={1.5} />
                    <span className="text-[14px] font-bold text-[#1d1d1f]">{getReaction(snap.reactions, 'worry')?.count || 0}</span>
                  </button>
                )}
              </div>

              {/* Ask AI Mini Button */}
              <button
                onClick={() => navigate('/chat/active', { 
                  state: { 
                    initialMessage: 'Bạn có thể phân tích bức ảnh này giúp tôi được không?',
                    initialImage: resolveImageUrl(snap.imageUrl)
                  } 
                })}
                className="flex items-center gap-2 bg-[#34C759]/10 text-[#248A3D] hover:bg-[#34C759]/20 px-4 py-2 rounded-full font-bold text-[13px] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Hỏi AI
              </button>
            </div>

            {/* Comment Form */}
            <form onSubmit={submitComment} className="flex items-center gap-3">
              <input
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Thêm bình luận..."
                maxLength={500}
                className="flex-1 bg-[#f5f5f7] border border-transparent rounded-full px-5 py-3 text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:bg-white focus:border-[#007AFF]/30 focus:shadow-[0_0_0_4px_rgba(0,122,255,0.1)] focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!comment.trim() || commentMutation.isPending}
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all disabled:opacity-50 text-[#007AFF] hover:bg-[#007AFF]/10 active:scale-95 font-bold"
                aria-label="Gửi bình luận"
              >
                Đăng
              </button>
            </form>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}} />
    </div>
  );
};

export default SnapDetail;
