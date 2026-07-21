import React, { useState } from 'react';
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

  return (
    // Backdrop
    <div className="fixed inset-0 z-[9000] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity"
        onClick={!isBusy ? onClose : undefined}
      />

      {/* Dialog Sheet */}
      <div className="relative z-10 w-full max-w-lg bg-[var(--color-paper)] border-t-2 md:border-2 border-[var(--color-border-main)] rounded-t-[32px] md:rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.16)] flex flex-col max-h-[92svh] overflow-hidden text-[var(--color-ink)] font-sans">

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
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[var(--color-ink)] tracking-tight">
                  {mode === 'first-time'
                    ? step === 'plot_info'
                      ? 'Tạo mảnh vườn'
                      : 'Khởi tạo vụ mùa'
                    : 'Thêm vụ mùa mới'}
                </h2>
                {mode === 'first-time' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-accent-2)]/20 text-[var(--color-ink)] font-[var(--font-label)]">
                    {step === 'plot_info' ? 'Bước 1/2' : 'Bước 2/2'}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[var(--color-ink-2)] mt-0.5">
                {mode === 'first-time'
                  ? step === 'plot_info' ? 'Điền thông tin diện tích & mảnh vườn của bạn' : 'Chọn loại cây trồng & tên vụ mùa'
                  : 'Tạo mùa vụ mới cho vườn cây của bạn'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-paper-2)] hover:bg-[var(--color-paper-3)] transition-colors cursor-pointer disabled:opacity-40 active:scale-95 border border-[var(--color-border-main)]"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 text-[var(--color-ink-2)]" weight="bold" />
          </button>
        </div>

        {/* Visual Progress Bar (first-time mode) */}
        {mode === 'first-time' && (
          <div className="h-1.5 w-full bg-[var(--color-paper-3)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-accent-2)] to-[var(--color-mint)] transition-all duration-300 ease-out"
              style={{ width: step === 'plot_info' ? '50%' : '100%' }}
            />
          </div>
        )}

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Error / Progress Toast */}
          {progress.status === 'failed' && progress.errorMsg && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 shadow-xs">
              <Warning className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" weight="duotone" />
              <p className="text-xs font-bold text-rose-700">{progress.errorMsg}</p>
            </div>
          )}

          {/* ══ STEP 1: PLOT INFO ══ */}
          {step === 'plot_info' && (
            <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-200">

              {/* Existing Plot Selector Toggles */}
              {mode === 'add-season' && plots.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex p-1 bg-[var(--color-paper-2)] rounded-2xl border border-[var(--color-border-main)] gap-1">
                    <button
                      type="button"
                      onClick={() => setUseExistingPlot(true)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                        useExistingPlot
                          ? 'bg-white text-[var(--color-ink)] shadow-sm border border-[var(--color-border-main)]'
                          : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
                      }`}
                    >
                      🏡 Chọn mảnh vườn có sẵn
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseExistingPlot(false)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                        !useExistingPlot
                          ? 'bg-white text-[var(--color-ink)] shadow-sm border border-[var(--color-border-main)]'
                          : 'text-[var(--color-ink-2)] hover:text-[var(--color-ink)]'
                      }`}
                    >
                      ✨ Tạo vườn mới
                    </button>
                  </div>

                  {useExistingPlot && (
                    <div className="grid grid-cols-1 gap-2.5 mt-1">
                      {plots.map((plot) => {
                        const isSelected = selectedExistingPlotId === plot._id;
                        return (
                          <button
                            key={plot._id}
                            type="button"
                            onClick={() => setSelectedExistingPlotId(plot._id)}
                            className={`card-bubble flex items-center gap-3 p-3.5 rounded-2xl text-left cursor-pointer transition-all select-none ${
                              isSelected
                                ? 'bg-white border-[var(--color-accent-2)] ring-2 ring-[var(--color-accent-2)]/30'
                                : 'bg-white hover:border-[var(--color-outline-main)]'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-[var(--color-accent-2)]/20 text-[var(--color-ink)]' : 'bg-[var(--color-paper-2)] text-[var(--color-ink-2)]'}`}>
                              <MapPin className="w-5 h-5" weight="duotone" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-[var(--color-ink)] leading-snug">{plot.name}</p>
                              <p className="text-xs text-[var(--color-ink-2)] font-semibold mt-0.5">{plot.area_size.toLocaleString()} m²</p>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-[var(--color-accent-2)] shrink-0" weight="fill" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {errors.existingPlot && <p className="text-xs text-[var(--color-accent-3)] font-bold ml-1">⚠️ {errors.existingPlot}</p>}
                </div>
              )}

              {/* New Plot Form */}
              {(!useExistingPlot || mode === 'first-time' || plots.length === 0) && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--color-ink)] ml-1 flex items-center gap-1">
                      <span>🏡</span> Tên mảnh vườn <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-2)]/50 pointer-events-none" weight="duotone" />
                      <input
                        type="text"
                        value={plotName}
                        onChange={(e) => setPlotName(e.target.value)}
                        placeholder="VD: Ruộng phía Đông, Vườn Nhà..."
                        className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink-2)]/40 focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20"
                      />
                    </div>
                    {errors.plotName && <p className="text-xs text-[var(--color-accent-3)] font-bold ml-1">⚠️ {errors.plotName}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--color-ink)] ml-1 flex items-center gap-1">
                      <span>📐</span> Diện tích <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ArrowsOut className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-2)]/50 pointer-events-none" weight="duotone" />
                        <input
                          type="number"
                          value={areaValue}
                          min={1}
                          onChange={(e) => setAreaValue(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="VD: 1000"
                          className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink-2)]/40 focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20"
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
                    {errors.areaValue && <p className="text-xs text-[var(--color-accent-3)] font-bold ml-1">⚠️ {errors.areaValue}</p>}
                    <p className="text-[11px] text-[var(--color-ink-2)] font-medium ml-1">
                      💡 Quy đổi: 1 sào Nam Bộ ≈ 1.000 m²
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--color-ink)] ml-1 flex items-center gap-1">
                      <span>📝</span> Mô tả (tùy chọn)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="VD: Đất phù sa ven sông, hệ thống tưới nhỏ giọt..."
                      rows={2}
                      className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3 px-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink-2)]/40 focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20 resize-none"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ STEP 2: SEASON INFO ══ */}
          {step === 'season_info' && (
            <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 duration-200">
              <CropPicker
                value={cropId}
                onChange={(id, label) => {
                  setCropId(id);
                  setCropLabel(label);
                  setErrors((e) => ({ ...e, crop: '' }));
                }}
                error={errors.crop}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-ink)] ml-1 flex items-center gap-1">
                  <span>🏷️</span> Tên mùa vụ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={seasonName}
                  onChange={(e) => {
                    setSeasonName(e.target.value);
                    setErrors((current) => ({ ...current, seasonName: '' }));
                  }}
                  placeholder="VD: Lúa thơm · Vụ 1 · 2026"
                  maxLength={100}
                  className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3.5 px-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all placeholder:text-[var(--color-ink-2)]/40 focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20"
                />
                <p className="text-[11px] text-[var(--color-ink-2)] font-medium ml-1">Tên được tự động gợi ý; bạn có thể tùy chỉnh lại theo ý muốn.</p>
                {errors.seasonName && <p className="text-xs text-[var(--color-accent-3)] font-bold ml-1">⚠️ {errors.seasonName}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-ink)] ml-1 flex items-center gap-1">
                  <span>📅</span> Ngày bắt đầu vụ mùa <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-ink-2)]/50 pointer-events-none" weight="duotone" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--color-border-main)] bg-white py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-ink)] outline-none transition-all focus:border-[var(--color-accent-2)] focus:ring-4 focus:ring-[var(--color-accent-2)]/20 cursor-pointer"
                  />
                </div>
                {errors.startDate && <p className="text-xs text-[var(--color-accent-3)] font-bold ml-1">⚠️ {errors.startDate}</p>}
              </div>

              {/* Summary Card Preview */}
              {cropLabel && (
                <div className="card-bubble card-bubble--pear bg-white p-4 flex flex-col gap-2">
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
              className="btn btn--cyan w-full py-3.5 text-base cursor-pointer active:scale-95 font-bold"
            >
              Tiếp tục đến Chọn vụ mùa &rsaquo;
            </button>
          ) : (
            <button
              onClick={() => { void handleConfirm(); }}
              disabled={isBusy}
              className="btn btn--cyan w-full py-3.5 text-base cursor-pointer active:scale-95 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default CreateSeasonModal;
