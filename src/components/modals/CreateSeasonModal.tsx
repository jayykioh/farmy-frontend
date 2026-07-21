import React, { useState } from 'react';
import { X, CaretLeft, CircleNotch, MapPin, ArrowsOut, Calendar, CheckCircle, Warning } from '@phosphor-icons/react';
import { useCreatePlotMutation, useCreateDiaryMutation, useGetPlotsQuery } from '../../store/api/farmApi';
import { CropPicker } from '../ui/CropPicker';
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
  const [startDate, setStartDate] = useState(today());

  // ─── Validation errors ─────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── API mutations ─────────────────────────────────────────────
  const [createPlot] = useCreatePlotMutation();
  const [createDiary] = useCreateDiaryMutation();
  const { data: plots = [] } = useGetPlotsQuery(undefined, {
    skip: mode === 'first-time',
  });

  // ─── Submit progress (idempotent retry state) ──────────────────
  const [progress, setProgress] = useState<SetupProgress>({ status: 'idle' });

  if (!isOpen) return null;

  // ─── Validation ────────────────────────────────────────────────
  const validatePlotStep = (): boolean => {
    const e: Record<string, string> = {};
    if (useExistingPlot) {
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
    if (step === 'season_info' && mode === 'first-time') {
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
      let plotId = progress.createdPlotId ?? (useExistingPlot ? selectedExistingPlotId : undefined);
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isBusy ? onClose : undefined}
      />

      {/* Sheet/Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-t-[32px] md:rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.18)] flex flex-col max-h-[92svh] overflow-hidden">

        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-main/40">
          <div className="flex items-center gap-3">
            {step === 'season_info' && mode === 'first-time' && (
              <button
                onClick={handleBack}
                disabled={isBusy}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40 active:scale-95"
              >
                <CaretLeft className="w-5 h-5 text-slate-600" weight="bold" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-black text-text-h">
                {mode === 'first-time'
                  ? step === 'plot_info'
                    ? 'Tạo mảnh vườn'
                    : 'Khởi tạo vụ mùa'
                  : 'Thêm vụ mùa mới'}
              </h2>
              <p className="text-xs font-semibold text-text-main/50 mt-0.5">
                {mode === 'first-time'
                  ? `Bước ${step === 'plot_info' ? '1' : '2'} / 2`
                  : 'Tạo vụ mùa cho mảnh vườn của bạn'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40 active:scale-95"
          >
            <X className="w-5 h-5 text-slate-500" weight="bold" />
          </button>
        </div>

        {/* Progress bar (first-time mode) */}
        {mode === 'first-time' && (
          <div className="h-1 bg-slate-100">
            <div
              className="h-full bg-primary-container transition-all duration-300"
              style={{ width: step === 'plot_info' ? '50%' : '100%' }}
            />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Error / Progress message */}
          {progress.status === 'failed' && progress.errorMsg && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
              <Warning className="w-4 h-4 text-red-500 shrink-0 mt-0.5" weight="duotone" />
              <p className="text-sm font-semibold text-red-700">{progress.errorMsg}</p>
            </div>
          )}

          {/* ══ STEP 1: PLOT INFO ══ */}
          {step === 'plot_info' && (
            <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-200">

              {/* Existing plot selector (add-season mode) */}
              {mode === 'add-season' && plots.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUseExistingPlot(true)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${useExistingPlot ? 'bg-primary-container text-white border-primary-container' : 'bg-white border-border-main/50 text-text-main'}`}
                    >
                      Chọn vườn có sẵn
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseExistingPlot(false)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${!useExistingPlot ? 'bg-primary-container text-white border-primary-container' : 'bg-white border-border-main/50 text-text-main'}`}
                    >
                      Tạo vườn mới
                    </button>
                  </div>

                  {useExistingPlot && (
                    <div className="grid grid-cols-1 gap-2 mt-1">
                      {plots.map((plot) => (
                        <button
                          key={plot._id}
                          type="button"
                          onClick={() => setSelectedExistingPlotId(plot._id)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${selectedExistingPlotId === plot._id ? 'border-primary-container bg-primary/5' : 'border-border-main/40 hover:border-primary/30'}`}
                        >
                          <MapPin className="w-4 h-4 text-primary shrink-0" weight="duotone" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-text-h">{plot.name}</p>
                            <p className="text-xs text-text-main/50 font-medium">{plot.area_size.toLocaleString()} m²</p>
                          </div>
                          {selectedExistingPlotId === plot._id && (
                            <CheckCircle className="w-5 h-5 text-primary-container shrink-0" weight="duotone" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.existingPlot && <p className="text-xs text-red-600 font-semibold ml-1">{errors.existingPlot}</p>}
                </div>
              )}

              {/* New Plot Form */}
              {(!useExistingPlot || mode === 'first-time') && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-text-main ml-1">Tên mảnh vườn</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/40 pointer-events-none" weight="duotone" />
                      <input
                        type="text"
                        value={plotName}
                        onChange={(e) => setPlotName(e.target.value)}
                        placeholder="VD: Ruộng phía Đông, Vườn Nhà..."
                        className="w-full rounded-2xl border border-border-main/55 bg-white py-3.5 pl-11 pr-5 text-sm font-semibold outline-none transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                    {errors.plotName && <p className="text-xs text-red-600 font-semibold ml-1">{errors.plotName}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-text-main ml-1">Diện tích</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ArrowsOut className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/40 pointer-events-none" weight="duotone" />
                        <input
                          type="number"
                          value={areaValue}
                          min={1}
                          onChange={(e) => setAreaValue(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="VD: 1000"
                          className="w-full rounded-2xl border border-border-main/55 bg-white py-3.5 pl-11 pr-5 text-sm font-semibold outline-none transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                      <select
                        value={areaUnit}
                        onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                        className="rounded-2xl border border-border-main/55 bg-white px-4 py-3.5 text-sm font-bold outline-none focus:border-primary/45 focus:ring-4 focus:ring-primary/10 cursor-pointer"
                      >
                        <option value="m2">m²</option>
                        <option value="sao">Sào</option>
                      </select>
                    </div>
                    {errors.areaValue && <p className="text-xs text-red-600 font-semibold ml-1">{errors.areaValue}</p>}
                    <p className="text-xs text-text-main/45 font-medium ml-1">
                      Mọi đơn vị đều được quy đổi về m² trước khi lưu.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-text-main ml-1">Mô tả (tùy chọn)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="VD: Đất phù sa ven sông, tưới nhỏ giọt..."
                      rows={2}
                      className="w-full rounded-2xl border border-border-main/55 bg-white py-3 px-4 text-sm font-semibold outline-none transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:ring-4 focus:ring-primary/10 resize-none"
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
                <label className="text-sm font-bold text-text-main ml-1">Ngày bắt đầu vụ mùa</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/40 pointer-events-none" weight="duotone" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-2xl border border-border-main/55 bg-white py-3.5 pl-11 pr-5 text-sm font-semibold outline-none transition-all focus:border-primary/45 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
                {errors.startDate && <p className="text-xs text-red-600 font-semibold ml-1">{errors.startDate}</p>}
              </div>

              {/* Summary preview */}
              {cropLabel && (
                <div className="bg-primary/5 rounded-2xl px-4 py-3.5 flex flex-col gap-1.5">
                  <p className="text-xs font-bold text-primary-container uppercase tracking-wide">Tóm tắt vụ mùa</p>
                  <p className="text-sm font-bold text-text-h">🌱 {cropLabel}</p>
                  <p className="text-xs text-text-main/60 font-medium">Bắt đầu: {new Date(startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-main/30 flex flex-col gap-2.5 bg-white">
          {progressLabel && (
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-text-main/70 py-1">
              <CircleNotch className="w-4 h-4 animate-spin text-primary-container" weight="bold" />
              {progressLabel}
            </div>
          )}

          {step === 'plot_info' ? (
            <button
              onClick={handleNext}
              className="w-full h-13 bg-primary-container text-white font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all hover:bg-primary cursor-pointer"
            >
              Tiếp tục →
            </button>
          ) : (
            <button
              onClick={() => { void handleConfirm(); }}
              disabled={isBusy}
              className="w-full h-13 bg-primary-container text-white font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all hover:bg-primary cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <CircleNotch className="w-5 h-5 animate-spin" weight="bold" />
                  Đang xử lý...
                </>
              ) : progress.status === 'failed' && progress.createdPlotId ? (
                'Thử lại tạo vụ mùa'
              ) : (
                '✨ Bắt đầu canh tác!'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSeasonModal;
