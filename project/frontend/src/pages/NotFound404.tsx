import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[100svh] bg-bg-surface-1 text-left font-sans flex flex-col items-center justify-center px-4 py-8">
      {/* Top spacing */}
      <div className="flex-1" />

      {/* Error Container */}
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        
        {/* Animated Error Icon */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Confused Bé Thóc Illustration */}
          <div className="w-32 h-32 bg-gradient-to-br from-primary-container/30 to-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-24 h-24 text-primary" fill="currentColor" viewBox="0 0 24 24">
              {/* Cute confused character */}
              <circle cx="12" cy="10" r="3" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="16" cy="8" r="1.5" />
              <path d="M9 14c0 1.66 1.34 3 3 3s3-1.34 3-3" strokeWidth="1.5" stroke="currentColor" fill="none" />
              <path d="M7 6c2-2 8-2 10 0" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          
          {/* Question Mark Badge */}
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-warning rounded-full flex items-center justify-center shadow-md">
            <span className="text-2xl font-bold text-white">?</span>
          </div>
        </div>

        {/* Error Text */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-black text-text-h">404</h1>
          <p className="text-2xl font-bold text-text-main">Trang không tìm thấy</p>
          <p className="text-base text-text-main/60 leading-relaxed">
            Có vẻ như Bé Thóc không tìm thấy trang bạn đang tìm kiếm. Nó cũng bối rối như một cây mưa trong mùa hè lắm!
          </p>
        </div>

        {/* Suggestions */}
        <div className="w-full bg-white rounded-[20px] border border-border-main/50 p-5 space-y-3">
          <p className="text-sm font-semibold text-text-main/70 uppercase">Điều này có thể xảy ra vì:</p>
          <ul className="space-y-2 text-sm text-text-main/60">
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span>URL có thể bị sai hoặc đã bị xóa</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Trang này chưa được phát hành</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Phiên đăng nhập của bạn hết hạn</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-primary text-white font-bold text-base py-3 rounded-full shadow-md hover:bg-primary-container hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
            </svg>
            Về Trang Chủ
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-white border border-border-main/50 text-text-main font-bold text-base py-3 rounded-full shadow-sm hover:bg-bg-surface-1 hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay Lại
          </button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="flex-1" />

      {/* Help Text */}
      <div className="text-center text-xs text-text-main/40 mt-8">
        <p>Cần giúp? <a href="/help-support" className="text-primary hover:underline cursor-pointer">Liên hệ Hỗ trợ</a></p>
      </div>
    </div>
  );
};

export default NotFound404;
