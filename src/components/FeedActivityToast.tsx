/* Hallmark · component: feed-activity-toast · genre: playful · theme: Hum
 * states: default · enter · exit
 * contrast: pass (46–50)
 */

import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Heart, Camera, ChatText, Leaf } from '@phosphor-icons/react';
import type { FarmSnap } from '../types/farmSnap';

interface FeedActivityToastProps {
  snaps: FarmSnap[];
}

const TOAST_INTERVAL_MS = 22000; // ~22 seconds between toasts

const activities = [
  {
    icon: <Camera className="w-4 h-4 text-[#008A5E]" weight="duotone" />,
    template: (name: string) => `${name} vừa đăng Farm Snap mới! 🌾`,
    bg: 'from-emerald-50 to-white border-emerald-200',
    dot: 'bg-emerald-400',
  },
  {
    icon: <Heart className="w-4 h-4 text-red-500" weight="duotone" />,
    template: (name: string) => `${name} vừa thích ảnh của cộng đồng ❤️`,
    bg: 'from-red-50 to-white border-red-200',
    dot: 'bg-red-400',
  },
  {
    icon: <ChatText className="w-4 h-4 text-blue-500" weight="duotone" />,
    template: (name: string) => `${name} đã bình luận: "Cây này đẹp quá!" 💬`,
    bg: 'from-blue-50 to-white border-blue-200',
    dot: 'bg-blue-400',
  },
  {
    icon: <Leaf className="w-4 h-4 text-emerald-600" weight="duotone" />,
    template: (name: string) => `${name} vừa chia sẻ mùa thu hoạch! 🌿`,
    bg: 'from-green-50 to-white border-green-200',
    dot: 'bg-green-400',
  },
];

const showActivityToast = (snap: FarmSnap) => {
  const activity = activities[Math.floor(Math.random() * activities.length)];
  const name = snap.userName?.split(' ').slice(-2).join(' ') ?? 'Nông dân';

  toast.custom(
    (t) => (
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-gradient-to-r shadow-lg max-w-xs transition-all duration-300 ${
          t.visible ? 'animate-[slideInUp_0.3s_ease-out]' : 'animate-[fadeOut_0.3s_ease-in]'
        } ${activity.bg}`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {/* Live dot */}
        <div className="relative flex-shrink-0">
          <div className={`w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm`}>
            <img
              src={snap.userAvatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${snap.userId}`}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/9.x/thumbs/svg?seed=${snap.userId}`;
              }}
            />
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${activity.dot} border-2 border-white`} />
        </div>
        {/* Text */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black text-gray-800 leading-tight truncate">
            {activity.template(name)}
          </span>
          <span className="text-[10px] font-bold text-gray-500 mt-0.5">Vừa xong</span>
        </div>
        {/* Icon */}
        <div className="flex-shrink-0 ml-auto">
          {activity.icon}
        </div>
      </div>
    ),
    {
      duration: 4000,
      position: 'bottom-right',
    },
  );
};

/**
 * FeedActivityToast — mounts silently, fires live-feeling toasts
 * based on real feed data at random intervals.
 */
export const FeedActivityToast: React.FC<FeedActivityToastProps> = ({ snaps }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!snaps || snaps.length === 0) return;

    const scheduleNext = () => {
      // Randomize interval: 15–30s
      const jitter = Math.random() * 15000;
      timerRef.current = setTimeout(() => {
        const snap = snaps[Math.floor(Math.random() * snaps.length)];
        showActivityToast(snap);
        scheduleNext();
      }, TOAST_INTERVAL_MS + jitter);
    };

    // Fire the first one after 5s (feels "live" without being immediately annoying)
    if (!firedRef.current) {
      firedRef.current = true;
      timerRef.current = setTimeout(() => {
        const snap = snaps[Math.floor(Math.random() * snaps.length)];
        showActivityToast(snap);
        scheduleNext();
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [snaps]);

  return null; // Renders nothing — toasts via react-hot-toast portal
};

export default FeedActivityToast;
