import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useAuthStore } from '../store/authStore';
import { testZaloNotification } from '../api/auth';

export const OnboardingStep2: React.FC = () => {
  const navigate = useNavigate();
  const { checkingAuth } = useRequireAuth();
  const { user } = useAuthStore();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isZaloTestLoading, setIsZaloTestLoading] = useState<boolean>(false);

  const hasPhone = !!user?.phoneNumber;

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="w-full h-full min-h-[100svh] relative text-left bg-gradient-to-b from-blue-100 via-bg-surface to-green-100 overflow-hidden font-sans">

      {/* Environmental Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/40 blur-3xl rounded-full"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-yellow-100/30 blur-3xl rounded-full"></div>
      </div>

      {/* Top App Bar Content (Floating) */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between mx-auto max-w-[1024px]">
        <button
          onClick={() => navigate('/onboarding-1')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-slate-200/50 text-slate-700 transition-transform active:scale-90"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex h-10 items-center justify-center rounded-full bg-white/80 px-5 backdrop-blur-md shadow-sm border border-slate-200/50">
          <span className="text-sm font-extrabold text-slate-800 tracking-tight">FarmDiaries</span>
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      <main className="w-full max-w-2xl mx-auto h-screen flex flex-col md:justify-center md:flex-row md:items-center relative z-10 pt-24 md:pt-0">
        {/* Mascot Area */}
        <div className="relative w-full h-[45%] md:h-auto md:flex-1 flex items-center justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <MascotLottie state="happy" className="w-full h-full" />
            {/* Shadow for Mascot */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 md:w-48 h-4 bg-black/5 blur-lg rounded-full"></div>
          </div>
        </div>

        {/* Bottom/Right Sheet */}
        <div className="w-full md:max-w-[440px] bg-white md:bg-white/90 md:backdrop-blur-xl rounded-t-[40px] md:rounded-3xl md:border md:border-border-main/50 shadow-[0_-20px_50px_rgba(0,0,0,0.06)] md:shadow-xl px-6 pt-6 pb-12 flex flex-col items-center z-20 h-auto self-end md:self-center md:mr-8 md:py-12">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-text-main/10 rounded-full mb-8 md:hidden"></div>

          {/* Progress Dots */}
          <div className="flex items-center gap-1.5 mb-6" aria-label="Onboarding progress: step 2 of 3">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="h-1.5 w-6 rounded-full bg-slate-800" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          </div>

          {/* Content */}
          <div className="text-center max-w-[340px] w-full mb-4">
            <h1 className="text-2xl font-bold text-text-h mb-4 leading-tight">
              Kết nối thông báo Zalo
            </h1>
            <p className="text-base text-text-main/70 px-4">
              Nhận nhắc nhở tưới nước và bón phân trực tiếp qua Zalo để không bao giờ bỏ lỡ.
            </p>
          </div>

          {/* Connection Mock Card - simplified Locket style */}
          <button 
            type="button"
            onClick={() => setIsConnected(!isConnected)}
            className="w-full max-w-[340px] bg-slate-100/80 hover:bg-slate-100 rounded-[24px] p-4 flex items-center justify-between mt-4 mb-2 active:scale-[0.98] transition-all cursor-pointer border border-transparent hover:border-slate-200/60"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-[#0068FF] flex items-center justify-center text-white font-extrabold text-[14px] tracking-tight shadow-[0_2px_10px_rgba(0,104,255,0.3)]">
                Zalo
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[15px] font-extrabold text-slate-800 leading-tight mb-0.5">Thông báo Zalo</span>
                <span className="text-[13px] font-semibold text-slate-500">Nhận nhắc nhở tưới cây</span>
              </div>
            </div>
            <div className={`flex items-center justify-center w-12 h-7 rounded-full transition-colors duration-300 ${isConnected ? 'bg-[#08a855]' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isConnected ? 'translate-x-2' : '-translate-x-2'}`} />
            </div>
          </button>
          
          {/* CTA Section */}
          <div className="w-full max-w-[340px] mt-6 space-y-4">
            <button 
              disabled={isZaloTestLoading || (!hasPhone && isConnected)}
              onClick={async () => {
                if (isConnected) {
                  if (hasPhone) {
                    try {
                      setIsZaloTestLoading(true);
                      await testZaloNotification();
                    } catch (error) {
                      console.error('Failed to send Zalo test notification:', error);
                    } finally {
                      setIsZaloTestLoading(false);
                    }
                  }
                  navigate('/onboarding-3');
                } else {
                  setIsConnected(true);
                }
              }}
              className={`w-full text-white font-extrabold text-base h-14 rounded-2xl flex items-center justify-center shadow-sm active:scale-[0.98] transition-all duration-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isConnected ? 'bg-[#08a855] hover:bg-green-600' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {isZaloTestLoading ? 'Đang gửi test...' : (isConnected ? 'Tiếp theo' : 'Kết nối Zalo')}
            </button>
            <div className="flex justify-center pt-2">
              <button 
                onClick={() => navigate('/onboarding-3')} 
                className="text-text-main/50 font-bold hover:text-text-main text-sm transition-colors cursor-pointer"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default OnboardingStep2;
