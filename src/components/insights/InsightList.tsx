import React, { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWeeklyInsights, triggerWeeklyInsight } from '../../api/weekly-insights';
import { InsightCard } from './InsightCard';
import {
  CheckCircle,
  CircleNotch,
  FileText,
  FilePlus,
  Funnel,
  X,
  Plant,
  Plus,
  SortDescending,
  SortAscending,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';
import { api } from '../../api/client';
import { CreateSeasonModal } from '../modals/CreateSeasonModal';

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
  const [showCreateSeason, setShowCreateSeason] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter state
  const [filterDiaryId, setFilterDiaryId] = useState<string>('all');
  const [filterWeekDate, setFilterWeekDate] = useState<string>('all');

  // Ref for season scroll container
  const seasonScrollRef = useRef<HTMLDivElement>(null);

  const scrollSeasonContainer = (direction: 'left' | 'right') => {
    if (seasonScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      seasonScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const {
    data: diaries = [],
    isLoading: isLoadingDiaries,
    isError: isDiariesError,
  } = useQuery<DiaryOption[]>({
    queryKey: ['diaries', 'insight-options'],
    queryFn: async () => {
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

  const { data: insights = [], isLoading, isError } = useQuery({
    queryKey: ['weekly-insights'],
    queryFn: () => fetchWeeklyInsights(20),
  });

  // Extract unique week dates for the currently selected diary filter
  const uniqueWeeks = useMemo(() => {
    const relevantInsights = insights.filter((i) =>
      filterDiaryId === 'all' ? true : i.diary_id === filterDiaryId
    );
    const dates = relevantInsights.map((i) => i.week_start_date);
    const unique = Array.from(new Set(dates));
    return unique.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [insights, filterDiaryId]);

  // Tự động chuyển tuần về 'all' nếu tuần đang chọn không có dữ liệu trong mùa vụ mới lọc
  React.useEffect(() => {
    if (filterWeekDate !== 'all' && !uniqueWeeks.includes(filterWeekDate)) {
      setFilterWeekDate('all');
    }
  }, [filterDiaryId, uniqueWeeks, filterWeekDate]);

  // Filtered list based on week & diary filters
  const filteredInsights = useMemo(() => {
    return insights.filter((insight) => {
      const matchDiary = filterDiaryId === 'all' || insight.diary_id === filterDiaryId;
      const matchWeek = filterWeekDate === 'all' || insight.week_start_date === filterWeekDate;
      return matchDiary && matchWeek;
    });
  }, [insights, filterDiaryId, filterWeekDate]);

  const sortedFilteredInsights = useMemo(() => {
    return [...filteredInsights].sort((a, b) => {
      const timeA = new Date(a.week_start_date).getTime();
      const timeB = new Date(b.week_start_date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [filteredInsights, sortOrder]);

  const hasActiveFilter = filterDiaryId !== 'all' || filterWeekDate !== 'all';

  const now = new Date();
  const daysFromMonday = now.getUTCDay() === 0 ? 6 : now.getUTCDay() - 1;
  const currentMonday = new Date(now);
  currentMonday.setUTCDate(now.getUTCDate() - daysFromMonday);
  currentMonday.setUTCHours(0, 0, 0, 0);

  const currentWeekInsight = insights.find(
    (insight) =>
      insight.diary_id === effectiveDiaryId &&
      insight.week_start_date === currentMonday.toISOString(),
  );

  const handleSelectDiary = (diaryId: string) => {
    if (isBusy) return;
    setSelectedDiaryId(diaryId);
    setFilterDiaryId(diaryId);
  };

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
        <CircleNotch className="w-8 h-8 text-primary-main animate-spin" weight="bold" />
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
                    <CircleNotch className="w-8 h-8 animate-spin" weight="bold" />
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

      <CreateSeasonModal
        isOpen={showCreateSeason}
        onClose={() => setShowCreateSeason(false)}
        mode="add-season"
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['diaries', 'insight-options'] });
          setShowCreateSeason(false);
        }}
      />

      {/* Season Selector Pills & Create Season */}
      <div className="flex flex-col gap-3 px-6 md:px-10 mb-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between gap-4">
          <label className="text-[14px] font-bold text-[#1d1d1f]">🌱 Chọn mùa vụ lập báo cáo:</label>
          <button
            onClick={triggerSelectedDiary}
            disabled={isBusy || isLoadingDiaries}
            className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-full text-[13px] font-bold active:scale-95 transition-all disabled:opacity-60 cursor-pointer ${
              currentWeekInsight
                ? 'bg-slate-600 shadow-sm hover:bg-slate-700'
                : 'bg-[#34C759] shadow-[0_4px_16px_rgba(52,199,89,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(52,199,89,0.4)]'
            }`}
          >
            {isBusy ? (
              <>
                <CircleNotch className="w-4 h-4 animate-spin" weight="bold" />
                Đang tổng hợp...
              </>
            ) : (
              <>
                {currentWeekInsight ? (
                  <CheckCircle className="w-4 h-4" weight="duotone" />
                ) : (
                  <FilePlus className="w-4 h-4" weight="bold" />
                )}
                {currentWeekInsight ? 'Đã có báo cáo tuần này' : 'Lập báo cáo ngay'}
              </>
            )}
          </button>
        </div>

        <div className="relative group">
          {/* Nút cuộn trái */}
          {diaries.length > 1 && (
            <button
              onClick={() => scrollSeasonContainer('left')}
              className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-black/10 items-center justify-center text-slate-700 hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Cuộn sang trái"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
          )}

          {/* Nút cuộn phải */}
          {diaries.length > 1 && (
            <button
              onClick={() => scrollSeasonContainer('right')}
              className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-black/10 items-center justify-center text-slate-700 hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Cuộn sang phải"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          )}

          <div
            ref={seasonScrollRef}
            className="flex overflow-x-auto gap-3 pb-3 snap-x snap-mandatory scroll-smooth custom-scrollbar -mx-4 px-4 md:mx-0 md:px-1 items-stretch"
          >
            {isLoadingDiaries && (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="min-w-[160px] h-16 bg-black/5 rounded-2xl animate-pulse flex-shrink-0" />
                ))}
              </>
            )}

            {/* Pill Tất cả mùa vụ */}
            {!isLoadingDiaries && diaries.length > 0 && (
              <div
                onClick={() => {
                  if (isBusy) return;
                  setFilterDiaryId('all');
                }}
                className={`flex items-center gap-3 min-w-fit px-4 py-3 rounded-[20px] cursor-pointer transition-all flex-shrink-0 snap-start border ${
                  filterDiaryId === 'all'
                    ? 'bg-white border-[#34C759]/30 shadow-[0_8px_24px_rgba(52,199,89,0.12)] ring-1 ring-[#34C759]'
                    : 'bg-white/50 border-black/5 hover:bg-white/80 hover:border-black/10 hover:shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${filterDiaryId === 'all' ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-black/5 text-[#86868b]'}`}>
                  <Plant size={20} weight={filterDiaryId === 'all' ? "fill" : "duotone"} />
                </div>
                <div className="flex flex-col pr-2">
                  <span className={`text-[14px] font-bold ${filterDiaryId === 'all' ? 'text-[#1d1d1f]' : 'text-[#48484a]'}`}>
                    Tất cả mùa vụ
                  </span>
                  <span className="text-[12px] font-medium text-[#86868b]">
                    {diaries.length} mùa vụ
                  </span>
                </div>
              </div>
            )}

            {!isLoadingDiaries && diaries.map((diary) => {
              const isActive = diary._id === (filterDiaryId === 'all' ? effectiveDiaryId : filterDiaryId);
              return (
                <div
                  key={diary._id}
                  onClick={() => handleSelectDiary(diary._id)}
                  className={`flex items-center gap-3 min-w-fit px-4 py-3 rounded-[20px] cursor-pointer transition-all flex-shrink-0 snap-start border ${
                    isActive
                      ? 'bg-white border-[#34C759]/30 shadow-[0_8px_24px_rgba(52,199,89,0.12)] ring-1 ring-[#34C759]'
                      : 'bg-white/50 border-black/5 hover:bg-white/80 hover:border-black/10 hover:shadow-sm'
                  } ${isBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-black/5 text-[#86868b]'}`}>
                    <Plant size={20} weight={isActive ? "fill" : "duotone"} />
                  </div>
                  <div className="flex flex-col pr-2">
                    <span className={`text-[14px] font-bold ${isActive ? 'text-[#1d1d1f]' : 'text-[#48484a]'}`}>
                      {diary.crop_type || 'Nông sản'}
                    </span>
                    {diary.season && (
                      <span className="text-[12px] font-medium text-[#86868b]">
                        {diary.season}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Nút Tạo Mùa vụ */}
            {!isLoadingDiaries && (
              <div
                onClick={() => !isBusy && setShowCreateSeason(true)}
                className={`flex items-center gap-3 min-w-fit px-4 py-3 rounded-[20px] cursor-pointer transition-all flex-shrink-0 snap-start bg-transparent border-2 border-dashed border-black/10 hover:border-black/20 hover:bg-black/5 ${isBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 text-[#86868b]">
                  <Plus size={20} weight="bold" />
                </div>
                <div className="flex flex-col pr-2">
                  <span className="text-[14px] font-bold text-[#48484a]">Tạo mùa vụ</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar: Lọc báo cáo theo Tuần & Mùa Vụ */}
      {insights.length > 0 && (
        <div className="bg-slate-100/90 backdrop-blur-md rounded-2xl p-3.5 mb-6 max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Funnel size={16} weight="bold" className="text-emerald-600" />
            <span>Lọc danh sách:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-2xl">
            {/* Filter 1: Theo Tuần */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Tuần:</span>
              <select
                value={filterWeekDate}
                onChange={(e) => setFilterWeekDate(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả các tuần ({uniqueWeeks.length})</option>
                {uniqueWeeks.map((weekIso) => {
                  const formatted = new Date(weekIso).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  });
                  return (
                    <option key={weekIso} value={weekIso}>
                      Tuần {formatted}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Filter 2: Theo Mùa vụ */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Mùa vụ:</span>
              <select
                value={filterDiaryId}
                onChange={(e) => setFilterDiaryId(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả mùa vụ ({diaries.length})</option>
                {diaries.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.crop_type}{d.season ? ` · ${d.season}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilter && (
              <button
                onClick={() => {
                  setFilterDiaryId('all');
                  setFilterWeekDate('all');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#E53935] bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors cursor-pointer"
              >
                <X size={14} weight="bold" />
                Bỏ lọc
              </button>
            )}
          </div>

          <button
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            {sortOrder === 'desc' ? <SortDescending size={16} weight="bold" /> : <SortAscending size={16} weight="bold" />}
            {sortOrder === 'desc' ? 'Mới nhất' : 'Cũ nhất'}
          </button>
        </div>
      )}

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
            className="flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-bold text-white bg-[#1d1d1f] hover:bg-black shadow-[0_4px_16px_rgba(0,0,0,0.1)] active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
          >
            <FilePlus className="w-4 h-4" weight="bold" />
            Lập báo cáo tuần
          </button>
        </div>
      ) : sortedFilteredInsights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center max-w-lg mx-auto bg-white/50 backdrop-blur-md rounded-3xl border border-slate-200/60 my-6">
          <Funnel className="w-10 h-10 text-slate-400 mb-3" weight="duotone" />
          <h4 className="text-slate-800 font-bold text-base mb-1">Không tìm thấy báo cáo phù hợp</h4>
          <p className="text-slate-500 text-sm mb-4">Không có báo cáo nào khớp với tuần hoặc mùa vụ đã chọn.</p>
          <button
            onClick={() => {
              setFilterDiaryId('all');
              setFilterWeekDate('all');
            }}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-colors"
          >
            Hiển thị tất cả báo cáo
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-6 md:px-10 pb-12 max-w-4xl mx-auto w-full">
          {isBusy && <SkeletonCard />}
          {sortedFilteredInsights.map((insight) => {
            const diary = diaries.find((d) => d._id === insight.diary_id);
            const diaryName = diary
              ? `${diary.crop_type}${diary.season ? ` · ${diary.season}` : ''}`
              : undefined;
            return <InsightCard key={insight.id} insight={insight} diaryName={diaryName} />;
          })}
        </div>
      )}
    </div>
  );
};

