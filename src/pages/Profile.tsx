import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { PetMascot } from '../features/pet/components/PetMascot';
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
    <div className="w-full flex flex-col gap-6 px-4 md:px-8 pt-24 pb-[100px] max-w-3xl mx-auto bg-bg-main min-h-screen">
      <PageHeader title="Hồ sơ cá nhân" leftButton="none" />
      
      {/* Header / Profile Summary */}
      <section className="flex items-center gap-4 bg-white p-6 rounded-[24px] border border-border-main/50 relative overflow-hidden shadow-sm">
        <div className="w-24 h-24 rounded-full border-[3px] border-white shadow-sm bg-bg-surface-1 flex-shrink-0 flex items-center justify-center overflow-hidden z-10 relative">
          <img 
            alt="Farmer Profile" 
            className="w-full h-full object-cover" 
            src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDsbCWDiuGTF5iEwK2O9pm1CMMzFdWx0hc4ellAPSIR0Fd0W04AaUk2McKFTBpkyt54F7qbz59AxRVm00X7l_paTxXsYAhKb0DJ2UtW18iwcftc8NpvHSUtky7QtZ3LYS_Jvnwzb_uyHj7Snd_GZJ5qRjx6kGvs2Y-yZafDMesEmvqIG9HZ3b06V39xa_0py0IGkepiBfpB_L-Nfe8YfQg-4VDdxhF78xd9seUk1RNYLfCuF3wEdwSvukiK2uu0wpN98-IjRJs9NRru"} 
          />
        </div>
        <div className="flex-1 z-10">
          <h2 className="text-2xl font-extrabold text-text-h mb-1">{user?.name || 'Nông dân Ẩn danh'}</h2>
          <p className="text-base text-text-main/70 flex items-center gap-1 font-semibold">
            <MapPin className="w-4 h-4" />
            Mekong Delta, Vietnam
          </p>
        </div>
        {/* Badge overlay */}
        <div className="absolute right-4 top-4 bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full font-bold text-xs border border-yellow-200 flex items-center gap-1 z-10 shadow-sm rotate-3">
          <Award className="w-4 h-4" />
          {petStatus.level >= 15 ? 'Vua Nông Trại' : petStatus.level >= 10 ? 'Chuyên Gia' : 'Tập Sự'}
        </div>
        {/* Decorative background pattern */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary-lightest/30 rounded-full pointer-events-none"></div>
      </section>

      {/* Level / XP Summary Card */}
      <section className="bg-white border border-border-main/50 rounded-[24px] p-6 relative shadow-sm">
        {loading ? (
          <div className="py-4 text-center font-bold text-text-main/50">Đang tải thông tin cấp độ...</div>
        ) : (
          <>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-bold text-text-h">Cấp độ {petStatus.level}</h3>
                <p className="text-base font-semibold text-text-main/70">
                  {getLevelTitle(petStatus.level)}
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="font-extrabold text-primary text-lg font-mono">
                  {petStatus.exp} XP
                </span>
                <p className="text-xs font-bold text-text-main/50 uppercase tracking-wide">
                  / {xpNeeded} XP lên cấp {petStatus.level + 1}
                </p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-4 bg-bg-surface-1 rounded-full overflow-hidden relative border border-border-main/30">
              <div 
                className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-inner transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </>
        )}
      </section>

      {/* Bảng quy định điểm tích lũy (XP rules table) */}
      <section className="bg-white border border-border-main/50 rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
        <h3 className="text-xl font-bold text-text-h flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> Bảng Quy Đổi Điểm (XP Rules)
        </h3>
        <p className="text-sm text-text-main/70">
          Hãy tích cực thực hiện các hoạt động làm vườn để giúp Bé Thóc mau lớn và thăng cấp!
        </p>
        <div className="overflow-x-auto border border-border-main/30 rounded-xl">
          <table className="w-full text-left border-collapse text-sm min-w-[500px]">
            <thead>
              <tr className="bg-bg-surface-2 border-b border-border-main/30 font-bold text-text-main/80">
                <th className="p-3">Hành động</th>
                <th className="p-3 text-center">XP nhận được</th>
                <th className="p-3">Tác động tâm trạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/20 text-text-main/80 font-medium">
              <tr className="hover:bg-bg-surface-1/50 transition-colors">
                <td className="p-3 flex items-center gap-2"><PenLine className="w-4 h-4" /> Ghi nhật ký vụ mùa (mỗi ngày)</td>
                <td className="p-3 text-center text-primary font-bold font-mono">+30 XP</td>
                <td className="p-3 text-xs text-green-600">Vui vẻ / Hào hứng (Excited)</td>
              </tr>
              <tr className="hover:bg-bg-surface-1/50 transition-colors">
                <td className="p-3 flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500" /> Hoàn thành nhắc nhở sớm</td>
                <td className="p-3 text-center text-primary font-bold font-mono">+10 XP</td>
                <td className="p-3 text-xs text-green-600">Vui vẻ (Happy)</td>
              </tr>
              <tr className="hover:bg-bg-surface-1/50 transition-colors bg-red-50/10">
                <td className="p-3 text-error flex items-center gap-2"><Clock className="w-4 h-4" /> Bỏ lỡ nhắc nhở quá giờ</td>
                <td className="p-3 text-center text-error font-bold font-mono">0 XP</td>
                <td className="p-3 text-xs text-error">Buồn bã (Sad)</td>
              </tr>
              <tr className="hover:bg-bg-surface-1/50 transition-colors bg-orange-50/10">
                <td className="p-3 text-orange-600 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Báo động sâu bệnh vườn</td>
                <td className="p-3 text-center text-orange-600 font-bold font-mono">0 XP</td>
                <td className="p-3 text-xs text-orange-600">Lo lắng (Worried)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Streak Calendar View */}
      <section className="bg-white border border-border-main/50 rounded-[24px] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold text-text-h flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500 drop-shadow-sm" />
            Chuỗi {petStatus.streakCount} ngày chăm chỉ!
          </h3>
          <div className="flex items-center gap-2 bg-bg-surface-1 px-2 py-1 rounded-full border border-border-main/30">
            <button onClick={() => setCurrentMonthDate(subMonths(currentMonthDate, 1))} className="p-1 hover:bg-white rounded-full transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
            <span className="font-bold text-sm text-text-main/70 min-w-[100px] text-center capitalize">
              {format(currentMonthDate, 'MMMM yyyy', { locale: vi })}
            </span>
            <button onClick={() => setCurrentMonthDate(addMonths(currentMonthDate, 1))} className="p-1 hover:bg-white rounded-full transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
          {['T2','T3','T4','T5','T6','T7','CN'].map((day, i) => (
            <div key={i} className="font-bold text-xs text-text-main/50">{day}</div>
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
                <div key={i} className={`flex flex-col items-center gap-1 ${!isCurrentMonth ? 'opacity-30' : ''}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-primary text-white shadow-md scale-105' 
                      : isTodayDate
                        ? 'text-primary bg-primary/10 border border-primary/30'
                        : 'text-text-main/70 bg-bg-surface-1 border border-border-main/10 hover:bg-bg-surface-2'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isCompleted ? 'bg-primary scale-110' : 'bg-transparent'}`}></div>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* Badge Shelf */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-text-h">Badge Shelf</h3>
          <button className="font-bold text-primary text-sm hover:underline active:scale-95 transition-transform" onClick={() => navigate('/shop')}>
            Go to Shop →
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
          <div className="bg-white border border-border-main/50 min-w-[120px] flex flex-col items-center p-4 gap-3 rounded-[20px] hover:-translate-y-1 transition-transform cursor-pointer shadow-sm snap-start">
            <div className="w-14 h-14 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center shadow-sm">
              <Medal className="w-7 h-7 text-yellow-500" />
            </div>
            <span className="font-bold text-sm text-text-main text-center">First Harvest</span>
          </div>
          <div className="bg-white border border-border-main/50 min-w-[120px] flex flex-col items-center p-4 gap-3 rounded-[20px] hover:-translate-y-1 transition-transform cursor-pointer shadow-sm snap-start">
            <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-sm">
              <Droplets className="w-7 h-7 text-blue-500" />
            </div>
            <span className="font-bold text-sm text-text-main text-center">Water Saver</span>
          </div>
          <div className="bg-white border border-border-main/50 min-w-[120px] flex flex-col items-center p-4 gap-3 rounded-[20px] hover:-translate-y-1 transition-transform cursor-pointer shadow-sm snap-start">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-7 h-7 text-error" />
            </div>
            <span className="font-bold text-sm text-text-main text-center">Pest Hunter</span>
          </div>
        </div>
      </section>

      {/* Settings / Account List */}
      <section className="mb-4">
        <h3 className="text-xl font-bold text-text-h mb-4">Account</h3>
        <div className="bg-white border border-border-main/50 rounded-[24px] flex flex-col divide-y divide-border-main/30 overflow-hidden shadow-sm">
          <button 
            onClick={() => navigate('/account-settings')}
            className="flex items-center justify-between p-4 md:px-6 bg-white hover:bg-bg-surface-1 transition-colors group active:bg-bg-surface cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-bg-surface-1 flex items-center justify-center text-text-main/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <span className="font-bold text-base text-text-main">Personal Information</span>
            </div>
            <svg className="w-5 h-5 text-text-main/30 group-hover:text-primary/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center justify-between p-4 md:px-6 bg-white hover:bg-bg-surface-1 transition-colors group active:bg-bg-surface cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-bg-surface-1 flex items-center justify-center text-text-main/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <span className="font-bold text-base text-text-main">App Settings</span>
            </div>
            <svg className="w-5 h-5 text-text-main/30 group-hover:text-primary/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
          <button 
            onClick={() => navigate('/help-support')}
            className="flex items-center justify-between p-4 md:px-6 bg-white hover:bg-bg-surface-1 transition-colors group active:bg-bg-surface cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-bg-surface-1 flex items-center justify-center text-text-main/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <span className="font-bold text-base text-text-main">Help & Support</span>
            </div>
            <svg className="w-5 h-5 text-text-main/30 group-hover:text-primary/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
        <button 
          onClick={() => {
            logoutUser().then(() => navigate('/'));
          }} 
          className="w-full mt-6 bg-white text-error font-bold text-base py-4 rounded-[20px] border border-error-container hover:bg-error-container/20 active:bg-error-container/40 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </section>
      
    </div>
  );
};

export default Profile;
