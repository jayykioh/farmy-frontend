import React from 'react';
import { PetMascot } from './PetMascot';
import { PET_MOOD_UI_MAP } from '../constants/petMood.constants';
import type { PetStatus } from '../types/pet.types';
import { Flame, Star, Warning, Confetti, Smiley, SmileyMeh, SmileySad, Bed, ForkKnife } from '@phosphor-icons/react';

interface PetStatusCardProps {
  status    : PetStatus;
  /** Show mascot (default true) */
  showMascot?: boolean;
  className?  : string;
}

/**
 * PetStatusCard — sidebar widget for Home page.
 * Displays mascot + mood label + streak + level + XP bar + bubble message.
 */
export const PetStatusCard: React.FC<PetStatusCardProps> = ({
  status,
  showMascot = true,
  className  = '',
}) => {
  const ui = PET_MOOD_UI_MAP[status.mood];
  const xpPercent = Math.min(100, (status.exp / (status.level * 100)) * 100);

  return (
    <div className={`pet-status-card ${className}`} role="region" aria-label="Trạng thái Bé Thóc">
      {/* Mascot */}
      {showMascot ? (<div className="pet-status-card__mascot">
        <PetMascot status={status} size={120} showBubble />
      </div>) : null}
      {/* Mood label */}
      <div className="pet-status-card__mood-row">
        <span className="pet-status-card__emoji flex items-center justify-center w-8 h-8 rounded-full bg-white/50 shadow-sm border border-border-main/50 text-text-main">
            {status.mood === 'excited' ? <Confetti className="w-5 h-5 text-yellow-500" weight="duotone" /> : null}
            {status.mood === 'happy' ? <Smiley className="w-5 h-5 text-green-500" weight="duotone" /> : null}
            {status.mood === 'neutral' ? <SmileyMeh className="w-5 h-5 text-gray-400" weight="duotone" /> : null}
            {status.mood === 'sad' ? <SmileySad className="w-5 h-5 text-blue-500" weight="duotone" /> : null}
            {status.mood === 'worried' ? <Warning className="w-5 h-5 text-orange-500" weight="duotone" /> : null}
            {status.mood === 'sleepy' ? <Bed className="w-5 h-5 text-purple-500" weight="duotone" /> : null}
            {status.mood === 'hungry' ? <ForkKnife className="w-5 h-5 text-amber-500" weight="duotone" /> : null}
        </span>
        <span className="pet-status-card__mood-label">{ui?.label}</span>
      </div>
      {/* Stats row */}
      <div className="pet-status-card__stats">
        <div className="pet-status-card__stat" aria-label={`Chuỗi ${status.streakCount} ngày`}>
          <span className="pet-status-card__stat-icon flex items-center justify-center w-6 h-6 rounded-full bg-orange-50/50"><Flame className="w-4 h-4 text-orange-500" weight="duotone" /></span>
          <span className="pet-status-card__stat-value">{status.streakCount}</span>
          <span className="pet-status-card__stat-label">ngày liên tiếp</span>
        </div>

        <div className="pet-status-card__stat" aria-label={`Cấp ${status.level}`}>
          <span className="pet-status-card__stat-icon flex items-center justify-center w-6 h-6 rounded-full bg-yellow-50/50"><Star className="w-4 h-4 text-yellow-500" weight="duotone" /></span>
          <span className="pet-status-card__stat-value">Cấp {status.level}</span>
        </div>
      </div>
      {/* XP bar */}
      <div className="pet-status-card__xp" aria-label={`${status.exp} / ${status.level * 100} XP`}>
        <div className="pet-status-card__xp-header">
          <span>XP</span>
          <span>{status.exp}/{status.level * 100}</span>
        </div>
        <div className="pet-status-card__xp-track" role="progressbar" aria-valuenow={status.exp} aria-valuemin={0} aria-valuemax={status.level * 100}>
          <div
            className="pet-status-card__xp-fill"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>
      {/* Missed days warning */}
      {status.missedDays > 0 ? (<p className="pet-status-card__missed-warning flex items-center gap-1 justify-center">
        <Warning className="w-4 h-4" weight="duotone" />Bé Thóc đã bỏ lỡ {status.missedDays}ngày...
                </p>) : null}
    </div>
  );
};
