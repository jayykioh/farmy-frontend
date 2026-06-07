import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';

export const CreateReminder: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-surface-1 relative text-left font-sans flex flex-col">
      
      {/* Background Content Layer (Diorama effect) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary-light/30 blur-[60px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-48 h-48 bg-secondary-light/40 blur-[80px] rounded-full"></div>
      </div>

      {/* Main Content Simulation (Behind Sheet) */}
      <div className="w-full h-full p-6 pb-40 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-border-main/50 shadow-sm bg-white p-0.5">
              <MascotLottie className="w-full h-full -mt-1" />
            </div>
            <div>
              <p className="font-bold text-xs text-text-main/70">Chào buổi sáng,</p>
              <p className="text-xl font-extrabold text-text-h">Vườn của bạn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet Overlay */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity" onClick={() => navigate(-1)}></div>

      {/* SCR-09B: Create Reminder Sheet / Modal */}
      {/* On mobile: Bottom sheet. On desktop: Centered Modal */}
      <div className="fixed bottom-0 top-[15%] md:top-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-2xl md:w-[90vw] md:h-auto md:max-h-[85vh] bg-white rounded-t-[40px] md:rounded-[40px] z-50 flex flex-col shadow-2xl overflow-hidden border border-border-main/20">
        
        {/* Sheet Handle */}
        <div className="w-full flex justify-center py-4 md:hidden">
          <div className="w-12 h-1.5 bg-border-main/50 rounded-full"></div>
        </div>

        {/* Page Header for Modal */}
        <PageHeader 
          title="Thêm nhắc nhở"
          leftButton="close"
          rightButton="none"
          showOnDesktop={true}
          className="relative bg-white/100 border-b static w-full z-10 max-w-none left-0 -translate-x-0 md:rounded-t-[40px]"
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-32 md:pb-36">
          
          {/* Section 1: Hoạt động vườn */}
          <div className="mb-6">
            <label className="font-bold text-sm text-text-main/70 mb-2 block">Hoạt động vườn</label>
            <div className="relative mb-4">
              <input 
                className="w-full px-6 py-4 bg-bg-surface-1 rounded-[20px] border border-border-main/30 focus:border-primary-container focus:ring-1 focus:ring-primary-container font-medium text-base text-text-main placeholder:text-text-main/50 shadow-sm transition-shadow" 
                placeholder="Nhập hoạt động mới..." 
                type="text"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-full font-bold text-sm flex items-center gap-1 shadow-md active:scale-95 transition-all scale-105">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> 
                Tưới nước
              </button>
              <button className="px-4 py-2 bg-bg-surface-1 border border-border-main/50 text-text-main/70 rounded-full font-bold text-sm flex items-center gap-1 hover:bg-border-main/30 active:scale-95 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h1M20 13h1m-9-9v1m0 16v1m-5.636-2.364l.707-.707m11.314-11.314l.707-.707M5.636 5.636l.707.707m11.314 11.314l.707.707M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg> 
                Bón phân
              </button>
              <button className="px-4 py-2 bg-bg-surface-1 border border-border-main/50 text-text-main/70 rounded-full font-bold text-sm flex items-center gap-1 hover:bg-border-main/30 active:scale-95 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l-7-7m7 7l-2 2m2-2l2-2" /></svg> 
                Phun thuốc
              </button>
              <button className="px-4 py-2 bg-bg-surface-1 border border-border-main/50 text-text-main/70 rounded-full font-bold text-sm flex items-center gap-1 hover:bg-border-main/30 active:scale-95 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> 
                Làm cỏ
              </button>
            </div>
          </div>

          {/* Section 2: Thời gian nhắc nhở */}
          <div className="mb-6">
            <label className="font-bold text-sm text-text-main/70 mb-2 block">Thời gian nhắc nhở</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-surface-1 border border-border-main/30 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-border-main/20 active:scale-95 transition-all shadow-sm">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-[10px] text-text-main/50 uppercase font-extrabold tracking-wider">Giờ</p>
                  <p className="text-lg font-extrabold text-text-main">08:30 AM</p>
                </div>
              </div>
              <div className="bg-bg-surface-1 border border-border-main/30 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-border-main/20 active:scale-95 transition-all shadow-sm">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-[10px] text-text-main/50 uppercase font-extrabold tracking-wider">Ngày</p>
                  <p className="text-lg font-extrabold text-text-main">Hôm nay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tần suất lặp lại */}
          <div className="mb-6">
            <label className="font-bold text-sm text-text-main/70 mb-2 block">Tần suất lặp lại</label>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-bg-surface-1 text-text-main/70 rounded-full font-bold text-sm border border-border-main/30 hover:border-primary/20 transition-all active:scale-95">
                Không lặp
              </button>
              <button className="px-4 py-2 bg-primary-lightest/30 text-primary-container border border-primary-lightest rounded-full font-bold text-sm shadow-sm">
                Hàng ngày
              </button>
              <button className="px-4 py-2 bg-bg-surface-1 text-text-main/70 rounded-full font-bold text-sm border border-border-main/30 hover:border-primary/20 transition-all active:scale-95">
                Hàng tuần
              </button>
              <button className="px-4 py-2 bg-bg-surface-1 text-text-main/70 rounded-full font-bold text-sm border border-border-main/30 hover:border-primary/20 transition-all active:scale-95">
                Hàng tháng
              </button>
            </div>
          </div>

          {/* Section 4: Kênh nhận thông báo */}
          <div className="mb-6">
            <label className="font-bold text-sm text-text-main/70 mb-4 block">Kênh nhận thông báo</label>
            <div className="space-y-3">
              
              <div className="flex items-center justify-between p-4 bg-white border border-border-main/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> 
                  </div>
                  <span className="font-bold text-base text-text-main">💬 Nhận qua Zalo</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-12 h-6 bg-border-main/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-border-main/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-lightest/20 flex items-center justify-center text-primary border border-primary/20">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <span className="font-bold text-base text-text-main">🔔 Thông báo đẩy thiết bị</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-12 h-6 bg-border-main/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                </label>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 bg-white/90 backdrop-blur-md border-t border-border-main/30 flex flex-col items-center gap-3 absolute bottom-0 w-full z-10 md:rounded-b-[40px]">
          <button 
            onClick={() => navigate('/reminders')}
            className="w-full py-4 bg-primary text-white font-bold text-lg rounded-full shadow-[0_10px_20px_rgba(8,168,85,0.2)] hover:scale-[1.02] active:scale-95 active:shadow-sm transition-all"
          >
            Đặt nhắc nhở
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="text-text-main/50 font-bold hover:text-text-main transition-colors py-2"
          >
            Hủy bỏ
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateReminder;
