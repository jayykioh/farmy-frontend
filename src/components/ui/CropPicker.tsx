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
      <div className="flex items-center justify-between px-1">
        <label className="text-sm font-bold text-[var(--color-ink)] flex items-center gap-1.5">
          <span>🌾</span> Chọn loại cây trồng
        </label>
        <span className="text-[11px] font-semibold text-[var(--color-ink-2)]">
          {selectedCategory ? 'Chọn cụ thể bên dưới' : 'Chọn nhóm cây'}
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CROP_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`
                flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none
                ${isActive
                  ? 'bg-[var(--color-ink)] text-white shadow-md scale-[1.03] ring-2 ring-[var(--color-accent)]'
                  : 'bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-border-main)] hover:bg-[var(--color-paper-3)] hover:scale-[1.02]'
                }
              `}
            >
              <span className="text-sm">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Crop Grid — animated expand */}
      {selectedCategory && activeCrops.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 pt-1 animate-in slide-in-from-top-2 duration-200">
          {activeCrops.map((crop) => {
            const isSelected = value === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => handleCropClick(crop)}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none active:scale-95
                  ${isSelected
                    ? `bg-white border-[var(--color-accent-deep)] ring-4 ring-[var(--color-accent)]/30 shadow-md`
                    : `bg-white border-[var(--color-border-main)] hover:border-[var(--color-outline-main)] hover:shadow-xs`
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[var(--color-accent-3)] rounded-full flex items-center justify-center shadow-xs">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <img
                  src={getCropImagePath(crop.id)}
                  alt={crop.label}
                  className="h-12 w-12 rounded-xl object-cover shadow-xs border border-slate-100"
                />
                <span className="text-[12px] font-bold text-center text-[var(--color-ink)] leading-tight">{crop.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom input when "Khác" selected */}
      {value === 'khac' && (
        <div className="mt-1 flex flex-col gap-2">
          <input
            type="text"
            placeholder="VD: Chuối, Dừa, Đu đủ, Ngô, Khoai tây..."
            className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3.5 px-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink-2)]/40 focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20"
            value={customCropLabel}
            onChange={(e) => {
              const label = e.target.value;
              setCustomCropLabel(label);
              onChange('khac', label.trim() || 'Cây khác');
            }}
          />
          {customCropLabel.trim() && getCropOption(customCropLabel)?.id !== 'khac' && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-3 shadow-xs">
              <img
                src={getCropImagePath(customCropLabel)}
                alt={customCropLabel}
                className="h-12 w-12 rounded-xl object-cover shadow-xs"
              />
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 font-[var(--font-label)]">Đã nhận diện cây trồng</p>
                <p className="text-sm font-bold text-[var(--color-ink)]">{getCropOption(customCropLabel)?.label}</p>
              </div>
            </div>
          )}
          {customCropLabel.trim() && (!getCropOption(customCropLabel) || getCropOption(customCropLabel)?.id === 'khac') && (
            <p className="text-xs font-semibold text-[var(--color-ink-2)] ml-1">Hệ thống sẽ dùng ảnh biểu tượng cây trồng chung cho vụ mùa này.</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-bold text-[var(--color-accent-3)] ml-1">⚠️ {error}</p>
      )}
    </div>
  );
};

export default CropPicker;
