import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';

export const DiaryList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-full">
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-8 flex flex-col gap-6">
        {/* Header equivalent */}
        <div className="flex items-center gap-3 mt-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-border-main/50 shadow-sm bg-white flex items-center justify-center p-1">
            <MascotLottie className="w-full h-full -mt-1" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-h tracking-tight">Nhật ký nông trại</h1>
        </div>

        {/* Filter Chips */}
        <section className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
          <button className="px-5 py-2 bg-primary text-white rounded-full font-bold whitespace-nowrap shadow-sm active:scale-95 transition-transform hover:bg-primary-dark">Tất cả</button>
          <button className="px-5 py-2 bg-white border border-border-main/50 text-text-main/70 rounded-full font-bold whitespace-nowrap hover:bg-bg-surface-1 hover:text-text-main transition-colors active:scale-95">Lúa</button>
          <button className="px-5 py-2 bg-white border border-border-main/50 text-text-main/70 rounded-full font-bold whitespace-nowrap hover:bg-bg-surface-1 hover:text-text-main transition-colors active:scale-95">Bưởi</button>
          <button className="px-5 py-2 bg-white border border-border-main/50 text-text-main/70 rounded-full font-bold whitespace-nowrap hover:bg-bg-surface-1 hover:text-text-main transition-colors active:scale-95">Cà phê</button>
          <button className="px-5 py-2 bg-white border border-border-main/50 text-text-main/70 rounded-full font-bold whitespace-nowrap hover:bg-bg-surface-1 hover:text-text-main transition-colors active:scale-95">Rau màu</button>
        </section>

        {/* Diary Timeline / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-2">
          
          {/* Diary Card 1 */}
          <article 
            onClick={() => navigate('/diary/history')}
            className="bg-white border border-border-main/50 p-4 rounded-2xl shadow-sm flex gap-4 items-start active:scale-[0.98] hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-bg-surface flex items-center justify-center border border-border-main/20 group-hover:border-primary/30 transition-colors">
              <img alt="Lúa Hè Thu" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzBjvc2DnHkU5kbDFMSwtv8BlsaiWbQudALcZbuYhJy8SPHAFmGOkRmm-l4KC5VSOUk3atkwm00nuuz6Z2ZTKRVAhQjwV3GoTebXZfy1o2eAujMFFziKt-smBZYu6Z5Y1OVRnyLwO5JVfFyoo6FbCJJv1cckKZSMi83YrGWZ_7RpHiVKx2k0l6Z-YKvzETxUD2sLP4FyEfy0ttKsrdDJkHT2IBS62yJLWXk_d0dEaJPZWKTLQH6XjW6IIrIL0y_y0AlbCNPcThctr7" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <div className="flex justify-between items-start mb-1">
                <div className="min-w-0 pr-2">
                  <h3 className="text-lg font-bold text-text-h truncate group-hover:text-primary transition-colors">Lúa Hè Thu</h3>
                  <span className="text-text-main/50 text-xs font-bold block mt-0.5">2 giờ trước</span>
                </div>
                <span className="px-2 py-0.5 bg-secondary-light/30 text-secondary-dark text-[10px] font-extrabold rounded-full whitespace-nowrap">Trổ bông</span>
              </div>
              <p className="text-sm text-text-main/80 line-clamp-2 mt-1 flex-1">Lúa phát triển tốt, màu lá xanh mướt. Đã kiểm tra độ pH đất và thấy ổn định.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20a6 6 0 01-6-6c0-4 6-10.75 6-10.75S18 10 18 14a6 6 0 01-6 6z"/></svg>
                  <span className="text-[11px] font-bold text-blue-600">Đã tưới</span>
                </div>
                <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                  <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 000-2H2a1 1 0 000 2zm18 0h2a1 1 0 000-2h-2a1 1 0 000 2zM11 4V2a1 1 0 012 0v2a1 1 0 01-2 0zm0 18v-2a1 1 0 012 0v2a1 1 0 01-2 0zM5.64 7.05L4.22 5.64a1 1 0 011.42-1.42l1.41 1.41a1 1 0 01-1.41 1.42zm14.14 14.14l-1.41-1.41a1 1 0 011.41-1.41l1.41 1.41a1 1 0 01-1.41 1.41zM5.64 16.95a1 1 0 00-1.42 1.41l1.41 1.42a1 1 0 001.42-1.42l-1.41-1.41zm14.14-14.14a1 1 0 00-1.41-1.41l-1.41 1.41a1 1 0 001.41 1.41l1.41-1.41z"/></svg>
                  <span className="text-[11px] font-bold text-orange-600">32°C - Nắng</span>
                </div>
              </div>
            </div>
          </article>
          
          {/* Diary Card 2 */}
          <article 
            onClick={() => navigate('/diary/history')}
            className="bg-white border border-border-main/50 p-4 rounded-2xl shadow-sm flex gap-4 items-start active:scale-[0.98] hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-bg-surface-1 flex items-center justify-center border border-border-main/20 group-hover:border-primary/30 transition-colors">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-text-main/30 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <div className="flex justify-between items-start mb-1">
                <div className="min-w-0 pr-2">
                  <h3 className="text-lg font-bold text-text-h truncate group-hover:text-primary transition-colors">Vườn Bưởi Năm Roi</h3>
                  <span className="text-text-main/50 text-xs font-bold block mt-0.5">5 giờ trước</span>
                </div>
                <span className="px-2 py-0.5 bg-primary-lightest/30 text-primary-container text-[10px] font-extrabold rounded-full uppercase whitespace-nowrap">Bón phân</span>
              </div>
              <p className="text-sm text-text-main/80 line-clamp-2 mt-1 flex-1">Thực hiện bón phân hữu cơ định kỳ cho gốc bưởi. Cây bắt đầu nhú chồi non.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
                  <span className="text-[11px] font-bold text-gray-600">28°C - Nhiều mây</span>
                </div>
              </div>
            </div>
          </article>

          {/* Diary Card 3 */}
          <article 
            onClick={() => navigate('/diary/history')}
            className="bg-white border border-border-main/50 p-4 rounded-2xl shadow-sm flex gap-4 items-start active:scale-[0.98] hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-bg-surface flex items-center justify-center border border-border-main/20 group-hover:border-primary/30 transition-colors">
              <img alt="Cà phê" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ98QwVUaI-DYbws4DExxqd5xte7Qsvnb_b1pfuim31P1em64_rv8k8mhv-ekc8vTVSDCAXyl2iszSTYAk-UGVNY3DAuFbnqmHK8vvkA1kl7Gk7g-MyndBvWKCjfG5eYPNiCsJ8ETcmdNgkjOpGqEEiDgdWh1ZZD1LInCVY4-RDhT6EnOkcQmqqNP5aKuHqDgJcqbw1aU03xTwIeAgj44GBwbORCJUR6IuOK5-Q3P17hzsLuTXZvHOCZNDXU4HrHFK_jc3FcLYK9Lc" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <div className="flex justify-between items-start mb-1">
                <div className="min-w-0 pr-2">
                  <h3 className="text-lg font-bold text-text-h truncate group-hover:text-primary transition-colors">Cà phê Arabica</h3>
                  <span className="text-text-main/50 text-xs font-bold block mt-0.5">Hôm qua</span>
                </div>
                <span className="px-2 py-0.5 bg-error-container text-error text-[10px] font-extrabold rounded-full whitespace-nowrap">Sâu bệnh</span>
              </div>
              <p className="text-sm text-text-main/80 line-clamp-2 mt-1 flex-1">Phát hiện một vài lá có dấu hiệu rỉ sắt. Cần theo dõi sát và phun thuốc sinh học.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20a6 6 0 01-6-6c0-4 6-10.75 6-10.75S18 10 18 14a6 6 0 01-6 6z"/></svg>
                  <span className="text-[11px] font-bold text-blue-600">Đã tưới</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/diary/create')}
        className="fixed bottom-[100px] right-6 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12 w-14 h-14 md:w-16 md:h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 z-40 transition-transform hover:scale-110 active:scale-95"
      >
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

    </div>
  );
};

export default DiaryList;
