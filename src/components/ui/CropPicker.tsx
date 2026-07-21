/* eslint-disable react-refresh/only-export-components */
import React from 'react';

// ────────────────────────────────────────────────────────────────
//  CropPicker
//  Picker 2 cấp: Category → Specific Crop
//  Trả về string crop CỤ THỂ (VD: "Bưởi", không phải "Cây ăn trái")
//  để đảm bảo AI Embedding đọc đúng crop_type
// ────────────────────────────────────────────────────────────────

export type CropOption = {
  id: string;
  label: string;
  emoji: string;
  /** Màu nền nhẹ cho card */
  color: string;
  /** Màu ring khi selected */
  ringColor: string;
  aliases?: string[];
};

export type CropCategory = {
  id: string;
  label: string;
  emoji: string;
  crops: CropOption[];
};

export const CROP_CATEGORIES: CropCategory[] = [
  {
    id: 'lua',
    label: 'Lúa',
    emoji: '🌾',
    crops: [
      { id: 'lua-nuoc', label: 'Lúa nước', emoji: '🌾', color: 'bg-yellow-50', ringColor: 'ring-yellow-400' },
      { id: 'lua-nep', label: 'Lúa nếp', emoji: '🌾', color: 'bg-amber-50', ringColor: 'ring-amber-400' },
      { id: 'lua-thom', label: 'Lúa thơm', emoji: '🌾', color: 'bg-orange-50', ringColor: 'ring-orange-400' },
    ],
  },
  {
    id: 'ca-phe',
    label: 'Cà phê',
    emoji: '☕',
    crops: [
      { id: 'robusta', label: 'Robusta', emoji: '☕', color: 'bg-amber-50', ringColor: 'ring-amber-600' },
      { id: 'arabica', label: 'Arabica', emoji: '☕', color: 'bg-yellow-50', ringColor: 'ring-yellow-600' },
      { id: 'liberica', label: 'Liberica', emoji: '☕', color: 'bg-orange-50', ringColor: 'ring-orange-600' },
    ],
  },
  {
    id: 'cay-an-trai',
    label: 'Cây ăn trái',
    emoji: '🍊',
    crops: [
      { id: 'buoi', label: 'Bưởi', emoji: '🍊', color: 'bg-orange-50', ringColor: 'ring-orange-400' },
      { id: 'cam', label: 'Cam', emoji: '🍊', color: 'bg-orange-50', ringColor: 'ring-orange-500' },
      { id: 'xoai', label: 'Xoài', emoji: '🥭', color: 'bg-yellow-50', ringColor: 'ring-yellow-500' },
      { id: 'sau-rieng', label: 'Sầu riêng', emoji: '🌿', color: 'bg-green-50', ringColor: 'ring-green-500' },
      { id: 'thanh-long', label: 'Thanh long', emoji: '🐉', color: 'bg-pink-50', ringColor: 'ring-pink-400' },
      { id: 'chom-chom', label: 'Chôm chôm', emoji: '🍒', color: 'bg-red-50', ringColor: 'ring-red-400' },
      { id: 'mit', label: 'Mít', emoji: '🍈', color: 'bg-yellow-50', ringColor: 'ring-yellow-400' },
      { id: 'nhan', label: 'Nhãn', emoji: '🍇', color: 'bg-purple-50', ringColor: 'ring-purple-400' },
    ],
  },
  {
    id: 'rau-mau',
    label: 'Rau màu',
    emoji: '🥦',
    crops: [
      { id: 'ca-chua', label: 'Cà chua', emoji: '🍅', color: 'bg-red-50', ringColor: 'ring-red-400' },
      { id: 'bap-cai', label: 'Bắp cải', emoji: '🥬', color: 'bg-green-50', ringColor: 'ring-green-400' },
      { id: 'dua-leo', label: 'Dưa leo', emoji: '🥒', color: 'bg-green-50', ringColor: 'ring-green-500' },
      { id: 'ot', label: 'Ớt', emoji: '🌶️', color: 'bg-red-50', ringColor: 'ring-red-500' },
      { id: 'hanh', label: 'Hành', emoji: '🧅', color: 'bg-purple-50', ringColor: 'ring-purple-400' },
      { id: 'rau-muong', label: 'Rau muống', emoji: '🌿', color: 'bg-emerald-50', ringColor: 'ring-emerald-500' },
    ],
  },
  {
    id: 'cay-cong-nghiep',
    label: 'Cây công nghiệp',
    emoji: '🌿',
    crops: [
      { id: 'tieu', label: 'Tiêu', emoji: '🌿', color: 'bg-slate-50', ringColor: 'ring-slate-400' },
      { id: 'dieu', label: 'Điều', emoji: '🌰', color: 'bg-amber-50', ringColor: 'ring-amber-500' },
      { id: 'cao-su', label: 'Cao su', emoji: '🌳', color: 'bg-emerald-50', ringColor: 'ring-emerald-400' },
      { id: 'mia', label: 'Mía', emoji: '🎋', color: 'bg-green-50', ringColor: 'ring-green-400' },
    ],
  },
  {
    id: 'khac',
    label: 'Khác',
    emoji: '🌱',
    crops: [
      { id: 'khac', label: 'Cây khác', emoji: '🌱', color: 'bg-slate-50', ringColor: 'ring-slate-400' },
    ],
  },
];

