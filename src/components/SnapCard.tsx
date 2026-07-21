import React from "react";
import type { FarmSnap, SnapReactionType } from "../types/farmSnap";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ThumbsUp,
  Warning,
  ChatCircleText,
  Leaf,
  Grains as Wheat,
  Plant,
} from "@phosphor-icons/react";
import { resolveImageUrl } from "../utils/url";
import { motion } from "framer-motion";

interface SnapCardProps {
  snap: FarmSnap;
  onClick?: () => void;
  mini?: boolean;
  onReact?: (type: SnapReactionType) => void;
}

const conditionConfig: Record<string, { label: string; bg: string; dot: string }> = {
  healthy: { label: "Khỏe",      bg: "bg-emerald-500/90 text-white",  dot: "bg-emerald-400" },
  issue:   { label: "Vấn đề",    bg: "bg-amber-500/90 text-white",    dot: "bg-amber-400" },
  harvest: { label: "Thu hoạch", bg: "bg-orange-500/90 text-white",   dot: "bg-orange-400" },
};

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

  const cond = conditionConfig[snap.condition] ?? { label: "Khác", bg: "bg-gray-500/90 text-white", dot: "bg-gray-400" };

  const [now] = React.useState(() => Date.now());
  const getRelativeTime = () => {
    const mins = Math.round((now - new Date(snap.capturedAt).getTime()) / 60000);
    if (mins < 1) return "Vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    return `${Math.floor(hrs / 24)} ngày trước`;
  };

  const totalReactions = snap.reactions.reduce((s, r) => s + r.count, 0);
  const handleReact = (e: React.MouseEvent, type: SnapReactionType) => {
    e.stopPropagation();
    onReact?.(type);
  };

  /* ─── MINI card (Home page horizontal scroll) ─── */
  if (mini) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className="w-[148px] flex-shrink-0 snap-center cursor-pointer group"
        style={{ willChange: "transform" }}
      >
        {/* Photo */}
        <div className="relative w-full h-[196px] rounded-[22px] overflow-hidden shadow-[0_8px_28px_rgba(0,0,0,0.12)] border-2 border-white">
          <img
            src={resolveImageUrl(snap.imageUrl)}
            alt={snap.cropType}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=400&auto=format&fit=crop";
            }}
          />

          {/* Top: condition badge */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black backdrop-blur-md shadow-sm ${cond.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cond.dot} inline-block`} />
              {cond.label}
            </span>
          </div>

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Caption */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5">
            <p className="text-white text-[11px] font-bold leading-tight line-clamp-2 drop-shadow-md mb-1.5">
              {snap.caption || `Ảnh ${snap.cropType}`}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white/75 text-[9px] font-bold tracking-wide uppercase">
                {getRelativeTime()}
              </span>
              <span className="flex items-center gap-0.5 text-white/90 text-[10px] font-bold">
                <Heart size={10} weight="duotone" className="text-red-400" />
                {totalReactions}
              </span>
            </div>
          </div>
        </div>

        {/* Below-card: user info */}
        <div className="flex items-center gap-2 mt-2 px-0.5">
          <img
            src={snap.userAvatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${snap.userId}`}
            alt={snap.userName}
            className="w-5 h-5 rounded-full border border-[var(--color-border-main)] shrink-0"
            onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/9.x/thumbs/svg?seed=${snap.userId}`; }}
          />
          <span className="text-[11px] font-bold text-[var(--color-ink-2)] truncate">{snap.userName}</span>
        </div>
      </motion.div>
    );
  }

  /* ─── FULL card (Farm Feed page) ─── */
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
      <div className="absolute top-0 left-0 right-0 p-4 flex gap-2 justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex gap-2">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/20">
            <Wheat size={14} weight="duotone" /> {snap.cropType}
          </span>
          <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 ${cond.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cond.dot} inline-block`} />
            {cond.label}
          </span>
        </div>
      </div>

      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        {snap.caption && (
          <p className="text-white text-sm md:text-base font-bold line-clamp-2 mb-2 leading-snug drop-shadow-md">
            {snap.caption}
          </p>
        )}
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2">
            <img
              src={snap.userAvatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${snap.userId}`}
              alt={snap.userName}
              className="w-6 h-6 rounded-full border border-white/20"
            />
            <div className="flex flex-col">
              <span className="text-white text-xs font-bold drop-shadow-md">{snap.userName}</span>
              <span className="text-white/70 text-[10px] font-medium">
                {snap.location?.province} • {getRelativeTime()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex items-center gap-3">
            <button onClick={(e) => handleReact(e, "like")} className="flex items-center gap-1.5 text-white/95 hover:text-white active:scale-95 transition-transform" aria-label="Like">
              <Heart size={16} weight={snap.reactions.find((r) => r.type === "like")?.userReacted ? "bold" : "duotone"} className={snap.reactions.find((r) => r.type === "like")?.userReacted ? "text-red-400" : ""} />
              <span className="text-xs font-extrabold">{snap.reactions.find((r) => r.type === "like")?.count || 0}</span>
            </button>
            <button onClick={(e) => handleReact(e, "helpful")} className="flex items-center gap-1.5 text-white/95 hover:text-white active:scale-95 transition-transform" aria-label="Helpful">
              <ThumbsUp size={16} weight={snap.reactions.find((r) => r.type === "helpful")?.userReacted ? "bold" : "duotone"} />
              <span className="text-xs font-extrabold">{snap.reactions.find((r) => r.type === "helpful")?.count || 0}</span>
            </button>
            {snap.condition === "issue" && (
              <button onClick={(e) => handleReact(e, "worry")} className="flex items-center gap-1.5 text-white/95 hover:text-white active:scale-95 transition-transform" aria-label="Worry">
                <Warning size={16} weight={snap.reactions.find((r) => r.type === "worry")?.userReacted ? "bold" : "duotone"} className={snap.reactions.find((r) => r.type === "worry")?.userReacted ? "text-amber-400" : ""} />
                <span className="text-xs font-extrabold">{snap.reactions.find((r) => r.type === "worry")?.count || 0}</span>
              </button>
            )}
          </div>
          <button onClick={handleAiClick} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-all">
            <ChatCircleText size={14} weight="duotone" className="text-emerald-300" />
            Hỏi AI
          </button>
        </div>
      </div>
    </div>
  );
};
