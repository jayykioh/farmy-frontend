/* Hallmark · page: profile · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';

import { MapPin, Trophy, Flame, Drop, Clock, Target, SignOut, PencilLine, Medal, ShieldWarning, CaretLeft, CaretRight } from '@phosphor-icons/react';
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
    <div className="w-full flex flex-col gap-6 px-4 md:px-8 pt-24 pb-24 max-w-3xl mx-auto bg-bg-main text-text-main min-h-screen relative font-sans">
      <PageHeader title="Hồ sơ cá nhân" subtitle="Thông tin nông dân & thành tích" leftButton="none" />
      
      {/* Header / Profile Summary */}
      <section className="card-bubble flex items-center gap-5 bg-white p-6 relative overflow-hidden shadow-sm">
        <div className="w-24 h-24 rounded-full border-4 border-border-main shadow-sm bg-bg-surface-2 flex-shrink-0 flex items-center justify-center overflow-hidden z-10 relative transition-transform duration-300 hover:scale-105">
          <img 
            alt="Farmer Profile" 
            className="w-full h-full object-cover" 
            src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDsbCWDiuGTF5iEwK2O9pm1CMMzFdWx0hc4ellAPSIR0Fd0W04AaUk2McKFTBpkyt54F7qbz59AxRVm00X7l_paTxXsYAhKb0DJ2UtW18iwcftc8NpvHSUtky7QtZ3LYS_Jvnwzb_uyHj7Snd_GZJ5qRjx6kGvs2Y-yZafDMesEmvqIG9HZ3b06V39xa_0py0IGkepiBfpB_L-Nfe8YfQg-4VDdxhF78xd9seUk1RNYLfCuF3wEdwSvukiK2uu0wpN98-IjRJs9NRru"} 
          />
        </div>
        <div className="flex-1 z-10 text-left">
          <h2 className="text-2xl font-black text-text-h mb-1 tracking-tight">{user?.name || 'Nông dân Ẩn danh'}</h2>
          <p className="text-sm text-text-secondary flex items-center gap-1 font-bold">
            <MapPin className="w-4 h-4 text-[#008A5E]" weight="duotone" />
            Mekong Delta, Vietnam
          </p>
        </div>
        {/* Badge overlay */}
        {user?.role !== 'admin' && user?.role !== 'moderator' && (
          <div className="absolute right-4 top-4 bg-amber-100 text-yellow-900 border-2 border-amber-300 px-3 py-1.5 rounded-full font-black text-xs flex items-center gap-1.5 z-10 shadow-sm">
            <Trophy className="w-4 h-4 text-yellow-600" weight="duotone" />
            {petStatus.level >= 15 ? 'Vua Nông Trại' : petStatus.level >= 10 ? 'Chuyên Gia' : 'Tập Sự'}
          </div>
        )}
      </section>

      {user?.role !== 'admin' && user?.role !== 'moderator' && (
        <>
          {/* Level / XP Summary Card */}
          <section className="card-bubble bg-white p-6 relative shadow-sm text-left">
            {loading ? (
              <div className="py-4 text-center font-bold text-text-secondary">Đang tải thông tin cấp độ...</div>
            ) : (
              <>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h3 className="text-xl font-black text-text-h tracking-tight">Cấp độ {petStatus.level}</h3>
                    <p className="text-sm font-bold text-text-secondary mt-0.5">
                      {getLevelTitle(petStatus.level)}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-black text-[#008A5E] text-xl font-mono tracking-tight">
                      {petStatus.exp} XP
                    </span>
                    <p className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider mt-1">
                      / {xpNeeded} XP lên cấp {petStatus.level + 1}
                    </p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-4 bg-bg-surface-2 rounded-full overflow-hidden border-2 border-border-main relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#008A5E] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </>
            )}
          </section>

          {/* Bảng quy định điểm tích lũy (XP rules table) */}
          <section className="card-bubble bg-white p-6 shadow-sm flex flex-col gap-4 text-left">
            <div>
              <h3 className="text-xl font-black text-text-h flex items-center gap-2 tracking-tight mb-1">
                <Target className="w-5 h-5 text-[#008A5E]" weight="duotone" /> Bảng Quy Đổi Điểm
              </h3>
              <p className="text-sm text-text-secondary font-bold">
                Hãy tích cực thực hiện các hoạt động làm vườn để giúp Bé Thóc mau lớn!
              </p>
            </div>
            <div className="overflow-x-auto rounded-[20px] bg-bg-surface-1 border-2 border-border-main">
              <table className="w-full text-left border-collapse text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-bg-surface-2 border-b-2 border-border-main text-text-secondary font-black text-[11px] uppercase tracking-wider">
                    <th className="p-4">Hành động</th>
                    <th className="p-4 text-center">XP nhận được</th>
                    <th className="p-4">Tác động tâm trạng</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-border-main/50 text-text-main font-bold">
                  <tr className="hover:bg-bg-surface-2/60 transition-colors">
                    <td className="p-4 flex items-center gap-2.5"><PencilLine className="w-4 h-4 text-text-secondary" weight="duotone" /> Ghi nhật ký vụ mùa (mỗi ngày)</td>
                    <td className="p-4 text-center text-[#008A5E] font-black font-mono">+30 XP</td>
                    <td className="p-4 text-xs text-emerald-700 font-extrabold">Vui vẻ / Hào hứng</td>
                  </tr>
                  <tr className="hover:bg-bg-surface-2/60 transition-colors">
                    <td className="p-4 flex items-center gap-2.5"><Drop className="w-4 h-4 text-sky-500" weight="duotone" /> Hoàn thành nhắc nhở sớm</td>
                    <td className="p-4 text-center text-[#008A5E] font-black font-mono">+10 XP</td>
                    <td className="p-4 text-xs text-emerald-700 font-extrabold">Vui vẻ</td>
                  </tr>
                  <tr className="hover:bg-red-50/50 transition-colors bg-red-50/30">
                    <td className="p-4 text-red-600 flex items-center gap-2.5"><Clock className="w-4 h-4 text-red-500" weight="duotone" /> Bỏ lỡ nhắc nhở quá giờ</td>
                    <td className="p-4 text-center text-red-600 font-black font-mono">0 XP</td>
                    <td className="p-4 text-xs text-red-600 font-extrabold">Buồn bã</td>
                  </tr>
                  <tr className="hover:bg-orange-50/50 transition-colors bg-orange-50/30">
                    <td className="p-4 text-orange-600 flex items-center gap-2.5"><ShieldWarning className="w-4 h-4 text-orange-500" weight="duotone" /> Báo động sâu bệnh vườn</td>
                    <td className="p-4 text-center text-orange-600 font-black font-mono">0 XP</td>
                    <td className="p-4 text-xs text-orange-600 font-extrabold">Lo lắng</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Streak Calendar View */}
          <section className="card-bubble bg-white p-6 shadow-sm text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="text-xl font-black text-text-h flex items-center gap-2 tracking-tight">
                <Flame className="w-6 h-6 text-orange-500 drop-shadow-sm" weight="duotone" />
                Chuỗi {petStatus.streakCount} ngày chăm chỉ!
              </h3>
              <div className="flex items-center gap-2 bg-bg-surface-2 px-3 py-1.5 rounded-full border-2 border-border-main shadow-sm">
                <button onClick={() => setCurrentMonthDate(subMonths(currentMonthDate, 1))} className="p-1 hover:bg-white rounded-full transition-colors cursor-pointer text-text-secondary hover:text-text-main active:scale-95"><CaretLeft className="w-4 h-4" weight="bold" /></button>
                <span className="font-extrabold text-sm text-text-h min-w-[100px] text-center capitalize">
                  {format(currentMonthDate, 'MMMM yyyy', { locale: vi })}
                </span>
                <button onClick={() => setCurrentMonthDate(addMonths(currentMonthDate, 1))} className="p-1 hover:bg-white rounded-full transition-colors cursor-pointer text-text-secondary hover:text-text-main active:scale-95"><CaretRight className="w-4 h-4" weight="bold" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-3">
              {['T2','T3','T4','T5','T6','T7','CN'].map((day, i) => (
                <div key={i} className="font-black text-[11px] text-text-secondary">{day}</div>
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
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-[#008A5E] text-white shadow-sm scale-105 border-2 border-[#008A5E]' 
                          : isTodayDate
                            ? 'text-[#008A5E] bg-primary-light/20 border-2 border-[#008A5E] font-black'
                            : 'text-text-secondary bg-bg-surface-1 border border-border-main/50 hover:bg-bg-surface-2'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isCompleted ? 'bg-orange-500 scale-110 shadow-sm' : 'bg-transparent'}`}></div>
                    </div>
                  );
                });
              })()}
            </div>
          </section>

          {/* Badge Shelf */}
          <section className="text-left">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-xl font-black text-text-h tracking-tight">Kệ huy hiệu</h3>
              <button className="font-extrabold text-[#008A5E] text-sm hover:underline active:scale-95 transition-all flex items-center gap-1 cursor-pointer" onClick={() => navigate('/shop')}>
                Cửa hàng quà <CaretRight className="w-4 h-4" weight="bold" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-1 snap-x">
              <div className="card-bubble card-bubble--pear min-w-[140px] flex flex-col items-center p-5 gap-3 bg-white text-center cursor-pointer shadow-sm snap-start group select-none active:scale-95 transition-all">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Medal className="w-8 h-8 text-yellow-600" weight="duotone" />
                </div>
                <span className="font-extrabold text-sm text-text-h text-center">Vụ Đầu Tiên</span>
              </div>
              <div className="card-bubble card-bubble--cyan min-w-[140px] flex flex-col items-center p-5 gap-3 bg-white text-center cursor-pointer shadow-sm snap-start group select-none active:scale-95 transition-all">
                <div className="w-16 h-16 rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Drop className="w-8 h-8 text-sky-600" weight="duotone" />
                </div>
                <span className="font-extrabold text-sm text-text-h text-center">Tiết Kiệm Nước</span>
              </div>
              <div className="card-bubble card-bubble--coral min-w-[140px] flex flex-col items-center p-5 gap-3 bg-white text-center cursor-pointer shadow-sm snap-start group select-none active:scale-95 transition-all">
                <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-300 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <ShieldWarning className="w-8 h-8 text-rose-600" weight="duotone" />
                </div>
                <span className="font-extrabold text-sm text-text-h text-center">Diệt Sâu Bệnh</span>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Settings / Account List */}
      <section className="mb-4 text-left">
        <h3 className="text-xl font-black text-text-h mb-4 px-1 tracking-tight">Tài khoản & Cài đặt</h3>
        <div className="card-bubble bg-white p-3 flex flex-col gap-2 shadow-sm">
          <button 
            onClick={() => navigate('/account-settings')}
            className="flex items-center justify-between p-4 bg-bg-surface-1 hover:bg-bg-surface-2 rounded-[20px] border border-border-main/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-white border border-border-main/50 flex items-center justify-center text-text-secondary group-hover:text-[#008A5E] transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <span className="font-extrabold text-base text-text-h">Thông tin cá nhân</span>
            </div>
            <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center justify-between p-4 bg-bg-surface-1 hover:bg-bg-surface-2 rounded-[20px] border border-border-main/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-white border border-border-main/50 flex items-center justify-center text-text-secondary group-hover:text-[#008A5E] transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <span className="font-extrabold text-base text-text-h">Cài đặt ứng dụng</span>
            </div>
            <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
          <button 
            onClick={() => navigate('/help-support')}
            className="flex items-center justify-between p-4 bg-bg-surface-1 hover:bg-bg-surface-2 rounded-[20px] border border-border-main/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-white border border-border-main/50 flex items-center justify-center text-text-secondary group-hover:text-[#008A5E] transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <span className="font-extrabold text-base text-text-h">Hỗ trợ & Hướng dẫn</span>
            </div>
            <CaretRight className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-all" weight="bold"/>
          </button>
        </div>

        <button 
          onClick={() => {
            logoutUser().then(() => navigate('/'));
          }} 
          className="btn btn--coral w-full mt-6 py-4 text-base font-black flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <SignOut className="w-5 h-5" weight="bold" />
          Đăng xuất tài khoản
        </button>
      </section>
      
    </div>
  );
};

export default Profile;
