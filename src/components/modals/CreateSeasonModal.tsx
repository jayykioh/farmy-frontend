import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CaretLeft, CircleNotch, MapPin, ArrowsOut, Calendar, CheckCircle, Warning } from '@phosphor-icons/react';
import { useCreatePlotMutation, useCreateDiaryMutation, useGetDiariesQuery, useGetPlotsQuery } from '../../store/api/farmApi';
import { CropPicker, getCropImagePath } from '../ui/CropPicker';
import type { Diary, FarmPlot } from '../../api/farm';

// ────────────────────────────────────────────────────────────────
//  CreateSeasonModal
//  2-bước: Thông tin Mảnh Vườn → Chọn Vụ Mùa
//  An toàn: API chỉ được gọi khi bấm Confirm cuối cùng.
//  Idempotent retry: Nếu /plots thành công nhưng /diaries fail,
//  retry sẽ reuse plotId đã có thay vì tạo Plot mới.
// ────────────────────────────────────────────────────────────────

export type CreateSeasonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (diary: Diary, plot: FarmPlot) => void;
  /** first-time: Luôn tạo plot mới → diary. add-season: Cho phép chọn plot cũ hoặc tạo mới */
  mode: 'first-time' | 'add-season';
  initialPlotId?: string;
};

type SetupStep = 'plot_info' | 'season_info';

type SetupProgress = {
  /** Nếu plot đã được tạo thành công, lưu ID để retry diary không tạo trùng plot */
  createdPlotId?: string;
  status: 'idle' | 'creating_plot' | 'creating_diary' | 'failed' | 'completed';
  errorMsg?: string;
};

type AreaUnit = 'm2' | 'sao';

/** Convert về mét vuông để gửi API */
const toSquareMeters = (value: number, unit: AreaUnit): number => {
  if (unit === 'sao') return value * 360; // 1 sào Nam Bộ ≈ 1000m², dùng 1000 cho đơn giản
  return value;
};

const today = () => new Date().toISOString().split('T')[0];

