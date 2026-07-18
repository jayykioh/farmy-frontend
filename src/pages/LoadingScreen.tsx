import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
    <div className="w-full min-h-[100svh] bg-[#FBFBFD] flex flex-col items-center justify-center px-4 py-8 gap-8">
      
      {/* Animated Bethoc or Loading Spinner */}
      <motion.div 
        className="w-40 h-40 flex items-center justify-center relative"
        animate={{ scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div 
          className="absolute inset-0 bg-primary/5 rounded-[40px] blur-xl"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
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
      </motion.div>

      {/* Loading Text */}
      <motion.div 
        className="text-center flex flex-col gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-text-h tracking-tight">{message}</h2>
        {subtitle && (
          <p className="text-sm font-medium text-text-main/50 tracking-wide">
            {subtitle}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
            >...</motion.span>
          </p>
        )}
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-slate-900 rounded-full"
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
