import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWeeklyInsights, triggerWeeklyInsight } from '../../api/weekly-insights';
import { InsightCard } from './InsightCard';
import { Loader2, FileText, FilePlus } from 'lucide-react';

interface ModalConfig {
  type: 'loading' | 'error';
  title: string;
  message: string;
}

const SkeletonCard = () => (
  <div className="w-full bg-white/60 backdrop-blur-2xl rounded-[32px] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 rounded-[20px] bg-slate-200/80 flex items-center justify-center flex-shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 bg-slate-200/80 rounded-full w-2/3" />
        <div className="h-3 bg-slate-200/80 rounded-full w-1/3" />
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-3 bg-slate-200/80 rounded-full" />
      <div className="h-3 bg-slate-200/80 rounded-full w-5/6" />
      <div className="h-3 bg-slate-200/80 rounded-full w-2/3" />
    </div>
  </div>
);

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
        title: 'Đang tổng hợp báo cáo... 📝',
        message: 'Hệ thống đang thu thập và tổng hợp thông tin từ nhật ký vụ mùa của bạn. Vui lòng đợi trong giây lát.',
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
        title: 'Lập báo cáo thất bại ❌',
        message: errMsg.includes('csrf') 
          ? 'Lỗi bảo mật (invalid CSRF token). Vui lòng cấu hình COOKIE_SAME_SITE=none trên máy chủ Backend của bạn hoặc liên hệ quản trị viên.'
          : 'Không thể lập báo cáo tuần mới. Vui lòng thử lại sau.',
      });
      setIsGenerating(false);
    }
  });

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
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/60 shadow-sm">
            <FileText className="w-10 h-10 text-[#86868b]/60" />
          </div>
          <h3 className="text-[#1d1d1f] font-bold text-[20px] mb-2">Chưa có báo cáo nào</h3>
          <p className="text-[#86868b] text-[15px] mb-8 font-medium">Hãy ghi nhật ký chăm sóc cây thường xuyên để nhận được báo cáo tổng hợp và lời khuyên hàng tuần nhé!</p>
          <button
            onClick={() => triggerMutation.mutate()}
            disabled={isBusy}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-bold text-white bg-[#1d1d1f] hover:bg-black shadow-[0_4px_16px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            Lập báo cáo tuần
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center px-6 md:px-10 mb-6 max-w-4xl mx-auto w-full">
            <h2 className="text-[20px] font-bold text-[#1d1d1f]">Các tuần gần đây</h2>
            <button
              onClick={() => triggerMutation.mutate()}
              disabled={isBusy}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#34C759] text-white rounded-full text-[13px] font-bold shadow-[0_4px_16px_rgba(52,199,89,0.3)] active:scale-95 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(52,199,89,0.4)] disabled:opacity-60 cursor-pointer"
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tổng hợp...
                </>
              ) : (
                <>
                  <FilePlus className="w-4 h-4" />
                  Lập báo cáo ngay
                </>
              )}
            </button>
          </div>
          <div className="flex flex-col gap-6 px-6 md:px-10 pb-12 max-w-4xl mx-auto w-full">
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
