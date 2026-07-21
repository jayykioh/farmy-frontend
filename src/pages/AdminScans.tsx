import React, { useEffect, useState } from 'react';
import { getAdminScans } from '../api/admin';
import { FileMagnifyingGlass, Calendar, WarningCircle, Image, X, Cpu } from '@phosphor-icons/react';
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
    <div className="card-bubble bg-white rounded-3xl border-2 border-border-main shadow-xs overflow-hidden text-left font-sans">
      {/* Scans Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-surface-1 border-b-2 border-border-main text-text-secondary text-xs font-black uppercase tracking-wider">
              <th className="py-4 px-6">Ảnh lá cây</th>
              <th className="py-4 px-6">Nông dân</th>
              <th className="py-4 px-6">Cây trồng & Bệnh</th>
              <th className="py-4 px-6">Độ tin cậy</th>
              <th className="py-4 px-6">Thông số kĩ thuật</th>
              <th className="py-4 px-6">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border-main/40">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-border-main border-t-[#008A5E] mx-auto"></div>
                </td>
              </tr>
            ) : scans.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <WarningCircle size={32} weight="duotone" className="text-text-secondary mx-auto mb-2" />
                  <p className="text-text-secondary font-bold text-sm">Chưa có lịch sử quét sâu bệnh nào</p>
                </td>
              </tr>
            ) : (
              scans.map((scan) => {
                const disease = scan.diagnosis?.disease_name || 'Khỏe mạnh / Không có bệnh';
                const confidence = scan.diagnosis?.confidence 
                  ? `${Math.round(scan.diagnosis.confidence * 100)}%` 
                  : 'N/A';

                return (
                  <tr key={scan._id} className="hover:bg-bg-surface-1/50 transition-colors text-text-main text-sm font-bold">
                    <td className="py-4 px-6">
                      {scan.imageUrl || scan.thumbnailUrl ? (
                        <div 
                          onClick={() => {
                            setSelectedImage(scan.imageUrl || scan.thumbnailUrl || null);
                            setSelectedScanDetail(scan);
                          }}
                          className="w-12 h-12 rounded-2xl bg-bg-surface-2 border-2 border-border-main overflow-hidden cursor-pointer hover:opacity-80 active:scale-95 transition-all flex items-center justify-center relative group shadow-xs"
                        >
                          <img 
                            src={scan.thumbnailUrl || scan.imageUrl} 
                            alt={scan.crop_type || 'Mẫu quét'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-bg-surface-2 border-2 border-border-main flex items-center justify-center text-text-secondary">
                          <Image size={20} weight="duotone" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {scan.user_id ? (
                        <div className="flex flex-col">
                          <span className="font-black text-text-h">{scan.user_id.name}</span>
                          <span className="text-xs text-text-secondary font-bold">{scan.user_id.email}</span>
                        </div>
                      ) : (
                        <span className="text-text-secondary italic text-xs font-bold">Khách vãng lai</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-black text-text-h capitalize">{scan.crop_type || 'Không xác định'}</span>
                        <span className="text-xs text-[#008A5E] font-black">{disease}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-black">
                        {confidence}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-xs text-text-secondary font-bold">
                        <span className="flex items-center gap-1">
                          <Cpu size={12} weight="bold" className="text-[#008A5E]" />
                          {scan.model_used || 'Gemini Vision'}
                        </span>
                        <span>Độ trễ: {scan.latency_ms ? `${scan.latency_ms}ms` : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs font-bold text-text-secondary">
                      {new Date(scan.created_at).toLocaleString('vi-VN')}
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
        <div className="p-5 border-t-2 border-border-main flex items-center justify-between">
          <span className="text-xs font-bold text-text-secondary">
            Hiển thị {scans.length} trên tổng số {total} lượt quét
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="btn btn--soft active:scale-95 rounded-2xl px-3.5 py-1.5 text-xs font-black border-2 border-border-main cursor-pointer disabled:opacity-40"
            >
              Trang trước
            </button>
            <span className="text-xs text-text-h font-black px-2">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="btn btn--soft active:scale-95 rounded-2xl px-3.5 py-1.5 text-xs font-black border-2 border-border-main cursor-pointer disabled:opacity-40"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      {/* Detail Image Modal */}
      {selectedImage && selectedScanDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="card-bubble bg-white rounded-3xl border-2 border-border-main max-w-xl w-full p-6 shadow-2xl relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-border-main pb-3">
              <h3 className="font-black text-lg text-text-h flex items-center gap-2">
                <FileMagnifyingGlass size={20} weight="duotone" className="text-[#008A5E]" />
                <span>Chi tiết lượt soi PlantScan</span>
              </h3>
              <button 
                onClick={() => {
                  setSelectedImage(null);
                  setSelectedScanDetail(null);
                }}
                className="p-1.5 text-text-secondary hover:text-text-main bg-bg-surface-2 rounded-full border border-border-main/50 active:scale-95 transition-all cursor-pointer"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="w-full h-64 bg-bg-surface-1 rounded-2xl border-2 border-border-main overflow-hidden relative flex items-center justify-center">
              <img src={selectedImage} alt="Mẫu bệnh" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-2 text-xs font-bold text-text-main">
              <div className="flex justify-between py-1 border-b border-border-main/40">
                <span className="text-text-secondary">Loại cây:</span>
                <span className="font-black text-text-h capitalize">{selectedScanDetail.crop_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-main/40">
                <span className="text-text-secondary">Chẩn đoán:</span>
                <span className="font-black text-[#008A5E]">{selectedScanDetail.diagnosis?.disease_name || 'Khỏe mạnh'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-main/40">
                <span className="text-text-secondary">Độ tin cậy:</span>
                <span className="font-black text-emerald-700">
                  {selectedScanDetail.diagnosis?.confidence ? `${Math.round(selectedScanDetail.diagnosis.confidence * 100)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-main/40">
                <span className="text-text-secondary">Nông dân gửi:</span>
                <span className="font-black text-text-h">{selectedScanDetail.user_id?.name || 'Khách vãng lai'} ({selectedScanDetail.user_id?.email || 'N/A'})</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedImage(null);
                setSelectedScanDetail(null);
              }}
              className="btn btn--cyan active:scale-95 rounded-2xl w-full py-3 text-sm font-black cursor-pointer shadow-xs mt-2"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminScans;
