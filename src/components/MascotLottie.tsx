/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from 'react';
import type { LottieComponentProps } from 'lottie-react';
import type { PetMood } from '../features/pet/types/pet.types';

const LottiePlayer = React.lazy(async () => {
  const [LottiePackage, animationData] = await Promise.all([
    import('lottie-react'),
    import('../assets/bethoc.json')
  ]);
  const LottieComponent = (LottiePackage as any).default || LottiePackage;
  return {
    default: (props: Omit<LottieComponentProps, 'animationData'>) => (
      <LottieComponent animationData={animationData.default || animationData} {...props} />
    )
  };
});

/** Display-only states extend PetMood with 'sleeping' (alias for sleepy.svg in static contexts) */
type MascotState = PetMood | 'sleeping';

interface MascotLottieProps extends Omit<LottieComponentProps, 'animationData'> {
  className?: string;
  state?: MascotState;
}

/**
 * MascotLottie replaces static images of Bé Thóc.
 * Renders SVG assets from public/pet for main moods, falls back to Lottie for others.
 */
export const MascotLottie: React.FC<MascotLottieProps> = ({ className, state = 'happy', ...props }) => {
  const currentMood = state;
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
    <div className={`relative overflow-visible ${className || ''}`}>
      {/* Dynamic Keyframes Style Tag */}
      <style>{`
        @keyframes mascot-floatUp {
          0% { transform: translateY(20px) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-70px) scale(1.1); opacity: 0; }
        }
        @keyframes mascot-floatLeaf {
          0% { transform: translateY(15px) translateX(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.7; }
          100% { transform: translateY(-60px) translateX(-15px) rotate(120deg); opacity: 0; }
        }
        @keyframes mascot-rainFall {
          0% { transform: translateY(-20px); opacity: 0; }
          30% { opacity: 0.6; }
          100% { transform: translateY(60px); opacity: 0; }
        }
        @keyframes mascot-tearDrip {
          0% { transform: translateY(0) scaleY(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(45px) scaleY(1); opacity: 0; }
        }
        @keyframes mascot-sweatDrip {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translateY(35px) scale(1); opacity: 0; }
        }
        @keyframes mascot-jitter {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 0); }
          20%, 40%, 60%, 80% { transform: translate(2px, 0); }
        }
        @keyframes mascot-bobCrown {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes mascot-confetti {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) rotate(var(--r)); opacity: 0; }
        }
        .animate-mascot-float-heart-1 { animation: mascot-floatUp 2.5s infinite ease-out; }
        .animate-mascot-float-heart-2 { animation: mascot-floatUp 2.2s infinite ease-out 0.8s; }
        .animate-mascot-float-heart-3 { animation: mascot-floatUp 2.8s infinite ease-out 1.5s; }
        .animate-mascot-float-leaf-1 { animation: mascot-floatLeaf 3s infinite ease-out 0.4s; }
        .animate-mascot-float-leaf-2 { animation: mascot-floatLeaf 2.6s infinite ease-out 1.2s; }
        
        .animate-mascot-rain-1 { animation: mascot-rainFall 1.2s infinite linear; }
        .animate-mascot-rain-2 { animation: mascot-rainFall 1.5s infinite linear 0.3s; }
        .animate-mascot-rain-3 { animation: mascot-rainFall 1.1s infinite linear 0.6s; }
        .animate-mascot-rain-4 { animation: mascot-rainFall 1.4s infinite linear 0.9s; }
        
        .animate-mascot-tear-l { animation: mascot-tearDrip 2s infinite ease-in; }
        .animate-mascot-tear-r { animation: mascot-tearDrip 2s infinite ease-in 0.8s; }
        
        .animate-mascot-sweat { animation: mascot-sweatDrip 1.8s infinite ease-in-out; }
        
        .animate-mascot-crown { animation: mascot-bobCrown 3s infinite ease-in-out; }
        .animate-mascot-confetti-1 { --x: -40px; --y: -50px; --r: 180deg; animation: mascot-confetti 1.5s infinite ease-out; }
        .animate-mascot-confetti-2 { --x: 40px; --y: -60px; --r: -150deg; animation: mascot-confetti 1.8s infinite ease-out 0.3s; }
        .animate-mascot-confetti-3 { --x: -30px; --y: -70px; --r: 210deg; animation: mascot-confetti 1.4s infinite ease-out 0.6s; }
        .animate-mascot-confetti-4 { --x: 35px; --y: -45px; --r: -180deg; animation: mascot-confetti 1.6s infinite ease-out 0.9s; }
      `}</style>
      {/* Glow Filter/Tints based on Mood */}
      <div 
        className={`w-full h-full transition-all duration-500 ${
          currentMood === 'excited' ? 'drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105' :
          currentMood === 'happy' ? 'drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
          currentMood === 'sad' ? 'drop-shadow-[0_0_10px_rgba(59,130,246,0.35)] brightness-90' :
          currentMood === 'worried' ? 'animate-[mascot-jitter_0.25s_infinite_alternate] brightness-95' :
          ''
        }`}
      >
        <Suspense fallback={<div className="w-full h-full" />}>
          <LottiePlayer 
            loop={true} 
            className="w-full h-full"
            {...props} 
          />
        </Suspense>
      </div>
      {/* MOOD OVERLAYS */}
      {/* 1. EXCITED: Crown floating, Confetti popping */}
      {currentMood === 'excited' ? (<div className="absolute inset-0 pointer-events-none overflow-visible">
        {/* Golden Crown */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 animate-mascot-crown">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            <path d="M5,16 L3,9 L8,12 L12,5 L16,12 L21,9 L19,16 Z M19,18 L5,18 L5,19 L19,19 Z" />
            <circle cx="3" cy="9" r="1" className="fill-amber-300" />
            <circle cx="12" cy="5" r="1.2" className="fill-red-500" />
            <circle cx="21" cy="9" r="1" className="fill-amber-300" />
            <circle cx="8" cy="12" r="0.8" className="fill-blue-500" />
            <circle cx="16" cy="12" r="0.8" className="fill-blue-500" />
          </svg>
        </div>
        {/* Confetti Particles */}
        <div className="absolute top-1/3 left-1/4 w-2 h-4 bg-pink-500 rounded-sm animate-mascot-confetti-1" />
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-mascot-confetti-2" />
        <div className="absolute top-1/2 left-1/3 w-3 h-2 bg-blue-400 animate-mascot-confetti-3" />
        <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-green-400 rounded-sm animate-mascot-confetti-4" />
      </div>) : null}
      {/* 2. HAPPY: Floating hearts and leaves */}
      {currentMood === 'happy' ? (<div className="absolute inset-0 pointer-events-none overflow-visible">
        {/* Floating Heart 1 */}
        <div className="absolute bottom-1/3 left-2 w-5 h-5 animate-mascot-float-heart-1">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-rose-500 opacity-80">
            <path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.04 L12,21.35 Z" />
          </svg>
        </div>
        {/* Floating Leaf 1 */}
        <div className="absolute bottom-1/4 right-2 w-5 h-5 animate-mascot-float-leaf-1">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-emerald-500 opacity-80">
            <path d="M17,8 C8,10 5.9,16.17 3.82,20.24 C3.67,20.53 3.82,20.9 4.13,20.97 C7.5,20.67 13.5,18 15.5,10 C17.5,10 19,9.5 20,8 C21,6.5 21,3 21,3 C21,3 17.5,3 16,4 C14.5,5 14,6.5 14,8.5 C16,8.5 17,8 17,8 Z" />
          </svg>
        </div>
        {/* Floating Heart 2 */}
        <div className="absolute bottom-1/2 left-1/4 w-4 h-4 animate-mascot-float-heart-2">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-pink-500 opacity-80">
            <path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.04 L12,21.35 Z" />
          </svg>
        </div>
        {/* Floating Leaf 2 */}
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 animate-mascot-float-leaf-2">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-green-400 opacity-80">
            <path d="M17,8 C8,10 5.9,16.17 3.82,20.24 C3.67,20.53 3.82,20.9 4.13,20.97 C7.5,20.67 13.5,18 15.5,10 C17.5,10 19,9.5 20,8 C21,6.5 21,3 21,3 C21,3 17.5,3 16,4 C14.5,5 14,6.5 14,8.5 C16,8.5 17,8 17,8 Z" />
          </svg>
        </div>
        {/* Floating Heart 3 */}
        <div className="absolute bottom-1/4 left-1/2 w-3.5 h-3.5 animate-mascot-float-heart-3">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-rose-400 opacity-70">
            <path d="M12,21.35 L10.55,20.03 C5.4,15.36 2,12.28 2,8.5 C2,5.42 4.42,3 7.5,3 C9.24,3 10.91,3.81 12,5.09 C13.09,3.81 14.76,3 16.5,3 C19.58,3 22,5.42 22,8.5 C22,12.28 18.6,15.36 13.45,20.04 L12,21.35 Z" />
          </svg>
        </div>
      </div>) : null}
      {/* 3. SAD: Tear drops sliding down, small dark rain cloud hovering above */}
      {currentMood === 'sad' ? (<div className="absolute inset-0 pointer-events-none overflow-visible">
        {/* Dark Rain Cloud */}
        <div className="absolute -top-7 -right-2 w-10 h-7 opacity-90">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-slate-500 drop-shadow-sm">
            <path d="M19.35,10.04 C18.67,6.59 15.64,4 12,4 C9.11,4 6.6,5.64 5.35,8.04 C2.34,8.36 0,10.91 0,14 C0,17.31 2.69,20 6,20 L19,20 C21.76,20 24,17.76 24,15 C24,12.36 21.95,10.22 19.35,10.04 Z" />
          </svg>
          {/* Cloud rain drops */}
          <div className="absolute top-6 left-2 w-1 h-3 bg-blue-300 rounded-full animate-mascot-rain-1" />
          <div className="absolute top-6 left-4 w-1 h-3.5 bg-blue-400 rounded-full animate-mascot-rain-2" />
          <div className="absolute top-6 left-6 w-1 h-2.5 bg-blue-300 rounded-full animate-mascot-rain-3" />
          <div className="absolute top-6 left-8 w-1 h-3 bg-blue-400 rounded-full animate-mascot-rain-4" />
        </div>
        {/* Dripping Tears (placed relative to head coordinates approximately) */}
        <div className="absolute top-[45%] left-[32%] w-1.5 h-3 animate-mascot-tear-l">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-blue-400">
            <path d="M12,2.69 C12,2.69 4,10.19 4,15 C4,19.42 7.58,23 12,23 C16.42,23 20,19.42 20,15 C20,10.19 12,2.69 12,2.69 Z" />
          </svg>
        </div>
        <div className="absolute top-[45%] right-[32%] w-1.5 h-3 animate-mascot-tear-r">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-blue-400">
            <path d="M12,2.69 C12,2.69 4,10.19 4,15 C4,19.42 7.58,23 12,23 C16.42,23 20,19.42 20,15 C20,10.19 12,2.69 12,2.69 Z" />
          </svg>
        </div>
      </div>) : null}
      {/* 4. WORRIED: Sweat droplets on forehead/temple */}
      {currentMood === 'worried' ? (<div className="absolute inset-0 pointer-events-none overflow-visible">
        {/* Sweat drop on top-right of head */}
        <div className="absolute top-[28%] right-[28%] w-3 h-4 animate-mascot-sweat">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-cyan-300 opacity-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
            <path d="M12,2.69 C12,2.69 4,10.19 4,15 C4,19.42 7.58,23 12,23 C16.42,23 20,19.42 20,15 C20,10.19 12,2.69 12,2.69 Z" />
          </svg>
        </div>
      </div>) : null}
    </div>
  );
};