export const CreateSeasonModal: React.FC<CreateSeasonModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  initialPlotId,
}) => {
  // ─── Bước điều hướng ───────────────────────────────────────────
  const [step, setStep] = useState<SetupStep>('plot_info');

  // ─── Plot form state ───────────────────────────────────────────
  const [plotName, setPlotName] = useState('');
  const [areaValue, setAreaValue] = useState<number | ''>('');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('m2');
  const [description, setDescription] = useState('');
  const [selectedExistingPlotId, setSelectedExistingPlotId] = useState<string>(initialPlotId ?? '');
  const [useExistingPlot, setUseExistingPlot] = useState(mode === 'add-season' || !!initialPlotId);

  // ─── Diary form state ──────────────────────────────────────────
  const [cropId, setCropId] = useState('');
  const [cropLabel, setCropLabel] = useState('');
  const [seasonName, setSeasonName] = useState('');
  const [startDate, setStartDate] = useState(today());

  // ─── Validation errors ─────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── API mutations ─────────────────────────────────────────────
  const [createPlot] = useCreatePlotMutation();
  const [createDiary] = useCreateDiaryMutation();
  const { data: plots = [] } = useGetPlotsQuery(undefined, {
    skip: mode === 'first-time',
  });
  const { data: diaries = [] } = useGetDiariesQuery();

  React.useEffect(() => {
    if (!cropLabel) return;
    const year = Number(startDate.slice(0, 4)) || new Date().getFullYear();
    const plotId = selectedExistingPlotId || initialPlotId;
    const existingCount = diaries.filter((diary) =>
      (!plotId || diary.plot_id === plotId) &&
      diary.crop_type.trim().toLocaleLowerCase('vi-VN') === cropLabel.trim().toLocaleLowerCase('vi-VN') &&
      String(diary.start_date).startsWith(String(year)) &&
      diary.status !== 'deleted'
    ).length;
    setSeasonName(`${cropLabel} · Vụ ${existingCount + 1} · ${year}`);
  }, [cropLabel, startDate, selectedExistingPlotId, initialPlotId, diaries]);

  // Khi danh sách vườn tải xong, nếu chưa có vườn nào thì tự động chuyển sang form Tạo vườn mới
  // Nếu có vườn và chưa chọn thì tự động chọn vườn đầu tiên cho tiện
  React.useEffect(() => {
    if (plots.length === 0 && !initialPlotId) {
      setUseExistingPlot(false);
    } else if (plots.length > 0 && !selectedExistingPlotId && !initialPlotId) {
      setSelectedExistingPlotId(plots[0]?._id ?? '');
    }
  }, [plots, initialPlotId, selectedExistingPlotId]);

  // ─── Submit progress (idempotent retry state) ──────────────────
  const [progress, setProgress] = useState<SetupProgress>({ status: 'idle' });

  if (!isOpen) return null;

  // ─── Validation ────────────────────────────────────────────────
  const validatePlotStep = (): boolean => {
    const e: Record<string, string> = {};
    const isChoosingExisting = useExistingPlot && plots.length > 0 && mode !== 'first-time';
    if (isChoosingExisting) {
      if (!selectedExistingPlotId) e.existingPlot = 'Vui lòng chọn mảnh vườn.';
    } else {
      if (!plotName.trim()) e.plotName = 'Vui lòng nhập tên mảnh vườn.';
      if (!areaValue || Number(areaValue) <= 0) e.areaValue = 'Vui lòng nhập diện tích hợp lệ.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSeasonStep = (): boolean => {
    const e: Record<string, string> = {};
    if (!cropId) e.crop = 'Vui lòng chọn loại cây trồng.';
    if (!seasonName.trim()) e.seasonName = 'Vui lòng nhập tên mùa vụ.';
    if (!startDate) e.startDate = 'Vui lòng chọn ngày bắt đầu.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Navigation ────────────────────────────────────────────────
  const handleNext = () => {
    if (step === 'plot_info') {
      if (validatePlotStep()) {
        setErrors({});
        setStep('season_info');
      }
    }
  };

  const handleBack = () => {
    if (step === 'season_info') {
      setStep('plot_info');
    }
  };

  // ─── Final Submit (chỉ gọi API ở đây) ─────────────────────────
  const handleConfirm = async () => {
    if (!validateSeasonStep()) return;
    if (progress.status === 'creating_plot' || progress.status === 'creating_diary') return;

    setProgress({ status: 'creating_plot' });

    try {
      // Step A: Create Plot (nếu chưa tạo)
      const isChoosingExisting = useExistingPlot && plots.length > 0 && mode !== 'first-time';
      let plotId = progress.createdPlotId ?? (isChoosingExisting ? selectedExistingPlotId : undefined);
      let createdPlot: FarmPlot | undefined;

      if (!plotId) {
        const plotPayload = {
          name: plotName.trim(),
          area_size: toSquareMeters(Number(areaValue), areaUnit),
          description: description.trim() || undefined,
        };
        createdPlot = await createPlot(plotPayload).unwrap();
        plotId = createdPlot._id;
        // Lưu plotId lại để retry không tạo trùng
        setProgress((p) => ({ ...p, createdPlotId: plotId, status: 'creating_diary' }));
      } else {
        setProgress((p) => ({ ...p, status: 'creating_diary' }));
      }

      // Step B: Create Diary
      const diary = await createDiary({
        plot_id: plotId,
        crop_type: cropLabel || cropId,
        season: seasonName.trim(),
        start_date: startDate,
      }).unwrap();

      setProgress({ status: 'completed' });

      // Lấy plot object cho onSuccess
      const plotForCallback =
        createdPlot ??
        (plots.find((p) => p._id === plotId) as FarmPlot | undefined) ??
        ({ _id: plotId, name: plotName, area_size: toSquareMeters(Number(areaValue), areaUnit), user_id: '' } as FarmPlot);

      onSuccess?.(diary, plotForCallback);
      onClose();
    } catch (err) {
      console.error('[CreateSeasonModal] Failed:', err);
      setProgress((p) => ({
        ...p,
        status: 'failed',
        errorMsg:
          p.createdPlotId
            ? 'Mảnh vườn đã được tạo. Đang thử tạo vụ mùa lại...'
            : 'Có lỗi xảy ra. Vui lòng thử lại.',
      }));
    }
  };

  const isBusy = progress.status === 'creating_plot' || progress.status === 'creating_diary';

  // ─── Progress label ────────────────────────────────────────────
  const progressLabel =
    progress.status === 'creating_plot'
      ? 'Đang tạo mảnh vườn...'
      : progress.status === 'creating_diary'
      ? 'Đang khởi tạo vụ mùa...'
      : null;

  if (!isOpen) return null;

  return createPortal(
    // Backdrop
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={!isBusy ? onClose : undefined}
      />

      {/* Dialog Sheet */}
      <div className="relative z-10 w-full max-w-lg bg-[var(--color-paper)] border-t-2 md:border-2 border-[var(--color-border-main)] rounded-t-[32px] md:rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] flex flex-col max-h-[92svh] overflow-hidden text-[var(--color-ink)] font-sans">

        {/* Mobile Drag Indicator */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[var(--color-paper-3)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-main)] bg-white/70 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            {step === 'season_info' && (
              <button
                onClick={handleBack}
                disabled={isBusy}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] transition-colors cursor-pointer disabled:opacity-40 active:scale-95 border border-[var(--color-border-main)]"
                aria-label="Quay lại"
              >
                <CaretLeft className="w-5 h-5 text-[var(--color-ink)]" weight="bold" />
              </button>
            )}
            <div>
              <h3 className="text-lg font-black tracking-tight text-[var(--color-ink)]">
                {step === 'plot_info' ? (mode === 'first-time' ? 'Tạo mảnh vườn' : 'Thêm vụ mùa mới') : 'Thiết lập thông tin vụ mùa'}
              </h3>
              <p className="text-xs font-semibold text-[var(--color-ink-2)]">
                {step === 'plot_info' ? 'Tạo mùa vụ mới cho vườn cây của bạn' : 'Chọn loại cây trồng và thời gian bắt đầu'}
              </p>
            </div>
          </div>
          <button
            onClick={!isBusy ? onClose : undefined}
            disabled={isBusy}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] transition-colors cursor-pointer disabled:opacity-40 active:scale-95 border border-[var(--color-border-main)]"
            aria-label="Đóng"
          >
            <X className="w-4 h-4 text-[var(--color-ink)]" weight="bold" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {/* Step 1: Plot Info */}
          {step === 'plot_info' && (
            <div className="space-y-4">
              {/* Option Switcher: Chọn plot cũ vs Tạo mới (Chỉ hiện khi mode='add-season') */}
              {mode === 'add-season' && plots.length > 0 && (
                <div className="flex rounded-2xl bg-[var(--color-paper-2)] p-1 border border-[var(--color-border-main)]/60">
                  <button
                    type="button"
                    onClick={() => {
                      setUseExistingPlot(true);
                      if (!selectedExistingPlotId && plots.length > 0) {
                        setSelectedExistingPlotId(plots[0]._id);
                      }
                    }}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      useExistingPlot
                        ? 'bg-white text-[var(--color-ink)] shadow-xs'
                        : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
                    }`}
                  >
                    🏡 Chọn mảnh vườn có sẵn
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseExistingPlot(false)}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      !useExistingPlot
                        ? 'bg-white text-[var(--color-ink)] shadow-xs'
                        : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
                    }`}
                  >
                    ✨ Tạo vườn mới
                  </button>
                </div>
              )}

              {/* Form A: Chọn Plot có sẵn */}
              {useExistingPlot && plots.length > 0 && mode !== 'first-time' ? (
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[var(--color-ink-2)] uppercase tracking-wider font-[var(--font-label)]">
                    Mảnh vườn sẽ thực hiện vụ mùa
                  </label>
                  <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                    {plots.map((p) => {
                      const isSelected = selectedExistingPlotId === p._id;
                      return (
                        <div
                          key={p._id}
                          onClick={() => setSelectedExistingPlotId(p._id)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#007AFF] bg-[#007AFF]/5 shadow-xs'
                              : 'border-[var(--color-border-main)]/60 hover:border-[var(--color-border-main)] bg-white/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#007AFF] text-white' : 'bg-[var(--color-paper-2)] text-[var(--color-ink-2)]'}`}>
                              <MapPin className="w-5 h-5" weight="duotone" />
                            </div>
                            <div>
                              <p className="text-sm font-extrabold text-[var(--color-ink)]">{p.name}</p>
                              {p.area_size ? (
                                <p className="text-xs font-semibold text-[var(--color-ink-2)]">
                                  {p.area_size.toLocaleString('vi-VN')} m²
                                </p>
                              ) : null}
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-[#007AFF]" weight="fill" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {errors.existingPlot && (
                    <p className="text-xs font-bold text-red-500 mt-1">{errors.existingPlot}</p>
                  )}
                </div>
              ) : (
                /* Form B: Tạo Plot Mới */
                <div className="space-y-4">
                  {/* Tên vườn */}
                  <div>
                    <label className="block text-xs font-extrabold text-[var(--color-ink-2)] uppercase tracking-wider mb-1.5 font-[var(--font-label)]">
                      Tên mảnh vườn <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={plotName}
                      onChange={(e) => setPlotName(e.target.value)}
                      placeholder="Ví dụ: Vườn Sầu Riêng Đắk Lắk, Nhà màng dưa leo..."
                      className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3.5 px-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink-2)]/40 focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20"
                    />
                    {errors.plotName && (
                      <p className="text-xs font-bold text-red-500 mt-1">{errors.plotName}</p>
                    )}
                  </div>

                  {/* Diện tích + Đơn vị */}
                  <div>
                    <label className="block text-xs font-extrabold text-[var(--color-ink-2)] uppercase tracking-wider mb-1.5 font-[var(--font-label)]">
                      Diện tích mảnh vườn
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min="1"
                          value={areaValue}
                          onChange={(e) => setAreaValue(e.target.value ? Number(e.target.value) : '')}
                          placeholder="Ví dụ: 1000"
                          className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3.5 px-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink-2)]/40 focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20"
                        />
                      </div>
                      <select
                        value={areaUnit}
                        onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                        className="rounded-2xl border border-[var(--color-border-main)] bg-white px-4 py-3.5 text-sm font-bold text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20 cursor-pointer"
                      >
                        <option value="m2">m²</option>
                        <option value="sao">Sào</option>
                      </select>
                    </div>
                    {errors.areaValue && (
                      <p className="text-xs font-bold text-red-500 mt-1">{errors.areaValue}</p>
                    )}
                  </div>

                  {/* Ghi chú mảnh vườn */}
                  <div>
                    <label className="block text-xs font-extrabold text-[var(--color-ink-2)] uppercase tracking-wider mb-1.5 font-[var(--font-label)]">
                      Mô tả / Ghi chú mảnh vườn (Tùy chọn)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Thông tin thổ nhưỡng, vị trí, nguồn nước tưới..."
                      rows={2}
                      className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3 px-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink-2)]/40 focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Season Info */}
          {step === 'season_info' && (
            <div className="space-y-4">
              {/* Loại cây trồng (CropPicker) */}
              <div>
                <label className="block text-xs font-extrabold text-[var(--color-ink-2)] uppercase tracking-wider mb-1.5 font-[var(--font-label)]">
                  Loại cây trồng <span className="text-red-500">*</span>
                </label>
                <CropPicker
                  value={cropId}
                  onChange={(id, label) => {
                    setCropId(id);
                    setCropLabel(label);
                    // Tự gợi ý tên vụ mùa dựa trên loại cây
                    if (!seasonName || seasonName.startsWith('Vụ')) {
                      const year = new Date().getFullYear();
                      setSeasonName(`Vụ ${label} ${year}`);
                    }
                  }}
                  error={errors.crop}
                />
              </div>

              {/* Tên mùa vụ */}
              <div>
                <label className="block text-xs font-extrabold text-[var(--color-ink-2)] uppercase tracking-wider mb-1.5 font-[var(--font-label)]">
                  Tên vụ mùa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={seasonName}
                  onChange={(e) => setSeasonName(e.target.value)}
                  placeholder="Ví dụ: Vụ Mùa 2026, Vụ Hè Thu..."
                  className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3.5 px-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink-2)]/40 focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20"
                />
                {errors.seasonName && (
                  <p className="text-xs font-bold text-red-500 mt-1">{errors.seasonName}</p>
                )}
              </div>

              {/* Ngày bắt đầu canh tác */}
              <div>
                <label className="block text-xs font-extrabold text-[var(--color-ink-2)] uppercase tracking-wider mb-1.5 font-[var(--font-label)]">
                  Ngày bắt đầu canh tác
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20 cursor-pointer"
                  />
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-2)] pointer-events-none" />
                </div>
              </div>

              {/* Error banner nếu fail */}
              {progress.status === 'failed' && progress.errorMsg && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <Warning className="w-4 h-4 shrink-0 text-red-500" weight="fill" />
                  {progress.errorMsg}
                </div>
              )}

              {/* Card xem trước */}
              {cropLabel && (
                <div className="p-4 rounded-2xl bg-[var(--color-paper-2)] border border-[var(--color-border-main)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-[var(--color-ink-2)] uppercase tracking-wider font-[var(--font-label)]">
                      Tóm tắt mùa vụ sắp tạo
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-[var(--color-ink)]">
                      Sẵn sàng ✨
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {getCropImagePath(cropLabel) ? (
                      <img
                        src={getCropImagePath(cropLabel)}
                        alt={cropLabel}
                        className="h-12 w-12 rounded-xl object-cover shadow-xs border border-slate-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center text-2xl">🌱</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-extrabold text-[var(--color-ink)] leading-snug">{cropLabel}</p>
                      <p className="text-xs font-bold text-[var(--color-ink-2)] truncate">{seasonName}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-main)]/60 text-xs font-semibold text-[var(--color-ink-2)]">
                    <span>Khởi tạo ngày:</span>
                    <span className="font-bold text-[var(--color-ink)] font-[var(--font-label)]">
                      {new Date(startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[var(--color-border-main)] flex flex-col gap-2 bg-white">
          {progressLabel && (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--color-ink-2)] py-1">
              <CircleNotch className="w-4 h-4 animate-spin text-[var(--color-accent-2)]" weight="bold" />
              {progressLabel}
            </div>
          )}

          {step === 'plot_info' ? (
            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-[var(--color-accent)] text-white font-bold rounded-2xl cursor-pointer active:scale-95 transition-all"
            >
              Tiếp tục đến Chọn vụ mùa &rsaquo;
            </button>
          ) : (
            <button
              onClick={() => { void handleConfirm(); }}
              disabled={isBusy}
              className="w-full py-3.5 bg-[var(--color-accent)] text-white font-bold rounded-2xl cursor-pointer active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                  Đang tạo vụ mùa...
                </>
              ) : progress.status === 'failed' && progress.createdPlotId ? (
                'Thử lại tạo vụ mùa'
              ) : (
                '🌱 Bắt đầu canh tác ngay!'
              )}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateSeasonModal;
