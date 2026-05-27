import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';

export const OnboardingStep1: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-gradient-to-b from-bg-surface via-bg-main to-primary-lightest/20 text-left font-sans">
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-primary-lightest/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-secondary-light/35 blur-3xl" />

      {/* Responsive onboarding app bar */}
      <header className="fixed left-4 right-4 top-4 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/60 bg-white/80 px-4 py-3 shadow-[0_12px_32px_rgba(20,30,23,0.08)] backdrop-blur-md md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-primary-container shadow-sm">
            <MascotLottie className="h-12 w-12 -mt-2" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-extrabold tracking-tight text-primary md:text-xl">FarmDiaries AI</h1>
            <p className="hidden text-xs font-extrabold uppercase tracking-[0.18em] text-text-secondary/70 md:block">Farm setup</p>
          </div>
        </div>
        <div className="hidden rounded-full border border-border-main/60 bg-bg-surface-1 px-4 py-2 text-sm font-extrabold text-text-secondary lg:block">
          Bước 1 trong 3
        </div>
        <button aria-label="Notifications" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-primary transition-colors duration-200 hover:bg-bg-surface-1 focus:outline-none focus:ring-2 focus:ring-primary-light active:scale-95">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-6xl grid-cols-1 items-end px-4 pb-0 pt-28 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(440px,520px)] lg:items-center lg:gap-12 lg:pb-8 lg:pt-28">
        {/* Mascot / desktop story panel */}
        <section className="relative flex min-h-[280px] w-full flex-col items-center justify-center px-2 pb-6 lg:min-h-[520px] lg:items-start lg:rounded-[36px] lg:border lg:border-white/70 lg:bg-white/45 lg:p-8 lg:shadow-[0_24px_80px_rgba(20,30,23,0.08)] lg:backdrop-blur-md">
          <div className="absolute inset-x-8 bottom-10 hidden h-24 rounded-full bg-primary-lightest/20 blur-3xl lg:block" />

          <div className="relative z-10 flex flex-col items-center lg:items-start">
            <div className="mb-4 hidden max-w-lg lg:block">
              <p className="mb-3 inline-flex rounded-full border border-border-main/60 bg-bg-surface/80 px-4 py-2 text-sm font-extrabold text-primary shadow-sm">
                Thiết lập lần đầu
              </p>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-text-h xl:text-5xl">
                Tạo không gian chăm vườn của bạn
              </h2>
              <p className="mt-3 max-w-md text-base font-semibold leading-7 text-text-secondary xl:text-lg">
                Bé Thóc sẽ dùng thông tin này để cá nhân hóa nhật ký, nhắc việc và gợi ý chăm sóc cây trồng hằng ngày.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -top-12 right-0 z-20 rounded-[20px] rounded-bl-sm border border-border-main/50 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-md lg:-right-8 lg:-top-4">
                <p className="font-bold text-primary">Chào bạn mới!</p>
                <div className="absolute bottom-[-8px] left-4 h-4 w-4 rotate-45 border-b border-r border-border-main/50 bg-white/90" />
              </div>
              <MascotLottie className="h-52 w-52 drop-shadow-2xl md:h-60 md:w-60 lg:h-64 lg:w-64 xl:h-72 xl:w-72" />
              <div className="absolute bottom-5 left-1/2 h-4 w-40 -translate-x-1/2 rounded-full bg-text-main/10 blur-md lg:w-56" />
            </div>

            <div className="mt-4 hidden grid-cols-3 gap-3 lg:grid">
              <div className="rounded-2xl border border-border-main/60 bg-bg-surface/80 p-3 text-center shadow-sm">
                <p className="text-xl font-black text-primary">3</p>
                <p className="text-xs font-extrabold text-text-secondary/70">bước thiết lập</p>
              </div>
              <div className="rounded-2xl border border-border-main/60 bg-bg-surface/80 p-3 text-center shadow-sm">
                <p className="text-xl font-black text-primary">+XP</p>
                <p className="text-xs font-extrabold text-text-secondary/70">habit loop</p>
              </div>
              <div className="rounded-2xl border border-border-main/60 bg-bg-surface/80 p-3 text-center shadow-sm">
                <p className="text-xl font-black text-primary">AI</p>
                <p className="text-xs font-extrabold text-text-secondary/70">cá nhân hóa</p>
              </div>
            </div>
          </div>
        </section>

        {/* Setup panel */}
        <section className="z-20 flex w-full flex-col items-center gap-6 rounded-t-[40px] border-x border-t border-border-main/40 bg-white/90 px-6 pb-10 pt-8 shadow-[0_-20px_60px_rgba(0,0,0,0.05)] backdrop-blur-md md:mx-auto md:max-w-[520px] md:rounded-[32px] md:border md:shadow-[0_24px_70px_rgba(20,30,23,0.10)] lg:mx-0 lg:min-h-0 lg:p-8">
          <div className="mb-2 h-1.5 w-12 rounded-full bg-text-main/10 lg:hidden" />

          <div className="flex items-center gap-2" aria-label="Onboarding progress: step 1 of 3">
            <div className="h-2.5 w-8 rounded-full bg-primary-container" />
            <div className="h-2.5 w-2.5 rounded-full bg-border-main" />
            <div className="h-2.5 w-2.5 rounded-full bg-border-main" />
          </div>

          <div className="w-full space-y-7">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-black text-text-h md:text-3xl">Thiết lập nông trại</h2>
              <p className="mx-auto max-w-sm text-base font-semibold leading-7 text-text-main/70">Hãy đặt tên cho mảnh vườn yêu thương để Bé Thóc cá nhân hóa trải nghiệm chăm sóc.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="farm-name" className="ml-2 text-sm font-bold text-text-main/70">Tên nông trại của bạn</label>
                <div className="relative">
                  <input id="farm-name" className="h-14 w-full rounded-full border border-border-main/50 bg-bg-main px-6 text-base font-semibold transition-all placeholder:text-text-main/30 focus:outline-none focus:ring-2 focus:ring-primary-container" placeholder="Ví dụ: Vườn Nhà Bé Thóc" type="text" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="ml-2 text-sm font-bold text-text-main/70">Loại cây trồng chính</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                  <button type="button" className="min-h-12 cursor-pointer rounded-full bg-primary-container px-5 py-3 font-bold text-white shadow-lg transition-colors duration-200 hover:bg-primary active:scale-95">
                    Lúa nước
                  </button>
                  <button type="button" className="min-h-12 cursor-pointer rounded-full border border-border-main bg-white px-5 py-3 font-bold text-text-main/70 transition-colors duration-200 hover:bg-bg-surface active:scale-95">
                    Cây ăn trái
                  </button>
                  <button type="button" className="min-h-12 cursor-pointer rounded-full border border-border-main bg-white px-5 py-3 font-bold text-text-main/70 transition-colors duration-200 hover:bg-bg-surface active:scale-95">
                    Cà phê
                  </button>
                  <button type="button" className="min-h-12 cursor-pointer rounded-full border border-border-main bg-white px-5 py-3 font-bold text-text-main/70 transition-colors duration-200 hover:bg-bg-surface active:scale-95">
                    Rau màu
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/onboarding-2')}
                className="group flex h-16 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary-container text-lg font-bold text-white shadow-[0_10px_20px_rgba(0,109,53,0.2),inset_0_-4px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:bg-primary active:scale-95 active:shadow-[0_4px_10px_rgba(0,109,53,0.1),inset_0_-2px_0_rgba(0,0,0,0.05)] focus:outline-none focus:ring-4 focus:ring-primary-light/50"
              >
                Tiếp theo
                <svg className="h-6 w-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <p className="mt-6 text-center text-sm font-bold text-border-main">Bước 1 trong 3</p>
            </div>
          </div>
        </section>
      </main>

      <div className="pointer-events-none fixed bottom-0 left-0 z-[1] h-[120px] w-full bg-gradient-to-t from-primary/20 to-transparent md:h-[200px]" />
    </div>
  );
};

export default OnboardingStep1;
