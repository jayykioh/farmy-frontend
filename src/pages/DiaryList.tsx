import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnapFAB } from '../components/SnapFAB';
import { PageHeader } from '../components/PageHeader';
import { useGetDiariesQuery } from '../store/api/farmApi';
import { CreateSeasonModal } from '../components/modals/CreateSeasonModal';
import { Filter, ArrowUpDown } from 'lucide-react';

type FilterType = 'all' | 'active' | 'archived' | 'lua' | 'ca-phe' | 'cay-an-trai' | 'rau-mau' | 'other';
type SortType = 'recent_activity' | 'newest_start' | 'oldest_start';

export const DiaryList: React.FC = () => {
  const navigate = useNavigate();
  const { data: diaries = [], isLoading: loading } = useGetDiariesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for filtering & sorting
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('recent_activity');

  const getCropImage = (cropType: string) => {
    const typeLower = cropType.toLowerCase();
    if (typeLower.includes('lúa') || typeLower.includes('nếp') || typeLower.includes('thơm')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzBjvc2DnHkU5kbDFMSwtv8BlsaiWbQudALcZbuYhJy8SPHAFmGOkRmm-l4KC5VSOUk3atkwm00nuuz6Z2ZTKRVAhQjwV3GoTebXZfy1o2eAujMFFziKt-smBZYu6Z5Y1OVRnyLwO5JVfFyoo6FbCJJv1cckKZSMi83YrGWZ_7RpHiVKx2k0l6Z-YKvzETxUD2sLP4FyEfy0ttKsrdDJkHT2IBS62yJLWXk_d0dEaJPZWKTLQH6XjW6IIrIL0y_y0AlbCNPcThctr7';
    }
    if (typeLower.includes('cà chua')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ98QwVUaI-DYbws4DExxqd5xte7Qsvnb_b1pfuim31P1em64_rv8k8mhv-ekc8vTVSDCAXyl2iszSTYAk-UGVNY3DAuFbnqmHK8vvkA1kl7Gk7g-MyndBvWKCjfG5eYPNiCsJ8ETcmdNgkjOpGqEEiDgdWh1ZZD1LInCVY4-RDhT6EnOkcQmqqNP5aKuHqDgJcqbw1aU03xTwIeAgj44GBwbORCJUR6IuOK5-Q3P17hzsLuTXZvHOCZNDXU4HrHFK_jc3FcLYK9Lc';
    }
    if (typeLower.includes('cà phê') || typeLower.includes('robusta') || typeLower.includes('arabica') || typeLower.includes('liberica')) {
      return 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&h=300&fit=crop';
    }
    if (typeLower.includes('bưởi') || typeLower.includes('cam')) {
      return 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=300&h=300&fit=crop';
    }
    if (typeLower.includes('xoài')) {
      return 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=300&h=300&fit=crop';
    }
    if (typeLower.includes('rau') || typeLower.includes('bắp cải') || typeLower.includes('hành')) {
      return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop';
    }
    return '';
  };

  const processedDiaries = useMemo(() => {
    // 1. Filter
    let filtered = diaries.filter((diary) => {
      switch (activeFilter) {
        case 'active': return diary.status === 'active';
        case 'archived': return diary.status === 'archived';
        case 'lua': return ['lúa', 'nếp', 'thơm'].some(c => diary.crop_type.toLowerCase().includes(c));
        case 'ca-phe': return ['cà phê', 'robusta', 'arabica', 'liberica'].some(c => diary.crop_type.toLowerCase().includes(c));
        case 'cay-an-trai': return ['bưởi', 'cam', 'xoài', 'sầu riêng', 'thanh long', 'chôm chôm', 'mít', 'nhãn'].some(c => diary.crop_type.toLowerCase().includes(c));
        case 'rau-mau': return ['cà chua', 'bắp cải', 'dưa leo', 'ớt', 'hành', 'rau muống'].some(c => diary.crop_type.toLowerCase().includes(c));
        case 'other': return !['lúa', 'nếp', 'thơm', 'cà phê', 'robusta', 'arabica', 'liberica', 'bưởi', 'cam', 'xoài', 'sầu riêng', 'thanh long', 'chôm chôm', 'mít', 'nhãn', 'cà chua', 'bắp cải', 'dưa leo', 'ớt', 'hành', 'rau muống'].some(c => diary.crop_type.toLowerCase().includes(c));
        case 'all':
        default:
          return true;
      }
    });

    // 2. Sort
    filtered.sort((a, b) => {
      const getLatestTime = (d: typeof a) => d.latest_log?.created_at ? new Date(d.latest_log.created_at).getTime() : new Date(d.start_date).getTime();
      
      switch (activeSort) {
        case 'recent_activity':
          return getLatestTime(b) - getLatestTime(a);
        case 'newest_start':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        case 'oldest_start':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [diaries, activeFilter, activeSort]);

  const FilterChip = ({ type, label }: { type: FilterType, label: string }) => {
    const isActive = activeFilter === type;
    return (
      <button
        onClick={() => setActiveFilter(type)}
        className={`px-4 py-2 rounded-full font-bold whitespace-nowrap shadow-sm active:scale-95 transition-all cursor-pointer text-sm ${
          isActive 
            ? 'bg-slate-800 text-white hover:bg-slate-900 scale-105 shadow-md' 
            : 'bg-white border border-border-main/50 text-text-main/70 hover:bg-bg-surface-1 hover:text-text-main hover:border-slate-300'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-full min-h-full bg-bg-surface-1">
      <PageHeader title="Nhật ký nông trại" leftButton="none" />
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-8 flex flex-col gap-6">

        {/* ─── Control Bar (Filters & Actions) ─── */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-black text-text-h flex items-center gap-2">
              Danh sách Vụ mùa
              <span className="text-sm font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">{processedDiaries.length}</span>
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-slate-100 text-slate-800 border border-transparent rounded-full font-bold whitespace-nowrap shadow-sm active:scale-95 transition-transform hover:bg-slate-200 cursor-pointer flex items-center gap-1.5 text-sm"
            >
              <span className="text-lg leading-none mt-[-2px]">+</span> Thêm vụ mùa
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 items-center">
            <div className="flex items-center gap-1.5 mr-1 text-text-main/50">
              <Filter className="w-4 h-4" />
            </div>
            <FilterChip type="all" label="Tất cả" />
            <FilterChip type="active" label="Đang canh tác" />
            <FilterChip type="archived" label="Lưu trữ" />
            <div className="w-px h-6 bg-border-main/50 mx-1 flex-shrink-0"></div>
            <FilterChip type="lua" label="Lúa" />
            <FilterChip type="ca-phe" label="Cà phê" />
            <FilterChip type="cay-an-trai" label="Ăn trái" />
            <FilterChip type="other" label="Khác" />
          </div>

          {/* Sorting Dropdown */}
          <div className="flex justify-end px-1 mt-1">
            <div className="relative inline-flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-text-main/40 absolute left-3" />
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as SortType)}
                className="pl-9 pr-8 py-1.5 bg-white border border-border-main/50 rounded-xl text-xs font-bold text-text-main/80 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none appearance-none cursor-pointer shadow-sm"
              >
                <option value="recent_activity">Hoạt động gần đây</option>
                <option value="newest_start">Bắt đầu gần nhất</option>
                <option value="oldest_start">Bắt đầu cũ nhất</option>
              </select>
            </div>
          </div>
        </section>

        {/* ─── Diary Grid ─── */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-bold text-text-main/60">Đang tải danh sách...</p>
          </div>
        ) : diaries.length === 0 ? (
          <div className="py-20 text-center flex flex-col gap-4 items-center">
            <span className="text-5xl drop-shadow-md">📔</span>
            <div className="flex flex-col gap-1 max-w-xs">
              <h3 className="font-black text-text-h text-xl">Chưa có vụ mùa nào</h3>
              <p className="font-medium text-text-main/60 text-sm">Hãy tạo vụ mùa đầu tiên của bạn để bắt đầu ghi chép quá trình canh tác.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-6 py-3.5 bg-slate-800 text-white font-extrabold rounded-2xl hover:bg-slate-900 cursor-pointer shadow-[0_10px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>+</span> Bắt đầu vụ mùa mới
            </button>
          </div>
        ) : processedDiaries.length === 0 ? (
          <div className="py-20 text-center flex flex-col gap-3 items-center">
            <Filter className="w-10 h-10 text-border-main/80" />
            <p className="font-bold text-text-main/60">Không tìm thấy vụ mùa phù hợp với bộ lọc.</p>
            <button onClick={() => setActiveFilter('all')} className="text-slate-800 font-bold hover:underline text-sm cursor-pointer mt-1">Xóa bộ lọc</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-2">
            {processedDiaries.map(diary => {
              const cropImg = getCropImage(diary.crop_type);
              return (
                <article
                  key={diary._id}
                  onClick={() => navigate(`/diary/history?diaryId=${diary._id}`)}
                  className="bg-white border border-border-main/40 p-4 rounded-2xl shadow-[0_2px_12px_rgba(20,30,23,0.03)] flex gap-4 items-start active:scale-[0.98] hover:shadow-[0_8px_24px_rgba(20,30,23,0.06)] hover:border-slate-300 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${diary.status === 'active' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                  <div className="w-20 h-20 md:w-22 md:h-22 rounded-xl overflow-hidden flex-shrink-0 bg-bg-surface flex items-center justify-center border border-border-main/20 group-hover:border-slate-300 transition-colors ml-1">
                    {cropImg ? (
                      <img alt={diary.crop_type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={cropImg} />
                    ) : (
                      <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300">🌱</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-1">
                      <div className="min-w-0 pr-2">
                        <h3 className="text-lg font-black text-text-h truncate group-hover:text-slate-600 transition-colors tracking-tight">{diary.crop_type}</h3>
                        <span className="text-text-main/50 text-xs font-semibold block mt-0.5">
                          Bắt đầu: {new Date(diary.start_date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-black rounded-full uppercase whitespace-nowrap tracking-wider ${diary.status === 'active' ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-400'}`}>
                        {diary.status === 'active' ? 'Đang canh tác' : 'Đã lưu trữ'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-text-main/70 font-medium line-clamp-2 mt-1.5 flex-1">
                      {diary.latest_log
                        ? diary.latest_log.content
                        : 'Chưa có ghi chép nào. Nhấn để cập nhật tình trạng mới nhất.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border-main/30">
                      {diary.latest_log ? (
                        <>
                          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            diary.latest_log.activity_type.toLowerCase().includes('tưới')
                              ? 'bg-blue-50 text-blue-700'
                              : diary.latest_log.activity_type.toLowerCase().includes('phân') || diary.latest_log.activity_type.toLowerCase().includes('dưỡng')
                                ? 'bg-emerald-50 text-emerald-700'
                                : diary.latest_log.activity_type.toLowerCase().includes('thuốc') || diary.latest_log.activity_type.toLowerCase().includes('sâu')
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'bg-slate-100 text-slate-700'
                          }`}>
                            <span>{diary.latest_log.activity_type}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg text-slate-500 text-[11px] font-bold">
                            <span>
                              {new Date(diary.latest_log.created_at).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg text-slate-400 text-[11px] font-bold">
                          <span>Chưa có hoạt động</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button for Create Diary (Log) */}
      <button
        onClick={() => navigate('/diary/create')}
        className="fixed bottom-[140px] right-4 md:bottom-24 md:right-8 w-15 h-15 bg-slate-800 text-white border border-transparent rounded-full flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.2)] z-40 transition-transform hover:scale-105 hover:-translate-y-1 active:scale-95 cursor-pointer hover:bg-slate-900"
        aria-label="Tạo Nhật ký"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <SnapFAB />

      <CreateSeasonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="add-season"
      />
    </div>
  );
};

export default DiaryList;
