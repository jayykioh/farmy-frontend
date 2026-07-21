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
    <div className="w-full bg-white/60 backdrop-blur-2xl rounded-[32px] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-left flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center flex-shrink-0 border border-black/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <FileText className="text-[#1d1d1f]" size={26} weight="duotone" />
        </div>
        <div>
          <h3 className="font-bold text-[#1d1d1f] text-[18px] line-clamp-1">Báo cáo canh tác</h3>
          <div className="flex items-center gap-1.5 text-[#86868b] mt-1">
            <Calendar size={14} weight="duotone" />
            <span className="text-[14px] font-medium">Tuần {formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-[50vh] overflow-y-auto pr-2 text-left custom-scrollbar">
        <ReactMarkdown
          components={{
            h3: ({ ...props }) => (
              <h3 className="text-[14px] font-bold text-[#1d1d1f] mt-5 mb-2 first:mt-0 flex items-center gap-2 border-l-2 border-[#34C759] pl-3" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="text-[16px] font-bold text-[#1d1d1f] mt-6 mb-3 flex items-center gap-2 border-l-4 border-[#34C759] pl-3 bg-gradient-to-r from-[#34C759]/5 to-transparent py-1 rounded-r-lg" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="text-[14px] font-medium text-[#48484a] leading-relaxed mb-4" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-5 space-y-2.5 mb-5 text-[14px] text-[#48484a] font-medium marker:text-[#86868b]" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-5 space-y-2.5 mb-5 text-[14px] text-[#48484a] font-medium marker:text-[#86868b]" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="pl-1 leading-relaxed" {...props} />
            ),
            strong: ({ ...props }) => (
              <strong className="font-bold text-[#1d1d1f] bg-[#34C759]/10 px-1.5 py-0.5 rounded-md" {...props} />
            ),
          }}
        >
          {insight.insight_text}
        </ReactMarkdown>
      </div>
    </div>
  );
};
