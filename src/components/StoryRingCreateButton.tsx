/* Hallmark · component: story-ring-create · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46–50)
 */

import React from 'react';
import { Plus } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

interface StoryRingCreateButtonProps {
  onClick: () => void;
}

export const StoryRingCreateButton: React.FC<StoryRingCreateButtonProps> = ({ onClick }) => {
  const { user } = useAuthStore();
  const avatarSrc = `https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.id ?? 'me'}`;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
      aria-label="Đăng Farm Snap mới"
    >
      {/* Ring + Avatar wrapper */}
      <div className="relative">
        {/* Animated gradient ring */}
        <div className="w-[68px] h-[68px] rounded-full p-[3px] bg-gradient-to-br from-[#008A5E] via-[#FFC000] to-[#008A5E] group-hover:from-[#FFC000] group-hover:to-[#008A5E] transition-all duration-500 animate-[spin_4s_linear_infinite]">
          <div className="w-full h-full rounded-full bg-bg-main p-[2px]">
            <img
              src={avatarSrc}
              alt={user?.name ?? 'Bạn'}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/9.x/thumbs/svg?seed=me`; }}
            />
          </div>
        </div>

        {/* Plus badge */}
        <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#008A5E] rounded-full border-2 border-bg-main flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <Plus className="w-3.5 h-3.5 text-white" weight="bold" />
        </div>
      </div>

      <span className="text-[11px] font-black text-text-secondary group-hover:text-[#008A5E] transition-colors tracking-wide">
        Đăng ảnh
      </span>
    </motion.button>
  );
};

export default StoryRingCreateButton;
