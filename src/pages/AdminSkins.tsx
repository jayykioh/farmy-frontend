/* Hallmark · page: admin-skins · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect, useState } from 'react';
import { getAdminSkins, createAdminSkin, updateAdminSkin, deleteAdminSkin } from '../api/admin';
import { Plus, NotePencil, Trash, X, Tag, ShieldWarning, Image, Stack, Sparkle } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export type ShopItemInfo = {
  _id: string;
  name: string;
  category: 'HAT' | 'OUTFIT' | 'EFFECT' | 'BACKGROUND';
  price: number;
  required_level: number;
  image_url: string;
  anchor?: {
    top?: string;
    left?: string;
    width?: string;
    transform?: string;
    zIndex?: number;
  };
};

export const AdminSkins: React.FC = () => {
  const [skins, setSkins] = useState<ShopItemInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkin, setEditingSkin] = useState<ShopItemInfo | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'HAT' | 'OUTFIT' | 'EFFECT' | 'BACKGROUND'>('HAT');
  const [price, setPrice] = useState(100);
  const [requiredLevel, setRequiredLevel] = useState(1);
  const [imageUrl, setImageUrl] = useState('');
  
  // Anchor states
  const [anchorTop, setAnchorTop] = useState('');
  const [anchorLeft, setAnchorLeft] = useState('');
  const [anchorWidth, setAnchorWidth] = useState('');
  const [anchorTransform, setAnchorTransform] = useState('');
  const [anchorZIndex, setAnchorZIndex] = useState('');

  const fetchSkins = () => {
    setLoading(true);
    getAdminSkins()
      .then((data) => {
        setSkins(data);
      })
      .catch((err) => {
        toast.error('Lỗi tải danh sách skin: ' + (err.message || err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSkins();
  }, []);

  const openAddModal = () => {
    setEditingSkin(null);
    setName('');
    setCategory('HAT');
    setPrice(100);
    setRequiredLevel(1);
    setImageUrl('');
    setAnchorTop('');
    setAnchorLeft('');
    setAnchorWidth('');
    setAnchorTransform('');
    setAnchorZIndex('');
    setIsModalOpen(true);
  };

  const openEditModal = (skin: ShopItemInfo) => {
    setEditingSkin(skin);
    setName(skin.name);
    setCategory(skin.category);
    setPrice(skin.price);
    setRequiredLevel(skin.required_level);
    setImageUrl(skin.image_url);
    setAnchorTop(skin.anchor?.top || '');
    setAnchorLeft(skin.anchor?.left || '');
    setAnchorWidth(skin.anchor?.width || '');
    setAnchorTransform(skin.anchor?.transform || '');
    setAnchorZIndex(skin.anchor?.zIndex?.toString() || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, itemName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa phụ kiện "${itemName}" không?`)) {
      deleteAdminSkin(id)
        .then(() => {
          toast.success('Xóa phụ kiện thành công!');
          fetchSkins();
        })
        .catch((err) => {
          toast.error('Lỗi khi xóa phụ kiện: ' + (err.message || err));
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !imageUrl) {
      toast.error('Vui lòng nhập tên và URL hình ảnh');
      return;
    }

    const anchor: any = {};
    if (anchorTop) anchor.top = anchorTop;
    if (anchorLeft) anchor.left = anchorLeft;
    if (anchorWidth) anchor.width = anchorWidth;
    if (anchorTransform) anchor.transform = anchorTransform;
    if (anchorZIndex) anchor.zIndex = parseInt(anchorZIndex, 10);

    const payload = {
      name,
      category,
      price: Number(price),
      required_level: Number(requiredLevel),
      image_url: imageUrl,
      anchor: Object.keys(anchor).length > 0 ? anchor : undefined,
    };

    if (editingSkin) {
      updateAdminSkin(editingSkin._id, payload)
        .then(() => {
          toast.success('Cập nhật phụ kiện thành công!');
          setIsModalOpen(false);
          fetchSkins();
        })
        .catch((err) => {
          toast.error('Lỗi khi cập nhật phụ kiện: ' + (err.message || err));
        });
    } else {
      createAdminSkin(payload)
        .then(() => {
          toast.success('Thêm phụ kiện mới thành công!');
          setIsModalOpen(false);
          fetchSkins();
        })
        .catch((err) => {
          toast.error('Lỗi khi thêm phụ kiện: ' + (err.message || err));
        });
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'HAT':
        return 'Nón/Mũ';
      case 'OUTFIT':
        return 'Trang phục';
      case 'EFFECT':
        return 'Hiệu ứng';
      case 'BACKGROUND':
        return 'Nền cảnh';
      default:
        return cat;
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left font-sans">
      {/* Header section with add button */}
      <div className="flex items-center justify-between card-bubble bg-white p-5 border-2 border-border-main shadow-xs rounded-3xl">
        <div>
          <h2 className="text-xl font-black text-text-h tracking-tight">Cửa hàng vật phẩm Bé Thóc</h2>
          <p className="text-xs text-text-secondary font-bold mt-0.5">Quản lý trang phục, mũ nón và hiệu ứng cho mascot nông trại.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn btn--cyan active:scale-95 rounded-2xl px-5 py-3 text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus size={18} weight="bold" /> Thêm phụ kiện mới
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-border-main border-t-[#008A5E] mx-auto"></div>
        </div>
      ) : skins.length === 0 ? (
        <div className="card-bubble bg-white rounded-3xl border-2 border-border-main p-12 text-center text-text-secondary font-bold">
          Chưa có phụ kiện nào trong cửa hàng. Nhấn "Thêm phụ kiện mới" để tạo vật phẩm đầu tiên!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skins.map((skin) => (
            <div
              key={skin._id}
              className="card-bubble bg-white rounded-3xl border-2 border-border-main shadow-xs overflow-hidden flex flex-col relative"
            >
              {/* Image Preview Container */}
              <div className="bg-bg-surface-1 p-6 flex items-center justify-center h-48 border-b-2 border-border-main relative">
                {skin.image_url ? (
                  <img
                    src={skin.image_url}
                    alt={skin.name}
                    className="max-h-36 max-w-[80%] object-contain drop-shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/150?text=No+Image';
                    }}
                  />
                ) : (
                  <Image size={32} weight="duotone" className="text-text-secondary" />
                )}
                <span className="absolute top-3 left-3 bg-white border-2 border-border-main text-xs font-black text-[#008A5E] px-3 py-1 rounded-full shadow-xs">
                  {getCategoryLabel(skin.category)}
                </span>
              </div>

              {/* Information */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-black text-text-h text-base line-clamp-1">{skin.name}</h3>
                  <div className="flex flex-col gap-1.5 mt-2 text-xs font-bold text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Tag size={14} weight="bold" className="text-[#008A5E]" />
                      <span>Giá bán: <strong className="text-[#008A5E] font-black">{skin.price} XP</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Stack size={14} weight="bold" className="text-amber-600" />
                      <span>Cấp mở khóa: <strong className="text-text-h font-black">{skin.required_level}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 border-t-2 border-border-main/50 pt-3 mt-1">
                  <button
                    onClick={() => openEditModal(skin)}
                    className="btn btn--soft active:scale-95 rounded-2xl p-2 text-text-main border border-border-main cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <NotePencil size={16} weight="bold" />
                  </button>
                  <button
                    onClick={() => handleDelete(skin._id, skin.name)}
                    className="btn btn--coral active:scale-95 rounded-2xl p-2 text-red-800 border border-red-300 cursor-pointer"
                    title="Xóa phụ kiện"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="card-bubble bg-white rounded-3xl border-2 border-border-main max-w-lg w-full shadow-2xl overflow-hidden my-8 text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-2 border-border-main">
              <h3 className="text-lg font-black text-text-h flex items-center gap-2">
                <Sparkle size={20} weight="duotone" className="text-[#008A5E]" />
                {editingSkin ? 'Cập nhật phụ kiện' : 'Thêm phụ kiện mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-text-secondary hover:text-text-main bg-bg-surface-2 rounded-full border border-border-main/50 active:scale-95 transition-all cursor-pointer"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="skinName">
                  Tên phụ kiện *
                </label>
                <input
                  id="skinName"
                  type="text"
                  placeholder="Ví dụ: Nón lá Nam Bộ, Kính mát ngầu..."
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 px-4 py-3 text-sm font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="skinCategory">
                    Phân loại *
                  </label>
                  <select
                    id="skinCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 px-4 py-3 text-xs font-black text-text-main outline-none focus:bg-white focus:border-[#008A5E] cursor-pointer transition-all"
                  >
                    <option value="HAT">Nón / Mũ (HAT)</option>
                    <option value="OUTFIT">Trang phục (OUTFIT)</option>
                    <option value="EFFECT">Hiệu ứng (EFFECT)</option>
                    <option value="BACKGROUND">Nền cảnh (BACKGROUND)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="skinPrice">
                    Giá mua (XP) *
                  </label>
                  <input
                    id="skinPrice"
                    type="number"
                    min={0}
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 px-4 py-3 text-sm font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="skinReqLevel">
                    Cấp độ yêu cầu *
                  </label>
                  <input
                    id="skinReqLevel"
                    type="number"
                    min={1}
                    required
                    value={requiredLevel}
                    onChange={(e) => setRequiredLevel(Number(e.target.value))}
                    className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 px-4 py-3 text-sm font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="skinImageUrl">
                    URL hình ảnh *
                  </label>
                  <input
                    id="skinImageUrl"
                    type="text"
                    placeholder="Ví dụ: /shop/non-la.svg"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 px-4 py-3 text-sm font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E] transition-all"
                  />
                </div>
              </div>

              {/* Anchor Settings */}
              <div className="mt-2 border-t-2 border-border-main/50 pt-4">
                <h4 className="text-xs font-black text-text-h mb-3 flex items-center gap-1.5">
                  <Stack size={16} weight="bold" className="text-[#008A5E]" />
                  Tùy chỉnh Anchor (Căn chỉnh Tọa độ Bé Thóc)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-text-secondary" htmlFor="anchorWidth">
                      Width (e.g. 80%)
                    </label>
                    <input
                      id="anchorWidth"
                      type="text"
                      placeholder="80%"
                      value={anchorWidth}
                      onChange={(e) => setAnchorWidth(e.target.value)}
                      className="w-full rounded-xl border-2 border-border-main bg-bg-surface-1 px-3 py-2 text-xs font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-text-secondary" htmlFor="anchorTop">
                      Top (e.g. -15%)
                    </label>
                    <input
                      id="anchorTop"
                      type="text"
                      placeholder="-15%"
                      value={anchorTop}
                      onChange={(e) => setAnchorTop(e.target.value)}
                      className="w-full rounded-xl border-2 border-border-main bg-bg-surface-1 px-3 py-2 text-xs font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-text-secondary" htmlFor="anchorLeft">
                      Left (e.g. 50%)
                    </label>
                    <input
                      id="anchorLeft"
                      type="text"
                      placeholder="50%"
                      value={anchorLeft}
                      onChange={(e) => setAnchorLeft(e.target.value)}
                      className="w-full rounded-xl border-2 border-border-main bg-bg-surface-1 px-3 py-2 text-xs font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-text-secondary" htmlFor="anchorTransform">
                      Transform (e.g. translateX(-50%))
                    </label>
                    <input
                      id="anchorTransform"
                      type="text"
                      placeholder="translateX(-50%)"
                      value={anchorTransform}
                      onChange={(e) => setAnchorTransform(e.target.value)}
                      className="w-full rounded-xl border-2 border-border-main bg-bg-surface-1 px-3 py-2 text-xs font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-text-secondary" htmlFor="anchorZIndex">
                      Z-Index (e.g. 5)
                    </label>
                    <input
                      id="anchorZIndex"
                      type="number"
                      placeholder="5"
                      value={anchorZIndex}
                      onChange={(e) => setAnchorZIndex(e.target.value)}
                      className="w-full rounded-xl border-2 border-border-main bg-bg-surface-1 px-3 py-2 text-xs font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t-2 border-border-main/50 pt-5 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn--soft active:scale-95 rounded-2xl px-5 py-2.5 text-xs font-black border-2 border-border-main cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn--cyan active:scale-95 rounded-2xl px-6 py-2.5 text-xs font-black shadow-md cursor-pointer"
                >
                  {editingSkin ? 'Lưu thay đổi' : 'Thêm phụ kiện mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSkins;
