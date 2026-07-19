import type { ShopItem } from '../../../api/shop';

// ─── Equipment Slot System ────────────────────────────────────────────────────
// Each category maps to a visual layer on the pet mascot.
// Items are rendered as absolute-positioned <img> elements on top of the pet.
// Z-index determines layer order: BACKGROUND(0) → ... → EFFECT(5).

export type EquipmentSlot = 'HAT' | 'OUTFIT' | 'GLASSES' | 'ACCESSORY' | 'EFFECT' | 'BACKGROUND';

export interface AnchorConfig {
  top: string;
  left: string;
  width: string;
  transform: string;
  zIndex: number;
}

/**
 * Default anchor positions per equipment slot.
 *
 * Based on the pet SVG viewBox (0 0 100 120):
 *   - Sprout tip: y ≈ 3–12
 *   - Body top: y ≈ 12
 *   - Eyes: y ≈ 60
 *   - Body bottom: y ≈ 96
 *   - Feet: y ≈ 107
 *
 * Percentages are relative to the pet wrapper container.
 */
export const SLOT_DEFAULT_ANCHORS: Record<EquipmentSlot, AnchorConfig> = {
  BACKGROUND: {
    top: '0',
    left: '0',
    width: '100%',
    transform: 'none',
    zIndex: 0,
  },
  OUTFIT: {
    top: '55%',
    left: '50%',
    width: '75%',
    transform: 'translateX(-50%)',
    zIndex: 1,
  },
  HAT: {
    top: '-15%',
    left: '50%',
    width: '70%',
    transform: 'translateX(-50%)',
    zIndex: 2,
  },
  GLASSES: {
    top: '32%',
    left: '50%',
    width: '45%',
    transform: 'translateX(-50%)',
    zIndex: 3,
  },
  ACCESSORY: {
    top: '60%',
    left: '75%',
    width: '35%',
    transform: 'translateX(-50%)',
    zIndex: 4,
  },
  EFFECT: {
    top: '0',
    left: '0',
    width: '100%',
    transform: 'none',
    zIndex: 5,
  },
};

/**
 * Resolves the final anchor config for an equipped item.
 * Priority: item-level anchor override → category default → HAT fallback.
 */
export function resolveAnchor(
  item: { _id?: string; name?: string; category: string; anchor?: Partial<AnchorConfig> },
): AnchorConfig {
  let slot = (item.category as EquipmentSlot) || 'HAT';
  
  // Special case: Glasses are currently categorized as 'HAT' in the backend 
  // but need the GLASSES visual slot positioning
  const isGlasses = 
    item.name?.toLowerCase().includes('kính') || 
    item._id?.includes('kinh');
    
  if (isGlasses && slot === 'HAT') {
    slot = 'GLASSES';
  }

  const base = SLOT_DEFAULT_ANCHORS[slot] ?? SLOT_DEFAULT_ANCHORS.HAT;

  if (!item.anchor) return base;

  return {
    top: item.anchor.top ?? base.top,
    left: item.anchor.left ?? base.left,
    width: item.anchor.width ?? base.width,
    transform: item.anchor.transform ?? base.transform,
    zIndex: item.anchor.zIndex ?? base.zIndex,
  };
}

/**
 * Sorts equipped items by z-index for correct layer rendering order.
 */
export function sortByLayer<T extends { category: string; anchor?: Partial<AnchorConfig> }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const zA = resolveAnchor(a).zIndex;
    const zB = resolveAnchor(b).zIndex;
    return zA - zB;
  });
}
