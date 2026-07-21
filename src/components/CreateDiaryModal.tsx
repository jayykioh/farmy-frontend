import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateDiaryMutation, useGetPlotsQuery, useCreatePlotMutation } from '../store/api/farmApi';
import { Button } from './ui/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const CreateDiaryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [createDiary, { isLoading: isCreatingDiary }] = useCreateDiaryMutation();
  const [createPlot, { isLoading: isCreatingPlot }] = useCreatePlotMutation();
  const { data: plots = [] } = useGetPlotsQuery(undefined, { skip: !isOpen });
  const [selectedCropType, setSelectedCropType] = useState('Lúa');
  const [customCropType, setCustomCropType] = useState('');
  const [seasonName, setSeasonName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const isLoading = isCreatingDiary || isCreatingPlot;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCropType = selectedCropType === 'Khác...' ? customCropType.trim() : selectedCropType;
    const finalSeasonName = seasonName.trim() || `${finalCropType} · ${startDate.slice(0, 4)}`;
    if (!finalCropType) {
      toast.error('Vui lòng nhập tên cây trồng!');
      return;
    }
    
    if (plots.length === 0) {
      toast.error('Không tìm thấy mảnh vườn nào. Vui lòng tạo mảnh vườn trước.');
      return;
    }
    try {
      let activePlotId = plots[0]?._id;
      if (!activePlotId) {
        // Fallback: If onboarding failed to create a plot on the backend,
        // we automatically create a default plot here so the user can still use the app.
        const newPlot = await createPlot({
          name: 'Vườn mặc định',
          area_size: 1,
          description: 'Tạo tự động do lỗi lưu onboarding',
        }).unwrap();
        activePlotId = newPlot._id;
      }

      await createDiary({
        plot_id: activePlotId,
        crop_type: finalCropType,
        season: finalSeasonName,
        start_date: startDate,
      }).unwrap();
      toast.success('Tạo nhật ký thành công!');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Tạo nhật ký thất bại.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md px-4 text-[var(--color-ink)] font-sans">
      <div className="bg-[var(--color-paper)] border-2 border-[var(--color-border-main)] rounded-[32px] p-6 w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.16)] flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border-main)] pb-3">
          <h2 className="text-xl font-extrabold text-[var(--color-ink)] tracking-tight">🌱 Bắt đầu vụ mùa mới</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-border-main)] flex items-center justify-center text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--color-ink)] ml-1">Loại cây trồng *</label>
            <select
              value={selectedCropType}
              onChange={(e) => setSelectedCropType(e.target.value)}
              className="w-full bg-white border border-[var(--color-border-main)] rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20 appearance-none cursor-pointer"
            >
              <option value="Lúa">Lúa</option>
              <option value="Bưởi">Bưởi</option>
              <option value="Cà chua">Cà chua</option>
              <option value="Ớt">Ớt</option>
              <option value="Dưa hấu">Dưa hấu</option>
              <option value="Khác...">Khác...</option>
            </select>
          </div>

          {selectedCropType === 'Khác...' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--color-ink)] ml-1">Tên cây trồng *</label>
              <input
                type="text"
                value={customCropType}
                onChange={(e) => setCustomCropType(e.target.value)}
                className="w-full bg-white border border-[var(--color-border-main)] rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20"
                placeholder="VD: Chanh dây, Bơ Booth..."
                required={selectedCropType === 'Khác...'}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--color-ink)] ml-1">Tên mùa vụ *</label>
            <input
              type="text"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              className="w-full bg-white border border-[var(--color-border-main)] rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20"
              placeholder={`${selectedCropType} · ${startDate.slice(0, 4)}`}
              maxLength={100}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--color-ink)] ml-1">Ngày bắt đầu</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white border border-[var(--color-border-main)] rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20 cursor-pointer"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn--soft flex-1 py-3 text-sm font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn--cyan flex-1 py-3 text-sm font-bold cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Đang tạo...' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
