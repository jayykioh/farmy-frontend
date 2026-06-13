import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { PageHeader } from '../components/PageHeader';
import {
  useGetPlotsQuery,
  useGetDiariesQuery,
  useCreateReminderMutation,
} from '../store/api/farmApi';

export const CreateReminder: React.FC = () => {
  const navigate = useNavigate();

  // Helper functions to get local date and time strings
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getLocalTimeString = (d: Date) => {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Form states
  const [title, setTitle] = useState('Tưới nước');
  const [dateStr, setDateStr] = useState(() => {
    const now = new Date();
    // Default to today
    return getLocalDateString(now);
  });
  const [timeStr, setTimeStr] = useState(() => {
    const now = new Date();
    // Default to now + 5 minutes for easy testing
    const defaultTime = new Date(now.getTime() + 5 * 60 * 1000);
    return getLocalTimeString(defaultTime);
  });

  const [diaryId, setDiaryId] = useState('');
  const [repeat] = useState<'none' | 'daily' | 'weekly'>('daily');

  const { data: plotsData = [] } = useGetPlotsQuery();
  const { data: diariesData = [] } = useGetDiariesQuery();
  const [createReminder, { isLoading: loading }] = useCreateReminderMutation();

  const diaries = React.useMemo(() => {
    const plotMap: Record<string, string> = {};
    plotsData.forEach(p => {
      plotMap[p._id] = p.name;
    });

    return diariesData.map(d => ({
      ...d,
      plot_name: plotMap[d.plot_id] || 'Mảnh vườn'
    }));
  }, [plotsData, diariesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập hoạt động vườn!');
      return;
    }

    try {
      // Parse local date & time strings back to a Date object
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      const remindAt = new Date(year, month - 1, day, hours, minutes);
 
      await createReminder({
        title,
        remind_at: remindAt.toISOString(),
        diary_id: diaryId || undefined,
        repeat,
      }).unwrap();

      navigate('/reminders');
    } catch (err) {
      console.error(err);
      alert('Không thể tạo nhắc nhở. Vui lòng kiểm tra lại!');
    }
  };

  const activityOptions = ['Tưới nước', 'Bón phân', 'Phun thuốc', 'Làm cỏ'];

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
      <form onSubmit={handleSubmit} className="fixed bottom-0 top-[15%] md:top-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-2xl md:w-[90vw] md:h-auto md:max-h-[85vh] bg-white rounded-t-[40px] md:rounded-[40px] z-50 flex flex-col shadow-2xl overflow-hidden border border-border-main/20">
        
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
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-32 md:pb-36 pt-4">
          
          {/* Section 1: Hoạt động vườn */}
          <div className="mb-6">
            <label className="font-bold text-sm text-text-main/70 mb-2 block">Hoạt động vườn</label>
            <div className="relative mb-4">
              <input 
                className="w-full px-6 py-4 bg-bg-surface-1 rounded-[20px] border border-border-main/30 focus:border-primary-container focus:ring-1 focus:ring-primary-container font-semibold text-base text-text-main placeholder:text-text-main/50 shadow-sm transition-shadow" 
                placeholder="Nhập hoạt động mới..." 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {activityOptions.map(option => {
                const isActive = title.toLowerCase().trim() === option.toLowerCase().trim();
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTitle(option)}
                    className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-primary text-white shadow-md scale-105 border border-primary' 
                        : 'bg-bg-surface-1 border border-border-main/50 text-text-main/70 hover:bg-border-main/30'
                    }`}
                  >
                    {option === 'Tưới nước' && '💧'}
                    {option === 'Bón phân' && '🌱'}
                    {option === 'Phun thuốc' && '🧪'}
                    {option === 'Làm cỏ' && '🌾'}
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector: Vụ mùa liên kết */}
          <div className="mb-6">
            <label className="font-bold text-sm text-text-main/70 mb-2 block">Vụ mùa liên kết (Không bắt buộc)</label>
            <select
              value={diaryId}
              onChange={(e) => setDiaryId(e.target.value)}
              className="w-full px-6 py-4 bg-bg-surface-1 rounded-[20px] border border-border-main/30 focus:border-primary-container focus:ring-1 focus:ring-primary-container font-semibold text-base text-text-main shadow-sm transition-shadow outline-none cursor-pointer"
            >
              <option value="">-- Không liên kết --</option>
              {diaries.map(d => (
                <option key={d._id} value={d._id}>
                  {d.crop_type} ({d.plot_name})
                </option>
              ))}
            </select>
          </div>

          {/* Section 2: Thời gian nhắc nhở */}
          <div className="mb-6">
            <label className="font-bold text-sm text-text-main/70 mb-2 block">Thời gian nhắc nhở</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-surface-1 border border-border-main/30 p-4 rounded-2xl flex flex-col gap-1 relative shadow-sm">
                <label className="text-[10px] text-text-main/50 uppercase font-extrabold tracking-wider">Giờ</label>
                <input
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="bg-transparent text-lg font-extrabold text-text-main border-none outline-none focus:ring-0 w-full cursor-pointer"
                  required
                />
              </div>
              <div className="bg-bg-surface-1 border border-border-main/30 p-4 rounded-2xl flex flex-col gap-1 relative shadow-sm">
                <label className="text-[10px] text-text-main/50 uppercase font-extrabold tracking-wider">Ngày</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="bg-transparent text-lg font-extrabold text-text-main border-none outline-none focus:ring-0 w-full cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>


          {/* Section 4: Kênh nhận thông báo (Static presentation) */}
          <div className="mb-6">
            <label className="font-bold text-sm text-text-main/70 mb-4 block">Kênh nhận thông báo</label>
            <div className="space-y-3">
              
              <div className="flex items-center justify-between p-4 bg-white border border-border-main/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    💧
                  </div>
                  <span className="font-bold text-base text-text-main">💬 Nhận qua Zalo (Mock)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked disabled className="sr-only peer" />
                  <div className="w-12 h-6 bg-primary peer-focus:outline-none rounded-full shadow-inner opacity-75"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-border-main/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-lightest/20 flex items-center justify-center text-primary border border-primary/20">
                    🔔
                  </div>
                  <span className="font-bold text-base text-text-main">🔔 Thông báo đẩy thiết bị</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked disabled className="sr-only peer" />
                  <div className="w-12 h-6 bg-primary peer-focus:outline-none rounded-full shadow-inner opacity-75"></div>
                </label>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 bg-white/90 backdrop-blur-md border-t border-border-main/30 flex flex-col items-center gap-3 absolute bottom-0 w-full z-10 md:rounded-b-[40px]">
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-primary text-white font-bold text-lg rounded-full shadow-[0_10px_20px_rgba(8,168,85,0.2)] hover:scale-[1.02] active:scale-95 active:shadow-sm transition-all cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Đang đặt...' : 'Đặt nhắc nhở'}
          </button>
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="text-text-main/50 font-bold hover:text-text-main transition-colors py-2 cursor-pointer"
          >
            Hủy bỏ
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateReminder;
