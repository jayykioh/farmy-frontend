import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';

export const OnboardingStep2: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[100svh] relative text-left bg-gradient-to-b from-blue-100 via-bg-surface to-green-100 overflow-hidden font-sans">
      
      {/* Environmental Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/40 blur-3xl rounded-full"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-yellow-100/30 blur-3xl rounded-full"></div>
      </div>
      
      {/* Top App Bar Content (Floating) */}
      <div className="fixed top-0 left-0 w-full px-4 md:px-8 py-4 flex justify-between items-center z-50 max-w-[1024px] mx-auto right-0">
        <button 
          onClick={() => navigate('/onboarding-1')}
          className="w-10 h-10 rounded-full bg-white/45 backdrop-blur-md flex items-center justify-center text-text-main/70 active:scale-90 transition-transform shadow-sm"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="px-4 py-2 bg-white/45 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
          <span className="font-bold text-primary">FarmDiaries AI</span>
        </div>
        <div className="w-10 h-10"></div> {/* Spacer */}
      </div>

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
        <div className="w-full md:flex-1 bg-white md:bg-white/90 md:backdrop-blur-xl rounded-t-[40px] md:rounded-3xl md:border md:border-border-main/50 shadow-[0_-20px_50px_rgba(0,0,0,0.06)] md:shadow-xl px-6 pt-6 pb-12 flex flex-col items-center z-20 h-auto self-end md:self-center md:mr-8 md:py-12">
          {/* Handle */}
          <div className="w-12 h-1.5 bg-text-main/10 rounded-full mb-8 md:hidden"></div>
          
          {/* Progress Dots */}
          <div className="flex gap-2 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(8,168,85,0.3)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(8,168,85,0.3)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-border-main/40"></div>
          </div>
          
          {/* Content */}
          <div className="text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-text-h mb-4 leading-tight">
              Kết nối thông báo Zalo
            </h1>
            <p className="text-base text-text-main/70 px-4">
              Nhận nhắc nhở tưới nước và bón phân trực tiếp qua Zalo để không bao giờ bỏ lỡ.
            </p>
          </div>
          
          {/* CTA Section */}
          <div className="w-full mt-10 space-y-6">
            <button 
              onClick={() => navigate('/onboarding-3')}
              className="w-full bg-[#0068FF] py-4 rounded-full flex items-center justify-center gap-4 shadow-[0_10px_20px_rgba(0,104,255,0.2),inset_0_-4px_0_rgba(0,0,0,0.1)] active:shadow-[0_4px_10px_rgba(0,104,255,0.1),inset_0_-2px_0_rgba(0,0,0,0.05)] active:scale-95 transition-all duration-200"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-[#0068FF] font-bold text-sm">
                Zalo
              </span>
              <span className="text-white text-lg font-extrabold">Kết nối Zalo</span>
            </button>
            <div className="flex justify-center">
              <button onClick={() => navigate('/onboarding-3')} className="text-text-main/60 font-bold hover:opacity-70 transition-opacity">
                Bỏ qua
              </button>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default OnboardingStep2;
