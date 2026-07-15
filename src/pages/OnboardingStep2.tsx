import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, MailCheck } from 'lucide-react';
import { MascotLottie } from '../components/MascotLottie';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useAuthStore } from '../store/authStore';
import { testEmailNotification } from '../api/auth';

export const OnboardingStep2: React.FC = () => {
  const navigate = useNavigate();
  const { checkingAuth } = useRequireAuth();
  const { user } = useAuthStore();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isEmailTestLoading, setIsEmailTestLoading] = useState<boolean>(false);

  const hasEmail = !!user?.email;

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
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/85 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,30,23,0.06)] border border-white/80 text-slate-700 transition-all hover:-translate-y-0.5 hover:text-slate-950 active:scale-90"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex h-10 items-center justify-center rounded-full bg-white/85 px-5 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,30,23,0.06)] border border-white/80">
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
        <div className="w-full md:max-w-[460px] bg-white/95 md:bg-white/90 md:backdrop-blur-xl rounded-t-[40px] md:rounded-3xl md:border md:border-border-main/45 shadow-[0_-20px_60px_rgba(20,30,23,0.08)] md:shadow-[0_24px_70px_rgba(20,30,23,0.12)] px-6 pt-6 pb-12 flex flex-col items-center z-20 h-auto self-end md:self-center md:mr-8 md:py-12">
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
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary-container/55">Step 2 of 3</p>
            <h1 className="text-2xl font-black text-text-h mb-4 leading-tight md:text-3xl">
              Kết nối thông báo Email
            </h1>
            <p className="text-base font-semibold leading-7 text-text-main/65 px-2">
              Nhận nhắc nhở tưới nước và bón phân trực tiếp qua Email để không bao giờ bỏ lỡ.
            </p>
          </div>

          {/* Connection Mock Card - simplified Locket style */}
          <button 
            type="button"
            onClick={() => setIsConnected(!isConnected)}
            className={`group w-full max-w-[340px] rounded-[26px] p-4 flex items-center justify-between mt-4 mb-2 active:scale-[0.98] transition-all cursor-pointer border text-left ${
              isConnected
                ? 'border-primary/25 bg-primary/[0.08] shadow-[0_14px_34px_rgba(8,168,85,0.12)]'
                : 'border-border-main/45 bg-white shadow-[0_12px_30px_rgba(20,30,23,0.06)] hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_18px_38px_rgba(20,30,23,0.09)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-[14px] tracking-tight transition-colors ${isConnected ? 'bg-primary text-white shadow-[0_10px_24px_rgba(8,168,85,0.22)]' : 'bg-[#EA4335] text-white shadow-[0_10px_24px_rgba(234,67,53,0.22)]'}`}>
                {isConnected ? <CheckCircle2 className="h-6 w-6" /> : <MailCheck className="h-6 w-6" />}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[15px] font-extrabold text-slate-800 leading-tight mb-0.5">Thông báo Email</span>
                <span className="text-[13px] font-semibold text-slate-500">{isConnected ? 'Đã bật gửi nhắc thử' : 'Nhận nhắc nhở tưới cây'}</span>
              </div>
            </div>
            <div className={`flex items-center justify-center w-12 h-7 rounded-full transition-colors duration-300 ${isConnected ? 'bg-[#08a855]' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isConnected ? 'translate-x-2' : '-translate-x-2'}`} />
            </div>
          </button>
          
          {/* CTA Section */}
          <div className="w-full max-w-[340px] mt-6 space-y-4">
            <button 
              disabled={isEmailTestLoading || (!hasEmail && isConnected)}
              onClick={async () => {
                if (isConnected) {
                  if (hasEmail) {
                    try {
                      setIsEmailTestLoading(true);
                      await testEmailNotification();
                    } catch (error) {
                      console.error('Failed to send Email test notification:', error);
                    } finally {
                      setIsEmailTestLoading(false);
                    }
                  }
                  navigate('/onboarding-3');
                } else {
                  setIsConnected(true);
                }
              }}
              className={`group flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl text-base font-extrabold text-white shadow-[0_16px_34px_rgba(0,109,53,0.20)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                isConnected ? 'bg-primary-container hover:bg-primary hover:shadow-[0_20px_42px_rgba(8,168,85,0.28)]' : 'bg-slate-950 hover:bg-slate-900 hover:shadow-[0_18px_36px_rgba(15,23,42,0.22)]'
              }`}
            >
              <span className="relative">{isEmailTestLoading ? 'Đang gửi test...' : (isConnected ? 'Tiếp theo' : 'Kết nối Email')}</span>
              {!isEmailTestLoading ? <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" /> : null}
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
