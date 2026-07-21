import React, { useState } from 'react';
import { Check, CloudSun, CalendarCheck, Plant } from '@phosphor-icons/react';
import type { UserScanContext } from '../../types/plantScan';

interface ContextFormStepProps {
  initialCropType?: string;
  weatherSummary?: string;
  activeSeasonName?: string;
  recentActivityNote?: string;
  onSubmit: (context: UserScanContext) => void;
}

export const ContextFormStep: React.FC<ContextFormStepProps> = ({
  initialCropType = 'Lúa',
  weatherSummary = 'Mưa vừa 3 ngày qua, độ ẩm 85%',
  activeSeasonName = 'Vụ Mùa 2026',
  recentActivityNote = 'Bón NPK 3 ngày trước',
  onSubmit,
}) => {
  const [organ, setOrgan] = useState<'Lá' | 'Thân' | 'Quả' | 'Rễ'>('Lá');
  const [onset, setOnset] = useState<'Hôm nay' | 'Vài ngày' | 'Lâu'>('Vài ngày');
  const [progress, setProgress] = useState<'Ổn định' | 'Lan chậm' | 'Lan nhanh'>('Lan chậm');
  const [cropType, setCropType] = useState<string>(initialCropType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      crop_type: cropType,
      organ,
      onset,
      progress,
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-xl border border-black/5 text-left flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Thông tin canh tác</h3>
        <p className="text-xs font-semibold text-slate-500">Cung cấp vài thông tin ngắn giúp Bé Thóc phân tích chuẩn xác hơn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Crop type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Loại cây trồng</label>
          <input
            type="text"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
            placeholder="Ví dụ: Lúa, Sầu Riêng, Dưa Leo..."
          />
        </div>

        {/* Organ affected */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Bộ phận có vấn đề</label>
          <div className="grid grid-cols-4 gap-2">
            {(['Lá', 'Thân', 'Quả', 'Rễ'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setOrgan(item)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  organ === item
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Onset time */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Xuất hiện từ bao giờ?</label>
          <div className="grid grid-cols-3 gap-2">
            {(['Hôm nay', 'Vài ngày', 'Lâu'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setOnset(item)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  onset === item
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Progress rate */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mức độ lan rộng</label>
          <div className="grid grid-cols-3 gap-2">
            {(['Ổn định', 'Lan chậm', 'Lan nhanh'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setProgress(item)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  progress === item
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Auto-filled badges */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-2 text-emerald-800">
            <CloudSun size={15} weight="bold" className="text-emerald-600" />
            <span>✓ {weatherSummary}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-800">
            <Plant size={15} weight="bold" className="text-emerald-600" />
            <span>✓ {activeSeasonName}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-800">
            <CalendarCheck size={15} weight="bold" className="text-emerald-600" />
            <span>✓ Nhật ký gần nhất: {recentActivityNote}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 text-xs font-extrabold text-white bg-[#34C759] hover:bg-emerald-600 rounded-2xl active:scale-95 transition-all shadow-md shadow-emerald-500/20 cursor-pointer mt-2"
        >
          🔬 Bắt đầu phân tích ngay ➔
        </button>
      </form>
    </div>
  );
};
