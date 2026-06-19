import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PetMascot } from '../features/pet/components/PetMascot';
import { PET_MOOD_UI_MAP } from '../features/pet/constants/petMood.constants';
import { SnapCard } from '../components/SnapCard';
import { mockSnaps } from '../mocks/snapData';
import { SnapFAB } from '../components/SnapFAB';
import { Flame } from 'lucide-react';
import { useGetPetStateQuery } from '../store/api/farmApi';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: petState } = useGetPetStateQuery();

  // Fetch authoritative pet status from backend
  const { data: petStatus } = usePetStatus();

  const mood   = petStatus?.mood ?? 'neutral';
  const streak = petStatus?.streakCount ?? 0;
  const level  = petStatus?.level ?? 1;
  const xp     = petStatus?.exp ?? 0;
  const bubbleMessage = petStatus?.bubbleMessage ?? PET_MOOD_UI_MAP[mood]?.description ?? 'Chào chủ vườn!';

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8 px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto min-h-screen">
      
      {/* Desktop Grid Layout Wrapper */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-8 lg:gap-12 w-full">
        
        {/* Left Column (Main Focus) */}
        <div className="flex flex-col col-span-12 md:col-span-7 lg:col-span-8 gap-6 md:gap-8">
          
          {/* Header & Streak */}
          <section className="flex flex-col items-center md:items-start text-center md:text-left mt-2 md:mt-0">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md ring-1 ring-slate-200/50 shadow-[0_2px_8px_rgb(0,0,0,0.04)] rounded-full px-4 py-1.5 mb-4 transition-all hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)] hover:ring-slate-200">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="font-bold text-slate-700 text-sm">{streak}-day streak</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight">Good morning,<br className="hidden md:block lg:hidden" /> Nông Dân!</h2>
            <p className="text-slate-500 mt-3 font-medium text-base md:text-lg">Bạn đã sẵn sàng để chăm sóc nông trại hôm nay chưa?</p>
          </section>
          
          {/* Mascot Emotional Anchor */}
          <section className="flex justify-center relative w-full aspect-square max-h-[320px] md:aspect-auto md:max-h-none md:h-80 lg:h-96 mt-2 mb-6 md:mb-0">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[40px] scale-90 blur-2xl opacity-70 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            {/* Mascot Container */}
            <div className="relative w-full h-full max-w-[280px] md:max-w-[400px] rounded-[32px] md:rounded-[40px] overflow-visible md:overflow-hidden bg-white/40 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_8px_32px_rgb(0,0,0,0.04)] flex items-center justify-center p-4 md:p-8">
              <PetMascot status={petStatus} size={220} className="w-full h-full drop-shadow-xl transition-transform hover:scale-105 duration-500" />
            </div>
            
            {/* Floating Dialogue Bubble */}
            <div className="absolute -top-4 md:top-8 right-0 md:right-8 bg-white/95 backdrop-blur-md ring-1 ring-slate-100/80 rounded-[24px] rounded-bl-sm px-5 py-3.5 shadow-[0_8px_24px_rgb(0,0,0,0.08)] animate-[bounce_4s_ease-in-out_infinite] max-w-[220px] md:max-w-xs z-10">
              <p className="font-semibold text-slate-700 text-sm md:text-base leading-snug">{bubbleMessage}</p>
            </div>
          </section>

          {/* Main CTA Button (Desktop prominent) */}
          <section className="w-full hidden md:block mt-2">
            <button 
              onClick={() => navigate('/diary/create')}
              className="group relative w-full overflow-hidden bg-primary text-white font-bold text-lg md:text-xl py-4 md:py-5 px-6 rounded-[24px] shadow-[0_8px_20px_rgba(8,168,85,0.3)] hover:shadow-[0_12px_24px_rgba(8,168,85,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_4px_10px_rgba(8,168,85,0.3)] flex justify-center items-center gap-3 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none opacity-50"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <svg className="w-6 h-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="relative z-10 tracking-wide">Ghi nhật ký hôm nay</span>
              <span className="relative z-10 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg text-sm ml-1 font-semibold border border-white/10">+30XP</span>
            </button>
          </section>

        </div>

        {/* Right Column (Stats & Tasks) */}
        <div className="flex flex-col col-span-12 md:col-span-5 lg:col-span-4 gap-6 md:gap-8">
          
          {/* XP Progress Card */}
          <section className="relative overflow-hidden bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            {/* Decorative background blur */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-slate-400 text-xs tracking-widest uppercase flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  Current Status
                </span>
                <span className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-baseline gap-1">
                  Lv. {level}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-xl text-sm md:text-base">{xp} / {level * 100} XP</span>
              </div>
            </div>
            {/* Modern Progress Bar */}
            <div className="relative z-10 w-full h-3.5 rounded-full bg-slate-100 overflow-hidden ring-1 ring-inset ring-slate-200/50">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(100, (xp / (level * 100)) * 100)}%` }}
              />
            </div>
            <p className="text-sm font-medium text-text-main/50 mt-1">
              {petState?.mood_reason || 'Gần lên cấp rồi! Tiếp tục ghi nhật ký nhé.'}
            </p>
          </section>

          {/* Main CTA Button (Mobile only) */}
          <section className="w-full md:hidden">
            <button 
              onClick={() => navigate('/diary/create')}
              className="group relative w-full overflow-hidden bg-primary text-white font-bold text-lg py-4 px-6 rounded-[20px] shadow-[0_8px_20px_rgba(8,168,85,0.3)] hover:shadow-[0_12px_24px_rgba(8,168,85,0.4)] active:scale-[0.98] active:shadow-[0_4px_10px_rgba(8,168,85,0.3)] flex justify-center items-center gap-3 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none opacity-50"></div>
              <svg className="w-6 h-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="relative z-10 tracking-wide">Ghi nhật ký</span>
              <span className="relative z-10 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg text-sm ml-1 font-semibold border border-white/10">+30XP</span>
            </button>
          </section>
          
          {/* Quick Actions Grid */}
          <section className="flex flex-col gap-3 mt-2 md:mt-0">
            <h3 className="hidden md:block text-base font-bold text-slate-800 mb-1 px-1">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
              
              {/* Task 1 */}
              <button 
                onClick={() => navigate('/reminders')}
                className="group relative overflow-hidden bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] flex flex-col md:flex-row items-center md:justify-start text-center md:text-left gap-3 md:gap-4 ring-1 ring-slate-100 hover:ring-blue-500/20 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] active:scale-[0.98] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-colors duration-300 pointer-events-none"></div>
                <div className="w-12 h-12 shrink-0 rounded-[16px] bg-blue-50/80 text-blue-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-700 text-sm md:text-base group-hover:text-blue-700 transition-colors">Watering check</span>
              </button>
              
              {/* Task 2 */}
              <button 
                onClick={() => navigate('/scan')}
                className="group relative overflow-hidden bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] flex flex-col md:flex-row items-center md:justify-start text-center md:text-left gap-3 md:gap-4 ring-1 ring-slate-100 hover:ring-emerald-500/20 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] active:scale-[0.98] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-colors duration-300 pointer-events-none"></div>
                <div className="w-12 h-12 shrink-0 rounded-[16px] bg-emerald-50/80 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-100/80 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-700 text-sm md:text-base group-hover:text-emerald-700 transition-colors">Plant health scan</span>
              </button>
              
              {/* Task 3 */}
              <button 
                onClick={() => navigate('/chat')}
                className="col-span-2 md:col-span-1 group relative overflow-hidden bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] flex flex-row items-center justify-center md:justify-start text-center md:text-left gap-3 md:gap-4 ring-1 ring-slate-100 hover:ring-purple-500/20 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] active:scale-[0.98] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-colors duration-300 pointer-events-none"></div>
                <div className="w-12 h-12 shrink-0 rounded-[16px] bg-purple-50/80 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-100/80 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-700 text-sm md:text-base group-hover:text-purple-700 transition-colors">Ask AI assistant</span>
              </button>
            </div>
          </section>
        </div>
        
      </div>

      {/* Farm Feed Preview Section */}
      <section className="w-full mt-4 md:mt-8">
        <div className="flex justify-between items-end mb-5 px-1">
          <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Farm Feed gần đây 
            <span className="text-2xl">🌱</span>
          </h3>
          <button 
            onClick={() => navigate('/farm-feed')}
            className="group text-primary font-bold text-sm hover:text-primary-dark flex items-center gap-1 active:scale-95 transition-all duration-200"
          >
            Xem tất cả
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-1">
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
