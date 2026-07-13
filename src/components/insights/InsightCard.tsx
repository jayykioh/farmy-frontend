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
    <div className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-bg-surface/80 backdrop-blur-xl border border-border-main/50 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary-main/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="text-primary-main" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-text-main text-base line-clamp-1">Insight Tuần Này</h3>
          <div className="flex items-center gap-1.5 text-text-muted mt-0.5">
            <Calendar size={12} />
            <span className="text-xs font-medium">Tuần {formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="prose prose-sm prose-p:text-text-secondary prose-p:leading-relaxed prose-headings:text-text-main max-h-[50vh] overflow-y-auto custom-scrollbar">
        <ReactMarkdown>{insight.insight_text}</ReactMarkdown>
      </div>
    </div>
  );
};
