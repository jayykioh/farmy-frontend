import React from 'react';
import { usePetMoodTransition } from '../hooks/usePetMoodTransition';
import { PetMoodBubble } from './PetMoodBubble';
import { PET_MOOD_UI_MAP } from '../constants/petMood.constants';
import type { PetMood, PetStatus } from '../types/pet.types';

interface PetMascotProps {
  /** Live status from usePetStatus. If undefined, renders neutral skeleton. */
  status?      : PetStatus;
  /** Override mood (used in onboarding where mood is static, not from API) */
  staticMood?  : PetMood;
  /** Display size in px (default 160) */
  size?        : number;
  /** Show speech bubble (default false) */
  showBubble?  : boolean;
  /** Extra wrapper class */
  className?   : string;
}

/**
 * PetMascot — primary mascot renderer.
 *
 * - When `status` is provided: transitions between moods using usePetMoodTransition.
 * - When `staticMood` is provided (onboarding): renders that mood directly, no transition.
 * - FE never decides mood; it only renders what the backend/props dictate.
 */
export const PetMascot: React.FC<PetMascotProps> = ({
  status,
  staticMood,
  size      = 160,
  showBubble = false,
  className  = '',
}) => {
  // Transition hook — handles live backend mood changes
  const transition = usePetMoodTransition(staticMood ? undefined : status);

  const effectiveMood : PetMood = staticMood ?? transition.displayMood;
  const src           : string  = staticMood
    ? `/pet/${staticMood}.svg`
    : transition.animationSrc;
  const message       : string  = staticMood
    ? PET_MOOD_UI_MAP[staticMood]?.description
    : transition.moodMessage;

  const ui = PET_MOOD_UI_MAP[effectiveMood];

  return (
    <div
      className={`pet-mascot-wrapper ${className}`}
      style={{ position: 'relative', width: size, display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {showBubble && message ? (<PetMoodBubble
        mood={effectiveMood}
        message={message}
        className="pet-mascot-wrapper__bubble"
      />) : null}
      
      <div style={{ position: 'relative', width: size, height: size }}>
        <img
          src={src}
          alt={`Bé Thóc đang ${ui?.label ?? 'trung lập'}`}
          aria-label={ui?.description}
          width={size}
          height={size}
          draggable={false}
          className={[
            'pet-mascot-img',
            transition.isTransitioning && !staticMood ? 'pet-mascot-img--transitioning' : '',
          ].join(' ').trim()}
          style={{ userSelect: 'none', width: '100%', height: '100%', objectFit: 'contain' }}
        />

        {/* Real Physical Equipping Logic */}
        {status?.equippedItemsDetails?.map((item) => {
          const isGlasses = item.name.toLowerCase().includes('kính') || item._id.includes('kinh');
          
          // Custom styles depending on item type
          const itemStyle: React.CSSProperties = isGlasses
            ? {
                position: 'absolute',
                top: '32%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50%',
                height: 'auto',
                pointerEvents: 'none',
                zIndex: 11,
              }
            : {
                position: 'absolute',
                top: '-18%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: 'auto',
                pointerEvents: 'none',
                zIndex: 10,
              };

          return (
            <img
              key={item._id}
              src={item.image_url}
              alt={item.name}
              style={itemStyle}
            />
          );
        })}
      </div>
    </div>
  );
};
