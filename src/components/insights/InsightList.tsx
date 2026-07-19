import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWeeklyInsights, triggerWeeklyInsight } from '../../api/weekly-insights';
import { InsightCard } from './InsightCard';
import { Loader2, LightbulbOff, Sparkles } from 'lucide-react';

interface ModalConfig {
  type: 'loading' | 'error';
  title: string;
  message: string;
}

export const InsightList: React.FC = () => {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const { data: insights, isLoading, isError } = useQuery({
    queryKey: ['weekly-insights'],
    queryFn: () => fetchWeeklyInsights(10),
  });

  const triggerMutation = useMutation({
    mutationFn: triggerWeeklyInsight,
    onMutate: () => {
      setIsGenerating(true);
      setModalConfig({
        type: 'loading',
        title: 'Đang tạo phân tích tuần... ⚡',
        message: 'Trí tuệ nhân tạo đang thu thập và tổng hợp thông tin từ nhật ký vụ mùa của bạn. Vui lòng đợi trong giây lát.',
      });
    },
    onSuccess: () => {
      // Wait 2.5 seconds for BullMQ and Gemini to finish writing the database entry
      setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: ['weekly-insights'] }).then(() => {
          setIsGenerating(false);
          setModalConfig(null);
        });
      }, 2500);
    },
    onError: (error: any) => {
      console.error('Trigger insight failed:', error);
      const errMsg = error.response?.data?.message || error.message || '';
      
      setModalConfig({
        type: 'error',
        title: 'Tạo phân tích thất bại ❌',
        message: errMsg.includes('csrf') 
          ? 'Lỗi bảo mật (invalid CSRF token). Vui lòng cấu hình COOKIE_SAME_SITE=none trên máy chủ Backend của bạn hoặc liên hệ quản trị viên.'
          : 'Không thể tạo bản phân tích tuần mới. Vui lòng thử lại sau.',
      });
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

  return (
    <div className="w-full overflow-hidden relative">
      {/* Framer Motion Modals */}
      <AnimatePresence>
        {modalConfig && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-[28px] border border-black/[0.04] p-6 max-w-sm w-full shadow-[0_24px_80px_rgba(0,0,0,0.08)] flex flex-col items-center text-center gap-4"
            >
              {modalConfig.type === 'loading' ? (
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-3xl">
                  ⚠️
                </div>
              )}
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-1">{modalConfig.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{modalConfig.message}</p>
              </div>
              
              {modalConfig.type === 'error' && (
                <button
                  onClick={() => setModalConfig(null)}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-md hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Đóng
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {insights.length === 0 && !isBusy ? (
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
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
