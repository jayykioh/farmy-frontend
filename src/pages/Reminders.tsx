/* Hallmark · page: reminders · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ReminderCard } from '../components/ReminderCard';
import { useReminders } from '../hooks/useReminders';
import { completeReminder, getReminderCompletionMessage } from '../api/reminders';
import type { Reminder } from '../api/reminders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar, CheckCircle, Clock } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { format, isToday, isFuture } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { PetMascot } from '../features/pet/components/PetMascot';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import toast from 'react-hot-toast';

type Tab = 'today' | 'upcoming' | 'done';

const Reminders: React.FC = () => {
  const [tab, setTab] = useState<Tab>('today');
  const queryClient = useQueryClient();
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;
  
  const statusFilter = tab === 'done' ? 'completed' : 'pending';
  const { data: reminders = [], isLoading } = useReminders({ status: statusFilter });

  const completeMutation = useMutation({
    mutationFn: (reminder: Reminder) => completeReminder(reminder._id),
    onSuccess: (_result, reminder) => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success(getReminderCompletionMessage(reminder));
    },
    onError: () => toast.error('Không thể hoàn thành nhắc nhở. Vui lòng thử lại!'),
  });

  const handleDone = (reminder: Reminder) => {
    completeMutation.mutate(reminder);
  };

  // Lọc và phân nhóm nhắc nhở
  const filteredReminders = reminders.filter((r) => {
    const remindDate = new Date(r.remind_at);
    if (tab === 'today') {
      return isToday(remindDate) || (remindDate < new Date() && r.status !== 'completed');
    }
    if (tab === 'upcoming') {
      return isFuture(remindDate) && !isToday(remindDate);
    }
    return r.status === 'completed'; // cho 'done'
  });

  // Group by date
  const groupedReminders = filteredReminders.reduce((groups, reminder) => {
    const date = format(new Date(reminder.remind_at), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reminder);
    return groups;
  }, {} as Record<string, Reminder[]>);

  // Sắp xếp ngày
  const sortedDates = Object.keys(groupedReminders).sort((a, b) => {
    if (tab === 'upcoming') return new Date(a).getTime() - new Date(b).getTime();
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main font-sans flex flex-col pb-24 text-left">
      <PageHeader 
        title="Nhắc nhở của tôi" 
        subtitle="Lịch tưới, bón phân & chăm sóc cây"
        leftButton="back" 
        rightButton="none"
      />
      
      <main className="w-full max-w-2xl mx-auto pt-24 px-4 md:px-6 flex flex-col flex-1">
        
        <div className="card-bubble bg-white p-4 mt-4 mb-2 flex items-center gap-4 relative shadow-sm border-2 border-border-main">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-border-main shadow-sm relative flex-shrink-0 p-1">
            <PetMascot className="w-full h-full -mt-1" status={petStatus} size={56} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-base text-text-main">
              Đừng quên chăm sóc cây đúng giờ để nhận được <strong className="text-[#008A5E] bg-primary-light/20 px-2 py-0.5 rounded-md font-black">gấp đôi XP</strong> nhé!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-bg-surface-2 p-1.5 rounded-full border-2 border-border-main mb-6 mt-2 gap-1">
          <button 
            onClick={() => setTab('today')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm rounded-full transition-all cursor-pointer active:scale-95 ${tab === 'today' ? 'btn btn--cyan font-extrabold' : 'font-bold text-text-secondary hover:text-text-main'}`}
          >
            <Clock className="w-4 h-4" weight="duotone" /> Hôm nay
          </button>
          <button 
            onClick={() => setTab('upcoming')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm rounded-full transition-all cursor-pointer active:scale-95 ${tab === 'upcoming' ? 'btn btn--cyan font-extrabold' : 'font-bold text-text-secondary hover:text-text-main'}`}
          >
            <Calendar className="w-4 h-4" weight="duotone" /> Sắp tới
          </button>
          <button 
            onClick={() => setTab('done')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm rounded-full transition-all cursor-pointer active:scale-95 ${tab === 'done' ? 'btn btn--cyan font-extrabold' : 'font-bold text-text-secondary hover:text-text-main'}`}
          >
            <CheckCircle className="w-4 h-4" weight="duotone" /> Đã xong
          </button>
        </div>

        {/* List */}
        <div className="flex-1 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-bg-surface-2 rounded-2xl border-2 border-border-main/50"></div>
              ))}
            </div>
          ) : sortedDates.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center mt-12 py-12">
              <div className="w-24 h-24 mb-4">
                <PetMascot className="w-full h-full animate-bounce" status={petStatus} size={96} />
              </div>
              <p className="font-extrabold text-text-h text-lg">
                {tab === 'done' 
                  ? 'Chưa có nhắc nhở nào hoàn thành' 
                  : 'Tuyệt vời! Bạn không có nhắc nhở nào đang chờ.'}
              </p>
              <p className="text-text-secondary text-sm font-bold mt-1">
                Lên lịch chăm sóc vườn tược để Bé Thóc vui sướng mỗi ngày!
              </p>
            </div>
          ) : (
            sortedDates.map(date => (
              <section key={date} className="flex flex-col gap-3">
                <h4 className="font-black text-text-h text-sm tracking-tight px-1">
                  {isToday(new Date(date)) ? 'Hôm nay' : format(new Date(date), 'EEEE, dd/MM/yyyy', { locale: vi })}
                </h4>
                <div className="flex flex-col gap-3">
                  {groupedReminders[date].map(r => (
                    <ReminderCard 
                      key={r._id} 
                      reminder={r} 
                      onDone={r.status !== 'completed' ? () => handleDone(r) : undefined} 
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-[90px] md:bottom-8 right-4 md:right-8 z-30">
        <Link 
          to="/reminder/create"
          className="btn btn--cyan !p-0 w-14 h-14 rounded-full flex items-center justify-center shadow-lg font-black cursor-pointer active:scale-95"
        >
          <Plus className="w-6 h-6 text-white" weight="bold" />
        </Link>
      </div>
    </div>
  );
};

export default Reminders;
