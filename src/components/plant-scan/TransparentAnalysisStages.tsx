import React, { useState, useEffect } from 'react';
import { CircleNotch, CheckCircle } from '@phosphor-icons/react';

interface Stage {
  id: number;
  label: string;
}

const STAGES: Stage[] = [
  { id: 1, label: 'Đang kiểm tra chất lượng ảnh' },
  { id: 2, label: 'Đang nhận diện dấu hiệu trên lá & cây' },
  { id: 3, label: 'Đang đối chiếu dữ liệu thời tiết & nhật ký' },
  { id: 4, label: 'Đang tham khảo tài liệu kỹ thuật RAG' },
  { id: 5, label: 'Đang tổng hợp các khả năng chẩn đoán' },
];

export const TransparentAnalysisStages: React.FC = () => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-8 shadow-xl border border-black/5 text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 rounded-full bg-emerald-100/70 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-inner">
        <CircleNotch size={32} className="animate-spin" weight="bold" />
      </div>

      <div>
        <h3 className="font-extrabold text-xl text-slate-900 tracking-tight">Bé Thóc đang xem cây của bạn...</h3>
        <p className="text-xs font-semibold text-slate-500 mt-1">Vui lòng chờ trong giây lát để có kết quả minh bạch</p>
      </div>

      <div className="w-full space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left">
        {STAGES.map((stg, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;

          return (
            <div key={stg.id} className="flex items-center gap-3 transition-all duration-300">
              {isDone ? (
                <CheckCircle size={20} className="text-emerald-500 shrink-0" weight="fill" />
              ) : isCurrent ? (
                <CircleNotch size={20} className="text-emerald-600 animate-spin shrink-0" weight="bold" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <span className={`text-xs font-bold ${isDone ? 'text-slate-800' : isCurrent ? 'text-emerald-700 font-black' : 'text-slate-400'}`}>
                {stg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
