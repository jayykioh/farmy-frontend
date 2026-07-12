import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWeeklyInsights } from '../../api/weekly-insights';
import { InsightCard } from './InsightCard';
import { Loader2, LightbulbOff } from 'lucide-react';

export const InsightList: React.FC = () => {
  const { data: insights, isLoading, isError } = useQuery({
    queryKey: ['weekly-insights'],
    queryFn: () => fetchWeeklyInsights(10),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="w-8 h-8 text-primary-main animate-spin" />
        <p className="text-text-muted text-sm font-medium animate-pulse">Đang tải insights...</p>
      </div>
    );
  }

  if (isError || !insights) {
    return (
      <div className="bg-status-error/10 border border-status-error/20 rounded-2xl p-4 mx-4">
        <p className="text-status-error text-center text-sm font-medium">Đã có lỗi xảy ra khi tải dữ liệu</p>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-bg-surface/80 flex items-center justify-center mb-4 border border-border-main/50">
          <LightbulbOff className="w-8 h-8 text-text-muted/60" />
        </div>
        <h3 className="text-text-main font-semibold text-lg mb-2">Chưa có Insight nào</h3>
        <p className="text-text-secondary text-sm">Hãy ghi nhật ký chăm sóc cây thường xuyên để nhận được tổng hợp và lời khuyên hàng tuần nhé!</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-4 pb-6 pt-2">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
};
