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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Bắt đầu vụ mùa mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Loại cây trồng *</label>
            <select
              value={selectedCropType}
              onChange={(e) => setSelectedCropType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
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
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tên cây trồng *</label>
              <input
                type="text"
                value={customCropType}
                onChange={(e) => setCustomCropType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="VD: Chanh dây, Bơ Booth..."
                required={selectedCropType === 'Khác...'}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Tên mùa vụ *</label>
            <input
              type="text"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder={`${selectedCropType} · ${startDate.slice(0, 4)}`}
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" fullWidth onClick={onClose}>Hủy</Button>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
