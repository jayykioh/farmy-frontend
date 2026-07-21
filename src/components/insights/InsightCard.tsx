import React from 'react';
import { Calendar, FileText } from '@phosphor-icons/react';
import type { WeeklyInsight } from '../../api/weekly-insights';
import ReactMarkdown from 'react-markdown';

interface InsightCardProps {
  insight: WeeklyInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const date = new Date(insight.week_start_date);
  const formattedDate = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="w-full bg-white rounded-[32px] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/[0.04] text-left flex flex-col mb-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#34C759]/20 to-[#34C759]/5 flex items-center justify-center flex-shrink-0 ring-1 ring-[#34C759]/20">
            <FileText className="text-[#34C759]" size={26} weight="duotone" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#1d1d1f] text-[20px] tracking-tight">Báo cáo canh tác</h3>
            <div className="flex items-center gap-1.5 text-[#86868b] mt-0.5">
              <Calendar size={15} weight="duotone" />
              <span className="text-[14px] font-semibold">Tuần {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-h-[55vh] overflow-y-auto pr-3 text-left custom-scrollbar">
        <ReactMarkdown
          components={{
            h2: ({ ...props }) => (
              <h2 className="text-[18px] font-black text-[#1d1d1f] mt-8 mb-4 first:mt-0 flex items-center gap-3 border-l-4 border-[#34C759] pl-4 bg-gradient-to-r from-[#34C759]/10 via-[#34C759]/5 to-transparent py-2 rounded-r-xl" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-[16px] font-bold text-[#1d1d1f] mt-6 mb-3 flex items-center gap-2 border-l-2 border-[#34C759]/50 pl-3" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="text-[15px] font-medium text-[#48484a] leading-relaxed mb-4" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-5 space-y-3 mb-6 text-[15px] text-[#48484a] font-medium marker:text-[#34C759]" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-5 space-y-3 mb-6 text-[15px] text-[#48484a] font-medium marker:text-[#86868b] marker:font-bold" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="pl-1 leading-relaxed" {...props} />
            ),
            strong: ({ ...props }) => (
              <strong className="font-bold text-[#1d1d1f] bg-[#34C759]/15 px-1.5 py-0.5 rounded-md" {...props} />
            ),
          }}
        >
          {insight.insight_text}
        </ReactMarkdown>
      </div>
    </div>
  );
};
