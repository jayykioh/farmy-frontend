import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWeeklyInsights, triggerWeeklyInsight } from '../../api/weekly-insights';
import { InsightCard } from './InsightCard';
import { CheckCircle2, Loader2, FileText, FilePlus } from 'lucide-react';
import { api } from '../../api/client';

interface DiaryOption {
  _id: string;
  crop_type: string;
  season?: string;
  status: string;
}

interface ModalConfig {
  type: 'loading' | 'error' | 'info';
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
  const [selectedDiaryId, setSelectedDiaryId] = useState('');

  const {
    data: diaries = [],
    isLoading: isLoadingDiaries,
    isError: isDiariesError,
  } = useQuery<DiaryOption[]>({
    queryKey: ['diaries', 'insight-options'],
    queryFn: async () => {
      // Cache-bust vì Express ETag có thể trả 304 và làm danh sách lựa chọn
      // bị rỗng trên lần tải đầu của màn hình insight.
      const response = await api.get('/diaries', {
        params: { _t: Date.now() },
      });
      return response.data?.data ?? [];
    },
  });

  const effectiveDiaryId = selectedDiaryId
    || diaries.find((diary) => diary.status === 'active')?._id
    || diaries[0]?._id
    || '';

  const { data: insights, isLoading, isError } = useQuery({
    queryKey: ['weekly-insights'],
    queryFn: () => fetchWeeklyInsights(10),
  });

  const now = new Date();
  const daysFromMonday = now.getUTCDay() === 0 ? 6 : now.getUTCDay() - 1;
  const currentMonday = new Date(now);
  currentMonday.setUTCDate(now.getUTCDate() - daysFromMonday);
  currentMonday.setUTCHours(0, 0, 0, 0);
  const currentWeekInsight = insights?.find(
    (insight) =>
      insight.diary_id === effectiveDiaryId &&
      insight.week_start_date === currentMonday.toISOString(),
  );

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
    onSuccess: async (result, diaryId) => {
      // Nếu tuần này đã có insight → hiển thị thông báo info
      if (result.already_exists) {
        setIsGenerating(false);
        setModalConfig({
          type: 'info',
          title: 'Đã có báo cáo tuần này ✅',
          message: result.message || 'Tuần này đã có báo cáo phân tích rồi! Hãy xem lại báo cáo hiện có hoặc đợi đến tuần sau.',
        });
        return;
      }
      try {
        // Poll kết quả thật thay vì đóng modal sau một timeout cố định.
        for (let attempt = 0; attempt < 30; attempt += 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 2000));
          const latestInsights = await fetchWeeklyInsights(20);
          const generated = latestInsights.some(
            (insight) =>
              insight.diary_id === diaryId &&
              (!result.week_start_date ||
                insight.week_start_date === result.week_start_date),
          );
          if (generated) {
            queryClient.setQueryData(['weekly-insights'], latestInsights);
            setIsGenerating(false);
            setModalConfig({
              type: 'info',
              title: 'Báo cáo đã sẵn sàng ✅',
              message: 'Báo cáo tuần của mùa vụ đã được tạo thành công.',
            });
            return;
          }
        }
      } catch (pollError) {
        console.error('Polling insight failed:', pollError);
      }

      setIsGenerating(false);
      setModalConfig({
        type: 'error',
        title: 'Chưa tạo được báo cáo',
        message: 'Hệ thống chưa nhận được kết quả sau 60 giây. Bạn có thể đóng thông báo và thử tạo lại.',
      });
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

  const triggerSelectedDiary = () => {
    if (currentWeekInsight) {
      setModalConfig({
        type: 'info',
        title: 'Đã có báo cáo tuần này ✅',
        message: 'Mùa vụ đang chọn đã có báo cáo. Bạn có thể xem nội dung ngay bên dưới hoặc đợi đến tuần sau để tạo báo cáo mới.',
      });
      return;
    }
    if (!effectiveDiaryId) {
      setModalConfig({
        type: 'error',
        title: 'Chưa chọn được mùa vụ',
        message: isDiariesError
          ? 'Không thể tải danh sách mùa vụ. Vui lòng tải lại trang và thử lại.'
          : 'Bạn cần tạo ít nhất một mùa vụ trước khi tạo báo cáo tuần.',
      });
      return;
    }
    triggerMutation.mutate(effectiveDiaryId);
  };

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
      {createPortal(
        <AnimatePresence>
          {modalConfig && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
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
                ) : modalConfig.type === 'info' ? (
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-3xl">
                    ✅
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

                {(modalConfig.type === 'error' || modalConfig.type === 'info') && (
                  <button
                    onClick={() => setModalConfig(null)}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-md hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Đóng
                  </button>
                )}
                {modalConfig.type === 'loading' && (
                  <button
                    onClick={() => setModalConfig(null)}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Ẩn và tiếp tục xử lý nền
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-10 mb-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <label htmlFor="insight-diary" className="text-[13px] font-bold text-[#86868b]">
            Mùa vụ:
          </label>
          <select
            id="insight-diary"
            value={effectiveDiaryId}
            onChange={(event) => setSelectedDiaryId(event.target.value)}
            disabled={isBusy || isLoadingDiaries}
            className="min-w-[140px] max-w-[200px] rounded-xl border border-black/[0.08] bg-white/80 backdrop-blur-md px-3 py-2 text-[14px] font-bold text-[#1d1d1f] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#34C759]/30 shadow-sm"
          >
            {isLoadingDiaries && <option value="">Đang tải mùa vụ...</option>}
            {!isLoadingDiaries && diaries.length === 0 && <option value="">Chưa có mùa vụ</option>}
            {diaries.map((diary) => (
              <option key={diary._id} value={diary._id}>
                {diary.crop_type}{diary.season ? ` · ${diary.season}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {insights.length === 0 && !isBusy ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-white/80 backdrop-blur-xl flex items-center justify-center mb-6 border border-white/60 shadow-sm">
            <FileText className="w-10 h-10 text-[#86868b]/60" />
          </div>
          <h3 className="text-[#1d1d1f] font-bold text-[20px] mb-2">Chưa có báo cáo nào</h3>
          <p className="text-[#86868b] text-[15px] mb-8 font-medium">Hãy ghi nhật ký chăm sóc cây thường xuyên để nhận được báo cáo tổng hợp và lời khuyên hàng tuần nhé!</p>
          <button
            onClick={triggerSelectedDiary}
            disabled={isBusy || isLoadingDiaries}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-bold text-white bg-[#1d1d1f] hover:bg-black shadow-[0_4px_16px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            Lập báo cáo tuần
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 md:px-10 mb-6 max-w-4xl mx-auto w-full">
            <h2 className="text-[20px] font-bold text-[#1d1d1f]">Các tuần gần đây</h2>
            <button
              onClick={triggerSelectedDiary}
              disabled={isBusy || isLoadingDiaries}
              className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-full text-[13px] font-bold active:scale-95 transition-all disabled:opacity-60 cursor-pointer ${currentWeekInsight
                  ? 'bg-slate-500 shadow-sm hover:bg-slate-600'
                  : 'bg-[#34C759] shadow-[0_4px_16px_rgba(52,199,89,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(52,199,89,0.4)]'
                }`}
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tổng hợp...
                </>
              ) : (
                <>
                  {currentWeekInsight ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <FilePlus className="w-4 h-4" />
                  )}
                  {currentWeekInsight ? 'Đã có báo cáo tuần này' : 'Lập báo cáo ngay'}
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
