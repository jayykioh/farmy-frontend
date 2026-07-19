import { useEffect, useRef, useState } from 'react';
import { getMoodSrc, PET_MOOD_FALLBACK } from '../constants/petAnimation.constants';
import type { PetMood, PetStatus, PetTransitionState } from '../types/pet.types';

const TRANSITION_DURATION_MS = 1000;

/**
 * Manages visual mood transitions when backend mood changes.
 *
 * Rules:
 * - On first load: render current mood immediately, no transition effect.
 * - On mood change: set isTransitioning=true for TRANSITION_DURATION_MS, then flip.
 * - Frontend NEVER decides mood. It only handles the visual crossfade.
 * - If status is undefined (loading), fall back to neutral silently.
 */
export function usePetMoodTransition(
  status: PetStatus | undefined,
): PetTransitionState {
  const safeMood = (m: string | undefined): PetMood => {
    const valid: PetMood[] = [
      'excited', 'happy', 'neutral', 'sad', 'worried', 'sleepy', 'hungry',
    ];
    return valid.includes(m as PetMood) ? (m as PetMood) : PET_MOOD_FALLBACK;
  };

  const initialMood: PetMood = safeMood(status?.mood);

  const [displayMood, setDisplayMood]       = useState<PetMood>(initialMood);
  const [isTransitioning, setTransitioning] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState<PetMood | undefined>(undefined);
  const [transitionTo, setTransitionTo]     = useState<PetMood | undefined>(undefined);

  // Track previous mood to detect changes
  const prevMoodRef = useRef<PetMood>(initialMood);
  // Prevent double-trigger on strict mode
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync: first load sets display mood immediately
  useEffect(() => {
    if (!status) return;
    const newMood = safeMood(status.mood);

    // First render — sync immediately
    if (prevMoodRef.current === PET_MOOD_FALLBACK && newMood !== PET_MOOD_FALLBACK) {
      prevMoodRef.current = newMood;
      setDisplayMood(newMood);
      return;
    }

    // Mood changed → trigger transition
    if (newMood !== prevMoodRef.current) {
      const from = prevMoodRef.current;
      prevMoodRef.current = newMood;

      setTransitionFrom(from);
      setTransitionTo(newMood);
      setTransitioning(true);

      // Clear any running timer
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setDisplayMood(newMood);
        setTransitioning(false);
        setTransitionFrom(undefined);
        setTransitionTo(undefined);
        timerRef.current = null;
      }, TRANSITION_DURATION_MS);
    }
  }, [status?.mood]);  

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    displayMood,
    isTransitioning,
    transitionFrom,
    transitionTo,
    animationSrc  : getMoodSrc(displayMood),
    moodMessage   : status?.bubbleMessage ?? '',
  };
}
