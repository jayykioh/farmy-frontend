import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { SnapCard } from '../components/SnapCard';
import { mockSnaps } from '../mocks/snapData';
import { SnapFAB } from '../components/SnapFAB';
import { Flame } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-6 px-4 md:px-8 md:py-8 pt-4 pb-8 max-w-7xl mx-auto">
      
      {/* Desktop Grid Layout Wrapper */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 w-full">
        
        {/* Left Column (Main Focus) */}
        <div className="flex flex-col col-span-12 md:col-span-8 lg:col-span-8 gap-6">
          
          {/* Header & Streak */}
          <section className="flex flex-col items-center md:items-start text-center md:text-left mt-2 md:mt-0">
            <div className="inline-flex items-center gap-2 bg-bg-surface border border-border-main/50 shadow-sm rounded-full px-4 py-1.5 mb-3">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="font-bold text-text-main/70 text-sm">7-day streak</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-h tracking-tight">Good morning, Nông Dân!</h2>
            <p className="text-text-main/70 mt-2 font-medium">Bạn đã sẵn sàng để chăm sóc nông trại hôm nay chưa?</p>
          </section>
          
          {/* Mascot Emotional Anchor */}
          <section className="flex justify-center relative w-full aspect-video md:aspect-auto md:h-80 lg:h-96 mt-2 mb-4">
            {/* Decorative background element */}
            <div className="absolute inset-0 bg-primary-container/20 rounded-full md:rounded-[40px] scale-75 md:scale-100 blur-3xl md:blur-2xl opacity-50"></div>
            {/* Mascot Container */}
            <div className="relative w-full h-full max-w-[240px] md:max-w-[400px] rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/80 backdrop-blur-sm border border-border-main/50 shadow-sm flex items-center justify-center p-4 md:p-8">
              <MascotLottie className="w-full h-full drop-shadow-md" />
            </div>
            {/* Floating Dialogue Bubble */}
            <div className="absolute top-0 md:top-8 right-4 md:right-8 bg-white border border-border-main/50 rounded-[20px] rounded-bl-none px-5 py-3 shadow-md animate-[bounce_4s_ease-in-out_infinite]">
              <p className="font-bold text-text-main md:text-lg">Ready to grow?</p>
            </div>
          </section>

          {/* Main CTA Button (Desktop prominent) */}
          <section className="w-full hidden md:block">
            <button 
              onClick={() => navigate('/diary/create')}
              className="w-full bg-primary text-white font-bold text-lg md:text-xl py-5 px-6 rounded-[24px] shadow-[0_10px_20px_rgba(8,168,85,0.2),inset_0_-4px_0_rgba(0,0,0,0.1)] active:shadow-[0_4px_10px_rgba(8,168,85,0.1),inset_0_-2px_0_rgba(0,0,0,0.05)] flex justify-center items-center gap-3 hover:scale-[1.01] active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Ghi nhật ký hôm nay 
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-sm ml-1">+30XP</span>
            </button>
          </section>

        </div>

        {/* Right Column (Stats & Tasks) */}
        <div className="flex flex-col col-span-12 md:col-span-4 lg:col-span-4 gap-6">
          
          {/* XP Progress Card */}
          <section className="bg-white border border-border-main/50 rounded-[28px] md:rounded-[32px] p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-secondary-dark bg-secondary-light/20 px-2 py-0.5 rounded-full text-xs uppercase tracking-wider self-start">Current Status</span>
                <span className="text-3xl font-extrabold text-text-main tracking-tight mt-1">Lv. 14</span>
              </div>
              <span className="font-bold text-primary bg-primary-lightest/50 px-3 py-1 rounded-full">830/1219 XP</span>
            </div>
            {/* Thick Progress Bar */}
            <div className="w-full h-4 rounded-full bg-bg-surface-2 relative overflow-hidden border border-border-main/20">
              <div className="absolute top-0 left-0 h-full w-[68%] bg-primary rounded-full border-t border-primary-light shadow-sm"></div>
            </div>
            <p className="text-sm font-medium text-text-main/50 mt-1">Gần lên cấp rồi! Tiếp tục ghi nhật ký nhé.</p>
          </section>

          {/* Main CTA Button (Mobile only) */}
          <section className="w-full md:hidden">
            <button 
              onClick={() => navigate('/diary/create')}
              className="w-full bg-primary text-white font-bold text-lg py-4 px-6 rounded-full shadow-[0_10px_20px_rgba(8,168,85,0.2),inset_0_-4px_0_rgba(0,0,0,0.1)] active:shadow-[0_4px_10px_rgba(8,168,85,0.1),inset_0_-2px_0_rgba(0,0,0,0.05)] flex justify-center items-center gap-3 active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Ghi nhật ký hôm nay 
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-sm ml-1">+30XP</span>
            </button>
          </section>
          
          {/* Small Task Cards Grid */}
          <section className="grid grid-cols-2 md:grid-cols-1 gap-4 mt-2 md:mt-0">
            <h3 className="hidden md:block text-lg font-extrabold text-text-main mb-2">Thao tác nhanh</h3>
            
            {/* Task 1 */}
            <button 
              onClick={() => navigate('/reminders')}
              className="bg-white border border-border-main/50 rounded-[24px] p-4 flex flex-col md:flex-row items-center md:justify-start text-center md:text-left gap-3 md:gap-4 hover:bg-bg-surface-1 hover:border-primary/30 shadow-sm hover:shadow-md active:scale-[0.98] transition-all group"
            >
              <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 md:w-6 md:h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="font-bold text-text-main text-sm md:text-base">Watering check</span>
            </button>
            
            {/* Task 2 */}
            <button 
              onClick={() => navigate('/scan')}
              className="bg-white border border-border-main/50 rounded-[24px] p-4 flex flex-col md:flex-row items-center md:justify-start text-center md:text-left gap-3 md:gap-4 hover:bg-bg-surface-1 hover:border-orange-500/30 shadow-sm hover:shadow-md active:scale-[0.98] transition-all group"
            >
              <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-yellow-50 text-secondary flex items-center justify-center border border-yellow-100 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 md:w-6 md:h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-bold text-text-main text-sm md:text-base">Plant health scan</span>
            </button>
            
            {/* Task 3 */}
            <button 
              onClick={() => navigate('/chat')}
              className="col-span-2 md:col-span-1 bg-white border border-border-main/50 rounded-[24px] p-4 flex flex-row md:flex-row items-center justify-center md:justify-start text-center md:text-left gap-3 md:gap-4 hover:bg-bg-surface-1 hover:border-primary/30 shadow-sm hover:shadow-md active:scale-[0.98] transition-all group"
            >
              <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-primary-container text-white flex items-center justify-center border-2 border-primary/20 shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="font-bold text-text-main text-sm md:text-base">Ask AI assistant</span>
            </button>
          </section>
        </div>
        
      </div>

      {/* Farm Feed Preview Section */}
      <section className="w-full mt-2 md:mt-4">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl md:text-2xl font-extrabold text-text-main">Farm Feed gần đây 🌱</h3>
          <button 
            onClick={() => navigate('/farm-feed')}
            className="text-primary font-bold text-sm hover:underline flex items-center gap-1 active:scale-95 transition-transform"
          >
            Xem tất cả
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {mockSnaps.map(snap => (
            <SnapCard 
              key={snap.id}
              snap={snap}
              mini={true}
              onClick={() => navigate(`/snap/${snap.id}`)}
            />
          ))}
        </div>
      </section>

      <SnapFAB />
    </div>
  );
};

export default Home;
