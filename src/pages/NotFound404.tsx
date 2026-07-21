/* Hallmark · page: not-found-404 · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { House, CaretLeft } from '@phosphor-icons/react';

export const NotFound404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main text-left font-sans flex flex-col items-center justify-center px-4 py-8">
      {/* Top spacing */}
      <div className="flex-1" />

      {/* Error Container */}
      <div className="w-full max-w-md flex flex-col items-center gap-6 relative z-10">
        
        {/* Animated Error Mascot */}
        <div className="relative w-48 h-48 flex items-center justify-center -mb-2">
          {/* Confused / Crying Bé Thóc Illustration */}
          <img src="/pet/crying.svg" alt="Bé Thóc đang khóc" className="w-full h-full object-contain relative z-10 drop-shadow-xl" draggable={false} />
          
          {/* Question Mark Badge */}
          <div className="absolute top-2 -right-2 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-md z-20 border-4 border-border-main animate-bounce">
            <span className="text-3xl font-black text-white leading-none mb-1">?</span>
          </div>
        </div>

        {/* Error Text */}
        <div className="text-center space-y-2">
          <h1 className="text-7xl font-black text-text-h tracking-tight">
            404
          </h1>
          <h2 className="text-2xl font-black text-text-h tracking-tight">Ôi không! Lạc đường mất rồi</h2>
          <p className="text-sm font-bold text-text-secondary leading-relaxed max-w-[90%] mx-auto">
            Bé Thóc mải nhìn cây trồng nên đi nhầm lối rồi! Trang này không tồn tại trên bản đồ nông trại.
          </p>
        </div>

        {/* Suggestions */}
        <div className="w-full card-bubble bg-white rounded-3xl border-2 border-border-main p-5 space-y-3 shadow-xs">
          <p className="text-xs font-black text-text-secondary uppercase">Nguyên nhân có thể do:</p>
          <ul className="space-y-2 text-xs font-extrabold text-text-main">
            <li className="flex gap-2">
              <span className="text-[#008A5E] font-black">•</span>
              <span>Đường dẫn (URL) bị gõ sai hoặc đã bị thay đổi</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#008A5E] font-black">•</span>
              <span>Tính năng này đang trong quá trình phát triển</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#008A5E] font-black">•</span>
              <span>Phiên làm việc tạm thời của bạn đã hết hạn</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate('/home')}
            className="btn btn--cyan active:scale-95 rounded-2xl flex-1 py-3.5 text-base font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <House size={20} weight="bold" />
            Về Trang Chủ
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn btn--soft active:scale-95 rounded-2xl flex-1 py-3.5 text-base font-bold text-text-secondary border-2 border-border-main/50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CaretLeft size={20} weight="bold" />
            Quay Lại
          </button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="flex-1" />

      {/* Help Text */}
      <div className="text-center text-xs font-bold text-text-secondary mt-6">
        <p>Cần hỗ trợ? <button onClick={() => navigate('/help-support')} className="text-[#008A5E] font-black hover:underline cursor-pointer">Gửi câu hỏi cho kĩ sư</button></p>
      </div>
    </div>
  );
};

export default NotFound404;
