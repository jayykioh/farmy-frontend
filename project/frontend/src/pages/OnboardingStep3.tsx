import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';

export const OnboardingStep3: React.FC = () => {
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate('/home');
  };

  return (
    <div className="w-full h-full min-h-[100svh] relative text-left bg-gradient-to-b from-blue-100 to-green-50 overflow-hidden font-sans">
      
      {/* Top App Bar (Branding) */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 py-4 bg-white/10 backdrop-blur-sm max-w-[1024px] mx-auto right-0 left-0">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
          <h1 className="text-xl font-extrabold text-primary">FarmDiaries AI</h1>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="relative flex-1 w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center pt-24 pb-24 md:pb-0 h-screen md:h-screen">
        {/* Mascot Section */}
        <div className="relative w-full aspect-square md:aspect-auto md:w-1/2 flex items-center justify-center z-10 md:h-full">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Mascot Lottie */}
            <MascotLottie className="w-full h-full" />
            {/* Floating Bell Element */}
            <div className="absolute bottom-10 right-10 origin-top animate-[spin_2s_ease-in-out_infinite]">
              <svg className="w-12 h-12 text-[#FFC107] drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Atmospheric Notes */}
        <div className="absolute top-1/4 left-10 md:left-20 opacity-40 animate-pulse">
          <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-12 md:right-32 opacity-30 animate-bounce">
          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.69 2 6 4.69 6 8c0 3.31 2.69 6 6 6s6-2.69 6-6c0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
          </svg>
        </div>
        
        {/* Bottom/Right Sheet UI */}
        <section className="w-full md:w-1/2 bg-white md:bg-white/90 md:backdrop-blur-xl z-50 rounded-t-[40px] md:rounded-3xl px-6 pt-8 pb-12 flex flex-col items-center gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.08),inset_0_-4px_8px_rgba(0,0,0,0.05)] md:shadow-xl md:border md:border-border-main/50 transition-transform self-end md:self-center md:mr-8 md:py-12 absolute md:relative bottom-0 md:bottom-auto">
          
          {/* Progress Indicator */}
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-primary/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div>
          </div>
          
          {/* Content */}
          <div className="text-center space-y-4 px-4">
            <h2 className="text-2xl font-bold text-text-h leading-tight">
              Nhận thông báo trình duyệt
            </h2>
            <p className="text-lg text-text-main/70">
              Cho phép Bé Thóc gửi thông báo nhanh để cập nhật tình trạng sức khỏe cây trồng của bạn.
            </p>
          </div>
          
          {/* Action Area */}
          <div className="w-full flex flex-col items-center gap-4 mt-4">
            <button 
              onClick={handleFinish}
              className="w-full max-w-sm py-4 px-8 bg-primary-container text-white font-bold text-lg rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.08),inset_0_-4px_8px_rgba(0,0,0,0.05)] active:scale-95 transition-transform"
            >
              Cho phép thông báo
            </button>
            <button 
              onClick={handleFinish}
              className="py-2 text-border-main font-bold hover:text-primary transition-colors"
            >
              Để sau
            </button>
          </div>
        </section>
      </main>

      {/* Wavy Grass Background */}
      <svg className="absolute bottom-0 left-0 w-full h-[120px] fill-[#10B981] z-0 pointer-events-none opacity-50 md:opacity-100" preserveAspectRatio="none" viewBox="0 0 1440 120">
        <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
      </svg>
    </div>
  );
};

export default OnboardingStep3;
