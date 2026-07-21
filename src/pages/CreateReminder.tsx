/* Hallmark · page: create-reminder · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetPlotsQuery,
  useGetDiariesQuery,
} from '../store/api/farmApi';
import { ChatCircleText, Bell, Drop, Flask, Bug, Leaf, NotePencil } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReminder, type CreateReminderPayload, type Reminder } from '../api/reminders';

export const CreateReminder: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
  const [selectedActivity, setSelectedActivity] = useState('Tưới nước');
  const [customActivity, setCustomActivity] = useState('');
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
  const createMutation = useMutation({ mutationFn: (payload: CreateReminderPayload) => createReminder(payload) });
  const loading = createMutation.isPending;

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
    const titleVal = selectedActivity === 'custom' ? customActivity.trim() : selectedActivity;
    if (!titleVal) {
      toast.error('Vui lòng nhập hoạt động vườn!');
      return;
    }
    if (!diaryId) {
      toast.error('Vui lòng chọn mùa vụ liên kết!');
      return;
    }

    try {
      // Parse local date & time strings back to a Date object
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      if (year < 2024 || year > 2100) {
        toast.error('Năm không hợp lệ (vui lòng chọn từ 2024 đến 2100)!');
        return;
      }

      const remindAt = new Date(year, month - 1, day, hours, minutes);
 
      const activity = activityOptions.find((option) => option.value === selectedActivity) ?? activityOptions[4];
      const created = await createMutation.mutateAsync({
        title: titleVal,
        remind_at: remindAt.toISOString(),
        diary_id: diaryId,
        type: activity.type,
        action_type: activity.actionType,
        action_detail: titleVal,
        repeat,
      });

      const selectedDiary = diariesData.find((diary) => diary._id === diaryId);
      const hydratedReminder: Reminder = {
        ...created,
        diary: selectedDiary ? {
          _id: selectedDiary._id,
          crop_type: selectedDiary.crop_type,
          season: selectedDiary.season,
        } : created.diary,
      };
      queryClient.setQueryData<Reminder[]>(['reminders', { status: 'pending' }], (current = []) => {
        const withoutDuplicate = current.filter((reminder) => reminder._id !== hydratedReminder._id);
        return [...withoutDuplicate, hydratedReminder].sort(
          (a, b) => new Date(a.remind_at).getTime() - new Date(b.remind_at).getTime(),
        );
      });
      await queryClient.invalidateQueries({ queryKey: ['reminders'] });

      navigate('/reminders');
    } catch (err) {
      console.error(err);
      toast.error('Không thể tạo nhắc nhở. Vui lòng kiểm tra lại!');
    }
  };

  const activityOptions: Array<{
    value: string;
    label: string;
    type: CreateReminderPayload['type'];
    actionType: string;
    icon: React.ReactNode;
  }> = [
    { value: 'Tưới nước', label: 'Tưới nước', type: 'water', actionType: 'water', icon: <Drop size={20} weight="duotone" /> },
    { value: 'Bón phân', label: 'Bón phân', type: 'fertilize', actionType: 'fertilize', icon: <Flask size={20} weight="duotone" /> },
    { value: 'Phun thuốc', label: 'Phun thuốc', type: 'plant_alert', actionType: 'pesticide', icon: <Bug size={20} weight="duotone" /> },
    { value: 'Làm cỏ', label: 'Làm cỏ', type: 'diary', actionType: 'weeding', icon: <Leaf size={20} weight="duotone" /> },
    { value: 'custom', label: 'Khác (Nhập thủ công...)', type: 'diary', actionType: 'other', icon: <NotePencil size={20} weight="duotone" /> },
  ];

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-main relative text-left font-sans flex flex-col justify-center items-center">
      {/* Clean overlay sheet background */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-45 transition-opacity" onClick={() => navigate(-1)}></div>

      {/* SCR-09B: Create Reminder Sheet / Modal */}
      <form onSubmit={handleSubmit} className="fixed bottom-0 top-[15%] md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-2xl md:w-[90vw] md:h-auto md:max-h-[85vh] bg-white rounded-t-[40px] md:rounded-[40px] z-50 flex flex-col shadow-2xl overflow-hidden border-2 border-border-main">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b-2 border-border-main bg-white md:rounded-t-[40px] shrink-0 z-10">
          <h2 className="text-xl font-black text-text-h tracking-tight">
            Thêm nhắc nhở mới
          </h2>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-surface-2 active:scale-95 transition-all text-text-main shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-36 pt-6">
          
          {/* Section 1: Hoạt động vườn */}
          <div className="mb-6">
            <label className="font-extrabold text-sm text-text-secondary mb-2 block">Hoạt động vườn</label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {activityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedActivity(option.value)}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold transition-all ${
                    selectedActivity === option.value
                      ? 'border-[#008A5E] bg-[#E9F9F3] text-[#007A54] shadow-sm'
                      : 'border-border-main bg-bg-surface-1 text-text-main hover:border-[#008A5E]/40'
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>

            {selectedActivity === 'custom' && (
              <div className="relative animate-in slide-in-from-top-2 duration-200">
                <input 
                  className="w-full px-6 py-4 bg-bg-surface-1 rounded-[20px] border-2 border-border-main focus:border-[#008A5E] font-bold text-base text-text-main placeholder:text-text-secondary/60 shadow-sm transition-all outline-none" 
                  placeholder="Nhập hoạt động mới..." 
                  type="text"
                  value={customActivity}
                  onChange={(e) => setCustomActivity(e.target.value)}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#008A5E]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </span>
              </div>
            )}
          </div>

          {/* Selector: Vụ mùa liên kết */}
          <div className="mb-6">
            <label className="font-extrabold text-sm text-text-secondary mb-2 block">Vụ mùa liên kết (Bắt buộc)</label>
            <select
              value={diaryId}
              onChange={(e) => setDiaryId(e.target.value)}
              className="w-full px-6 py-4 bg-bg-surface-1 rounded-[20px] border-2 border-border-main focus:border-[#008A5E] font-bold text-base text-text-main shadow-sm transition-all outline-none cursor-pointer"
            >
              <option value="">-- Chọn một vụ mùa --</option>
              {diaries.map(d => (
                <option key={d._id} value={d._id}>
                  {d.crop_type} · {d.season} ({d.plot_name})
                </option>
              ))}
            </select>
          </div>

          {/* Section 2: Thời gian nhắc nhở */}
          <div className="mb-6">
            <label className="font-extrabold text-sm text-text-secondary mb-2 block">Thời gian nhắc nhở</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-surface-1 border-2 border-border-main p-4 rounded-2xl flex flex-col gap-1 relative shadow-sm">
                <label className="text-[10px] text-text-secondary uppercase font-black tracking-wider">Giờ</label>
                <input
                  type="time"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  className="bg-transparent text-lg font-black text-text-main border-none outline-none focus:ring-0 w-full cursor-pointer"
                  required
                />
              </div>
              <div className="bg-bg-surface-1 border-2 border-border-main p-4 rounded-2xl flex flex-col gap-1 relative shadow-sm">
                <label className="text-[10px] text-text-secondary uppercase font-black tracking-wider">Ngày</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="bg-transparent text-lg font-black text-text-main border-none outline-none focus:ring-0 w-full cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Kênh nhận thông báo */}
          <div className="mb-6">
            <label className="font-extrabold text-sm text-text-secondary mb-3 block">Kênh nhận thông báo</label>
            <div className="space-y-3">
              
              <div className="flex items-center justify-between p-4 bg-white border-2 border-border-main rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200">
                    <ChatCircleText className="w-5 h-5" weight="duotone" />
                  </div>
                  <span className="font-bold text-base text-text-main flex items-center gap-2">Nhận qua Email</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked disabled className="sr-only peer" />
                  <div className="w-12 h-6 bg-[#008A5E] peer-focus:outline-none rounded-full shadow-inner opacity-80"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border-2 border-border-main rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-light/20 flex items-center justify-center text-[#008A5E] border border-primary-light/30">
                    <Bell className="w-5 h-5" weight="duotone" />
                  </div>
                  <span className="font-bold text-base text-text-main flex items-center gap-2">Thông báo đẩy thiết bị</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked disabled className="sr-only peer" />
                  <div className="w-12 h-6 bg-[#008A5E] peer-focus:outline-none rounded-full shadow-inner opacity-80"></div>
                </label>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 bg-white border-t-2 border-border-main flex flex-col items-center gap-3 absolute bottom-0 w-full z-10 md:rounded-b-[40px]">
          <button 
            type="submit"
            disabled={loading}
            className={`btn btn--cyan w-full py-4 text-lg font-extrabold cursor-pointer active:scale-95 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Đang đặt...' : 'Đặt nhắc nhở'}
          </button>
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn--soft py-2 px-6 font-bold text-sm text-text-secondary cursor-pointer border-2 border-border-main/50 active:scale-95"
          >
            Hủy bỏ
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateReminder;
