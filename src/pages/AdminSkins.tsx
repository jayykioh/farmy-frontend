import React, { useEffect, useState } from 'react';
import { getAdminSkins, createAdminSkin, updateAdminSkin, deleteAdminSkin } from '../api/admin';
import { Plus, Edit2, Trash2, X, Tag, ShieldAlert, Image, Layers, Sparkles } from 'lucide-react';
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

    // Build anchor object dynamically if any field is filled
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
    <div className="flex flex-col gap-6">
      {/* Header section with add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Quản lý Cửa hàng (Skins)</h2>
          <p className="text-sm text-[#86868b] font-medium">Quản lý danh sách phụ kiện cho thú cưng, cấu hình giá EXP và cấp độ yêu cầu.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#08A855] text-white px-4 py-2.5 rounded-xl text-[14px] font-bold shadow-md hover:bg-[#07964b] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus size={16} /> Thêm phụ kiện
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#08A855] mx-auto"></div>
        </div>
      ) : skins.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.04] p-12 text-center text-[#86868b]">
          Chưa có phụ kiện nào trong cửa hàng. Nhấn "Thêm phụ kiện" để bắt đầu.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skins.map((skin) => (
            <div
              key={skin._id}
              className="bg-white rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-all overflow-hidden flex flex-col relative group"
            >
              {/* Image Preview Container */}
              <div className="bg-[#f5f5f7] p-6 flex items-center justify-center h-48 border-b border-black/[0.02] relative">
                {skin.image_url ? (
                  <img
                    src={skin.image_url}
                    alt={skin.name}
                    className="max-h-36 max-w-[80%] object-contain drop-shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/150?text=No+Image';
                    }}
                  />
                ) : (
                  <Image className="w-12 h-12 text-[#86868b]" />
                )}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-black/[0.04] text-[11px] font-bold text-[#1d1d1f] px-2.5 py-1 rounded-full shadow-sm">
                  {getCategoryLabel(skin.category)}
                </span>
              </div>

              {/* Information */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[#1d1d1f] text-[15px] line-clamp-1">{skin.name}</h3>
                  <div className="flex flex-col gap-1 mt-2 text-[13px] text-[#86868b] font-medium">
                    <div className="flex items-center gap-1.5">
                      <Tag size={13} className="text-slate-400" />
                      <span>Giá: <strong className="text-[#08A855] font-semibold">{skin.price} XP</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers size={13} className="text-slate-400" />
                      <span>Cấp độ yêu cầu: <strong className="text-slate-700 font-semibold">{skin.required_level}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 border-t border-black/[0.03] pt-3 mt-1">
                  <button
                    onClick={() => openEditModal(skin)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(skin._id, skin.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-border-main/55 rounded-[28px] max-w-lg w-full shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.05]">
              <h3 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#08A855]" />
                {editingSkin ? 'Cập nhật phụ kiện' : 'Thêm phụ kiện mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#86868b] hover:text-[#1d1d1f] p-1 hover:bg-black/[0.04] rounded-full transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-[13px] font-bold text-[#1d1d1f]" htmlFor="skinName">
                  Tên phụ kiện *
                </label>
                <input
                  id="skinName"
                  type="text"
                  placeholder="Ví dụ: Vương Miện Hoàng Gia, Kính Râm..."
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-[#08A855] focus:ring-2 focus:ring-[#08A855]/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-[#1d1d1f]" htmlFor="skinCategory">
                    Thể loại *
                  </label>
                  <select
                    id="skinCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-[#08A855] focus:ring-2 focus:ring-[#08A855]/10 transition-all"
                  >
                    <option value="HAT">Nón/Mũ (HAT)</option>
                    <option value="OUTFIT">Trang phục (OUTFIT)</option>
                    <option value="EFFECT">Hiệu ứng (EFFECT)</option>
                    <option value="BACKGROUND">Nền cảnh (BACKGROUND)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-[#1d1d1f]" htmlFor="skinPrice">
                    Giá bán (EXP) *
                  </label>
                  <input
                    id="skinPrice"
                    type="number"
                    min={0}
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-[#08A855] focus:ring-2 focus:ring-[#08A855]/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-[#1d1d1f]" htmlFor="skinReqLevel">
                    Cấp độ yêu cầu *
                  </label>
                  <input
                    id="skinReqLevel"
                    type="number"
                    min={1}
                    required
                    value={requiredLevel}
                    onChange={(e) => setRequiredLevel(Number(e.target.value))}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-[#08A855] focus:ring-2 focus:ring-[#08A855]/10 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[13px] font-bold text-[#1d1d1f]" htmlFor="skinImageUrl">
                    URL hình ảnh *
                  </label>
                  <input
                    id="skinImageUrl"
                    type="text"
                    placeholder="Ví dụ: /shop/non-la.svg"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.08] px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-[#08A855] focus:ring-2 focus:ring-[#08A855]/10 transition-all"
                  />
                </div>
              </div>

              {/* Anchor Settings */}
              <div className="mt-2 border-t border-black/[0.05] pt-4">
                <h4 className="text-[13px] font-bold text-[#1d1d1f] mb-3 flex items-center gap-1.5">
                  <Layers size={14} className="text-[#86868b]" />
                  Tùy chỉnh Anchor (Tọa độ/kích thước hiển thị)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#86868b]" htmlFor="anchorWidth">
                      Width (ví dụ: 80%)
                    </label>
                    <input
                      id="anchorWidth"
                      type="text"
                      placeholder="e.g. 80%"
                      value={anchorWidth}
                      onChange={(e) => setAnchorWidth(e.target.value)}
                      className="w-full rounded-xl border border-black/[0.08] px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[#08A855] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#86868b]" htmlFor="anchorTop">
                      Top (ví dụ: -15%)
                    </label>
                    <input
                      id="anchorTop"
                      type="text"
                      placeholder="e.g. -15%"
                      value={anchorTop}
                      onChange={(e) => setAnchorTop(e.target.value)}
                      className="w-full rounded-xl border border-black/[0.08] px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[#08A855] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#86868b]" htmlFor="anchorLeft">
                      Left (ví dụ: 50%)
                    </label>
                    <input
                      id="anchorLeft"
                      type="text"
                      placeholder="e.g. 50%"
                      value={anchorLeft}
                      onChange={(e) => setAnchorLeft(e.target.value)}
                      className="w-full rounded-xl border border-black/[0.08] px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[#08A855] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#86868b]" htmlFor="anchorTransform">
                      Transform (ví dụ: translateX(-50%))
                    </label>
                    <input
                      id="anchorTransform"
                      type="text"
                      placeholder="e.g. translateX(-50%)"
                      value={anchorTransform}
                      onChange={(e) => setAnchorTransform(e.target.value)}
                      className="w-full rounded-xl border border-black/[0.08] px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[#08A855] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-[#86868b]" htmlFor="anchorZIndex">
                      Z-Index (ví dụ: 5)
                    </label>
                    <input
                      id="anchorZIndex"
                      type="number"
                      placeholder="e.g. 5"
                      value={anchorZIndex}
                      onChange={(e) => setAnchorZIndex(e.target.value)}
                      className="w-full rounded-xl border border-black/[0.08] px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[#08A855] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-black/[0.05] pt-5 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-black/[0.08] text-[13.5px] font-bold text-[#86868b] hover:bg-black/[0.03] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#08A855] text-white text-[13.5px] font-bold hover:bg-[#07964b] active:scale-[0.98] transition-all cursor-pointer shadow-md"
                >
                  {editingSkin ? 'Lưu thay đổi' : 'Thêm phụ kiện'}
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
