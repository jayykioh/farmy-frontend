import React, { useEffect, useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { X, Download } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, promptInstall, dismissPrompt } = usePWAInstall();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInstallable) {
      // Small delay to allow initial animations to settle before showing the prompt
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isInstallable]);

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500 ease-out">
      <div className="bg-white/95 backdrop-blur-xl border border-black/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.08)] rounded-[24px] p-4 flex items-start gap-4">
        {/* App Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-container to-primary rounded-[14px] flex items-center justify-center shadow-inner mt-0.5">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Text Content */}
        <div className="flex-1 pt-0.5">
          <h4 className="text-[15px] font-bold text-slate-900 tracking-tight leading-none mb-1">
            Cài đặt ứng dụng
          </h4>
          <p className="text-[13px] text-slate-500 font-medium leading-snug pr-4">
            Thêm FarmDiaries vào màn hình chính để truy cập nhanh chóng.
          </p>
          
          <div className="flex gap-2 mt-3">
            <button 
              onClick={promptInstall}
              className="flex-1 bg-slate-900 text-white text-[13px] font-bold py-2 rounded-full hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Cài đặt ngay
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={() => {
            setShow(false);
            dismissPrompt();
          }}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
