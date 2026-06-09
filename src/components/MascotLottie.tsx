import React from 'react';
import LottiePackage from 'lottie-react';
import type { LottieComponentProps } from 'lottie-react';
import bethocAnimation from '../assets/bethoc.json';

// Handle CJS/ESM interop where default might be nested
const Lottie = (LottiePackage as any).default || LottiePackage;

interface MascotLottieProps extends Omit<LottieComponentProps, 'animationData'> {
  className?: string;
  state?: 'happy' | 'worried' | 'excited' | 'analytical' | 'celebrating' | 'sleeping' | 'neutral' | 'sad' | 'hungry' | 'sleepy';
}

/**
 * MascotLottie replaces static images of Bé Thóc.
 * Renders SVG assets from public/pet for main moods, falls back to Lottie for others.
 */
export const MascotLottie: React.FC<MascotLottieProps> = ({ className, state = 'happy', ...props }) => {
  const svgStates = ['happy', 'excited', 'neutral', 'sad', 'worried', 'hungry', 'sleepy', 'sleeping'];

  if (svgStates.includes(state)) {
    // Map 'sleeping' state name to the 'sleepy.svg' file name
    const fileName = state === 'sleeping' ? 'sleepy' : state;
    return (
      <div className={className}>
        <img 
          src={`/pet/${fileName}.svg`} 
          alt={`Bé Thóc - ${state}`} 
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Lottie 
        animationData={bethocAnimation} 
        loop={true} 
        className="w-full h-full"
        {...props} 
      />
    </div>
  );
};
