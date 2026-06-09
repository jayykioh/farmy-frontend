import { getMoodSrc } from '../constants/petAnimation.constants';
import type { PetMood } from '../types/pet.types';

/**
 * Simple helper hook — given a mood string, returns the public SVG src.
 * Handles undefined / invalid moods gracefully by falling back to 'neutral'.
 */
export function usePetAnimation(mood: PetMood | undefined | null): string {
  return getMoodSrc(mood ?? null);
}