/** Cây phổ biến được nhận diện khi người dùng nhập trong mục "Khác". */
export const DETECTABLE_CROPS: CropOption[] = [
  { id: 'chuoi', label: 'Chuối', emoji: '🍌', color: 'bg-yellow-50', ringColor: 'ring-yellow-400', aliases: ['cây chuối', 'banana'] },
  { id: 'dua', label: 'Dừa', emoji: '🥥', color: 'bg-emerald-50', ringColor: 'ring-emerald-400', aliases: ['cây dừa', 'coconut'] },
  { id: 'du-du', label: 'Đu đủ', emoji: '🍈', color: 'bg-orange-50', ringColor: 'ring-orange-400', aliases: ['cây đu đủ', 'papaya'] },
  { id: 'oi', label: 'Ổi', emoji: '🍐', color: 'bg-green-50', ringColor: 'ring-green-400', aliases: ['cây ổi', 'guava'] },
  { id: 'bo', label: 'Bơ', emoji: '🥑', color: 'bg-lime-50', ringColor: 'ring-lime-500', aliases: ['cây bơ', 'avocado'] },
  { id: 'ngo', label: 'Ngô', emoji: '🌽', color: 'bg-yellow-50', ringColor: 'ring-yellow-500', aliases: ['bắp', 'cây ngô', 'cây bắp', 'corn', 'maize'] },
  { id: 'khoai-tay', label: 'Khoai tây', emoji: '🥔', color: 'bg-amber-50', ringColor: 'ring-amber-400', aliases: ['potato'] },
  { id: 'khoai-lang', label: 'Khoai lang', emoji: '🍠', color: 'bg-purple-50', ringColor: 'ring-purple-400', aliases: ['sweet potato'] },
  { id: 'lac', label: 'Lạc', emoji: '🥜', color: 'bg-amber-50', ringColor: 'ring-amber-500', aliases: ['đậu phộng', 'dau phong', 'peanut'] },
  { id: 'dau-nanh', label: 'Đậu nành', emoji: '🫘', color: 'bg-green-50', ringColor: 'ring-green-500', aliases: ['đậu tương', 'dau tuong', 'soybean'] },
  { id: 'che', label: 'Chè', emoji: '🍃', color: 'bg-emerald-50', ringColor: 'ring-emerald-500', aliases: ['trà', 'cây chè', 'tea'] },
  { id: 'san', label: 'Sắn', emoji: '🌿', color: 'bg-lime-50', ringColor: 'ring-lime-500', aliases: ['khoai mì', 'khoai mi', 'cassava'] },
];

/** Map từ crop id → label để dùng khi gửi API */
const CROP_LABEL_MAP: Record<string, string> = Object.fromEntries(
  CROP_CATEGORIES.flatMap((cat) => cat.crops.map((c) => [c.id, c.label]))
);

const normalizeCropName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');

