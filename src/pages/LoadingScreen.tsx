/* Hallmark · page: loading-screen · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React from 'react';
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
  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main font-sans flex flex-col items-center justify-center px-4 py-8 gap-8 text-left">
      
      {/* Animated Bethoc or Loading Spinner */}
      <motion.div 
        className="w-44 h-44 flex items-center justify-center relative card-bubble bg-white rounded-full border-4 border-border-main shadow-lg p-2"
        animate={{ scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {showBethoc ? (
          <React.Suspense fallback={
            <div className="w-32 h-32 bg-primary-light/20 rounded-full animate-pulse" />
          }>
            <div className="w-full h-full flex items-center justify-center">
              <svg 
                className="w-32 h-32 text-[#008A5E] animate-bounce" 
                viewBox="0 0 512 512" 
                fill="none"
              >
                <circle cx="256" cy="256" r="120" fill="currentColor" opacity="0.15" />
                <circle cx="256" cy="200" r="50" fill="currentColor" />
                <circle cx="230" cy="190" r="8" fill="#FFFFFF" />
                <circle cx="282" cy="190" r="8" fill="#FFFFFF" />
                <path d="M240 220 Q256 235 272 220" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </React.Suspense>
        ) : (
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full border-4 border-border-main" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#008A5E] animate-spin" />
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
        <h2 className="text-2xl font-black text-text-h tracking-tight">{message}</h2>
        {subtitle && (
          <p className="text-base font-bold text-text-secondary">
            {subtitle}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
            >...</motion.span>
          </p>
        )}
      </motion.div>

      {/* Progress Bar Track */}
      <div className="w-full max-w-xs h-3 bg-bg-surface-2 rounded-full overflow-hidden border-2 border-border-main relative">
        <div 
          className="h-full bg-[#008A5E] rounded-full"
          style={{
            animation: 'shimmer 2s infinite',
          }}
        />
      </div>

      {/* Loading Tips */}
      <div className="text-center max-w-sm card-bubble bg-white border-2 border-border-main p-4 shadow-xs">
        <p className="text-xs font-bold text-text-secondary leading-relaxed">
          💡 <strong className="text-text-h">Mẹo:</strong> Ghi nhật ký tưới cây và soi bệnh định kỳ sẽ giúp Bé Thóc thu thập dữ liệu nông vụ chuẩn xác nhất!
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
