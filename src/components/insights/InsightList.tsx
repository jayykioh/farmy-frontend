import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWeeklyInsights, triggerWeeklyInsight } from '../../api/weekly-insights';
import { InsightCard } from './InsightCard';
import { Loader2, LightbulbOff, Sparkles } from 'lucide-react';

export const InsightList: React.FC = () => {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: insights, isLoading, isError } = useQuery({
    queryKey: ['weekly-insights'],
    queryFn: () => fetchWeeklyInsights(10),
  });

  const triggerMutation = useMutation({
    mutationFn: triggerWeeklyInsight,
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: () => {
      // Wait 2.5 seconds for BullMQ and Gemini to finish writing the database entry
      setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: ['weekly-insights'] }).then(() => {
          setIsGenerating(false);
        });
      }, 2500);
    },
    onError: (error) => {
      console.error('Trigger insight failed:', error);
      alert('Tạo phân tích tuần thất bại. Vui lòng thử lại sau.');
      setIsGenerating(false);
    }
  });

  const SkeletonCard = () => (
    <div className="flex-shrink-0 w-[85vw] max-w-sm snap-center bg-bg-surface/80 backdrop-blur-xl border border-border-main/50 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200/80 rounded w-2/3" />
          <div className="h-3 bg-slate-200/80 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-200/80 rounded" />
        <div className="h-3 bg-slate-200/80 rounded w-5/6" />
        <div className="h-3 bg-slate-200/80 rounded w-2/3" />
      </div>
    </div>
  );

  const isBusy = triggerMutation.isPending || isGenerating;

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

  if (insights.length === 0 && !isBusy) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-bg-surface/80 flex items-center justify-center mb-4 border border-border-main/50">
          <LightbulbOff className="w-8 h-8 text-text-muted/60" />
        </div>
        <h3 className="text-text-main font-semibold text-lg mb-2">Chưa có Insight nào</h3>
        <p className="text-text-secondary text-sm mb-6">Hãy ghi nhật ký chăm sóc cây thường xuyên để nhận được tổng hợp và lời khuyên hàng tuần nhé!</p>
        <button
          onClick={() => triggerMutation.mutate()}
          disabled={isBusy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold text-white bg-slate-950 hover:bg-slate-900 shadow-sm active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Phân tích ngay
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-end px-4 mb-4">
        <button
          onClick={() => triggerMutation.mutate()}
          disabled={isBusy}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-900 shadow-sm active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
        >
          {isBusy ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Đang phân tích dữ liệu...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Phân tích tuần này
            </>
          )}
        </button>
      </div>
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-4 pb-6 pt-2">
        {isBusy && <SkeletonCard />}
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
};
