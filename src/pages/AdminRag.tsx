import React, { useEffect, useState } from 'react';
import { getAdminChatSessions, getAdminRAGFiles, deleteAdminRAGFile, validateAdminRAGFile, batchEmbedAdminRAGFiles } from '../api/admin';
import { Database, MessageSquare, Trash2, Calendar, FileText, CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { UploadRAGModal } from '../components/admin/rag/UploadRAGModal';
import { ReviewRAGModal } from '../components/admin/rag/ReviewRAGModal';

type ChatSession = {
  _id: string;
  title: string;
  user_id: { name: string; email: string } | null;
  last_message_at: string;
  created_at: string;
};

type RAGFile = {
  _id: string;
  title: string;
  category: string;
  embed_status: 'pending' | 'processing' | 'done' | 'error';
  validation_status: 'unvalidated' | 'validating' | 'validated' | 'rejected' | 'confirmed';
  validation_report?: any;
  created_at: string;
};

export const AdminRag: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'files'>('sessions');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [files, setFiles] = useState<RAGFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination for chat sessions
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewFile, setReviewFile] = useState<RAGFile | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSessions = () => {
    setLoading(true);
    getAdminChatSessions({ page, limit: 10 })
      .then((res) => {
        setSessions(res.sessions);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        toast.error('Lỗi khi tải phiên chat: ' + (err.message || err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchFiles = () => {
    setLoading(true);
    getAdminRAGFiles()
      .then((res) => {
        setFiles(res);
      })
      .catch((err) => {
        toast.error('Lỗi tải tệp tri thức RAG: ' + (err.message || err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (activeTab === 'sessions') {
      fetchSessions();
    } else {
      fetchFiles();
    }
  }, [activeTab, page]);

  const handleDeleteFile = (fileId: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài liệu tri thức RAG "${title}" không?`)) {
      deleteAdminRAGFile(fileId)
        .then(() => {
          toast.success('Đã xóa tài liệu tri thức thành công!');
          fetchFiles();
        })
        .catch((err) => {
          toast.error('Lỗi khi xóa tài liệu: ' + (err.message || err));
        });
    }
  };

  const getEmbedStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <span title="Đã Vector hóa"><CheckCircle2 size={16} className="text-emerald-500" /></span>;
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" title="Đang xử lý..." />;
      case 'error':
        return <span title="Lỗi Vector hóa"><XCircle size={16} className="text-red-500" /></span>;
      default:
        return <span title="Chờ xử lý"><HelpCircle size={16} className="text-slate-400" /></span>;
    }
  };

  const getValidationBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'validated':
        return <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[11px] font-bold">Hợp lệ</span>;
      case 'validating':
        return <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[11px] font-bold">Đang kiểm định</span>;
      case 'rejected':
        return <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[11px] font-bold">Bị từ chối</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[11px] font-bold">Chưa kiểm định</span>;
    }
  };

  const handleValidate = async (fileId: string) => {
    setActionLoading(fileId);
    try {
      await validateAdminRAGFile(fileId);
      toast.success('Đã gửi yêu cầu kiểm định AI');
      fetchFiles();
    } catch (err: any) {
      toast.error('Lỗi khi kiểm định: ' + (err.message || 'Unknown error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleBatchEmbed = async () => {
    try {
      const res = await batchEmbedAdminRAGFiles();
      toast.success(res.message || 'Đã gửi yêu cầu đồng bộ Vector DB');
      fetchFiles();
    } catch (err: any) {
      toast.error('Lỗi khi đồng bộ: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.01)] overflow-hidden">
      {/* Tab Switcher Header */}
      <div className="flex border-b border-black/[0.04]">
        <button
          onClick={() => {
            setActiveTab('sessions');
            setPage(1);
          }}
          className={`flex items-center gap-2 px-6 py-4 text-[14px] font-bold border-b-2 transition-all ${
            activeTab === 'sessions'
              ? 'border-[#08A855] text-[#08A855]'
              : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
          }`}
        >
          <MessageSquare size={16} />
          <span>Phiên Chat AI</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('files');
            setPage(1);
          }}
          className={`flex items-center gap-2 px-6 py-4 text-[14px] font-bold border-b-2 transition-all ${
            activeTab === 'files'
              ? 'border-[#08A855] text-[#08A855]'
              : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
          }`}
        >
          <Database size={16} />
          <span>Tài liệu Tri thức (RAG)</span>
        </button>
      </div>

      {activeTab === 'files' && (
        <div className="flex justify-end gap-3 p-4 border-b border-black/[0.04]">
          <button
            onClick={handleBatchEmbed}
            className="px-4 py-2 text-[13px] font-bold text-[#08A855] bg-[#08A855]/10 hover:bg-[#08A855]/20 rounded-xl transition-all"
          >
            Đồng bộ AI (Batch Embed)
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 text-[13px] font-bold text-white bg-[#08A855] hover:bg-[#08A855]/90 rounded-xl transition-all shadow-sm"
          >
            Tải lên Tri thức
          </button>
        </div>
      )}

      {/* Sessions Tab Content */}
      {activeTab === 'sessions' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfcfd] border-b border-black/[0.03] text-[#86868b] text-[12px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Tiêu đề cuộc hội thoại</th>
                <th className="py-4 px-6">Nông dân</th>
                <th className="py-4 px-6">Hoạt động cuối</th>
                <th className="py-4 px-6">Ngày khởi tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#08A855] mx-auto"></div>
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <AlertCircle size={28} className="text-[#86868b] mx-auto mb-2" />
                    <p className="text-[#86868b] text-[14px]">Chưa có phiên chat AI nào được thực hiện</p>
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session._id} className="hover:bg-black/[0.01] transition-all text-[#1d1d1f] text-[14px]">
                    <td className="py-4 px-6 font-bold flex items-center gap-2">
                      <MessageSquare size={16} className="text-[#86868b]" />
                      <span>{session.title || 'Hội thoại chưa đặt tên'}</span>
                    </td>
                    <td className="py-4 px-6">
                      {session.user_id ? (
                        <div className="flex flex-col">
                          <span className="font-semibold">{session.user_id.name}</span>
                          <span className="text-[12px] text-[#86868b] font-medium">{session.user_id.email}</span>
                        </div>
                      ) : (
                        <span className="text-[#86868b] font-medium">Ẩn danh</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-[#86868b] text-[13px] font-medium">
                        <Calendar size={14} />
                        <span>{new Date(session.last_message_at).toLocaleString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-[#86868b] text-[13px] font-medium">
                        <Calendar size={14} />
                        <span>{new Date(session.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          {!loading && totalPages > 1 && (
            <div className="p-5 border-t border-black/[0.03] flex items-center justify-end gap-2">
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
          )}
        </div>
      )}

      {/* Files Tab Content */}
      {activeTab === 'files' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfcfd] border-b border-black/[0.03] text-[#86868b] text-[12px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Tiêu đề tài liệu</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Kiểm định</th>
                <th className="py-4 px-6">Trạng thái Vector</th>
                <th className="py-4 px-6">Ngày cập nhật</th>
                <th className="py-4 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.03]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#08A855] mx-auto"></div>
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <AlertCircle size={28} className="text-[#86868b] mx-auto mb-2" />
                    <p className="text-[#86868b] text-[14px]">Không có tài liệu tri thức RAG nào</p>
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file._id} className="hover:bg-black/[0.01] transition-all text-[#1d1d1f] text-[14px]">
                    <td className="py-4 px-6 font-bold flex items-center gap-2">
                      <FileText size={16} className="text-indigo-500" />
                      <span className="line-clamp-1">{file.title}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{file.category}</td>
                    <td className="py-4 px-6">{getValidationBadge(file.validation_status)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 font-medium">
                        {getEmbedStatusIcon(file.embed_status)}
                        <span className="capitalize text-[13px]">{file.embed_status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-[#86868b] text-[13px] font-medium">
                        <Calendar size={14} />
                        <span>{new Date(file.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {file.validation_status === 'unvalidated' && (
                          <button
                            onClick={() => handleValidate(file._id)}
                            disabled={actionLoading === file._id}
                            className="px-3 py-1.5 text-[12px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-50"
                          >
                            {actionLoading === file._id ? 'Đang gửi...' : 'Gửi AI Check'}
                          </button>
                        )}
                        {(file.validation_status === 'validated' || file.validation_status === 'rejected') && (
                          <button
                            onClick={() => {
                              setReviewFile(file);
                              setIsReviewOpen(true);
                            }}
                            className="px-3 py-1.5 text-[12px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all"
                          >
                            Xem xét
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteFile(file._id, file.title)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full active:scale-95 transition-all inline-flex items-center"
                          title="Xóa tri thức"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <UploadRAGModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchFiles}
      />
      
      <ReviewRAGModal
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setReviewFile(null);
        }}
        file={reviewFile}
        onSuccess={fetchFiles}
      />
    </div>
  );
};

export default AdminRag;
