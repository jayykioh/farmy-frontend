import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { ArrowRight, Apple, CheckCircle2, Coffee, Leaf, Sprout, Wheat } from 'lucide-react';
import { useRequireAuth } from '../hooks/useRequireAuth';

export const OnboardingStep1: React.FC = () => {
  const navigate = useNavigate();
  const { checkingAuth } = useRequireAuth();
  const [selectedCrop, setSelectedCrop] = useState<string>('lua-nuoc');
  const [farmName, setFarmName] = useState<string>('');

  const crops = [
    { id: 'lua-nuoc', label: 'Lúa nước', description: 'Ruộng mùa vụ', icon: Wheat },
    { id: 'cay-an-trai', label: 'Cây ăn trái', description: 'Vườn lâu năm', icon: Apple },
    { id: 'ca-phe', label: 'Cà phê', description: 'Canh tác cao nguyên', icon: Coffee },
    { id: 'rau-mau', label: 'Rau màu', description: 'Luân canh ngắn ngày', icon: Leaf },
    { id: 'khac', label: 'Khác', description: 'Tự cá nhân hóa', icon: Sprout },
  ];

  if (checkingAuth) {
    return null;
  }

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden bg-gradient-to-b from-bg-surface via-bg-main to-primary-lightest/20 text-left font-sans">
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-primary-lightest/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-secondary-light/35 blur-3xl" />

      {/* Responsive onboarding app bar */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between mx-auto max-w-[1024px]">
        <div className="w-10 h-10" /> {/* Spacer */}
        <div className="flex h-10 items-center justify-center rounded-full bg-white/85 px-5 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,30,23,0.06)] border border-white/80">
          <span className="text-sm font-extrabold text-slate-800 tracking-tight">FarmDiaries</span>
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      <main className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-6xl grid-cols-1 items-end px-4 pb-0 pt-28 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(440px,520px)] lg:items-center lg:gap-12 lg:pb-8 lg:pt-28">
        {/* Mascot / desktop story panel */}
        <section className="relative flex min-h-[280px] w-full flex-col items-center justify-center px-2 pb-6 lg:min-h-[520px] lg:items-start lg:rounded-[36px] lg:border lg:border-white/70 lg:bg-white/50 lg:p-8 lg:shadow-[0_24px_80px_rgba(20,30,23,0.09)] lg:backdrop-blur-xl">
          <div className="absolute inset-x-8 bottom-10 hidden h-24 rounded-full bg-primary-lightest/20 blur-3xl lg:block" />

          <div className="relative z-10 flex flex-col items-center lg:items-start">
            <div className="mb-4 hidden max-w-lg lg:block">
              <p className="mb-3 inline-flex rounded-full border border-emerald-100 bg-white/85 px-4 py-2 text-sm font-extrabold text-primary-container shadow-sm">
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
              <MascotLottie state="excited" className="h-52 w-52 drop-shadow-2xl md:h-60 md:w-60 lg:h-64 lg:w-64 xl:h-72 xl:w-72" />
              <div className="absolute bottom-5 left-1/2 h-4 w-40 -translate-x-1/2 rounded-full bg-text-main/10 blur-md lg:w-56" />
            </div>


          </div>
        </section>

        {/* Setup panel */}
        <section className="z-20 flex w-full flex-col items-center gap-6 rounded-t-[40px] border-x border-t border-border-main/40 bg-white/[0.92] px-6 pb-10 pt-8 shadow-[0_-20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl md:mx-auto md:max-w-[460px] md:rounded-[32px] md:border md:shadow-[0_24px_70px_rgba(20,30,23,0.12)] lg:mx-0 lg:min-h-0 lg:p-8">
          <div className="mb-2 h-1.5 w-12 rounded-full bg-text-main/10 lg:hidden" />

          <div className="flex items-center gap-1.5 mb-2" aria-label="Onboarding progress: step 1 of 3">
            <div className="h-1.5 w-6 rounded-full bg-slate-800" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          </div>

          <div className="w-full space-y-7">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-black text-text-h md:text-3xl">Thiết lập nông trại</h2>
              <p className="mx-auto max-w-sm text-base font-semibold leading-7 text-text-main/70">Hãy đặt tên cho mảnh vườn yêu thương để Bé Thóc cá nhân hóa trải nghiệm chăm sóc.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 w-full max-w-[340px] mx-auto text-left">
                <label htmlFor="farm-name" className="ml-2 text-sm font-bold text-text-main/70">Tên nông trại của bạn</label>
                <div className="relative">
                  <input
                    id="farm-name"
                    className="h-14 w-full rounded-2xl border border-border-main/45 bg-white px-5 text-base font-semibold shadow-[0_8px_24px_rgba(20,30,23,0.04)] transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:outline-none focus:ring-4 focus:ring-primary/10"
                    placeholder="Ví dụ: Vườn Nhà Bé Thóc"
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 w-full max-w-[340px] mx-auto text-left">
                <label className="ml-2 text-xs font-black uppercase tracking-wider text-text-main/50">Loại cây trồng chính</label>
                <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  {crops.map((crop) => {
                    const isSelected = selectedCrop === crop.id;
                    const CropIcon = crop.icon;
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => setSelectedCrop(crop.id)}
                        className={`group relative flex min-h-[74px] cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10 ${
                          isSelected
                            ? 'border-primary/30 bg-primary-container text-white shadow-[0_14px_30px_rgba(8,168,85,0.20)]'
                            : 'border-border-main/45 bg-white text-slate-800 shadow-[0_8px_22px_rgba(20,30,23,0.04)] hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_28px_rgba(20,30,23,0.08)]'
                        } active:scale-[0.98]`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isSelected ? 'bg-white/15' : 'bg-primary/[0.08] text-primary-container'}`}>
                          <CropIcon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-black leading-tight">{crop.label}</span>
                          <span className={`mt-0.5 block text-xs font-bold leading-tight ${isSelected ? 'text-white/70' : 'text-text-main/45'}`}>{crop.description}</span>
                        </span>
                        {isSelected ? <CheckCircle2 className="h-5 w-5 shrink-0 text-white" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 w-full max-w-[340px] mx-auto mt-2 mb-4">
              <button
                onClick={() => {
                  localStorage.setItem('onboarding_farmName', farmName || 'Vườn Nhà Bé Thóc');
                  localStorage.setItem('onboarding_selectedCrop', selectedCrop);
                  navigate('/onboarding-2');
                }}
                className="group flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary-container text-base font-extrabold text-white shadow-[0_16px_34px_rgba(0,109,53,0.24)] transition-all hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_20px_42px_rgba(8,168,85,0.28)] active:scale-[0.98]"
              >
                <span className="relative">Tiếp theo</span>
                <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <div className="pointer-events-none fixed bottom-0 left-0 z-[1] h-[120px] w-full bg-gradient-to-t from-primary/20 to-transparent md:h-[200px]" />
    </div>
  );
};

export default OnboardingStep1;
