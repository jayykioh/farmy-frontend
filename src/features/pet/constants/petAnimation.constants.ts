import type { PetMood } from '../types/pet.types';

// ─── SVG Asset Map ────────────────────────────────────────────────────────────
// Maps each mood to a public SVG path. SVG files live in /public/pet/*.svg

export const PET_ANIMATION_MAP: Record<PetMood, string> = {
  excited : '/pet/excited.svg',
  happy   : '/pet/happy.svg',
  neutral : '/pet/neutral.svg',
  sad     : '/pet/sad.svg',
  worried : '/pet/worried.svg',
  sleepy  : '/pet/sleepy.svg',
  hungry  : '/pet/hungry.svg',
};

export const PET_MOOD_FALLBACK: PetMood = 'neutral';

/** Returns the SVG src for a given mood, falling back to neutral. */
export function getMoodSrc(mood: PetMood | undefined | null): string {
  if (!mood || !(mood in PET_ANIMATION_MAP)) {
    return PET_ANIMATION_MAP[PET_MOOD_FALLBACK];
  }
  return PET_ANIMATION_MAP[mood];
}
