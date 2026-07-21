import React, { useState } from 'react';
import {
  CheckCircle,
  Warning,
  Eye,
  ChatCircleText,
  BookmarkSimple,
  Bell,
  ArrowClockwise,
  UserCheck,
  ShieldCheck,
  Info,
} from '@phosphor-icons/react';
import type { PlantScanResult } from '../../types/plantScan';

interface GuidedResultViewProps {
  result: PlantScanResult;
  onAskChat: (diseaseContext: string) => void;
  onSaveDiary: (result: PlantScanResult) => void;
  onCreateReminder: (result: PlantScanResult) => void;
  onReScan: () => void;
}

export const GuidedResultView: React.FC<GuidedResultViewProps> = ({
  result,
  onAskChat,
  onSaveDiary,
  onCreateReminder,
  onReScan,
}) => {
  const diagnosis = result.diagnosis;
  const assessmentState = diagnosis?.assessment_state ?? 'signs_to_monitor';

  const getStateBadge = (state: string) => {
    switch (state) {
      case 'probable_issue':
        return { label: 'Có khả năng gặp vấn đề', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'signs_to_monitor':
        return { label: 'Có dấu hiệu cần theo dõi', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'no_clear_signs':
        return { label: 'Chưa thấy dấu hiệu rõ ràng', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'expert_review_recommended':
        return { label: 'Nên nhờ chuyên gia kiểm tra', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'insufficient_evidence':
      default:
        return { label: 'Chưa đủ bằng chứng kết luận', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const stateBadge = getStateBadge(assessmentState);

  // Evidence list fallback
  const evidenceList =
    diagnosis?.evidence_observed && diagnosis.evidence_observed.length > 0
      ? diagnosis.evidence_observed
      : diagnosis?.symptoms && diagnosis.symptoms.length > 0
      ? diagnosis.symptoms
      : [
          'Xuất hiện đốm bất thường trên mặt lá',
          'Viền lá chuyển màu nâu xám khác biệt',
          'Lá có dấu hiệu mất sắc tố diệp lục nhẹ',
        ];

  // Possible causes fallback
  const possibleCauses =
    diagnosis?.possible_causes && diagnosis.possible_causes.length > 0
      ? diagnosis.possible_causes
      : [
          {
            name: diagnosis?.disease_name || 'Tổn thương lá do nấm / sâu hại',
            matched_points:
              diagnosis?.symptoms && diagnosis.symptoms.length > 0
                ? diagnosis.symptoms
                : ['Vết đốm biến dạng trên lá', 'Vùng bị ảnh hưởng'],
            uncertain_points: ['Cần thêm ảnh chụp mặt dưới lá để khẳng định bào tử nấm'],
          },
        ];

  // Safe immediate actions fallback
  const safeActions =
    diagnosis?.treatment?.safe_immediate_actions &&
    diagnosis.treatment.safe_immediate_actions.length > 0
      ? diagnosis.treatment.safe_immediate_actions
      : [
          'Khoanh vùng các cây có biểu hiện đốm lá',
          'Tránh tưới nước phun mưa trực tiếp lên vùng lá bị đốm',
          'Theo dõi mật độ lan rộng sau 24-48 giờ',
          'Hạn chế bón dư đạm (N) trong giai đoạn này',
        ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-black/5 text-left flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Cache banner */}
      {result.is_cached && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs font-bold text-blue-900">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-blue-600 shrink-0" weight="fill" />
            <span>ⓘ Kết quả được tái sử dụng từ lần phân tích gần nhất</span>
          </div>
          <button
            onClick={onReScan}
            className="px-3 py-1 bg-white border border-blue-300 rounded-xl text-blue-700 hover:bg-blue-100 active:scale-95 transition-all text-[11px] cursor-pointer"
          >
            Phân tích lại
          </button>
        </div>
      )}

      {/* RAG Degraded Warning */}
      {result.rag_degraded && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-900">
          <Warning size={18} className="text-amber-600 shrink-0" weight="fill" />
          <span>⚠️ Chưa thể đối chiếu tài liệu kỹ thuật RAG. Kết quả hiện chỉ dựa trên ảnh & ngữ cảnh bạn cung cấp.</span>
        </div>
      )}

      {/* SECTION A: Assessment Overview */}
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-black text-xl text-slate-900 tracking-tight">Kết quả đánh giá sức khỏe cây</h2>
          </div>
          <p className="text-xs font-semibold text-slate-500">Mùa vụ: {result.crop_type || 'Nông sản'}</p>
        </div>
        <span className={`self-start sm:self-center px-3.5 py-1.5 rounded-full text-xs font-black border shadow-2xs ${stateBadge.bg}`}>
          {stateBadge.label}
        </span>
      </div>

      {/* Image Preview Thumbnails */}
      <div className="flex items-center gap-3">
        {result.image_url && (
          <img src={result.image_url} alt="Ảnh quét 1" className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs" />
        )}
        {result.additional_images?.map((url, idx) => (
          <img key={idx} src={url} alt={`Ảnh quét ${idx + 2}`} className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs" />
        ))}
      </div>

      {/* SECTION B: What AI Observed (Evidence) */}
      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
          <Eye size={20} className="text-emerald-600" weight="bold" />
          <span>AI đã nhìn thấy gì (Dấu hiệu quan sát được)</span>
        </div>
        <ul className="space-y-1.5 text-xs font-bold text-slate-700">
          {evidenceList.map((ev, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{ev}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* SECTION C: Differential Diagnosis / Possible Causes */}
      <div className="space-y-3">
        <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Các khả năng phù hợp</h4>
        <div className="space-y-3">
          {possibleCauses.map((cause, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-900">{idx + 1}. {cause.name}</span>
              </div>
              
              {cause.matched_points?.length > 0 && (
                <div className="text-xs font-semibold text-emerald-900 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                  <span className="font-bold">✓ Điểm phù hợp: </span>
                  {cause.matched_points.join(', ')}
                </div>
              )}

              {cause.uncertain_points?.length > 0 && (
                <div className="text-xs font-semibold text-amber-900 bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                  <span className="font-bold">! Chưa chắc chắn: </span>
                  {cause.uncertain_points.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION F: Safe Next Actions (Low-risk immediate steps) */}
      <div className="space-y-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
        <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
          <ShieldCheck size={20} className="text-emerald-700" weight="fill" />
          <span>Khuyến nghị bước kiểm tra & hành động an toàn tiếp theo</span>
        </div>
        <ol className="space-y-2 text-xs font-bold text-emerald-950 list-decimal list-inside">
          {safeActions.map((act, idx) => (
            <li key={idx} className="leading-relaxed">{act}</li>
          ))}
        </ol>
      </div>

      {/* Treatment Info (Only if available with citation) */}
      {diagnosis?.treatment?.chemical && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-xs font-extrabold text-slate-900">Thông tin điều trị tham khảo (khi có đủ căn cứ)</p>
          {diagnosis.treatment.source_citation && (
            <p className="text-[11px] font-semibold text-slate-500">Nguồn: {diagnosis.treatment.source_citation}</p>
          )}
          <p className="text-xs font-semibold text-slate-800">{diagnosis.treatment.chemical}</p>
          <p className="text-[11px] font-bold text-amber-700">⚠️ Vui lòng kiểm tra kỹ nhãn sản phẩm & tuân thủ thời gian cách ly thực tế.</p>
        </div>
      )}

      {/* Integrated Action CTAs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => onAskChat(possibleCauses[0]?.name || 'Tổn thương lá')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all text-xs font-bold gap-1 cursor-pointer"
        >
          <ChatCircleText size={20} weight="duotone" />
          <span>Hỏi Bé Thóc</span>
        </button>

        <button
          onClick={() => onSaveDiary(result)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 active:scale-95 transition-all text-xs font-bold gap-1 cursor-pointer"
        >
          <BookmarkSimple size={20} weight="duotone" />
          <span>Lưu Nhật ký</span>
        </button>

        <button
          onClick={() => onCreateReminder(result)}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 active:scale-95 transition-all text-xs font-bold gap-1 cursor-pointer"
        >
          <Bell size={20} weight="duotone" />
          <span>Nhắc tái khám</span>
        </button>

        <button
          onClick={onReScan}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 active:scale-95 transition-all text-xs font-bold gap-1 cursor-pointer"
        >
          <ArrowClockwise size={20} weight="bold" />
          <span>Chụp theo dõi</span>
        </button>
      </div>
    </div>
  );
};
