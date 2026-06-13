import React from 'react';
import type { PetMood } from '../types/pet.types';
import { PET_MOOD_UI_MAP } from '../constants/petMood.constants';

interface PetMoodBubbleProps {
  mood    : PetMood;
  message : string;
  /** Optional extra class for positioning */
  className?: string;
}

/**
 * Speech bubble that floats above the mascot.
 * Animates in whenever `mood` changes via a CSS keyframe.
 */
export const PetMoodBubble: React.FC<PetMoodBubbleProps> = ({
  mood,
  message,
  className = '',
}) => {
  const ui = PET_MOOD_UI_MAP[mood];

  return (
    <div
      key={mood} // re-mount on mood change triggers animation
      className={`pet-mood-bubble ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="pet-mood-bubble__emoji">{ui.emoji}</span>
      <p className="pet-mood-bubble__text">{message}</p>
      {/* Bubble tail */}
      <span className="pet-mood-bubble__tail" aria-hidden="true" />
    </div>
  );
};
