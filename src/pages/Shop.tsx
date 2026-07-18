import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PetMascot } from '../features/pet/components/PetMascot';
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
  const [previewMoodOverride, setPreviewMoodOverride] = useState<'excited' | 'happy' | null>(null);

  const categories = [
    { id: 'HAT', label: 'Mũ & Phụ kiện' },
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
      onSuccess: (res: unknown) => {
        const successData = res as { message?: string };
        setModal({
          type: 'success',
          title: 'Mua thành công! 🎉',
          message: successData.message || 'Chúc mừng bạn đã sở hữu món đồ mới cho Bé Thóc.',
        });
      },
      onError: (err: unknown) => {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        setModal({
          type: 'error',
          title: 'Giao dịch thất bại ❌',
          message: errorResponse.response?.data?.message || 'Không đủ XP hoặc có lỗi hệ thống xảy ra.',
        });
      }
    });
  };

  const handleEquip = (itemId: string) => {
    const item = items.find(i => i._id === itemId);
    const isEquipped = petStatus.equippedItems?.includes(itemId);

    equipMutation.mutate(itemId, {
      onSuccess: () => {
        if (isEquipped) {
          toast.success(`Đã tháo ${item?.name || 'phụ kiện'}! ✨`);
        } else {
          toast.success(`Đã trang bị ${item?.name || 'phụ kiện'}! 👒`);
          setPreviewMoodOverride('excited');
          setTimeout(() => {
            setPreviewMoodOverride(null);
          }, 2500);
        }
      },
      onError: (err: unknown) => {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        toast.error(errorResponse.response?.data?.message || 'Có lỗi xảy ra khi trang bị món đồ này.');
      }
    });
  };

  return (
    <div className="w-full min-h-[100svh] relative text-left bg-[#FBFBFD] overflow-x-hidden font-sans">
      {/* Custom Alert Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setModal(null);
              }}
              className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-black/[0.04] p-6 max-w-sm w-full shadow-[0_24px_80px_rgba(0,0,0,0.08)] flex flex-col items-center text-center gap-4 cursor-grab active:cursor-grabbing"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-black/10 rounded-full mb-2"></div>
              
              {modal.type === 'success' ? (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl"
                >
                  ✨
                </motion.div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-3xl">
                  ⚠️
                </div>
              )}
              <div>
                <h3 className="text-lg font-extrabold text-text-h mb-1">{modal.title}</h3>
                <p className="text-sm text-text-main/70">{modal.message}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setModal(null)}
                className="w-full py-3 bg-primary text-white font-bold rounded-2xl shadow-md hover:bg-primary-dark"
              >
                Tuyệt vời
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

        {/* Category Chips with Framer Motion Magic Pill */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-5 py-2 rounded-full font-bold whitespace-nowrap shadow-sm transition-colors ${
                activeCategory === cat.id
                  ? 'text-white'
                  : 'bg-white/70 border border-border-main/30 text-text-main/70 hover:bg-white hover:text-text-main'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-primary rounded-full shadow-md"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Main Layout: Preview + Grid */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: Preview Card */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-[28px] border border-white/60 shadow-lg p-4 flex flex-col items-center gap-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang trang bị</p>
              <div className="relative w-full h-[220px] rounded-[20px] bg-[#F5F5F7] flex items-end justify-center overflow-hidden">
                <div className="relative z-10 mb-6 animate-[bounce_4s_ease-in-out_infinite]">
                  <div className="w-32 h-32 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white border-[6px] border-white overflow-hidden p-2">
                    <PetMascot 
                      className="w-full h-full -mt-2 drop-shadow-md" 
                      status={{
                        ...petStatus,
                        mood: previewMoodOverride ?? petStatus.mood
                      }} 
                      size={112} 
                    />
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
                <motion.div 
                  key={item._id} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileTap={!isLocked ? { scale: 0.96 } : {}}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className={`bg-white/80 backdrop-blur-sm border shadow-sm rounded-[24px] p-4 flex flex-col items-center group hover:shadow-md transition-all ${isEquipped ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border-main/30'}`}
                >
                  <div className="w-full aspect-square rounded-2xl bg-bg-surface-1 border border-border-main/20 mb-3 flex items-center justify-center overflow-hidden relative group-hover:bg-primary/5 transition-colors">
                    {!isLocked ? (
                      <motion.img 
                        layoutId={`item-img-${item._id}`}
                        alt={item.name} 
                        className="w-3/4 h-3/4 object-contain" 
                        src={item.image_url} 
                      />
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
                     <button onClick={() => handleEquip(item._id)} className="w-full py-2 bg-primary text-white rounded-full font-bold text-sm shadow-sm transition-transform border-b-[3px] border-primary-dark">
                       Đã trang bị
                     </button>
                  ) : isOwned ? (
                     <button onClick={() => handleEquip(item._id)} className="w-full py-2 bg-white border border-primary/50 text-primary rounded-full font-bold text-sm transition-transform hover:bg-primary/5 shadow-sm">
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
                       className="w-full py-2 bg-white border border-border-main/40 text-text-main rounded-full font-bold text-sm transition-transform hover:bg-bg-surface-1 shadow-sm disabled:opacity-50"
                     >
                       {buyMutation.isPending ? 'Đang mua...' : 'Mua ngay'}
                     </button>
                  ) : (
                     <button disabled className="w-full py-2 bg-bg-surface border border-border-main/20 text-text-main/40 rounded-full font-bold text-sm cursor-not-allowed">
                       Thiếu XP
                     </button>
                  )}
                </motion.div>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
