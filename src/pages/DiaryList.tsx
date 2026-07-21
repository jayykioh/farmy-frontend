/* Hallmark · page: diary-list · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SnapFAB } from '../components/SnapFAB';
import { PageHeader } from '../components/PageHeader';
import { useGetDiariesQuery } from '../store/api/farmApi';
import { CreateSeasonModal } from '../components/modals/CreateSeasonModal';
import { Funnel, ArrowsDownUp, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { getCropImagePath, getCropOption } from '../components/ui/CropPicker';

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
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ98QwVUaI-DYbws4DExxqd5xte7Qsvnb_b1pfuim31P1em64_rv8k8mhv-ekc8vTVSDCAXyl2iszSTYAk-UGVNY3DAuFbnqmHK8vvkA1kl7Gk7g-MyndBvWKCjfG5eYPNiCsJ5ETcmdNgkjOpGqEEiDgdWh1ZZD1LInCVY4-RDhT6EnOkcQmqqNP5aKuHqDgJcqbw1aU03xTwIeAgj44GBwbORCJUR6IuOK5-Q3P17hzsLuTXZvHOCZNDXU4HrHFK_jc3FcLYK9Lc';
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
        case 'lua': return ['lúa', 'nếp', 'thơm'].some(c => (diary.crop_type || '').toLowerCase().includes(c));
        case 'ca-phe': return ['cà phê', 'robusta', 'arabica', 'liberica'].some(c => (diary.crop_type || '').toLowerCase().includes(c));
        case 'cay-an-trai': return ['bưởi', 'cam', 'xoài', 'sầu riêng', 'thanh long', 'chôm chôm', 'mít', 'nhãn'].some(c => (diary.crop_type || '').toLowerCase().includes(c));
        case 'rau-mau': return ['cà chua', 'bắp cải', 'dưa leo', 'ớt', 'hành', 'rau muống'].some(c => (diary.crop_type || '').toLowerCase().includes(c));
        case 'other': return !['lúa', 'nếp', 'thơm', 'cà phê', 'robusta', 'arabica', 'liberica', 'bưởi', 'cam', 'xoài', 'sầu riêng', 'thanh long', 'chôm chôm', 'mít', 'nhãn', 'cà chua', 'bắp cải', 'dưa leo', 'ớt', 'hành', 'rau muống'].some(c => (diary.crop_type || '').toLowerCase().includes(c));
        case 'all':
        default:
          return true;
      }
    });

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(diary => 
        (diary.crop_type || '').toLowerCase().includes(term) ||
        (diary.latest_log && (diary.latest_log.content || '').toLowerCase().includes(term))
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
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main pb-24 text-left">
      <PageHeader title="Nhật ký nông trại" leftButton="none" />
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-8 flex flex-col gap-6">

        {/* ─── Control Bar (Filters & Actions) ─── */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl md:text-2xl font-black text-text-h flex items-center gap-2">
              Danh sách Vụ mùa
              <span className="text-[13px] font-bold bg-[#E8F8F5] text-[#008A5E] px-2.5 py-0.5 rounded-full border border-[#008A5E]/10 font-mono">{processedDiaries.length}</span>
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn--soft text-sm px-4 py-2 font-bold cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" weight="bold" /> Thêm vụ mùa
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-1">
            <div className="relative">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" weight="duotone" />
              <input
                type="text"
                placeholder="Tìm kiếm vụ mùa, ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-border-main rounded-[16px] text-sm font-medium text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-4 focus:ring-primary-light/20 focus:border-primary-light transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2 items-center px-1">
            <div className="flex items-center gap-1.5 mr-1 text-text-secondary">
              <Funnel className="w-4 h-4" weight="duotone" />
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
              if (f.type === 'separator') return <div key={idx} className="w-px h-6 bg-border-main mx-1 flex-shrink-0"></div>;
              const isActive = activeFilter === f.type;
              return (
                <button
                  key={f.type}
                  onClick={() => setActiveFilter(f.type as FilterType)}
                  className={`relative px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer active:scale-95 text-sm ${
                    isActive 
                      ? 'text-white' 
                      : 'bg-white/60 border-2 border-border-main/50 text-text-secondary hover:bg-white hover:text-text-main shadow-sm'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-[#008A5E] rounded-full shadow-sm"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex justify-end px-1">
            <div className="relative inline-flex items-center">
              <ArrowsDownUp className="w-3.5 h-3.5 text-text-secondary absolute left-3 pointer-events-none" weight="duotone" />
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as SortType)}
                className="pl-9 pr-8 py-2 bg-white border-2 border-border-main rounded-xl text-xs font-bold text-text-main focus:ring-4 focus:ring-primary-light/20 focus:border-primary outline-none appearance-none cursor-pointer shadow-sm"
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
            <p className="font-bold text-text-secondary">Đang tải danh sách...</p>
          </div>
        ) : diaries.length === 0 ? (
          <div className="py-20 text-center flex flex-col gap-4 items-center">
            <span className="text-5xl drop-shadow-md">📔</span>
            <div className="flex flex-col gap-1 max-w-xs">
              <h3 className="font-black text-text-h text-xl">Chưa có vụ mùa nào</h3>
              <p className="font-medium text-text-secondary text-sm">Hãy tạo vụ mùa đầu tiên của bạn để bắt đầu ghi chép quá trình canh tác.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn--cyan mt-2 px-6 py-3.5 font-extrabold active:scale-95"
            >
              <Plus className="w-5 h-5" weight="bold" /> Bắt đầu vụ mùa mới
            </button>
          </div>
        ) : processedDiaries.length === 0 ? (
          <div className="py-20 text-center flex flex-col gap-3 items-center">
            <Funnel className="w-10 h-10 text-border-main" weight="duotone" />
            <p className="font-bold text-text-secondary">Không tìm thấy vụ mùa phù hợp với bộ lọc.</p>
            <button onClick={() => setActiveFilter('all')} className="text-primary font-bold hover:underline text-sm cursor-pointer mt-1 active:scale-95">Xóa bộ lọc</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
            {processedDiaries.map(diary => {
              const cropImg = getCropImage(diary.crop_type);
              const cropOption = getCropOption(diary.crop_type);
              const catalogImage = getCropImagePath(diary.crop_type);
              const isActiveCrop = diary.status === 'active';
              return (
                <article
                  key={diary._id}
                  onClick={() => navigate(`/diary/history?diaryId=${diary._id}`)}
                  className={`card-bubble ${isActiveCrop ? 'card-bubble--pear' : ''} p-5 flex gap-4 items-center cursor-pointer select-none text-left active:scale-95 transition-all`}
                >
                  <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden flex-shrink-0 bg-bg-surface-2 border border-border-main/50 flex items-center justify-center relative">
                    {isActiveCrop && (
                      <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-[#30d158] border-2 border-white z-10 shadow-sm"></div>
                    )}
                    {cropOption && catalogImage ? (
                      <img
                        alt={cropOption.label}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={catalogImage}
                        title={cropOption.label}
                      />
                    ) : cropImg ? (
                      <img alt={diary.crop_type} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={cropImg} />
                    ) : (
                      <span className="text-2xl">🌱</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="text-[18px] font-extrabold text-text-h truncate tracking-tight">{diary.crop_type}</h3>
                      {diary.season && diary.season !== 'Chưa xác định' && (
                        <p className="text-xs font-semibold text-text-main/55 truncate mt-0.5">{diary.season}</p>
                      )}
                    </div>
                    
                    <p className="text-[14px] text-text-secondary line-clamp-1 mb-2.5">
                      {diary.latest_log ? diary.latest_log.content : 'Chưa có ghi chép nào.'}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      {diary.latest_log ? (
                        <div className="flex items-center gap-2">
                          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-lg border ${
                            (diary.latest_log.activity_type || '').toLowerCase().includes('tưới')
                              ? 'bg-[#E5F1FF] text-[#0066CC] border-[#0066CC]/10'
                              : (diary.latest_log.activity_type || '').toLowerCase().includes('phân') || (diary.latest_log.activity_type || '').toLowerCase().includes('dưỡng')
                                ? 'bg-[#E8F8F5] text-[#008A5E] border-[#008A5E]/10'
                                : (diary.latest_log.activity_type || '').toLowerCase().includes('thuốc') || (diary.latest_log.activity_type || '').toLowerCase().includes('sâu')
                                  ? 'bg-[#FFF3E0] text-[#E67300] border-[#E67300]/10'
                                  : 'bg-bg-surface-1 text-text-main border-border-main/50'
                          }`}>
                            {diary.latest_log.activity_type || 'Hoạt động'}
                          </span>
                          <span className="text-[12px] text-text-secondary font-semibold font-mono">
                            {new Date(diary.latest_log.created_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[12px] font-semibold px-2 py-0.5 rounded-lg bg-bg-surface-1 text-text-secondary border border-border-main/50 font-mono">
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
      <div className="fixed fab-diary-create right-4 md:right-8 z-40">
        <button
          onClick={() => navigate('/diary/create')}
          className="btn btn--cyan !p-0 w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer active:scale-95"
          aria-label="Tạo Nhật ký"
        >
          <Plus className="w-6 h-6 text-white" weight="bold" />
        </button>
      </div>

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
