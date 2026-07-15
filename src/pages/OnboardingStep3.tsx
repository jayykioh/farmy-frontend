import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BellRing, CheckCircle2 } from 'lucide-react';
import { MascotLottie } from '../components/MascotLottie';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { completeOnboarding } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export const OnboardingStep3: React.FC = () => {
  const navigate = useNavigate();
  const { checkingAuth } = useRequireAuth();

  const handleFinish = async () => {
    const farmName = localStorage.getItem('onboarding_farmName') || 'Vườn Nhà Bé Thóc';
    const selectedCrop = localStorage.getItem('onboarding_selectedCrop') || 'lua-nuoc';

    // Update local auth store optimistically to prevent redirect loop
    const user = useAuthStore.getState().user;
    if (user) {
      useAuthStore.getState().setSession({
        user: { ...user, onboardingCompleted: true }
      });
      // Persist to localStorage immediately as fallback in case API fails
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    }

    try {
      await completeOnboarding({
        onboarding_completed: true,
        farmName,
        primaryCrops: selectedCrop,
      });

      // Clear onboarding temp data on success
      localStorage.removeItem('onboarding_farmName');
      localStorage.removeItem('onboarding_selectedCrop');
    } catch (error) {
      console.error('Failed to complete onboarding on server, but proceeding locally:', error);
      // localStorage flag already set above — user will not be looped
    } finally {
      navigate('/home');
    }
  };

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="w-full h-full min-h-[100svh] relative text-left bg-[linear-gradient(180deg,#dbeafe_0%,#f7fff7_52%,#ecfdf5_100%)] overflow-hidden font-sans">
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_1px_1px,rgba(20,30,23,0.14)_1px,transparent_0)] [background-size:28px_28px]" />

      {/* Top App Bar (Branding) */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between mx-auto max-w-[1024px]">
        <button
          onClick={() => navigate('/onboarding-2')}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/85 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,30,23,0.06)] border border-white/80 text-slate-700 transition-all hover:-translate-y-0.5 hover:text-slate-950 active:scale-90"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex h-10 items-center justify-center rounded-full bg-white/85 px-5 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,30,23,0.06)] border border-white/80">
          <span className="text-sm font-extrabold text-slate-800 tracking-tight">FarmDiaries</span>
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      {/* Main Canvas */}
      <main className="relative flex-1 w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center pt-24 pb-24 md:pb-0 h-screen md:h-screen">
        {/* Mascot Section */}
        <div className="relative w-full aspect-square md:aspect-auto md:w-1/2 flex items-center justify-center z-10 md:h-full">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Mascot Lottie */}
            <MascotLottie state="sleepy" className="w-full h-full" />
            {/* Floating Bell Element */}
            <div className="absolute bottom-10 right-10 origin-top animate-[spin_2s_ease-in-out_infinite]">
              <BellRing className="w-12 h-12 text-[#FFC107] drop-shadow-md" />
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
        <section className="w-full md:w-1/2 bg-white/95 md:bg-white/90 md:backdrop-blur-xl z-50 rounded-t-[40px] md:rounded-3xl px-6 pt-8 pb-12 flex flex-col items-center gap-6 shadow-[0_-20px_60px_rgba(20,30,23,0.08)] md:shadow-[0_24px_70px_rgba(20,30,23,0.12)] md:border md:border-border-main/45 transition-transform self-end md:self-center md:mr-8 md:py-12 absolute md:relative bottom-0 md:bottom-auto">

          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5 mb-2" aria-label="Onboarding progress: step 3 of 3">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="h-1.5 w-6 rounded-full bg-slate-800" />
          </div>

          {/* Content */}
          <div className="text-center space-y-4 px-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.10] text-primary-container shadow-inner">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-container/55">Almost ready</p>
            <h2 className="text-2xl font-black text-text-h leading-tight md:text-3xl">
              Nhận thông báo trình duyệt
            </h2>
            <p className="text-base font-semibold leading-7 text-text-main/65">
              Cho phép Bé Thóc gửi thông báo nhanh để cập nhật tình trạng sức khỏe cây trồng của bạn.
            </p>
          </div>

          {/* Action Area */}
          <div className="w-full max-w-[340px] mt-6 space-y-4">
            <button
              onClick={handleFinish}
              className="group flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary-container text-base font-extrabold text-white shadow-[0_16px_34px_rgba(0,109,53,0.24)] transition-all hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_20px_42px_rgba(8,168,85,0.28)] active:scale-[0.98]"
            >
              <span className="relative">Cho phép thông báo</span>
              <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="flex justify-center pt-2">
              <button
                onClick={handleFinish}
                className="text-text-main/50 font-bold hover:text-text-main text-sm transition-colors cursor-pointer"
              >
                Để sau
              </button>
            </div>
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
