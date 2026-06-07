import React from 'react';
import LottiePackage from 'lottie-react';
import type { LottieComponentProps } from 'lottie-react';
import bethocAnimation from '../assets/bethoc.json';

// Handle CJS/ESM interop where default might be nested
const Lottie = (LottiePackage as any).default || LottiePackage;

interface MascotLottieProps extends Omit<LottieComponentProps, 'animationData'> {
  className?: string;
  state?: 'happy' | 'worried' | 'excited' | 'analytical' | 'celebrating' | 'sleeping';
}

/**
 * MascotLottie replaces static images of Bé Thóc.
 * Currently uses a single lottie file, but 'state' prop can be used later 
 * to swap between different animations if available.
 */
export const MascotLottie: React.FC<MascotLottieProps> = ({ className, state = 'happy', ...props }) => {
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
