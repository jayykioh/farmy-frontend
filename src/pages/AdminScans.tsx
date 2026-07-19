import React, { useEffect, useState } from 'react';
import { getAdminScans } from '../api/admin';
import { FileSearch, Calendar, AlertCircle, ImageIcon, X, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

type ScanLog = {
  _id: string;
  user_id: { name: string; email: string } | null;
  crop_type: string;
  status: 'completed' | 'failed';
  diagnosis?: {
    is_plant: boolean;
    disease_name?: string;
    confidence?: number;
    symptoms?: string[];
  };
  imageUrl?: string;
  thumbnailUrl?: string;
  model_used?: string;
  latency_ms?: number;
  created_at: string;
};

export const AdminScans: React.FC = () => {
  const [scans, setScans] = useState<ScanLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // States for full-screen image viewer modal
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedScanDetail, setSelectedScanDetail] = useState<ScanLog | null>(null);

  const fetchScans = () => {
    setLoading(true);
    getAdminScans({ page, limit: 10 })
      .then((res) => {
        setScans(res.scans);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        toast.error('Lỗi khi tải nhật ký quét: ' + (err.message || err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchScans();
  }, [page]);

  return (
    <div className="bg-white rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.01)] overflow-hidden">
      {/* Scans Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fcfcfd] border-b border-black/[0.03] text-[#86868b] text-[12px] font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Ảnh</th>
              <th className="py-4 px-6">Nông dân</th>
              <th className="py-4 px-6">Cây trồng & Bệnh</th>
              <th className="py-4 px-6">Độ tin cậy</th>
              <th className="py-4 px-6">Thông số</th>
              <th className="py-4 px-6">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.03]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#08A855] mx-auto"></div>
                </td>
              </tr>
            ) : scans.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <AlertCircle size={28} className="text-[#86868b] mx-auto mb-2" />
                  <p className="text-[#86868b] text-[14px]">Chưa có lịch sử quét sâu bệnh nào</p>
                </td>
              </tr>
            ) : (
              scans.map((scan) => {
                const disease = scan.diagnosis?.disease_name || 'Khỏe mạnh / Không có bệnh';
                const confidence = scan.diagnosis?.confidence 
                  ? `${Math.round(scan.diagnosis.confidence * 100)}%` 
                  : 'N/A';

                return (
                  <tr key={scan._id} className="hover:bg-black/[0.01] transition-all text-[#1d1d1f] text-[14px]">
                    <td className="py-4 px-6">
                      {scan.imageUrl || scan.thumbnailUrl ? (
                        <div 
                          onClick={() => {
                            setSelectedImage(scan.imageUrl || scan.thumbnailUrl || null);
                            setSelectedScanDetail(scan);
                          }}
                          className="w-12 h-12 rounded-xl bg-slate-100 border border-black/[0.06] overflow-hidden cursor-pointer hover:opacity-80 active:scale-95 transition-all flex items-center justify-center relative group"
                        >
                          <img 
                            src={scan.thumbnailUrl || scan.imageUrl} 
                            alt="Crop Scan" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <ImageIcon size={14} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#86868b]">
                          <FileSearch size={18} />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {scan.user_id ? (
                        <div className="flex flex-col">
                          <span className="font-bold">{scan.user_id.name}</span>
                          <span className="text-[12px] text-[#86868b] font-medium">{scan.user_id.email}</span>
                        </div>
                      ) : (
                        <span className="text-[#86868b]">Vô danh</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#08A855]">{scan.crop_type}</span>
                        <span className="text-[13px] text-[#1d1d1f] font-semibold">{disease}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {scan.status === 'failed' ? (
                        <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[11px] font-bold">Thất bại</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-bold">{confidence}</span>
                          <span className="text-[11px] text-[#86868b] font-medium">Độ chính xác</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-[12px] text-[#86868b] font-medium">
                        <span className="flex items-center gap-1">
                          <Cpu size={12} />
                          {scan.model_used || 'Gemini 1.5'}
                        </span>
                        <span>Độ trễ: {scan.latency_ms ? `${scan.latency_ms}ms` : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-[#86868b] text-[13px] font-medium">
                        <Calendar size={14} />
                        <span>{new Date(scan.created_at).toLocaleString('vi-VN')}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="p-5 border-t border-black/[0.03] flex items-center justify-between">
          <span className="text-[13.5px] text-[#86868b] font-medium">
            Hiển thị {scans.length} trên tổng số {total} lượt quét
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3.5 py-1.5 border border-black/[0.08] text-[13px] font-bold rounded-xl hover:bg-black/[0.02] disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              Trang trước
            </button>
            <span className="text-[13px] text-[#1d1d1f] font-bold px-2">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3.5 py-1.5 border border-black/[0.08] text-[13px] font-bold rounded-xl hover:bg-black/[0.02] disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      {/* Image Viewer & Details Modal */}
      {selectedImage && selectedScanDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.05]">
              <h3 className="font-bold text-lg text-[#1d1d1f]">Chẩn đoán chi tiết</h3>
              <button 
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedScanDetail(null);
                }}
                className="p-1 text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-black/[0.05]">
              {/* Image View */}
              <div className="flex-1 bg-[#1d1d1f] flex items-center justify-center p-4 aspect-square md:aspect-auto md:h-[400px]">
                <img 
                  src={selectedImage} 
                  alt="Full Scan" 
                  className="max-w-full max-h-full object-contain rounded-lg" 
                />
              </div>
              {/* Diagnostic Text */}
              <div className="w-full md:w-[320px] p-6 flex flex-col gap-4 overflow-y-auto max-h-[300px] md:max-h-[400px]">
                <div>
                  <span className="text-[12px] text-[#86868b] font-medium">Cây trồng</span>
                  <p className="font-bold text-[#08A855] text-lg">{selectedScanDetail.crop_type}</p>
                </div>
                <div>
                  <span className="text-[12px] text-[#86868b] font-medium">Bệnh chẩn đoán</span>
                  <p className="font-bold text-[#1d1d1f]">{selectedScanDetail.diagnosis?.disease_name || 'Khỏe mạnh'}</p>
                </div>
                <div>
                  <span className="text-[12px] text-[#86868b] font-medium">Độ chính xác</span>
                  <p className="font-bold text-[#1d1d1f]">
                    {selectedScanDetail.diagnosis?.confidence 
                      ? `${Math.round(selectedScanDetail.diagnosis.confidence * 100)}%` 
                      : 'N/A'}
                  </p>
                </div>
                {selectedScanDetail.diagnosis?.symptoms && selectedScanDetail.diagnosis.symptoms.length > 0 && (
                  <div>
                    <span className="text-[12px] text-[#86868b] font-medium">Triệu chứng</span>
                    <ul className="list-disc pl-4 text-[13px] text-[#1d1d1f] mt-1 space-y-1">
                      {selectedScanDetail.diagnosis.symptoms.map((symptom, idx) => (
                        <li key={idx} className="font-medium">{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="pt-2 border-t border-black/[0.05]">
                  <span className="text-[12px] text-[#86868b] font-medium">Nông dân chụp</span>
                  <p className="font-semibold text-[#1d1d1f] text-[13px]">{selectedScanDetail.user_id?.name || 'Ẩn danh'}</p>
                  <p className="text-[#86868b] text-[11px] font-medium">{selectedScanDetail.user_id?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScans;
