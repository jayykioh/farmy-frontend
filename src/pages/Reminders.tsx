import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ReminderCard } from '../components/ReminderCard';
import { useReminders } from '../hooks/useReminders';
import { completeReminder } from '../api/reminders';
import type { Reminder } from '../api/reminders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isToday, isFuture } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { PetMascot } from '../features/pet/components/PetMascot';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';

type Tab = 'today' | 'upcoming' | 'done';

const Reminders: React.FC = () => {
  const [tab, setTab] = useState<Tab>('today');
  const queryClient = useQueryClient();
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;
  
  const statusFilter = tab === 'done' ? 'completed' : 'pending';
  const { data: reminders = [], isLoading } = useReminders({ status: statusFilter });

  const completeMutation = useMutation({
    mutationFn: completeReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const handleDone = (id: string) => {
    completeMutation.mutate(id);
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
    return true; // cho 'done'
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
    <div className="w-full min-h-[100svh] bg-bg-surface-1 font-sans flex flex-col pb-[100px]">
      <PageHeader 
        title="Nhắc nhở của tôi" 
        leftButton="back" 
        rightButton="none"
      />
      
      <main className="w-full max-w-2xl mx-auto pt-[72px] px-4 md:px-6 flex flex-col flex-1">
        
        <div className="bg-white border border-primary/20 shadow-sm rounded-[24px] p-4 mt-4 mb-2 flex items-center gap-4 relative">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-primary/20 shadow-sm relative flex-shrink-0 p-1">
            <PetMascot className="w-full h-full -mt-1" status={petStatus} size={56} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-base text-text-main">
              Đừng quên chăm sóc cây đúng giờ để nhận được <strong className="text-secondary-dark bg-secondary-light/30 px-1 rounded font-extrabold">gấp đôi XP</strong> nhé!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 mt-2">
          <button 
            onClick={() => setTab('today')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'today' ? 'bg-white shadow-sm text-text-main' : 'text-text-main/60 hover:text-text-main/80'}`}
          >
            <Clock className="w-4 h-4" /> Hôm nay
          </button>
          <button 
            onClick={() => setTab('upcoming')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'upcoming' ? 'bg-white shadow-sm text-text-main' : 'text-text-main/60 hover:text-text-main/80'}`}
          >
            <Calendar className="w-4 h-4" /> Sắp tới
          </button>
          <button 
            onClick={() => setTab('done')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'done' ? 'bg-white shadow-sm text-text-main' : 'text-text-main/60 hover:text-text-main/80'}`}
          >
            <CheckCircle2 className="w-4 h-4" /> Đã xong
          </button>
        </div>

        {/* List */}
        <div className="flex-1 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          ) : sortedDates.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center opacity-60 mt-10">
              <CheckCircle2 className="w-16 h-16 text-gray-400 mb-3" />
              <p className="text-gray-500">
                {tab === 'done' 
                  ? 'Chưa có nhắc nhở nào hoàn thành' 
                  : 'Tuyệt vời! Bạn không có nhắc nhở nào đang chờ.'}
              </p>
            </div>
          ) : (
            sortedDates.map(date => (
              <section key={date} className="flex flex-col gap-3">
                <h4 className="font-semibold text-text-main/80 text-sm">
                  {isToday(new Date(date)) ? 'Hôm nay' : format(new Date(date), 'EEEE, dd/MM/yyyy', { locale: vi })}
                </h4>
                <div className="flex flex-col gap-3">
                  {groupedReminders[date].map(r => (
                    <ReminderCard 
                      key={r._id} 
                      reminder={r} 
                      onDone={r.status !== 'completed' ? () => handleDone(r._id) : undefined} 
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
          className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default Reminders;
