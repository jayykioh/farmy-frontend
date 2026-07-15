import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PetMascot } from '../features/pet/components/PetMascot';
import { SnapCard } from '../components/SnapCard';
import { mockSnaps } from '../mocks/snapData';
import { SnapFAB } from '../components/SnapFAB';
import { Flame, Droplets, ScanLine, MessageSquare, PenLine, Sprout, ChevronRight } from 'lucide-react';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Fetch authoritative pet status from backend
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const streak = petStatus.streakCount;
  const level  = petStatus.level;
  const xp     = petStatus.exp;
  const bubbleMessage = petStatus.bubbleMessage;

  return (
    <div className="relative w-full flex flex-col gap-6 md:gap-8 px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[760px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />
      
      {/* Desktop Grid Layout Wrapper */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-8 lg:gap-12 w-full">
        
        {/* Left Column (Main Focus) */}
        <div className="flex flex-col col-span-12 md:col-span-7 lg:col-span-8 gap-6 md:gap-8">
          
          {/* Header & Streak */}
          <section className="flex flex-col items-center md:items-start text-center md:text-left mt-2 md:mt-0">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xl ring-1 ring-white/80 shadow-[0_10px_28px_rgba(20,30,23,0.06)] rounded-full px-4 py-1.5 mb-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(20,30,23,0.09)]">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="font-bold text-slate-700 text-sm">{streak}-day streak</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">Good morning,<br className="hidden md:block lg:hidden" /> Nông Dân!</h2>
            <p className="text-slate-500 mt-3 font-medium text-base md:text-lg">Bạn đã sẵn sàng để chăm sóc nông trại hôm nay chưa?</p>
          </section>
          
          {/* Mascot Emotional Anchor */}
          <section className="flex justify-center relative w-full aspect-square max-h-[320px] md:aspect-auto md:max-h-none md:h-80 lg:h-96 mt-2 mb-6 md:mb-0">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/12 via-secondary-container/10 to-transparent rounded-[40px] scale-90 blur-2xl opacity-80 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            {/* Mascot Container */}
            <div className="relative w-full h-full max-w-[280px] md:max-w-[400px] rounded-[32px] md:rounded-[40px] overflow-visible md:overflow-hidden bg-white/55 backdrop-blur-xl ring-1 ring-white/80 shadow-[0_24px_70px_rgba(20,30,23,0.08),inset_0_1px_0_rgba(255,255,255,0.65)] flex items-center justify-center p-4 md:p-8">
              <PetMascot status={petStatus} size={220} className="w-full h-full drop-shadow-xl transition-transform hover:scale-105 duration-500" />
            </div>
            
            {/* Floating Dialogue Bubble */}
            <div className="absolute -top-4 md:top-8 right-0 md:right-8 bg-white/95 backdrop-blur-md ring-1 ring-white rounded-[24px] rounded-bl-sm px-5 py-3.5 shadow-[0_18px_38px_rgba(20,30,23,0.10)] animate-[bounce_4s_ease-in-out_infinite] max-w-[220px] md:max-w-xs z-10">
              <p className="font-semibold text-slate-700 text-sm md:text-base leading-snug">{bubbleMessage}</p>
            </div>
          </section>

          {/* Main CTA Button (Desktop prominent) */}
          <section className="w-full hidden md:block mt-2">
            <Button 
              onClick={() => navigate('/diary/create')}
              size="lg"
              fullWidth
            >
              <PenLine className="w-5 h-5" />
              <span className="tracking-wide">Ghi nhật ký hôm nay</span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-semibold border border-white/10">+30XP</span>
            </Button>
          </section>

        </div>

        {/* Right Column (Stats & Tasks) */}
        <div className="flex flex-col col-span-12 md:col-span-5 lg:col-span-4 gap-6 md:gap-8">
          
          {/* XP Progress Card */}
          <section className="relative overflow-hidden bg-white/88 backdrop-blur-xl rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col gap-5 shadow-[0_18px_55px_rgba(20,30,23,0.07)] ring-1 ring-white/90 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(20,30,23,0.10)] transition-all duration-300">
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
                <span className="font-bold text-primary-container bg-primary/[0.10] px-3 py-1 rounded-xl text-sm md:text-base">{xp} / {level * 100} XP</span>
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
              {petStatus.moodReason || 'Gần lên cấp rồi! Tiếp tục ghi nhật ký nhé.'}
            </p>
          </section>

          {/* Main CTA Button (Mobile only) */}
          <section className="w-full md:hidden">
            <Button 
              onClick={() => navigate('/diary/create')}
              size="lg"
              fullWidth
            >
              <PenLine className="w-5 h-5" />
              <span className="tracking-wide">Ghi nhật ký</span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-semibold border border-white/10">+30XP</span>
            </Button>
          </section>
          
          {/* Quick Actions Grid */}
          <section className="flex flex-col gap-3 mt-2 md:mt-0">
            <h3 className="hidden md:block text-base font-black text-slate-900 mb-1 px-1">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
              
              {/* Task 1 */}
              <Button 
                onClick={() => navigate('/reminders')}
                variant="outline"
                className="justify-start gap-3 h-auto py-3.5 md:py-4 px-4 md:px-5 w-full text-slate-700 hover:text-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                  <Droplets className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <span className="flex min-w-0 flex-col items-start leading-tight">
                  <span className="font-black">Lịch tưới</span>
                  <span className="mt-1 hidden text-xs font-bold text-slate-400 md:block">Kiểm tra việc hôm nay</span>
                </span>
              </Button>
              
              {/* Task 2 */}
              <Button 
                onClick={() => navigate('/scan')}
                variant="outline"
                className="justify-start gap-3 h-auto py-3.5 md:py-4 px-4 md:px-5 w-full text-slate-700 hover:text-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-primary ring-1 ring-emerald-100">
                  <ScanLine className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <span className="flex min-w-0 flex-col items-start leading-tight">
                  <span className="font-black">Quét cây</span>
                  <span className="mt-1 hidden text-xs font-bold text-slate-400 md:block">Chẩn đoán nhanh bằng AI</span>
                </span>
              </Button>
              
              {/* Task 3 */}
              <Button 
                onClick={() => navigate('/chat')}
                variant="outline"
                className="col-span-2 md:col-span-1 justify-start gap-3 h-auto py-3.5 md:py-4 px-4 md:px-5 w-full text-slate-700 hover:text-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                  <MessageSquare className="w-5 h-5" strokeWidth={1.8} />
                </span>
                <span className="flex min-w-0 flex-col items-start leading-tight">
                  <span className="font-black">Hỏi trợ lý AI</span>
                  <span className="mt-1 hidden text-xs font-bold text-slate-400 md:block">Gợi ý theo lịch sử vườn</span>
                </span>
              </Button>
            </div>
          </section>
        </div>
        
      </div>

      {/* Farm Feed Preview Section */}
      <section className="w-full mt-4 md:mt-8">
        <div className="flex justify-between items-end mb-5 px-1">
          <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Farm Feed gần đây 
            <Sprout className="w-6 h-6 text-primary" />
          </h3>
          <button 
            onClick={() => navigate('/farm-feed')}
            className="group text-primary font-bold text-sm hover:text-primary-dark flex items-center gap-1 active:scale-95 transition-all duration-200"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
