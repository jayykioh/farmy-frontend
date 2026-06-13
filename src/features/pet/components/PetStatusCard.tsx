import React from 'react';
import { PetMascot } from './PetMascot';
import { PET_MOOD_UI_MAP } from '../constants/petMood.constants';
import type { PetStatus } from '../types/pet.types';

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
      {showMascot && (
        <div className="pet-status-card__mascot">
          <PetMascot status={status} size={120} showBubble />
        </div>
      )}

      {/* Mood label */}
      <div className="pet-status-card__mood-row">
        <span className="pet-status-card__emoji">{ui?.emoji}</span>
        <span className="pet-status-card__mood-label">{ui?.label}</span>
      </div>

      {/* Stats row */}
      <div className="pet-status-card__stats">
        <div className="pet-status-card__stat" aria-label={`Chuỗi ${status.streakCount} ngày`}>
          <span className="pet-status-card__stat-icon">🔥</span>
          <span className="pet-status-card__stat-value">{status.streakCount}</span>
          <span className="pet-status-card__stat-label">ngày liên tiếp</span>
        </div>

        <div className="pet-status-card__stat" aria-label={`Cấp ${status.level}`}>
          <span className="pet-status-card__stat-icon">⭐</span>
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
      {status.missedDays > 0 && (
        <p className="pet-status-card__missed-warning">
          ⚠️ Bé Thóc đã bỏ lỡ {status.missedDays} ngày...
        </p>
      )}
    </div>
  );
};
