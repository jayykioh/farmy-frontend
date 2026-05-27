import React, { useEffect, useState } from 'react';
import bethocAnimation from '../assets/bethoc.json';

// Lazy load Lottie for better performance
const Lottie = React.lazy(() => import('lottie-react').catch(() => {
  // Fallback if lottie-react not available
  return {
    default: () => <div className="w-32 h-32 bg-primary-container/20 rounded-full animate-pulse" />
  };
}));

interface LoadingScreenProps {
  message?: string;
  subtitle?: string;
  showBethoc?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Đang tải...',
  subtitle = 'Bé Thóc đang chuẩn bị cho bạn',
  showBethoc = true,
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[100svh] bg-bg-surface-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
      
      {/* Animated Bethoc or Loading Spinner */}
      <div className="w-40 h-40 flex items-center justify-center">
        {showBethoc ? (
          <React.Suspense fallback={
            <div className="w-32 h-32 bg-primary-container/20 rounded-full animate-pulse" />
          }>
            <div className="w-full h-full flex items-center justify-center">
              {/* Bethoc Lottie Animation - if available, otherwise fallback */}
              <svg 
                className="w-32 h-32 text-primary animate-bounce" 
                viewBox="0 0 512 512" 
                fill="none"
              >
                {/* Simplified cute character for fallback */}
                <circle cx="256" cy="256" r="120" fill="currentColor" opacity="0.2" />
                <circle cx="256" cy="200" r="50" fill="currentColor" />
                <circle cx="230" cy="190" r="8" fill="#F1FCF1" />
                <circle cx="282" cy="190" r="8" fill="#F1FCF1" />
                <path d="M240 220 Q256 235 272 220" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </React.Suspense>
        ) : (
          // Default spinner
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-4 border-primary-container/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          </div>
        )}
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-bold text-text-main">
          {message}<span className="inline-block w-8 text-left">{dots}</span>
        </p>
        <p className="text-sm text-text-main/60">{subtitle}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs h-1.5 bg-primary-container/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary via-primary-container to-primary rounded-full animate-pulse"
          style={{
            animation: 'shimmer 2s infinite',
          }}
        />
      </div>

      {/* Loading Tips */}
      <div className="text-center max-w-sm">
        <p className="text-xs text-text-main/40 leading-relaxed">
          💡 Mẹo: Bảo dưỡng thường xuyên giữ cho nông trại luôn khỏe mạnh. Hãy ghi nhật ký hôm nay!
        </p>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes shimmer {
          0% { width: 0; }
          50% { width: 100%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