/** Một nguồn dữ liệu duy nhất cho hình đại diện ở picker và kết quả diary. */
export const getCropOption = (cropType: string): CropOption | undefined => {
  const normalized = normalizeCropName(cropType);
  const crops = [...CROP_CATEGORIES.flatMap((category) => category.crops), ...DETECTABLE_CROPS];
  const aliases: Record<string, string> = {
    lua: 'luanuoc',
    caphe: 'arabica',
    cayankhai: 'khac',
    caykhac: 'khac',
  };
  const resolved = aliases[normalized] ?? normalized;
  const exactMatch = crops.find(
    (crop) =>
      normalizeCropName(crop.label) === resolved ||
      normalizeCropName(crop.id) === resolved ||
      crop.aliases?.some((alias) => normalizeCropName(alias) === resolved),
  );
  if (exactMatch) return exactMatch;

  const searchableNames = (crop: CropOption) => [crop.label, crop.id, ...(crop.aliases ?? [])]
    .map(normalizeCropName)
    .filter((name) => name.length >= 3);
  return crops
    .map((crop) => ({
      crop,
      score: Math.max(
        0,
        ...searchableNames(crop)
          .filter((name) => resolved.includes(name))
          .map((name) => name.length),
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)[0]?.crop;
};

export const getCropImagePath = (cropType: string): string | undefined => {
  const crop = getCropOption(cropType);
  if (!crop) return undefined;
  const pngOverrides = new Set(['lua-nuoc', 'lua-thom']);
  return `/crops/${crop.id}.${pngOverrides.has(crop.id) ? 'png' : 'webp'}`;
};

type Props = {
  value: string; // crop id hoặc rỗng
  onChange: (cropId: string, cropLabel: string) => void;
  error?: string;
};

export const CropPicker: React.FC<Props> = ({ value, onChange, error }) => {
  const [customCropLabel, setCustomCropLabel] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(() => {
    // Nếu đã có value, tự tìm category tương ứng
    if (!value) return null;
    const cat = CROP_CATEGORIES.find((c) => c.crops.some((crop) => crop.id === value));
    return cat?.id ?? null;
  });

  const activeCrops = selectedCategory
    ? CROP_CATEGORIES.find((c) => c.id === selectedCategory)?.crops ?? []
    : [];

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory((prev) => (prev === catId ? null : catId));
  };

  const handleCropClick = (crop: CropOption) => {
    onChange(crop.id, CROP_LABEL_MAP[crop.id] ?? crop.label);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-bold text-text-main ml-1">Loại cây trồng</label>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CROP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryClick(cat.id)}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border transition-all duration-150 cursor-pointer
              ${selectedCategory === cat.id
                ? 'bg-primary-container text-white border-primary-container shadow-md scale-105'
                : 'bg-white border-border-main/50 text-text-main hover:border-primary/40 hover:bg-primary/5'
              }
            `}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Crop Grid — animated expand */}
      {selectedCategory && activeCrops.length > 0 && (
        <div className="grid grid-cols-3 gap-2 pt-1 animate-in slide-in-from-top-2 duration-200">
          {activeCrops.map((crop) => {
            const isSelected = value === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => handleCropClick(crop)}
                className={`
                  relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer
                  ${crop.color}
                  ${isSelected
                    ? `border-primary-container ring-2 ring-primary/30 shadow-lg scale-105`
                    : `border-transparent hover:border-primary/30 hover:scale-105`
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-container rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <img
                  src={getCropImagePath(crop.id)}
                  alt={crop.label}
                  className="h-14 w-14 rounded-xl object-cover shadow-sm"
                />
                <span className="text-xs font-bold text-center text-text-main leading-tight">{crop.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom input when "Khác" selected */}
      {value === 'khac' && (
        <div className="mt-1">
          <input
            type="text"
            placeholder="VD: Chuối, Dừa, Đu đủ, Ngô, Khoai tây..."
            className="w-full rounded-2xl border border-border-main/55 bg-white py-3 px-4 text-sm font-semibold outline-none transition-all placeholder:text-text-main/40 focus:border-primary/45 focus:ring-4 focus:ring-primary/10"
            value={customCropLabel}
            onChange={(e) => {
              const label = e.target.value;
              setCustomCropLabel(label);
              onChange('khac', label.trim() || 'Cây khác');
            }}
          />
          {customCropLabel.trim() && getCropOption(customCropLabel)?.id !== 'khac' && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
              <img
                src={getCropImagePath(customCropLabel)}
                alt={customCropLabel}
                className="h-14 w-14 rounded-xl object-cover"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Đã nhận diện cây</p>
                <p className="text-sm font-bold text-text-h">{getCropOption(customCropLabel)?.label}</p>
              </div>
            </div>
          )}
          {customCropLabel.trim() && (!getCropOption(customCropLabel) || getCropOption(customCropLabel)?.id === 'khac') && (
            <p className="mt-2 text-xs font-semibold text-text-main/50">Chưa có ảnh riêng cho cây này, hệ thống sẽ dùng ảnh cây giống.</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-600 ml-1">{error}</p>
      )}
    </div>
  );
};

export default CropPicker;
