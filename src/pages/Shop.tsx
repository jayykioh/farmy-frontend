import React, { useState } from 'react';
import { MascotLottie } from '../components/MascotLottie';
import { usePetStatus } from '../features/pet/hooks/usePetStatus';
import { PET_STATUS_FALLBACK } from '../features/pet/types/pet.types';
import { useShopItems, useBuyItem, useEquipItem } from '../features/shop/hooks/useShop';

interface ModalConfig {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export const Shop: React.FC = () => {
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;
  
  const { data: items = [], isLoading } = useShopItems();
  const buyMutation = useBuyItem();
  const equipMutation = useEquipItem();

  const [activeCategory, setActiveCategory] = useState<'HAT' | 'OUTFIT' | 'EFFECT' | 'BACKGROUND'>('HAT');
  const [modal, setModal] = useState<ModalConfig | null>(null);

  const categories = [
    { id: 'HAT', label: 'Mũ' },
    { id: 'OUTFIT', label: 'Trang phục' },
    { id: 'EFFECT', label: 'Hiệu ứng' },
    { id: 'BACKGROUND', label: 'Nền' },
  ] as const;

  const filteredItems = items.filter(item => item.category === activeCategory);

  const currentlyEquippedInActiveCategory = items.find(
    item => item.category === activeCategory && petStatus.equippedItems?.includes(item._id)
  );

  const handleBuy = (itemId: string) => {
    buyMutation.mutate(itemId, {
      onSuccess: (res: any) => {
        setModal({
          type: 'success',
          title: 'Mua thành công! 🎉',
          message: res.message || 'Chúc mừng bạn đã sở hữu món đồ mới cho Bé Thóc.',
        });
      },
      onError: (err: any) => {
        setModal({
          type: 'error',
          title: 'Giao dịch thất bại ❌',
          message: err.response?.data?.message || 'Không đủ XP hoặc có lỗi hệ thống xảy ra.',
        });
      }
    });
  };

  const handleEquip = (itemId: string) => {
    equipMutation.mutate(itemId, {
      onSuccess: (res: any) => {
        setModal({
          type: 'success',
          title: 'Đã thay đổi trang phục! ✨',
          message: res.message || 'Bé Thóc trông thật tuyệt vời trong diện mạo mới!',
        });
      },
      onError: (err: any) => {
        setModal({
          type: 'error',
          title: 'Trang bị thất bại ❌',
          message: err.response?.data?.message || 'Có lỗi xảy ra khi trang bị món đồ này.',
        });
      }
    });
  };

