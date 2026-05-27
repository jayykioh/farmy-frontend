import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';

export const DiaryHistory: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-6 px-4 md:px-8 mt-6 mb-8 max-w-5xl mx-auto min-h-screen">
      
      {/* Header Section */}
      <section className="flex flex-col gap-2 items-center text-center mt-4">
        <h2 className="text-3xl font-extrabold text-text-h tracking-tight">Farm History</h2>
        <p className="text-lg text-text-main/70">Your weekly progress and diary records.</p>
      </section>

      {/* Bé Thóc Encouragement */}
      <section className="flex items-end gap-4 w-full">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-border-main/50 shrink-0 relative overflow-hidden p-1 shadow-sm">
          <MascotLottie className="w-full h-full -mt-1" />
        </div>
        <div className="relative bg-white border border-border-main/50 rounded-2xl p-4 mb-2 flex-1 shadow-sm">
          <p className="text-base font-medium text-text-main">Great job this week! Your farm is looking healthier than ever. Keep updating your diary!</p>
          {/* Bubble tail */}
          <div className="absolute -bottom-3 left-6 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-white border-r-[12px] border-r-transparent"></div>
          <div className="absolute -bottom-3.5 left-5 w-0 h-0 border-l-[14px] border-l-transparent border-t-[14px] border-t-border-main/50 border-r-[14px] border-r-transparent -z-10"></div>
        </div>
      </section>

      {/* Bento Grid: Stats & Chart */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left Column: Weekly Chart */}
        <div className="bg-white border border-border-main/50 rounded-3xl p-6 flex flex-col gap-4 row-span-2 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-text-h">Weekly Progress</h3>
            <span className="bg-secondary-light/30 text-secondary-dark px-3 py-1 rounded-full font-bold text-sm">This Week</span>
          </div>
          {/* Simple Bar Chart */}
          <div className="flex-1 flex items-end justify-between gap-2 h-48 mt-4 bg-bg-surface-1 border border-border-main/30 rounded-2xl p-4">
            {[{ day: 'M', h: '40%' }, { day: 'T', h: '65%' }, { day: 'W', h: '85%' }, { day: 'T', h: '50%' }, { day: 'F', h: '90%' }, { day: 'S', h: '30%' }, { day: 'S', h: '10%' }].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end w-full group">
                <div className="w-full bg-bg-surface h-32 relative flex items-end overflow-hidden rounded-full">
                  <div className="bg-primary w-full rounded-full transition-all duration-500 ease-out group-hover:bg-primary-dark" style={{ height: item.h }}></div>
                </div>
                <span className="font-bold text-text-main/70">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stats Cards */}
        <div className="bg-white border border-border-main/50 rounded-3xl flex flex-col justify-center items-center text-center p-6 shadow-sm hover:shadow-md transition-shadow">
          <svg className="w-10 h-10 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p className="text-base text-text-main/70 mb-1">Last update</p>
          <h4 className="text-2xl font-extrabold text-text-main">05:30 AM</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-border-main/50 rounded-3xl flex flex-col justify-center items-center text-center p-4 shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p className="font-bold text-sm text-text-main/70 mb-1">Total care</p>
            <h4 className="text-xl font-bold text-text-main">8h 16m</h4>
          </div>
          <div className="bg-white border border-border-main/50 rounded-3xl flex flex-col justify-center items-center text-center p-4 shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <p className="font-bold text-sm text-text-main/70 mb-1">Completion</p>
            <h4 className="text-xl font-bold text-text-main">82%</h4>
          </div>
        </div>

      </section>

      {/* Recent Diary Entries List */}
      <section className="flex flex-col gap-4 mt-2">
        <h3 className="text-2xl font-bold text-text-h mb-2">Recent Entries</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Entry 1 */}
          <div className="bg-white border border-border-main/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-bg-surface-1 transition-colors shadow-sm hover:shadow-md active:scale-95 group">
            <div className="w-12 h-12 rounded-full bg-primary-lightest/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-text-main truncate">Fertilized Tomatoes</h4>
              <p className="text-sm text-text-main/70 truncate">Added organic compost to rows A and B.</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="font-bold text-sm text-text-main/50">Today</span>
              <span className="bg-primary/10 text-primary-container px-2 py-0.5 rounded-full font-bold text-[11px]">Completed</span>
            </div>
          </div>

          {/* Entry 2 */}
          <div className="bg-white border border-border-main/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-bg-surface-1 transition-colors shadow-sm hover:shadow-md active:scale-95 group">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20a6 6 0 01-6-6c0-4 6-10.75 6-10.75S18 10 18 14a6 6 0 01-6 6z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-text-main truncate">Watering Schedule</h4>
              <p className="text-sm text-text-main/70 truncate">Morning hydration for the greenhouse.</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="font-bold text-sm text-text-main/50">Yesterday</span>
              <span className="bg-primary/10 text-primary-container px-2 py-0.5 rounded-full font-bold text-[11px]">Completed</span>
            </div>
          </div>

          {/* Entry 3 */}
          <div className="bg-white border border-border-main/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-bg-surface-1 transition-colors opacity-75 shadow-sm hover:shadow-md active:scale-95 hover:opacity-100 group">
            <div className="w-12 h-12 rounded-full bg-error-container/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-error" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-bold text-text-main truncate">Pest Inspection</h4>
              <p className="text-sm text-text-main/70 truncate">Checking for aphids on the peppers.</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="font-bold text-sm text-text-main/50">Oct 12</span>
              <span className="bg-secondary-light/30 text-secondary-dark px-2 py-0.5 rounded-full font-bold text-[11px]">Pending</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/diary')}
          className="w-full md:w-auto md:mx-auto md:px-12 bg-white border border-border-main/50 text-text-main py-4 rounded-full font-bold text-lg mt-4 shadow-sm hover:bg-bg-surface active:scale-95 transition-all"
        >
          View All Records
        </button>
      </section>
      
    </div>
  );
};

export default DiaryHistory;
