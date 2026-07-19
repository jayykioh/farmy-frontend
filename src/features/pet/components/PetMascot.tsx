import React from 'react';
import { usePetMoodTransition } from '../hooks/usePetMoodTransition';
import { PetMoodBubble } from './PetMoodBubble';
import { PET_MOOD_UI_MAP } from '../constants/petMood.constants';
import { resolveAnchor, sortByLayer } from '../constants/equipmentSlots.constants';
import type { PetMood, PetStatus } from '../types/pet.types';
import { useShopItems } from '../../shop/hooks/useShop';

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
 * - Equipment items are rendered as absolute-positioned layers with anchor-based positioning.
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
  
  // Hydrate shop items to render equipment
  const { data: shopItems = [] } = useShopItems();

  const effectiveMood : PetMood = staticMood ?? transition.displayMood;
  const src           : string  = staticMood
    ? `/pet/${staticMood}.svg`
    : transition.animationSrc;
  const message       : string  = staticMood
    ? PET_MOOD_UI_MAP[staticMood]?.description
    : transition.moodMessage;

  const ui = PET_MOOD_UI_MAP[effectiveMood];

  // If parent passed details directly, use it.
  // Otherwise, use shopItems to hydrate the equippedItems string IDs.
  const rawItems = status?.equippedItemsDetails || 
    (status?.equippedItems ? shopItems.filter(i => status.equippedItems.includes(i._id)) : []);

  // Sort equipped items by z-index layer order for correct rendering
  const equippedItems = sortByLayer(rawItems);

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
        {/* Base pet image */}
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
          style={{ 
            userSelect: 'none', 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            position: 'relative',
            zIndex: 10 // Pet is layer 10
          }}
        />

        {/* Equipment layers — anchor-based physical positioning */}
        {equippedItems.map((item) => {
          const anchor = resolveAnchor(item);
          // If anchor.zIndex is 0 (BACKGROUND), it will be 0 < 10 (behind pet).
          // If anchor.zIndex is > 0 (OUTFIT, HAT), it will be > 10 (in front of pet).
          const itemZIndex = anchor.zIndex === 0 ? 0 : anchor.zIndex + 10;

          return (
            <div
              key={item._id}
              style={{
                position: 'absolute',
                top: anchor.top,
                left: anchor.left,
                width: anchor.width,
                transform: anchor.transform,
                zIndex: itemZIndex,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              <img
                src={item.image_url}
                alt={item.name}
                draggable={false}
                className="pet-equipment-item"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