  return (
    <div className="w-full min-h-[100svh] relative text-left bg-gradient-to-b from-[#d0e5fa] to-[#79fc9e] overflow-x-hidden font-sans">
      {/* Custom Alert Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] border border-white/60 p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4 animate-[scaleIn_0.2s_ease-out]">
            {modal.type === 'success' ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl animate-bounce">
                ✨
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-3xl">
                ⚠️
              </div>
            )}
            <div>
              <h3 className="text-lg font-extrabold text-text-h mb-1">{modal.title}</h3>
              <p className="text-sm text-text-main/70">{modal.message}</p>
            </div>
            <button
              onClick={() => setModal(null)}
              className="w-full py-3 bg-primary text-white font-bold rounded-2xl active:scale-[0.98] transition-transform shadow-md hover:bg-primary-dark"
            >
              Tuyệt vời
            </button>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-12 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-h">Cửa hàng</h1>
            <p className="text-sm text-text-main/60 mt-0.5">Trang trí cho Bé Thóc của bạn!</p>
          </div>
          {/* XP Badge */}
          <div className="bg-white/80 backdrop-blur-sm border border-yellow-200 rounded-full px-4 py-2 flex items-center gap-1.5 shadow-sm">
            <span className="font-extrabold text-yellow-800 text-sm bg-yellow-100/50 px-2 py-0.5 rounded-full font-mono">Lv.{petStatus.level}</span>
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="font-extrabold text-yellow-800 text-lg font-mono">{petStatus.exp} XP</span>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-bold whitespace-nowrap shadow-sm active:scale-95 transition-transform ${
                activeCategory === cat.id
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-white/70 border border-border-main/30 text-text-main/70 hover:bg-white hover:text-text-main'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Layout: Preview + Grid */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: Preview Card */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-[28px] border border-white/60 shadow-lg p-4 flex flex-col items-center gap-3">
              <p className="text-xs font-bold text-text-main/40 uppercase tracking-widest">Đang trang bị</p>
              <div className="relative w-full h-[220px] rounded-[20px] bg-gradient-to-b from-sky-50 to-green-50 border border-border-main/20 flex items-end justify-center overflow-hidden">
                {/* Wavy grass */}
                <div className="absolute inset-x-0 bottom-0 h-16 opacity-50">
                  <svg preserveAspectRatio="none" viewBox="0 0 1440 320" className="w-full h-full">
                    <path fill="#08a855" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                  </svg>
                </div>
                <div className="relative z-10 mb-6 animate-[bounce_4s_ease-in-out_infinite]">
                  <div className="w-32 h-32 rounded-full shadow-lg bg-white border-4 border-white overflow-hidden p-2">
                    <MascotLottie className="w-full h-full -mt-2 drop-shadow-md" state={petStatus.mood} />
                  </div>
                  {/* Equipped indicator */}
                  {currentlyEquippedInActiveCategory && (
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-md border-2 border-primary/20 p-1 flex items-center justify-center animate-[scaleIn_0.2s_ease-out]">
                       <img src={currentlyEquippedInActiveCategory.image_url} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm font-bold text-text-main">
                {currentlyEquippedInActiveCategory ? currentlyEquippedInActiveCategory.name : 'Chưa trang bị'}
              </p>
            </div>
          </div>

          {/* Right: Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            
            {isLoading && <div className="col-span-full text-center py-10 text-text-main/50 font-bold">Đang tải cửa hàng...</div>}
            {!isLoading && filteredItems.length === 0 && (
               <div className="col-span-full text-center py-10 text-text-main/50 font-bold animate-pulse">Chưa có vật phẩm nào trong mục này</div>
            )}

            {!isLoading && filteredItems.map((item) => {
              const isOwned = petStatus.ownedItems?.includes(item._id);
              const isEquipped = petStatus.equippedItems?.includes(item._id);
              const isLocked = petStatus.level < item.required_level;
              const canAfford = petStatus.exp >= item.price;

              return (
                <div key={item._id} className={`bg-white/80 backdrop-blur-sm border shadow-sm rounded-[24px] p-4 flex flex-col items-center group hover:shadow-md transition-all ${isEquipped ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border-main/30'}`}>
                  <div className="w-full aspect-square rounded-2xl bg-bg-surface-1 border border-border-main/20 mb-3 flex items-center justify-center overflow-hidden relative group-hover:bg-primary/5 transition-colors">
                    {!isLocked ? (
                      <img alt={item.name} className="w-3/4 h-3/4 object-contain animate-[bounce_4s_ease-in-out_infinite]" src={item.image_url} />
                    ) : (
                      <div className="text-text-main/30 flex flex-col items-center">
                        <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="font-bold text-xs uppercase tracking-wide">Cấp {item.required_level}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-text-main text-center mb-1 w-full truncate text-sm">{item.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5 mb-3">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <span className="font-bold text-yellow-800 text-xs font-mono">{item.price}</span>
                  </div>

                  {/* Button logic */}
                  {isEquipped ? (
                     <button onClick={() => handleEquip(item._id)} className="w-full py-2 bg-primary text-white rounded-full font-bold text-sm shadow-sm active:scale-95 transition-transform border-b-[3px] border-primary-dark active:border-b-0 active:translate-y-[3px]">
                       Đã trang bị
                     </button>
                  ) : isOwned ? (
                     <button onClick={() => handleEquip(item._id)} className="w-full py-2 bg-white border border-primary/50 text-primary rounded-full font-bold text-sm active:scale-95 transition-transform hover:bg-primary/5 shadow-sm">
                       Mặc thử
                     </button>
                  ) : isLocked ? (
                     <button disabled className="w-full py-2 bg-bg-surface border border-border-main/20 text-text-main/30 rounded-full font-bold text-sm cursor-not-allowed">
                       Khóa
                     </button>
                  ) : canAfford ? (
                     <button 
                       onClick={() => handleBuy(item._id)}
                       disabled={buyMutation.isPending}
                       className="w-full py-2 bg-white border border-border-main/40 text-text-main rounded-full font-bold text-sm active:scale-95 transition-transform hover:bg-bg-surface-1 shadow-sm disabled:opacity-50"
                     >
                       {buyMutation.isPending ? 'Đang mua...' : 'Mua ngay'}
                     </button>
                  ) : (
                     <button disabled className="w-full py-2 bg-bg-surface border border-border-main/20 text-text-main/40 rounded-full font-bold text-sm cursor-not-allowed">
                       Thiếu XP
                     </button>
                  )}
                </div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
