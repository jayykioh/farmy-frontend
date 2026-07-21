/* Hallmark · page: shop · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { PetMascot } from "../features/pet/components/PetMascot";
import { usePetStatus } from "../features/pet/hooks/usePetStatus";
import { PET_STATUS_FALLBACK } from "../features/pet/types/pet.types";
import {
  useShopItems,
  useBuyItem,
  useEquipItem,
  useUnequipItem,
} from "../features/shop/hooks/useShop";
import { EquipToast } from "../features/shop/components/EquipToast";

interface ModalConfig {
  type: "success" | "error";
  title: string;
  message: string;
}

export const Shop: React.FC = () => {
  const { data: petStatusRaw } = usePetStatus();
  const petStatus = petStatusRaw ?? PET_STATUS_FALLBACK;

  const { data: items = [], isLoading } = useShopItems();
  const buyMutation = useBuyItem();
  const equipMutation = useEquipItem();
  const unequipMutation = useUnequipItem();

  const [activeCategory, setActiveCategory] = useState<
    "HAT" | "OUTFIT" | "EFFECT" | "BACKGROUND"
  >("HAT");
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const [previewMoodOverride, setPreviewMoodOverride] = useState<
    "excited" | "happy" | "sad" | null
  >(null);
  // Track which item is pending unequip confirmation (two-tap to unequip)
  const [unequipPendingId, setUnequipPendingId] = useState<string | null>(null);

  const categories = [
    { id: "HAT", label: "Mũ & Phụ kiện" },
    { id: "OUTFIT", label: "Trang phục" },
    { id: "EFFECT", label: "Hiệu ứng" },
    { id: "BACKGROUND", label: "Nền" },
  ] as const;

  const filteredItems = items.filter(
    (item) => item.category === activeCategory,
  );

  const currentlyEquippedInActiveCategory = items.find(
    (item) =>
      item.category === activeCategory &&
      petStatus.equippedItems?.includes(item._id),
  );

  const handleBuy = (itemId: string) => {
    buyMutation.mutate(itemId, {
      onSuccess: (res: unknown) => {
        const successData = res as { message?: string };
        setModal({
          type: "success",
          title: "Mua thành công! 🎉",
          message:
            successData.message ||
            "Chúc mừng bạn đã sở hữu món đồ mới cho Bé Thóc.",
        });
      },
      onError: (err: unknown) => {
        const errorResponse = err as {
          response?: { data?: { message?: string } };
        };
        setModal({
          type: "error",
          title: "Giao dịch thất bại ❌",
          message:
            errorResponse.response?.data?.message ||
            "Không đủ XP hoặc có lỗi hệ thống xảy ra.",
        });
      },
    });
  };

  const handleEquip = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i._id === itemId);

      equipMutation.mutate(itemId, {
        onSuccess: () => {
          // Custom rich toast with item thumbnail
          toast.custom(
            () => (
              <EquipToast
                type="equip"
                itemName={item?.name || "phụ kiện"}
                itemImageUrl={item?.image_url || ""}
              />
            ),
            { duration: 3000 },
          );
          // Pet mood reaction — excited for 2.5s
          setPreviewMoodOverride("excited");
          setTimeout(() => {
            setPreviewMoodOverride(null);
          }, 2500);
        },
        onError: (err: unknown) => {
          const errorResponse = err as {
            response?: { data?: { message?: string } };
          };
          toast.error(
            errorResponse.response?.data?.message ||
              "Có lỗi xảy ra khi trang bị món đồ này.",
          );
        },
      });
    },
    [items, equipMutation],
  );

  const handleUnequip = useCallback(
    (itemId: string) => {
      // Two-tap confirmation: first tap shows "Tháo?", second tap confirms
      if (unequipPendingId !== itemId) {
        setUnequipPendingId(itemId);
        // Auto-reset after 3 seconds if user doesn't confirm
        setTimeout(
          () => setUnequipPendingId((prev) => (prev === itemId ? null : prev)),
          3000,
        );
        return;
      }

      setUnequipPendingId(null);
      const item = items.find((i) => i._id === itemId);

      unequipMutation.mutate(itemId, {
        onSuccess: () => {
          // Custom rich toast for unequip
          toast.custom(
            () => (
              <EquipToast
                type="unequip"
                itemName={item?.name || "phụ kiện"}
                itemImageUrl={item?.image_url || ""}
              />
            ),
            { duration: 3000 },
          );
          // Pet mood reaction — sad for 1.5s then back to normal
          setPreviewMoodOverride("sad");
          setTimeout(() => {
            setPreviewMoodOverride(null);
          }, 1500);
        },
        onError: (err: unknown) => {
          const errorResponse = err as {
            response?: { data?: { message?: string } };
          };
          toast.error(
            errorResponse.response?.data?.message ||
              "Có lỗi xảy ra khi tháo món đồ này.",
          );
        },
      });
    },
    [items, unequipMutation, unequipPendingId],
  );

  return (
    <div className="w-full min-h-[100svh] relative text-left bg-bg-main text-text-main overflow-x-hidden font-sans pb-24">
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
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_: any, info: any) => {
                if (info.offset.y > 100) setModal(null);
              }}
              className="card-bubble bg-white p-6 max-w-sm w-full shadow-lg flex flex-col items-center text-center gap-4 cursor-grab active:cursor-grabbing border-2 border-border-main"
            >
              {/* Drag Handle */}
              <div className="w-12 h-1.5 bg-border-main rounded-full mb-2"></div>

              {modal.type === "success" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 10,
                    stiffness: 200,
                    delay: 0.1,
                  }}
                  className="w-16 h-16 bg-[#E8F8F5] border-2 border-[#008A5E]/30 rounded-full flex items-center justify-center text-[#008A5E] text-3xl shadow-sm"
                >
                  ✨
                </motion.div>
              ) : (
                <div className="w-16 h-16 bg-red-100 border-2 border-red-300 rounded-full flex items-center justify-center text-red-600 text-3xl shadow-sm">
                  ⚠️
                </div>
              )}
              <div>
                <h3 className="text-xl font-black text-text-h mb-1">
                  {modal.title}
                </h3>
                <p className="text-sm font-bold text-text-secondary">{modal.message}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setModal(null)}
                className="btn btn--cyan w-full py-3 font-extrabold cursor-pointer"
              >
                Tuyệt vời
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-20 pb-20 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-text-h">
              Cửa hàng
            </h1>
            <p className="text-sm font-bold text-text-secondary mt-0.5">
              Trang trí cho Bé Thóc của bạn!
            </p>
          </div>
          {/* XP Badge */}
          <div className="card-bubble bg-white border-2 border-amber-300 px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="font-black text-yellow-900 text-xs bg-amber-100 px-2.5 py-1 rounded-full font-mono border border-amber-300">
              Lv.{petStatus.level}
            </span>
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="font-black text-yellow-900 text-lg font-mono">
              {petStatus.exp} XP
            </span>
          </div>
        </div>

        {/* Category Chips with Framer Motion Magic Pill */}
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors cursor-pointer active:scale-95 ${
                activeCategory === cat.id
                  ? "btn btn--cyan shadow-sm"
                  : "card-bubble bg-white border-2 border-border-main text-text-secondary hover:bg-bg-surface-2 hover:text-text-main"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Main Layout: Preview + Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Preview Card */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="card-bubble bg-white p-5 flex flex-col items-center gap-3 shadow-sm border-2 border-border-main">
              <p className="text-xs font-black text-text-secondary uppercase tracking-widest">
                Đang trang bị
              </p>
              <div className="relative w-full h-[260px] rounded-[20px] bg-bg-surface-1 border-2 border-border-main/50 flex items-center justify-center overflow-hidden">
                <div
                  className="relative z-10 animate-[float_3s_ease-in-out_infinite]"
                >
                  <div className="w-48 h-48">
                    <PetMascot
                      className="w-full h-full drop-shadow-lg"
                      status={{
                        ...petStatus,
                        mood: previewMoodOverride ?? petStatus.mood,
                      }}
                      size={192}
                    />
                  </div>
                </div>
              </div>
              <p className="text-base font-extrabold text-text-h">
                {currentlyEquippedInActiveCategory
                  ? currentlyEquippedInActiveCategory.name
                  : "Chưa trang bị"}
              </p>
            </div>
          </div>

          {/* Right: Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {isLoading && (
              <div className="col-span-full text-center py-10 text-text-secondary font-bold">
                Đang tải cửa hàng...
              </div>
            )}
            {!isLoading && filteredItems.length === 0 && (
              <div className="col-span-full text-center py-10 text-text-secondary font-bold animate-pulse">
                Chưa có vật phẩm nào trong mục này
              </div>
            )}

            {!isLoading &&
              filteredItems.map((item) => {
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
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className={`card-bubble bg-white p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all ${isEquipped ? "border-2 border-[#008A5E] ring-4 ring-[#008A5E]/10" : "border-2 border-border-main"}`}
                  >
                    <div className="w-full aspect-square rounded-2xl bg-bg-surface-1 border-2 border-border-main/50 mb-3 flex items-center justify-center overflow-hidden relative group-hover:bg-primary-light/10 transition-colors">
                      {/* Equipped badge */}
                      {isEquipped && (
                        <div className="absolute top-2 right-2 z-20 bg-[#008A5E] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-white/20">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          Đang mặc
                        </div>
                      )}
                      {!isLocked ? (
                        <motion.img
                          layoutId={`item-img-${item._id}`}
                          alt={item.name}
                          className="w-3/4 h-3/4 object-contain"
                          src={item.image_url}
                        />
                      ) : (
                        <div className="text-text-secondary flex flex-col items-center">
                          <svg
                            className="w-8 h-8 mb-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          <span className="font-extrabold text-xs uppercase tracking-wide">
                            Cấp {item.required_level}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-extrabold text-text-h text-center mb-1 w-full truncate text-sm">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-50 border-2 border-amber-200 rounded-full px-2.5 py-0.5 mb-3">
                      <svg
                        className="w-3.5 h-3.5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="font-black text-yellow-900 text-xs font-mono">
                        {item.price}
                      </span>
                    </div>

                    {/* Button logic */}
                    {isEquipped ? (
                      <button
                        onClick={() => handleUnequip(item._id)}
                        disabled={unequipMutation.isPending}
                        className={`w-full py-2.5 rounded-full font-black text-xs shadow-sm transition-all border-b-[3px] disabled:opacity-50 cursor-pointer active:scale-95 ${
                          unequipPendingId === item._id
                            ? "btn btn--coral animate-pulse"
                            : "btn btn--cyan"
                        }`}
                      >
                        {unequipMutation.isPending ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                            Đang tháo...
                          </span>
                        ) : unequipPendingId === item._id ? (
                          "Chạm nữa để tháo"
                        ) : (
                          "✓ Đã trang bị"
                        )}
                      </button>
                    ) : isOwned ? (
                      <button
                        onClick={() => handleEquip(item._id)}
                        disabled={equipMutation.isPending}
                        className="btn btn--soft w-full py-2.5 font-bold text-xs border-2 border-border-main cursor-pointer disabled:opacity-50 active:scale-95"
                      >
                        {equipMutation.isPending ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <span className="w-3 h-3 border-2 border-primary/40 border-t-primary rounded-full animate-spin"></span>
                            Đang mặc...
                          </span>
                        ) : (
                          "Mặc thử"
                        )}
                      </button>
                    ) : isLocked ? (
                      <button
                        disabled
                        className="btn btn--outline opacity-50 w-full py-2.5 font-bold text-xs cursor-not-allowed active:scale-95"
                      >
                        Khóa
                      </button>
                    ) : canAfford ? (
                      <button
                        onClick={() => handleBuy(item._id)}
                        disabled={buyMutation.isPending}
                        className="btn w-full py-2.5 font-extrabold text-xs cursor-pointer disabled:opacity-50 active:scale-95"
                      >
                        {buyMutation.isPending ? "Đang mua..." : "Mua ngay"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="btn btn--outline opacity-50 w-full py-2.5 font-bold text-xs cursor-not-allowed active:scale-95"
                      >
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
