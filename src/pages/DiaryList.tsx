import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnapFAB } from '../components/SnapFAB';
import { PageHeader } from '../components/PageHeader';
import { getDiaries } from '../api/farm';
import type { Diary } from '../api/farm';

export const DiaryList: React.FC = () => {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDiaries()
      .then(data => {
        setDiaries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getCropImage = (cropType: string) => {
    const typeLower = cropType.toLowerCase();
    if (typeLower.includes('lúa')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzBjvc2DnHkU5kbDFMSwtv8BlsaiWbQudALcZbuYhJy8SPHAFmGOkRmm-l4KC5VSOUk3atkwm00nuuz6Z2ZTKRVAhQjwV3GoTebXZfy1o2eAujMFFziKt-smBZYu6Z5Y1OVRnyLwO5JVfFyoo6FbCJJv1cckKZSMi83YrGWZ_7RpHiVKx2k0l6Z-YKvzETxUD2sLP4FyEfy0ttKsrdDJkHT2IBS62yJLWXk_d0dEaJPZWKTLQH6XjW6IIrIL0y_y0AlbCNPcThctr7';
    }
    if (typeLower.includes('cà chua')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ98QwVUaI-DYbws4DExxqd5xte7Qsvnb_b1pfuim31P1em64_rv8k8mhv-ekc8vTVSDCAXyl2iszSTYAk-UGVNY3DAuFbnqmHK8vvkA1kl7Gk7g-MyndBvWKCjfG5eYPNiCsJ8ETcmdNgkjOpGqEEiDgdWh1ZZD1LInCVY4-RDhT6EnOkcQmqqNP5aKuHqDgJcqbw1aU03xTwIeAgj44GBwbORCJUR6IuOK5-Q3P17hzsLuTXZvHOCZNDXU4HrHFK_jc3FcLYK9Lc';
    }
    return '';
  };

  return (
    <div className="w-full min-h-full bg-bg-surface-1">
      <PageHeader title="Nhật ký nông trại" leftButton="none" />
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-8 flex flex-col gap-6">

        {/* Filter Chips */}
        <section className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
          <button className="px-5 py-2 bg-primary text-white rounded-full font-bold whitespace-nowrap shadow-sm active:scale-95 transition-transform hover:bg-primary-dark cursor-pointer">Tất cả</button>
          <button className="px-5 py-2 bg-white border border-border-main/50 text-text-main/70 rounded-full font-bold whitespace-nowrap hover:bg-bg-surface-1 hover:text-text-main transition-colors active:scale-95 cursor-pointer">Lúa</button>
          <button className="px-5 py-2 bg-white border border-border-main/50 text-text-main/70 rounded-full font-bold whitespace-nowrap hover:bg-bg-surface-1 hover:text-text-main transition-colors active:scale-95 cursor-pointer">Bưởi</button>
          <button className="px-5 py-2 bg-white border border-border-main/50 text-text-main/70 rounded-full font-bold whitespace-nowrap hover:bg-bg-surface-1 hover:text-text-main transition-colors active:scale-95 cursor-pointer">Cà chua</button>
          <button className="px-5 py-2 bg-white border border-border-main/50 text-text-main/70 rounded-full font-bold whitespace-nowrap hover:bg-bg-surface-1 hover:text-text-main transition-colors active:scale-95 cursor-pointer">Khác</button>
        </section>

        {/* Diary Timeline / Grid */}
        {loading ? (
          <div className="py-20 text-center font-bold text-text-main/70">Đang tải nhật ký...</div>
        ) : diaries.length === 0 ? (
          <div className="py-20 text-center flex flex-col gap-4 items-center">
            <span className="text-4xl">📔</span>
            <p className="font-bold text-text-main/70 text-lg">Chưa có nhật ký vụ mùa nào.</p>
            <button 
              onClick={() => navigate('/diary/create')}
              className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark cursor-pointer shadow-md"
            >
              Bắt đầu Nhật ký Mới
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-2">
            {diaries.map(diary => {
              const cropImg = getCropImage(diary.crop_type);
              return (
                <article 
                  key={diary._id}
                  onClick={() => navigate(`/diary-history?diaryId=${diary._id}`)}
                  className="bg-white border border-border-main/50 p-4 rounded-2xl shadow-sm flex gap-4 items-start active:scale-[0.98] hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-bg-surface flex items-center justify-center border border-border-main/20 group-hover:border-primary/30 transition-colors">
                    {cropImg ? (
                      <img alt={diary.crop_type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={cropImg} />
                    ) : (
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-text-main/30 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-1">
                      <div className="min-w-0 pr-2">
                        <h3 className="text-lg font-bold text-text-h truncate group-hover:text-primary transition-colors">{diary.crop_type}</h3>
                        <span className="text-text-main/50 text-xs font-bold block mt-0.5">
                          Bắt đầu: {new Date(diary.start_date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full uppercase whitespace-nowrap ${diary.status === 'active' ? 'bg-primary-lightest/30 text-primary-container' : 'bg-gray-100 text-gray-500'}`}>
                        {diary.status === 'active' ? 'Đang canh tác' : 'Lưu trữ'}
                      </span>
                    </div>
                    <p className="text-sm text-text-main/80 line-clamp-2 mt-1 flex-1">
                      Mật độ canh tác ổn định. Nhấp vào đây để xem chi tiết lịch trình chăm sóc.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20a6 6 0 01-6-6c0-4 6-10.75 6-10.75S18 10 18 14a6 6 0 01-6 6z"/></svg>
                        <span className="text-[11px] font-bold text-blue-600">Đã tưới</span>
                      </div>
                      <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                        <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a5 5 0 100 10 5 5 0 000-10z"/></svg>
                        <span className="text-[11px] font-bold text-orange-600">32°C - Nắng</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button for Create Diary */}
      <button 
        onClick={() => navigate('/diary/create')}
        className="fixed bottom-[140px] right-4 md:bottom-24 md:right-8 w-14 h-14 bg-white text-primary border border-primary/20 rounded-full flex items-center justify-center shadow-lg shadow-black/5 z-40 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Tạo Nhật ký"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <SnapFAB />
    </div>
  );
};

export default DiaryList;
