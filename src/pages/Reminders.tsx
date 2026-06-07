import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';
import { getPendingReminders, completeReminder, getPetState } from '../api/farm';
import type { Reminder, PetState } from '../api/farm';

export const Reminders: React.FC = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [petState, setPetState] = useState<PetState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      const data = await getPendingReminders();
      setReminders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPetState = async () => {
    try {
      const data = await getPetState();
      setPetState(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReminders();
    fetchPetState();
  }, []);

  const handleComplete = async (id: string) => {
    try {
      await completeReminder(id);
      setReminders(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
      alert('Không thể hoàn thành nhắc nhở!');
    }
  };

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
        
        <div className="bg-white border border-primary/20 shadow-sm rounded-[24px] p-4 mb-6 flex items-center gap-4 relative">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border border-primary/20 shadow-sm relative flex-shrink-0 p-1">
            <MascotLottie className="w-full h-full -mt-1" state={petState?.mood || 'happy'} />
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
          {loading ? (
            <div className="py-10 text-center font-bold text-text-main/50">Đang tải nhắc nhở...</div>
          ) : reminders.length === 0 ? (
            <div className="bg-white border border-border-main/50 rounded-2xl p-8 text-center text-text-main/50 font-bold shadow-sm">
              Bạn không có lịch nhắc nhở nào chưa hoàn thành.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reminders.map(reminder => (
                <div 
                  key={reminder._id}
                  className="bg-white border border-border-main/50 shadow-sm rounded-[20px] p-4 flex items-center gap-4 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm text-xl shrink-0">
                    💧
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-text-main truncate">{reminder.title}</h3>
                    <p className="text-xs text-text-main/70 flex items-center gap-1 mt-1 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                      {new Date(reminder.remind_at).toLocaleString('vi-VN')}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-bg-surface text-text-main/70 rounded-full text-[10px] font-bold border border-border-main/50">Push</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full text-[10px] font-bold border border-blue-100">Zalo</span>
                      {reminder.repeat && reminder.repeat !== 'none' && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full text-[10px] font-bold border border-amber-100 flex items-center gap-1">
                          🔁 {reminder.repeat === 'daily' ? 'Hàng ngày' : 'Hàng tuần'}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleComplete(reminder._id)}
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-dark cursor-pointer shrink-0"
                  >
                    Xong
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* FAB */}
      <button 
        onClick={() => navigate('/reminders/create')}
        className="fixed bottom-[100px] right-6 md:right-8 lg:right-1/2 lg:translate-x-[360px] w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center z-40 cursor-pointer"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

    </div>
  );
};

export default Reminders;
