import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';

import { MapPin, Award, Flame, Droplets, Clock, Target, LogOut, PenLine, Medal, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, isSameMonth, isToday, 
  addMonths, subMonths, startOfDay
} from 'date-fns';
import { vi } from 'date-fns/locale';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout: logoutUser } = useAuthStore();
  const { data: petStatusRaw, isLoading: loading } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const getLevelTitle = (level: number) => {
    if (level < 5) return 'Làm Vườn Tập Sự (Novice Farmer)';
    if (level < 10) return 'Nông Dân Thực Thụ (Active Farmer)';
    if (level < 15) return 'Chuyên Gia Trồng Trọt (Crop Cultivator)';
    return 'Vua Nông Trại (Master Farmer)';
  };

  const xpNeeded = petStatus.level * 100;
  const progressPercent = Math.min(100, Math.max(0, (petStatus.exp / xpNeeded) * 100));

  return (
    <div className="w-full flex flex-col gap-6 px-4 md:px-8 pt-24 pb-[100px] max-w-3xl mx-auto bg-slate-50 min-h-screen selection:bg-primary/20">
      <PageHeader title="Hồ sơ cá nhân" leftButton="none" />
      
      {/* Header / Profile Summary */}
      <section className="flex items-center gap-5 bg-white/80 backdrop-blur-xl p-6 rounded-[28px] border border-white/50 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="w-24 h-24 rounded-full border-[4px] border-white shadow-sm bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden z-10 relative transition-transform duration-500 hover:scale-105">
          <img 
            alt="Farmer Profile" 
            className="w-full h-full object-cover" 
            src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDsbCWDiuGTF5iEwK2O9pm1CMMzFdWx0hc4ellAPSIR0Fd0W04AaUk2McKFTBpkyt54F7qbz59AxRVm00X7l_paTxXsYAhKb0DJ2UtW18iwcftc8NpvHSUtky7QtZ3LYS_Jvnwzb_uyHj7Snd_GZJ5qRjx6kGvs2Y-yZafDMesEmvqIG9HZ3b06V39xa_0py0IGkepiBfpB_L-Nfe8YfQg-4VDdxhF78xd9seUk1RNYLfCuF3wEdwSvukiK2uu0wpN98-IjRJs9NRru"} 
          />
        </div>
        <div className="flex-1 z-10">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-1 tracking-tight">{user?.name || 'Nông dân Ẩn danh'}</h2>
          <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">
            <MapPin className="w-4 h-4" />
            Mekong Delta, Vietnam
          </p>
        </div>
        {/* Badge overlay */}
        {user?.role !== 'admin' && user?.role !== 'moderator' && (
          <div className="absolute right-4 top-4 bg-gradient-to-r from-amber-100 to-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full font-bold text-xs border border-yellow-200/50 flex items-center gap-1.5 z-10 shadow-sm backdrop-blur-md">
            <Award className="w-4 h-4" />
            {petStatus.level >= 15 ? 'Vua Nông Trại' : petStatus.level >= 10 ? 'Chuyên Gia' : 'Tập Sự'}
          </div>
        )}
        {/* Decorative background pattern */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {user?.role !== 'admin' && user?.role !== 'moderator' && (
        <>
          {/* Level / XP Summary Card */}
          <section className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[28px] p-6 relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            {loading ? (
              <div className="py-4 text-center font-medium text-slate-400">Đang tải thông tin cấp độ...</div>
            ) : (
              <>
                <div className="flex justify-between items-end mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Cấp độ {petStatus.level}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                      {getLevelTitle(petStatus.level)}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-extrabold text-primary text-lg font-mono tracking-tight">
                      {petStatus.exp} XP
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      / {xpNeeded} XP lên cấp {petStatus.level + 1}
                    </p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </>
            )}
          </section>

          {/* Bảng quy định điểm tích lũy (XP rules table) */}
          <section className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[28px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 tracking-tight mb-1">
                <Target className="w-5 h-5 text-primary" /> Bảng Quy Đổi Điểm
              </h3>
              <p className="text-sm text-slate-500">
                Hãy tích cực thực hiện các hoạt động làm vườn để giúp Bé Thóc mau lớn!
              </p>
            </div>
            <div className="overflow-x-auto rounded-[20px] bg-slate-50/50 border border-slate-100/80">
              <table className="w-full text-left border-collapse text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-slate-100/50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="p-4">Hành động</th>
                    <th className="p-4 text-center">XP nhận được</th>
                    <th className="p-4">Tác động tâm trạng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  <tr className="hover:bg-slate-100/50 transition-colors">
                    <td className="p-4 flex items-center gap-2.5"><PenLine className="w-4 h-4 text-slate-400" /> Ghi nhật ký vụ mùa (mỗi ngày)</td>
                    <td className="p-4 text-center text-primary font-bold font-mono">+30 XP</td>
                    <td className="p-4 text-xs text-emerald-600">Vui vẻ / Hào hứng</td>
                  </tr>
                  <tr className="hover:bg-slate-100/50 transition-colors">
                    <td className="p-4 flex items-center gap-2.5"><Droplets className="w-4 h-4 text-blue-400" /> Hoàn thành nhắc nhở sớm</td>
                    <td className="p-4 text-center text-primary font-bold font-mono">+10 XP</td>
                    <td className="p-4 text-xs text-emerald-600">Vui vẻ</td>
                  </tr>
                  <tr className="hover:bg-red-50/50 transition-colors bg-red-50/30">
                    <td className="p-4 text-red-600 flex items-center gap-2.5"><Clock className="w-4 h-4" /> Bỏ lỡ nhắc nhở quá giờ</td>
                    <td className="p-4 text-center text-red-600 font-bold font-mono">0 XP</td>
                    <td className="p-4 text-xs text-red-600">Buồn bã</td>
                  </tr>
                  <tr className="hover:bg-orange-50/50 transition-colors bg-orange-50/30">
                    <td className="p-4 text-orange-600 flex items-center gap-2.5"><ShieldAlert className="w-4 h-4" /> Báo động sâu bệnh vườn</td>
                    <td className="p-4 text-center text-orange-600 font-bold font-mono">0 XP</td>
                    <td className="p-4 text-xs text-orange-600">Lo lắng</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Streak Calendar View */}
          <section className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[28px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                <Flame className="w-6 h-6 text-orange-500 drop-shadow-sm" />
                Chuỗi {petStatus.streakCount} ngày chăm chỉ!
              </h3>
              <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
                <button onClick={() => setCurrentMonthDate(subMonths(currentMonthDate, 1))} className="p-1 hover:bg-white rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-800 hover:shadow-sm"><ChevronLeft className="w-4 h-4" /></button>
                <span className="font-bold text-sm text-slate-700 min-w-[100px] text-center capitalize">
                  {format(currentMonthDate, 'MMMM yyyy', { locale: vi })}
                </span>
                <button onClick={() => setCurrentMonthDate(addMonths(currentMonthDate, 1))} className="p-1 hover:bg-white rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-800 hover:shadow-sm"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-3">
              {['T2','T3','T4','T5','T6','T7','CN'].map((day, i) => (
                <div key={i} className="font-semibold text-[11px] text-slate-400">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2 gap-y-2 md:gap-y-3">
              {(() => {
                const monthStart = startOfMonth(currentMonthDate);
                const monthEnd = endOfMonth(monthStart);
                const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
                const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
                const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

                const streakEnd = petStatus.lastDiaryDate ? startOfDay(new Date(petStatus.lastDiaryDate)) : null;
                const streakStart = streakEnd && petStatus.streakCount > 0 
                  ? new Date(streakEnd.getTime() - (petStatus.streakCount - 1) * 24 * 60 * 60 * 1000) 
                  : null;

                return calendarDays.map((day, i) => {
                  const isCurrentMonth = isSameMonth(day, currentMonthDate);
                  const isTodayDate = isToday(day);
                  
                  const currentDayStart = startOfDay(day);
                  const isCompleted = streakStart && streakEnd && currentDayStart >= streakStart && currentDayStart <= streakEnd;

                  return (
                    <div key={i} className={`flex flex-col items-center gap-1.5 ${!isCurrentMonth ? 'opacity-30' : ''}`}>
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-primary to-primary/90 text-white shadow-md scale-105' 
                          : isTodayDate
                            ? 'text-primary bg-primary/10 border border-primary/20 font-bold'
                            : 'text-slate-500 bg-slate-50/50 border border-slate-100 hover:bg-slate-100'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isCompleted ? 'bg-orange-400 scale-110 shadow-sm' : 'bg-transparent'}`}></div>
                    </div>
                  );
                });
              })()}
            </div>
          </section>

          {/* Badge Shelf */}
          <section>
            <div className="flex justify-between items-center mb-5 px-1">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Badge Shelf</h3>
              <button className="font-semibold text-primary text-sm hover:text-primary/80 active:scale-95 transition-all flex items-center gap-1" onClick={() => navigate('/shop')}>
                Go to Shop <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 md:mx-0 md:px-1 snap-x">
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 min-w-[130px] flex flex-col items-center p-5 gap-3 rounded-[24px] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] snap-start group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-50 to-yellow-100 border border-yellow-200/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Medal className="w-8 h-8 text-yellow-500" />
                </div>
                <span className="font-bold text-sm text-slate-700 text-center">First Harvest</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 min-w-[130px] flex flex-col items-center p-5 gap-3 rounded-[24px] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] snap-start group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Droplets className="w-8 h-8 text-blue-500" />
                </div>
                <span className="font-bold text-sm text-slate-700 text-center">Water Saver</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 min-w-[130px] flex flex-col items-center p-5 gap-3 rounded-[24px] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] snap-start group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-50 to-rose-100 border border-red-200/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <span className="font-bold text-sm text-slate-700 text-center">Pest Hunter</span>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Settings / Account List */}
      <section className="mb-4">
        <h3 className="text-xl font-bold text-slate-800 mb-5 px-1 tracking-tight">Account</h3>
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[28px] flex flex-col divide-y divide-slate-100/80 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <button 
            onClick={() => navigate('/account-settings')}
            className="flex items-center justify-between p-4 md:px-6 bg-transparent hover:bg-slate-50/80 transition-colors group active:bg-slate-100 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-slate-100/80 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105 transition-all duration-300 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <span className="font-semibold text-base text-slate-700">Personal Information</span>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center justify-between p-4 md:px-6 bg-transparent hover:bg-slate-50/80 transition-colors group active:bg-slate-100 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-slate-100/80 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105 transition-all duration-300 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <span className="font-semibold text-base text-slate-700">App Settings</span>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
          <button 
            onClick={() => navigate('/help-support')}
            className="flex items-center justify-between p-4 md:px-6 bg-transparent hover:bg-slate-50/80 transition-colors group active:bg-slate-100 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-slate-100/80 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105 transition-all duration-300 shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <span className="font-semibold text-base text-slate-700">Help & Support</span>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
        <button 
          onClick={() => {
            logoutUser().then(() => navigate('/'));
          }} 
          className="w-full mt-6 bg-white/80 backdrop-blur-xl text-red-500 font-bold text-base py-4 rounded-[24px] border border-red-100 hover:bg-red-50 active:bg-red-100 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </section>
      
    </div>
  );
};

export default Profile;
