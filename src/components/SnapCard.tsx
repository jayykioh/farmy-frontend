import React from "react";
import type { FarmSnap, SnapReactionType } from "../types/farmSnap";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ThumbsUp,
  AlertTriangle,
  MessageSquare,
  Leaf,
  Wheat,
  Sprout,
} from "lucide-react";
import { resolveImageUrl } from "../utils/url";
import { motion } from "framer-motion";

interface SnapCardProps {
  snap: FarmSnap;
  onClick?: () => void;
  mini?: boolean;
  onReact?: (type: SnapReactionType) => void;
}

export const SnapCard: React.FC<SnapCardProps> = ({
  snap,
  onClick,
  mini = false,
  onReact,
}) => {
  const navigate = useNavigate();

  const handleAiClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/chat/active", {
      state: {
        initialMessage: "Bạn có thể phân tích bức ảnh này giúp tôi được không?",
        initialImage: resolveImageUrl(snap.imageUrl),
      },
    });
  };

  const getConditionColor = () => {
    switch (snap.condition) {
      case "healthy":
        return "bg-green-500 text-white";
      case "issue":
        return "bg-yellow-500 text-white";
      case "harvest":
        return "bg-amber-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getConditionLabel = () => {
    switch (snap.condition) {
      case "healthy":
        return (
          <span className="flex items-center gap-1">
            <Leaf className="w-3 h-3" /> Khỏe
          </span>
        );
      case "issue":
        return (
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Vấn đề
          </span>
        );
      case "harvest":
        return (
          <span className="flex items-center gap-1">
            <Wheat className="w-3 h-3" /> Thu hoạch
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1">
            <Sprout className="w-3 h-3" /> Khác
          </span>
        );
    }
  };

  const [now] = React.useState(() => Date.now());

  // Format relative time (mock logic)
  const getRelativeTime = () => {
    const hours = Math.round(
      (now - new Date(snap.capturedAt).getTime()) / (1000 * 60 * 60),
    );
    if (hours < 1) return "Vừa xong";
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  const handleReact = (e: React.MouseEvent, type: SnapReactionType) => {
    e.stopPropagation();
    onReact?.(type);
  };

  if (mini) {
    return (
      <motion.div
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className="w-[160px] h-[240px] rounded-[28px] overflow-hidden relative cursor-pointer flex-shrink-0 snap-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/[0.04]"
      >
        <img
          src={resolveImageUrl(snap.imageUrl)}
          alt={snap.cropType}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=400&auto=format&fit=crop";
          }}
        />

        {/* Top Pills */}
        <div className="absolute top-3 left-3 flex gap-1">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm border border-white/20 ${getConditionColor()}`}
          >
            {getConditionLabel()}
          </span>
        </div>

        {/* Bottom Frosted Glass Info */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 p-3 bg-black/40 backdrop-blur-xl rounded-[20px] border border-white/20 shadow-lg">
          <p className="text-white text-[11.5px] font-bold line-clamp-2 leading-tight mb-1.5 drop-shadow-sm">
            {snap.caption || `Ảnh ${snap.cropType} của ${snap.userName}`}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-[9.5px] font-extrabold tracking-wide uppercase">
              {getRelativeTime()}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-white text-[10px] font-bold flex items-center gap-1">
                <Heart className="w-3 h-3 fill-white" />
                {snap.reactions.reduce((sum, r) => sum + r.count, 0)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="w-full aspect-[4/5] rounded-[24px] overflow-hidden relative cursor-pointer shadow-sm border border-border-main/20 mb-4 hover:shadow-md transition-shadow group"
    >
      <img
        src={resolveImageUrl(snap.imageUrl)}
        alt={snap.cropType}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=800&auto=format&fit=crop";
        }}
      />
      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-4 flex gap-2 justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex gap-2">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/20">
            <Wheat className="w-3.5 h-3.5" /> {snap.cropType}
          </span>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 ${getConditionColor()}`}
          >
            {getConditionLabel()}
          </span>
        </div>
      </div>
      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        {/* Caption */}
        {snap.caption ? (
          <p className="text-white text-sm md:text-base font-bold line-clamp-2 mb-2 leading-snug drop-shadow-md">
            {snap.caption}
          </p>
        ) : null}

        {/* User & Meta */}
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2">
            <img
              src={snap.userAvatar}
              alt={snap.userName}
              className="w-6 h-6 rounded-full border border-white/20"
            />
            <div className="flex flex-col">
              <span className="text-white text-xs font-bold drop-shadow-md">
                {snap.userName}
              </span>
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
              onClick={(e) => handleReact(e, "like")}
              className="flex items-center gap-1.5 text-white/95 hover:text-white active:scale-90 transition-transform"
              aria-label="Like Snap"
            >
              <Heart
                className={`w-4 h-4 ${snap.reactions.find((r) => r.type === "like")?.userReacted ? "fill-red-500 text-red-500" : "text-white"}`}
              />
              <span className="text-xs font-extrabold">
                {snap.reactions.find((r) => r.type === "like")?.count || 0}
              </span>
            </button>
            <button
              onClick={(e) => handleReact(e, "helpful")}
              className="flex items-center gap-1.5 text-white/95 hover:text-white active:scale-90 transition-transform"
              aria-label="Mark helpful"
            >
              <ThumbsUp
                className={`w-4 h-4 ${snap.reactions.find((r) => r.type === "helpful")?.userReacted ? "fill-primary-light text-primary-light" : "text-white"}`}
              />
              <span className="text-xs font-extrabold">
                {snap.reactions.find((r) => r.type === "helpful")?.count || 0}
              </span>
            </button>
            {snap.condition === "issue" ? (
              <button
                onClick={(e) => handleReact(e, "worry")}
                className="flex items-center gap-1.5 text-white/95 hover:text-white active:scale-90 transition-transform"
                aria-label="Worry about issue"
              >
                <AlertTriangle
                  className={`w-4 h-4 ${snap.reactions.find((r) => r.type === "worry")?.userReacted ? "fill-amber-500 text-amber-500" : "text-white"}`}
                />
                <span className="text-xs font-extrabold">
                  {snap.reactions.find((r) => r.type === "worry")?.count || 0}
                </span>
              </button>
            ) : null}
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
