import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SnapFAB } from '../components/SnapFAB';
import { PageHeader } from '../components/PageHeader';
import { useGetDiariesQuery } from '../store/api/farmApi';
import { CreateSeasonModal } from '../components/modals/CreateSeasonModal';
import { Filter, ArrowUpDown, Search } from 'lucide-react';

type FilterType = 'all' | 'active' | 'archived' | 'lua' | 'ca-phe' | 'cay-an-trai' | 'rau-mau' | 'other';
type SortType = 'recent_activity' | 'newest_start' | 'oldest_start';

export const DiaryList: React.FC = () => {
  const navigate = useNavigate();
  const { data: diaries = [], isLoading: loading } = useGetDiariesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for filtering & sorting
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('recent_activity');
  const [searchTerm, setSearchTerm] = useState('');

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

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(diary => 
        diary.crop_type.toLowerCase().includes(term) ||
        (diary.latest_log && diary.latest_log.content.toLowerCase().includes(term))
      );
    }

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
  }, [diaries, activeFilter, activeSort, searchTerm]);



  return (
    <div className="w-full min-h-full bg-[#fbfbfd]">
      <PageHeader title="Nhật ký nông trại" leftButton="none" />
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-8 flex flex-col gap-6">

        {/* ─── Control Bar (Filters & Actions) ─── */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-black text-text-h flex items-center gap-2">
              Danh sách Vụ mùa
              <span className="text-[13px] font-bold bg-[#E8F8F5] text-[#008A5E] px-2.5 py-0.5 rounded-full border border-[#008A5E]/10">{processedDiaries.length}</span>
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#E8F8F5] text-[#008A5E] border border-[#008A5E]/10 rounded-full font-bold whitespace-nowrap active:scale-95 transition-transform hover:bg-[#D1F2EB] cursor-pointer flex items-center gap-1.5 text-[14px]"
            >
              <span className="text-lg leading-none mt-[-2px]">+</span> Thêm vụ mùa
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/40" />
              <input
                type="text"
                placeholder="Tìm kiếm vụ mùa, ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-border-main/50 rounded-xl text-sm font-medium text-text-main placeholder:text-text-main/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 items-center">
            <div className="flex items-center gap-1.5 mr-1 text-[#86868b]">
              <Filter className="w-4 h-4" />
            </div>
            {[
              { type: 'all', label: 'Tất cả' },
              { type: 'active', label: 'Đang canh tác' },
              { type: 'archived', label: 'Lưu trữ' },
              { type: 'separator', label: '' },
              { type: 'lua', label: 'Lúa' },
              { type: 'ca-phe', label: 'Cà phê' },
              { type: 'cay-an-trai', label: 'Ăn trái' },
              { type: 'other', label: 'Khác' }
            ].map((f, idx) => {
              if (f.type === 'separator') return <div key={idx} className="w-px h-6 bg-black/[0.06] mx-1 flex-shrink-0"></div>;
              const isActive = activeFilter === f.type;
              return (
                <button
                  key={f.type}
                  onClick={() => setActiveFilter(f.type as FilterType)}
                  className={`relative px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer text-[14px] ${
                    isActive 
                      ? 'text-white' 
                      : 'bg-white/70 border border-black/[0.04] text-[#86868b] hover:bg-white hover:text-[#1d1d1f]'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-[#34C759] rounded-full shadow-sm"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
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
                  className="bg-white border border-black/[0.04] p-4 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex gap-4 items-center hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden flex-shrink-0 bg-[#f5f5f7] border border-black/[0.03] flex items-center justify-center relative">
                    {diary.status === 'active' && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#30d158] border-[1.5px] border-white z-10 shadow-sm"></div>
                    )}
                    {cropImg ? (
                      <img alt={diary.crop_type} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={cropImg} />
                    ) : (
                      <span className="text-2xl">🌱</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="text-[17px] font-semibold text-[#1d1d1f] truncate tracking-tight">{diary.crop_type}</h3>
                    </div>
                    
                    <p className="text-[14px] text-[#86868b] line-clamp-1 mb-2.5">
                      {diary.latest_log ? diary.latest_log.content : 'Chưa có ghi chép nào.'}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      {diary.latest_log ? (
                        <div className="flex items-center gap-2">
                           <span className={`text-[12px] font-medium px-2 py-0.5 rounded-lg border ${
                             diary.latest_log.activity_type.toLowerCase().includes('tưới')
                               ? 'bg-[#E5F1FF] text-[#0066CC] border-[#0066CC]/10'
                               : diary.latest_log.activity_type.toLowerCase().includes('phân') || diary.latest_log.activity_type.toLowerCase().includes('dưỡng')
                                 ? 'bg-[#E8F8F5] text-[#008A5E] border-[#008A5E]/10'
                                 : diary.latest_log.activity_type.toLowerCase().includes('thuốc') || diary.latest_log.activity_type.toLowerCase().includes('sâu')
                                   ? 'bg-[#FFF3E0] text-[#E67300] border-[#E67300]/10'
                                   : 'bg-[#f5f5f7] text-[#1d1d1f] border-black/[0.03]'
                           }`}>
                             {diary.latest_log.activity_type}
                           </span>
                           <span className="text-[12px] text-[#86868b] font-medium">
                             {new Date(diary.latest_log.created_at).toLocaleDateString('vi-VN')}
                           </span>
                        </div>
                      ) : (
                        <span className="text-[12px] font-medium px-2 py-0.5 rounded-lg bg-[#f5f5f7] text-[#86868b] border border-black/[0.03]">
                          Bắt đầu: {new Date(diary.start_date).toLocaleDateString('vi-VN')}
                        </span>
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
        className="fixed right-4 md:right-8 w-14 h-14 bg-[#34C759] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(52,199,89,0.35)] z-40 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        style={{ bottom: 'calc(150px + env(safe-area-inset-bottom))' }}
        aria-label="Tạo Nhật ký"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
