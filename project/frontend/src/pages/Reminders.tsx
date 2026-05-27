import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';

export const Reminders: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-surface-1 relative text-left font-sans flex flex-col pb-32">
      
      <PageHeader 
        title="Nhắc nhở của tôi"
        leftButton="back"
        rightButton="notification"
      />

      {/* Ambient Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-light/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary-light/20 rounded-full blur-3xl"></div>
      </div>

      <main className="pt-[88px] px-4 md:px-8 pb-24 relative z-10 w-full max-w-3xl mx-auto">
        
        {/* Mascot Card */}
        <div className="bg-white border border-primary/20 shadow-sm rounded-[24px] p-4 mb-6 flex items-center gap-4 relative">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-primary/20 shadow-sm relative flex-shrink-0 p-1">
            <MascotLottie className="w-full h-full -mt-1" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-base text-text-main">
              Đừng quên chăm sóc cây đúng giờ để nhận được <strong className="text-secondary-dark bg-secondary-light/30 px-1 rounded font-extrabold">gấp đôi XP</strong> nhé!
            </p>
          </div>
        </div>

        {/* Section: Upcoming */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-text-h mb-4">Sắp tới</h2>
          <div className="flex flex-col gap-3">
            
            {/* Item A */}
            <div className="bg-white border border-border-main/50 shadow-sm rounded-[20px] p-4 flex items-center gap-4 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20a6 6 0 01-6-6c0-4 6-10.75 6-10.75S18 10 18 14a6 6 0 01-6 6z"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-text-main">Tưới nước Cây Lúa</h3>
                <p className="text-xs text-text-main/70 flex items-center gap-1 mt-1 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                  08:00 hàng ngày
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-bg-surface text-text-main/70 rounded-full text-[10px] font-bold border border-border-main/50">Push</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full text-[10px] font-bold border border-blue-100">Zalo</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-12 h-6 bg-border-main/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            </div>

            {/* Item B */}
            <div className="bg-white border border-border-main/50 shadow-sm rounded-[20px] p-4 flex items-center gap-4 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-primary-lightest/30 border border-primary-lightest flex items-center justify-center text-primary-container shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h1M20 13h1m-9-9v1m0 16v1m-5.636-2.364l.707-.707m11.314-11.314l.707-.707M5.636 5.636l.707.707m11.314 11.314l.707.707M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-text-main">Bón phân</h3>
                <p className="text-xs text-text-main/70 flex items-center gap-1 mt-1 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                  Thứ 2 hàng tuần
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-bg-surface text-text-main/70 rounded-full text-[10px] font-bold border border-border-main/50">Push</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-12 h-6 bg-border-main/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            </div>

            {/* Item C */}
            <div className="bg-white border border-border-main/50 shadow-sm rounded-[20px] p-4 flex items-center gap-4 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-error-container/30 border border-error-container flex items-center justify-center text-error shadow-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8z" /></svg>
              </div>
              <div className="flex-1 opacity-70">
                <h3 className="font-bold text-base text-text-main">Phun thuốc</h3>
                <p className="text-xs text-text-main/70 flex items-center gap-1 mt-1 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Ngày 20/10
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-bg-surface text-text-main/70 rounded-full text-[10px] font-bold border border-border-main/50">Push</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full text-[10px] font-bold border border-blue-100">Zalo</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-6 bg-border-main/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            </div>

          </div>
        </section>

        {/* Section: Past */}
        <section>
          <h2 className="text-lg font-bold text-text-main/70 mb-4">Đã qua</h2>
          <div className="flex flex-col gap-3">
            
            {/* Past Item */}
            <div className="bg-bg-surface border border-border-main/30 shadow-sm rounded-[20px] p-4 flex items-center gap-4 opacity-70">
              <div className="w-12 h-12 rounded-full bg-border-main/50 flex items-center justify-center text-text-main/50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-text-main/70 line-through">Kiểm tra sâu bệnh</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-container">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* FAB */}
      <button 
        onClick={() => navigate('/reminder/create')}
        className="fixed bottom-[100px] right-6 md:right-8 lg:right-1/2 lg:translate-x-[360px] w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-40"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

    </div>
  );
};

export default Reminders;
