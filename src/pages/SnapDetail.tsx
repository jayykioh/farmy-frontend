 
/* Hallmark · page: snap-detail · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ThumbsUp,
  Warning,
  ChatText,
  CaretLeft,
  DotsThreeVertical,
  Leaf,
  Plant,
  Grains,
  Trash,
  NotePencil,
  Archive,
  ShareNetwork,
  UserPlus,
} from '@phosphor-icons/react';
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
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [reactedType, setReactedType] = useState<SnapReactionType | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore();
  const MAX_COMMENT = 500;

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
      <div className="w-full min-h-[100svh] bg-bg-main flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-border-main border-t-[#008A5E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!snap) {
    return (
      <div className="w-full min-h-[100svh] bg-bg-main text-text-main flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black mb-6 tracking-tight">Không tìm thấy khoảnh khắc Snap</h2>
        <button 
          onClick={() => navigate('/farm-feed')}
          className="btn btn--cyan font-extrabold px-6 py-3 cursor-pointer"
        >
          Quay lại Bản tin
        </button>
      </div>
    );
  }

  const getConditionColor = () => {
    switch (snap.condition) {
      case 'healthy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'issue':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'harvest':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-bg-surface-2 text-text-secondary border-border-main';
    }
  };

  const getConditionLabel = () => {
    switch (snap.condition) {
      case 'healthy':
        return <><Leaf className="w-3.5 h-3.5" weight="duotone" /> Khỏe mạnh</>;
      case 'issue':
        return <><Warning className="w-3.5 h-3.5" weight="duotone" /> Cần chú ý</>;
      case 'harvest':
        return <><Grains className="w-3.5 h-3.5" weight="duotone" /> Bội thu</>;
      default:
        return <><Plant className="w-3.5 h-3.5" weight="duotone" /> Khác</>;
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

  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitComment(e as unknown as React.FormEvent);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: snap?.caption ?? 'Farm Snap',
          text: `Xem Farm Snap từ ${snap?.userName ?? 'nông dân'} trên FarmDiaries!`,
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Đã sao chép liên kết!');
    }
  };

  const handleReaction = (type: SnapReactionType) => {
    setReactedType(type);
    reactionMutation.mutate(type);
    setTimeout(() => setReactedType(null), 400);
  };

  return (
    <div className="w-full min-h-[100svh] bg-bg-main flex items-center justify-center font-sans md:p-6 lg:p-10 text-left">
      
      {/* Mobile Back Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="btn btn--cyan !p-0 w-10 h-10 flex items-center justify-center rounded-full shadow-lg active:scale-95"
          aria-label="Quay lại"
        >
          <CaretLeft className="w-5 h-5 text-white" weight="bold" />
        </button>
      </div>

      <div className="w-full max-w-6xl md:h-[85vh] md:max-h-[900px] card-bubble bg-white md:rounded-[36px] overflow-hidden flex flex-col md:flex-row relative shadow-xl border-2 border-border-main">
        
        {/* LEFT PANEL: Media View */}
        <div className="w-full md:w-[55%] lg:w-[60%] h-[55svh] md:h-full relative bg-slate-950 flex flex-col border-b-2 md:border-b-0 md:border-r-2 border-border-main">
          {/* Desktop Back Button */}
          <div className="hidden md:flex absolute top-6 left-6 z-30">
            <button
              onClick={() => navigate(-1)}
              className="btn btn--cyan !p-0 w-10 h-10 flex items-center justify-center rounded-full shadow-lg cursor-pointer active:scale-95"
              aria-label="Quay lại"
            >
              <CaretLeft className="w-5 h-5 text-white" weight="bold" />
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
          <div className="flex items-center justify-between p-4 border-b-2 border-border-main shrink-0 bg-white z-10 sticky top-0">
            <div className="flex items-center gap-3">
              <img
                src={snap.userAvatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${snap.userId}`}
                alt={snap.userName}
                className="w-11 h-11 rounded-full border-2 border-border-main object-cover"
              />
              <div className="flex flex-col">
                <span className="text-text-h text-base font-extrabold tracking-tight">
                  {snap.userName}
                </span>
                <span className="text-text-secondary text-xs font-bold">
                  {snap.location?.province || 'Nông trại'} • {getRelativeTime(snap.capturedAt)}
                </span>
              </div>
              {/* Follow button — shown for other people's snaps */}
              {snap.userId !== user?.id && (
                <button className="ml-1 flex items-center gap-1 text-[#008A5E] border border-[#008A5E] rounded-full px-3 py-1 text-xs font-extrabold hover:bg-[#008A5E] hover:text-white transition-all cursor-pointer active:scale-95">
                  <UserPlus size={12} weight="bold" />
                  Theo dõi
                </button>
              )}
            </div>

            {snap.userId === user?.id && (
              <div className="relative">
                <button 
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-bg-surface-2 transition-colors cursor-pointer border border-border-main/50 active:scale-95"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <DotsThreeVertical className="w-5 h-5 text-text-main" weight="bold" />
                </button>
                
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 card-bubble bg-white rounded-2xl shadow-xl border-2 border-border-main z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="py-1">
                        <button
                          className="w-full px-4 py-3 text-left text-sm font-bold text-text-main hover:bg-bg-surface-2 flex items-center gap-3 transition-colors cursor-pointer active:scale-95"
                          onClick={() => { setShowDropdown(false); toast('Chức năng chỉnh sửa đang phát triển', { icon: 'ℹ️' }); }}
                        >
                          <NotePencil className="w-4 h-4 text-text-secondary" weight="duotone" />
                          <span>Chỉnh sửa</span>
                        </button>
                        <button
                          className="w-full px-4 py-3 text-left text-sm font-bold text-text-main hover:bg-bg-surface-2 flex items-center gap-3 transition-colors cursor-pointer active:scale-95"
                          onClick={() => { setShowDropdown(false); toast('Chức năng lưu trữ đang phát triển', { icon: 'ℹ️' }); }}
                        >
                          <Archive className="w-4 h-4 text-text-secondary" weight="duotone" />
                          <span>Lưu trữ ảnh</span>
                        </button>
                        <div className="h-0.5 bg-border-main/40 my-1" />
                        <button
                          className="w-full px-4 py-3 text-left text-sm font-black text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors cursor-pointer active:scale-95"
                          onClick={() => {
                            setShowDropdown(false);
                            if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) deleteMutation.mutate();
                          }}
                        >
                          <Trash className="w-4 h-4 text-red-600" weight="duotone" />
                          <span>Xóa bài đăng</span>
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
                <span className="flex items-center gap-1.5 bg-bg-surface-2 px-3 py-1 rounded-full text-xs font-black uppercase border border-border-main text-text-main">
                  <Grains className="w-3.5 h-3.5 text-amber-600" weight="duotone" /> {snap.cropType}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase border ${getConditionColor()}`}>
                  {getConditionLabel()}
                </span>
              </div>
              {snap.caption && (
                <div>
                  <p className={`text-text-main text-sm font-medium leading-relaxed ${!captionExpanded ? 'line-clamp-3' : ''}`}>
                    <span className="font-extrabold mr-2 text-text-h">{snap.userName}</span>
                    {snap.caption}
                  </p>
                  {snap.caption.length > 120 && (
                    <button
                      onClick={() => setCaptionExpanded(!captionExpanded)}
                      className="text-xs font-bold text-text-secondary mt-1 hover:text-text-main cursor-pointer"
                    >
                      {captionExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="h-0.5 w-full bg-border-main/40 my-1" />

            {/* Comments List */}
            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {(snap.comments && snap.comments.length > 0) ? (
                  snap.comments.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="flex gap-3"
                    >
                      <img
                        src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${item.userId ?? item.userName}`}
                        alt={item.userName}
                        className="w-8 h-8 rounded-full border border-border-main flex-shrink-0 bg-bg-surface-2 object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="flex flex-col">
                        <p className="text-sm leading-snug">
                          <span className="font-extrabold text-text-h mr-2">{item.userName}</span>
                          <span className="text-text-main font-medium">{item.content}</span>
                        </p>
                        <span className="text-[11px] font-bold text-text-secondary mt-1">{getRelativeTime(item.createdAt)}</span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-text-secondary"
                  >
                    <ChatText className="w-8 h-8 mb-2 opacity-40" weight="duotone" />
                    <p className="text-sm font-extrabold text-text-h">Chưa có bình luận nào.</p>
                    <p className="text-xs font-bold mt-0.5">Hãy là người đầu tiên để lại ý kiến! 💬</p>
                    <button
                      onClick={() => commentInputRef.current?.focus()}
                      className="mt-3 text-xs font-black text-[#008A5E] hover:underline cursor-pointer"
                    >
                      Thêm bình luận ngay →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Footer: Actions & Comment Input */}
          <div className="border-t-2 border-border-main bg-white p-4 shrink-0">
            {/* Reaction Buttons Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-5">
                {/* Like */}
                <motion.button
                  onClick={() => handleReaction('like')}
                  animate={reactedType === 'like' ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className="flex items-center gap-1.5 cursor-pointer group"
                >
                  <Heart
                    className={`w-7 h-7 transition-colors ${getReaction(snap.reactions, 'like')?.userReacted ? 'text-red-500' : 'text-text-main group-hover:text-red-500'}`}
                    weight={getReaction(snap.reactions, 'like')?.userReacted ? 'fill' : 'duotone'}
                  />
                  <span className="text-sm font-black text-text-h">{getReaction(snap.reactions, 'like')?.count || 0}</span>
                </motion.button>

                {/* Helpful */}
                <motion.button
                  onClick={() => handleReaction('helpful')}
                  animate={reactedType === 'helpful' ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className="flex items-center gap-1.5 cursor-pointer group"
                >
                  <ThumbsUp
                    className={`w-7 h-7 transition-colors ${getReaction(snap.reactions, 'helpful')?.userReacted ? 'text-blue-500' : 'text-text-main group-hover:text-blue-500'}`}
                    weight={getReaction(snap.reactions, 'helpful')?.userReacted ? 'fill' : 'duotone'}
                  />
                  <span className="text-sm font-black text-text-h">{getReaction(snap.reactions, 'helpful')?.count || 0}</span>
                </motion.button>

                {/* Worry — issue snaps only */}
                {snap.condition === 'issue' && (
                  <motion.button
                    onClick={() => handleReaction('worry')}
                    animate={reactedType === 'worry' ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                    className="flex items-center gap-1.5 cursor-pointer group"
                  >
                    <Warning
                      className={`w-7 h-7 transition-colors ${getReaction(snap.reactions, 'worry')?.userReacted ? 'text-amber-500' : 'text-text-main group-hover:text-amber-500'}`}
                      weight={getReaction(snap.reactions, 'worry')?.userReacted ? 'fill' : 'duotone'}
                    />
                    <span className="text-sm font-black text-text-h">{getReaction(snap.reactions, 'worry')?.count || 0}</span>
                  </motion.button>
                )}
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                {/* Share */}
                <button
                  onClick={handleShare}
                  className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-border-main hover:bg-bg-surface-1 transition-colors cursor-pointer active:scale-95"
                  aria-label="Chia sẻ"
                >
                  <ShareNetwork className="w-5 h-5 text-text-secondary" weight="duotone" />
                </button>
                {/* Ask AI */}
                <button
                  onClick={() => navigate('/chat/active', {
                    state: {
                      initialMessage: 'Bạn có thể phân tích bức ảnh này giúp tôi được không?',
                      initialImage: resolveImageUrl(snap.imageUrl)
                    }
                  })}
                  className="btn btn--cyan font-extrabold text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                >
                  <ChatText className="w-3.5 h-3.5" weight="bold" />
                  Hỏi AI
                </button>
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={submitComment} className="flex flex-col gap-1.5">
              <div className="flex items-end gap-2">
                <div className="relative flex-1">
                  <textarea
                    ref={commentInputRef}
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
                    onKeyDown={handleCommentKeyDown}
                    placeholder="Thêm bình luận... (Enter để gửi)"
                    rows={1}
                    className="w-full bg-bg-surface-1 border-2 border-border-main rounded-2xl px-4 py-2.5 text-sm text-text-main font-bold placeholder:text-text-secondary/60 focus:bg-white focus:border-[#008A5E] focus:outline-none transition-all resize-none leading-relaxed"
                    style={{ minHeight: '42px', maxHeight: '96px' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!comment.trim() || commentMutation.isPending}
                  className="btn btn--cyan px-4 py-2.5 rounded-full font-black text-sm cursor-pointer disabled:opacity-50 active:scale-95 flex-shrink-0"
                  aria-label="Gửi bình luận"
                >
                  {commentMutation.isPending ? '...' : 'Đăng'}
                </button>
              </div>
              {comment.length > 0 && (
                <span className={`text-[11px] font-bold text-right pr-1 ${
                  comment.length > MAX_COMMENT * 0.9 ? 'text-amber-500' : 'text-text-secondary'
                }`}>
                  {comment.length}/{MAX_COMMENT}
                </span>
              )}
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
          background: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}} />
    </div>
  );
};

export default SnapDetail;
