import React from 'react';
import { Check, Warning, Sun, Crop, FrameCorners, Eye } from '@phosphor-icons/react';
import type { ImageQualityInfo } from '../../types/plantScan';

interface ImageQualityAssistantProps {
  quality: ImageQualityInfo;
  onProceed: () => void;
  onRetake: () => void;
}

export const ImageQualityAssistant: React.FC<ImageQualityAssistantProps> = ({
  quality,
  onProceed,
  onRetake,
}) => {
  const getBadgeStyle = (status: ImageQualityInfo['status']) => {
    switch (status) {
      case 'good':
        return { text: 'Chất lượng tốt', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'usable':
        return { text: 'Có thể phân tích', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'fair':
        return { text: 'Cần chụp rõ hơn', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'poor':
      default:
        return { text: 'Chưa thể phân tích', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
  };

  const badge = getBadgeStyle(quality.status);

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-xl border border-black/5 text-left flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Kiểm tra chất lượng ảnh</h3>
          <p className="text-xs font-semibold text-slate-500">Bé Thóc đánh giá chất lượng ảnh chụp đầu vào</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-black border shadow-2xs ${badge.bg}`}>
          {badge.text} ({quality.score}%)
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${quality.checks.is_enough_light ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <Sun size={18} weight="bold" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            {quality.checks.is_enough_light ? '✓ Đủ ánh sáng tốt' : '! Ánh sáng hơi yếu hoặc chói'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${quality.checks.is_centered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <FrameCorners size={18} weight="bold" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            {quality.checks.is_centered ? '✓ Lá/Vết bệnh nằm trong khung' : '! Hãy đưa đốm bệnh vào giữa khung'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!quality.checks.is_blurry ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            <Eye size={18} weight="bold" />
          </div>
          <span className="text-xs font-bold text-slate-800">
            {!quality.checks.is_blurry ? '✓ Ảnh nét rõ chi tiết' : '! Ảnh hơi mờ hoặc bị rung tay'}
          </span>
        </div>
      </div>

      {/* Tips */}
      {quality.checks.tips.length > 0 && (
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2">
          <Warning size={18} className="text-amber-600 shrink-0 mt-0.5" weight="fill" />
          <div className="text-xs font-semibold text-amber-900 space-y-1">
            {quality.checks.tips.map((tip, idx) => (
              <p key={idx}>💡 {tip}</p>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onRetake}
          className="flex-1 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl active:scale-95 transition-all cursor-pointer"
        >
          📷 Chụp lại ảnh khác
        </button>
        <button
          onClick={onProceed}
          disabled={quality.status === 'poor'}
          className="flex-1 py-3 text-xs font-extrabold text-white bg-[#34C759] hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl active:scale-95 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          {quality.status === 'good' || quality.status === 'usable' ? 'Tiếp tục phân tích ➔' : 'Vẫn dùng ảnh này ➔'}
        </button>
      </div>
    </div>
  );
};
