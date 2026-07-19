import React from 'react';
import { Calendar, Lightbulb } from 'lucide-react';
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
    <div className="flex-shrink-0 w-[85vw] sm:w-[460px] snap-center bg-white border border-border-main/40 rounded-3xl p-6 shadow-sm text-left">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-[#ebf7eb] flex items-center justify-center flex-shrink-0">
          <Lightbulb className="text-primary" size={22} />
        </div>
        <div>
          <h3 className="font-extrabold text-text-h text-base line-clamp-1">Khuyến nghị nông nghiệp</h3>
          <div className="flex items-center gap-1.5 text-text-muted mt-0.5">
            <Calendar size={12} />
            <span className="text-xs font-semibold">Tuần {formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-[50vh] overflow-y-auto pr-1 text-left">
        <ReactMarkdown
          components={{
            h3: ({ ...props }) => (
              <h3 className="text-sm font-extrabold text-text-h mt-4 mb-2 first:mt-0 flex items-center gap-1.5 border-l-3 border-primary pl-2" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="text-base font-extrabold text-text-h mt-5 mb-2.5 flex items-center gap-1.5 border-l-4 border-primary pl-2.5" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="text-xs font-semibold text-text-secondary leading-relaxed mb-3.5" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-4 space-y-2 mb-4 text-xs text-text-secondary font-medium" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-4 space-y-2 mb-4 text-xs text-text-secondary font-medium" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="pl-0.5 leading-relaxed" {...props} />
            ),
            strong: ({ ...props }) => (
              <strong className="font-extrabold text-text-main bg-green-50/50 px-1 py-0.5 rounded" {...props} />
            ),
          }}
        >
          {insight.insight_text}
        </ReactMarkdown>
      </div>
    </div>
  );
};
