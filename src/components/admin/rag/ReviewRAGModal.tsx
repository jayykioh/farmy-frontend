import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { confirmAdminRAGFile } from '../../../api/admin';

type RAGFile = {
  _id: string;
  title: string;
  validation_report?: {
    score: number;
    is_agriculture_related: boolean;
    language_detected: string;
    category_match: boolean;
    rejection_reason: string | null;
    warnings: string[];
  };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  file: RAGFile | null;
  onSuccess: () => void;
};

export const ReviewRAGModal: React.FC<Props> = ({ isOpen, onClose, file, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  if (!isOpen || !file) return null;

  const report = file.validation_report;
  const isValid = report ? report.score >= 40 && report.is_agriculture_related : false;

  const handleAction = async (action: 'confirm' | 'reject') => {
    setLoading(true);
    try {
      await confirmAdminRAGFile(file._id, { action, note });
      toast.success(`Đã ${action === 'confirm' ? 'phê duyệt' : 'từ chối'} tài liệu!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error('Lỗi khi thực hiện: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-black/[0.04]">
          <h2 className="text-[18px] font-bold text-[#1d1d1f]">Kiểm duyệt Tri thức</h2>
          <button onClick={onClose} className="p-2 text-[#86868b] hover:bg-black/[0.04] rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <h3 className="text-[13px] font-bold text-[#86868b] uppercase tracking-wider mb-1">Tài liệu</h3>
            <p className="text-[15px] font-semibold text-[#1d1d1f]">{file.title}</p>
          </div>

          {report ? (
            <div className="bg-black/[0.02] rounded-xl p-5 border border-black/[0.04]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-[#1d1d1f]">Báo cáo từ AI (Gemini)</h3>
                <div
                  className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                    isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isValid ? 'Hợp lệ' : 'Không hợp lệ'}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[12px] font-bold text-[#86868b] mb-1">Độ tin cậy</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-black/[0.04] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          report.score >= 80 ? 'bg-emerald-500' : report.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${report.score}%` }}
                      />
                    </div>
                    <span className="text-[13px] font-bold">{report.score}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-bold">
                  <span className={report.is_agriculture_related ? 'text-emerald-700' : 'text-red-700'}>
                    {report.is_agriculture_related ? 'Liên quan nông nghiệp' : 'Không liên quan nông nghiệp'}
                  </span>
                  <span className={report.category_match ? 'text-emerald-700' : 'text-amber-700'}>
                    {report.category_match ? 'Đúng danh mục' : 'Lệch danh mục'}
                  </span>
                </div>

                <div>
                  <div className="text-[12px] font-bold text-[#86868b] mb-1">Lý do / Phân tích</div>
                  <p className="text-[13px] text-[#1d1d1f] leading-relaxed">
                    {report.rejection_reason || 'Không có lý do từ chối.'}
                  </p>
                </div>

                {report.warnings && report.warnings.length > 0 && (
                  <div>
                    <div className="text-[12px] font-bold text-[#86868b] mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-amber-500" /> Cảnh báo
                    </div>
                    <ul className="list-disc pl-4 space-y-1">
                      {report.warnings.map((w, i) => (
                        <li key={i} className="text-[13px] text-amber-700">{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-[14px] flex items-center gap-2">
              <AlertTriangle size={18} />
              <span>Chưa có báo cáo kiểm định từ AI.</span>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-bold text-[#1d1d1f] mb-1.5">Ghi chú duyệt (Tùy chọn)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Nhập ghi chú cho quyết định của bạn..."
              className="w-full px-4 py-3 bg-black/[0.02] border border-black/[0.04] rounded-xl text-[14px] focus:outline-none focus:border-[#08A855] focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-black/[0.04] flex justify-end gap-3 bg-[#fcfcfd]">
          <button
            onClick={() => handleAction('reject')}
            disabled={loading}
            className="px-5 py-2.5 text-[14px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <XCircle size={18} /> Từ chối
          </button>
          <button
            onClick={() => handleAction('confirm')}
            disabled={loading}
            className="px-5 py-2.5 text-[14px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle size={18} /> Phê duyệt
          </button>
        </div>
      </div>
    </div>
  );
};
