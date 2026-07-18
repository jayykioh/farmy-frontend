import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[100svh] bg-[#FBFBFD] text-left font-sans flex flex-col items-center justify-center px-4 py-8">
      {/* Top spacing */}
      <div className="flex-1" />

      {/* Error Container */}
      <div className="w-full max-w-md flex flex-col items-center gap-8 relative z-10">
        
        {/* Animated Error Mascot */}
        <div className="relative w-48 h-48 flex items-center justify-center -mb-4">
          {/* Confused / Crying Bé Thóc Illustration */}
          <img src="/pet/crying.svg" alt="Bé Thóc đang khóc" className="w-full h-full object-contain relative z-10 drop-shadow-xl" draggable={false} />
          
          {/* Question Mark Badge */}
          <div className="absolute top-2 -right-2 w-14 h-14 bg-error rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(186,26,26,0.3)] z-20 border-[3px] border-white animate-bounce" style={{ animationDuration: '2s' }}>
            <span className="text-3xl font-black text-white leading-none mb-1">?</span>
          </div>
        </div>

        {/* Error Text */}
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-extrabold text-slate-900 drop-shadow-sm tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tight">Ôi không! Lạc đường mất rồi</h2>
          <p className="text-base md:text-lg text-text-main/70 leading-relaxed font-medium max-w-[85%] mx-auto">
            Bé Thóc đang khóc nhè vì không tìm thấy trang bạn cần. Lối này có vẻ không dẫn đến nông trại của chúng ta đâu.
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
            onClick={() => navigate('/home')}
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
