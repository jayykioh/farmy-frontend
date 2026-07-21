import React from 'react';
import { Camera, ArrowRight, Lightbulb, SkipForward } from '@phosphor-icons/react';

export interface AdditionalAngleSuggestion {
  id: 'underside' | 'whole_plant' | 'stem_root' | 'healthy_neighbor';
  title: string;
  reason: string;
  icon: string;
}

interface GuidedAdditionalCaptureProps {
  primaryPreviewUrl: string;
  additionalPreviews: string[];
  suggestions: AdditionalAngleSuggestion[];
  onAddPhoto: (angleId: string) => void;
  onSkip: () => void;
}

export const GuidedAdditionalCapture: React.FC<GuidedAdditionalCaptureProps> = ({
  primaryPreviewUrl,
  additionalPreviews,
  suggestions,
  onAddPhoto,
  onSkip,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-xl border border-black/5 text-left flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Góc chụp bổ sung</h3>
          <p className="text-xs font-semibold text-slate-500">Giúp Bé Thóc nhận diện chính xác nguồn bệnh hơn</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
          Khuyên dùng ✨
        </span>
      </div>

      {/* Primary & Captured previews */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 shrink-0 shadow-xs">
          <img src={primaryPreviewUrl} alt="Ảnh chính" className="w-full h-full object-cover" />
          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
            Ảnh chính
          </span>
        </div>

        {additionalPreviews.map((url, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0 shadow-xs">
            <img src={url} alt={`Ảnh bổ sung ${idx + 1}`} className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
              Góc {idx + 2}
            </span>
          </div>
        ))}
      </div>

      {/* AI Suggestion Box */}
      <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-200/60 flex items-center justify-center text-emerald-800 shrink-0">
          <Lightbulb size={20} weight="fill" />
        </div>
        <div className="text-xs font-semibold text-emerald-950 space-y-1">
          <p className="font-bold text-emerald-900">Gợi ý góc chụp từ AI:</p>
          <p>Ảnh đầu tiên đã ghi nhận vết bệnh trên lá. Để phân biệt nấm & sâu hại, hãy chụp thêm mặt dưới lá hoặc thân cây.</p>
        </div>
      </div>

      {/* Angle option buttons */}
      <div className="grid grid-cols-1 gap-2.5">
        {suggestions.map((sug) => (
          <button
            key={sug.id}
            onClick={() => onAddPhoto(sug.id)}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer group active:scale-98 text-left bg-slate-50/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{sug.icon}</span>
              <div>
                <p className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-700">{sug.title}</p>
                <p className="text-[11px] font-medium text-slate-500">{sug.reason}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-slate-600 transition-all shrink-0">
              <Camera size={16} weight="bold" />
            </div>
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onSkip}
          className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <SkipForward size={16} weight="bold" />
          Bỏ qua & Phân tích ngay
        </button>
      </div>
    </div>
  );
};
