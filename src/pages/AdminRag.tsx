/* Hallmark · page: admin-rag · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect, useState } from 'react';
import { getAdminChatSessions, getAdminRAGFiles, deleteAdminRAGFile, validateAdminRAGFile, batchEmbedAdminRAGFiles } from '../api/admin';
import { Database, ChatText, Trash, Calendar, FileText, CheckCircle, XCircle, WarningCircle, Question, UploadSimple, Checks, Play, Funnel } from '@phosphor-icons/react';
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

  // Filters for RAG files
  const [fileSort, setFileSort] = useState<string>('created_at_desc');
  const [minScore, setMinScore] = useState<string>('');
  const [maxScore, setMaxScore] = useState<string>('');

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
    const params: any = { sort: fileSort };
    if (minScore) params.min_score = Number(minScore);
    if (maxScore) params.max_score = Number(maxScore);

    getAdminRAGFiles(params)
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
        return <span title="Đã Vector hóa"><CheckCircle size={18} weight="bold" className="text-emerald-600" /></span>;
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-border-main border-t-[#008A5E]" title="Đang xử lý..." />;
      case 'error':
        return <span title="Lỗi Vector hóa"><XCircle size={18} weight="bold" className="text-red-500" /></span>;
      default:
        return <span title="Chờ xử lý"><Question size={18} weight="bold" className="text-text-secondary" /></span>;
    }
  };

  const getValidationBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'validated':
        return <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-black">Đã kiểm duyệt</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 bg-red-100 text-red-800 border border-red-300 rounded-full text-xs font-black">Từ chối</span>;
      case 'validating':
        return <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-300 rounded-full text-xs font-black">Đang kiểm duyệt...</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-black">Chưa kiểm duyệt</span>;
    }
  };

  const handleValidateFile = (fileId: string) => {
    setActionLoading(fileId);
    validateAdminRAGFile(fileId)
      .then((res) => {
        toast.success(res.message || 'Kiểm duyệt hoàn tất!');
        fetchFiles();
      })
      .catch((err) => {
        toast.error('Lỗi kiểm duyệt: ' + (err.message || err));
      })
      .finally(() => {
        setActionLoading(null);
      });
  };

  const handleBatchEmbed = () => {
    setActionLoading('batch_embed');
    batchEmbedAdminRAGFiles()
      .then((res) => {
        toast.success(res.message || 'Đã bắt đầu nhúng Vector hàng loạt!');
        fetchFiles();
      })
      .catch((err) => {
        toast.error('Lỗi nhúng hàng loạt: ' + (err.message || err));
      })
      .finally(() => {
        setActionLoading(null);
      });
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left font-sans">
      {/* Tabs & Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 card-bubble bg-white p-4 border-2 border-border-main shadow-xs rounded-3xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('sessions');
              setPage(1);
            }}
            className={`btn active:scale-95 rounded-2xl px-4 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer ${
              activeTab === 'sessions' ? 'btn--cyan' : 'btn--soft border-2 border-border-main'
            }`}
          >
            <ChatText size={16} weight="bold" />
            Hội thoại AI ({sessions.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('files');
              setPage(1);
            }}
            className={`btn active:scale-95 rounded-2xl px-4 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer ${
              activeTab === 'files' ? 'btn--cyan' : 'btn--soft border-2 border-border-main'
            }`}
          >
            <Database size={16} weight="bold" />
            Kho Tri Thức RAG ({files.length})
          </button>
        </div>

        {activeTab === 'files' && (
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 w-full sm:w-auto">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 bg-bg-surface-1 p-2 rounded-2xl border-2 border-border-main">
              <Funnel size={16} weight="bold" className="text-text-secondary ml-1" />
              <select
                value={fileSort}
                onChange={(e) => setFileSort(e.target.value)}
                className="bg-white border-2 border-border-main rounded-xl px-2 py-1.5 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="created_at_desc">Mới nhất</option>
                <option value="created_at_asc">Cũ nhất</option>
                <option value="score_desc">Điểm AI cao</option>
                <option value="score_asc">Điểm AI thấp</option>
              </select>

              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  className="bg-white border-2 border-border-main rounded-xl px-2 py-1.5 text-xs font-bold outline-none w-16"
                  min="0"
                  max="100"
                />
                <span className="text-text-secondary text-xs font-black">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  className="bg-white border-2 border-border-main rounded-xl px-2 py-1.5 text-xs font-bold outline-none w-16"
                  min="0"
                  max="100"
                />
              </div>
              
              <button
                onClick={fetchFiles}
                className="btn btn--soft active:scale-95 rounded-xl px-3 py-1.5 text-xs font-black border-2 border-border-main cursor-pointer"
              >
                Lọc
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 xl:ml-auto">
              <button
                onClick={handleBatchEmbed}
                disabled={actionLoading === 'batch_embed'}
                className="btn active:scale-95 rounded-2xl px-4 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play size={16} weight="bold" />
                Nhúng Vector
              </button>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="btn btn--cyan active:scale-95 rounded-2xl px-4 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <UploadSimple size={16} weight="bold" />
                Tải lên
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="card-bubble bg-white rounded-3xl border-2 border-border-main shadow-xs overflow-hidden">
        {activeTab === 'sessions' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-surface-1 border-b-2 border-border-main text-text-secondary text-xs font-black uppercase tracking-wider">
                  <th className="py-4 px-6">Tiêu đề hội thoại</th>
                  <th className="py-4 px-6">Nông dân</th>
                  <th className="py-4 px-6">Tin nhắn cuối</th>
                  <th className="py-4 px-6">Ngày khởi tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border-main/40">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-border-main border-t-[#008A5E] mx-auto"></div>
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <WarningCircle size={32} weight="duotone" className="text-text-secondary mx-auto mb-2" />
                      <p className="text-text-secondary font-bold text-sm">Chưa có phiên trò chuyện nào</p>
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr key={session._id} className="hover:bg-bg-surface-1/50 transition-colors text-text-main text-sm font-bold">
                      <td className="py-4 px-6">
                        <span className="font-black text-text-h flex items-center gap-2">
                          <ChatText size={16} weight="duotone" className="text-[#008A5E]" />
                          {session.title || 'Hội thoại không tên'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {session.user_id ? (
                          <div className="flex flex-col">
                            <span className="font-black text-text-h">{session.user_id.name}</span>
                            <span className="text-xs text-text-secondary font-bold">{session.user_id.email}</span>
                          </div>
                        ) : (
                          <span className="text-text-secondary italic text-xs font-bold">Khách vãng lai</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-text-secondary">
                        {new Date(session.last_message_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-text-secondary">
                        {new Date(session.created_at).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-surface-1 border-b-2 border-border-main text-text-secondary text-xs font-black uppercase tracking-wider">
                  <th className="py-4 px-6">Tài liệu tri thức</th>
                  <th className="py-4 px-6">Danh mục</th>
                  <th className="py-4 px-6">Trạng thái Nhúng Vector</th>
                  <th className="py-4 px-6">Kiểm duyệt AI</th>
                  <th className="py-4 px-6 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border-main/40">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-border-main border-t-[#008A5E] mx-auto"></div>
                    </td>
                  </tr>
                ) : files.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <WarningCircle size={32} weight="duotone" className="text-text-secondary mx-auto mb-2" />
                      <p className="text-text-secondary font-bold text-sm">Chưa có tài liệu RAG nào được tải lên</p>
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file._id} className="hover:bg-bg-surface-1/50 transition-colors text-text-main text-sm font-bold">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <FileText size={18} weight="duotone" className="text-[#008A5E] shrink-0" />
                          <span className="font-black text-text-h">{file.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-bg-surface-2 border border-border-main rounded-xl text-xs font-black text-text-secondary">
                          {file.category || 'Nông nghiệp chung'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getEmbedStatusIcon(file.embed_status)}
                          <span className="text-xs font-black uppercase text-text-secondary">{file.embed_status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getValidationBadge(file.validation_status)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setReviewFile(file);
                              setIsReviewOpen(true);
                            }}
                            className="btn btn--soft active:scale-95 rounded-2xl px-2.5 py-1 text-xs font-black border border-border-main cursor-pointer"
                          >
                            Xem báo cáo
                          </button>
                          <button
                            onClick={() => handleValidateFile(file._id)}
                            disabled={actionLoading === file._id}
                            className="p-1.5 text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-2xl hover:bg-emerald-200 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            title="Chạy kiểm duyệt RAG"
                          >
                            <Checks size={16} weight="bold" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file._id, file.title)}
                            className="p-1.5 text-red-800 bg-red-100 border border-red-300 rounded-2xl hover:bg-red-200 active:scale-95 transition-all cursor-pointer"
                            title="Xóa tài liệu"
                          >
                            <Trash size={16} weight="bold" />
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

        {/* Pagination Footer for Sessions */}
        {activeTab === 'sessions' && !loading && totalPages > 1 && (
          <div className="p-5 border-t-2 border-border-main flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary">
              Hiển thị {sessions.length} phiên trò chuyện
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
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <UploadRAGModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={() => {
            fetchFiles();
            setIsUploadOpen(false);
          }}
        />
      )}

      {/* Review Modal */}
      {isReviewOpen && reviewFile && (
        <ReviewRAGModal
          isOpen={isReviewOpen}
          file={reviewFile}
          onClose={() => {
            setIsReviewOpen(false);
            setReviewFile(null);
          }}
          onSuccess={() => {
            fetchFiles();
          }}
        />
      )}
    </div>
  );
};

export default AdminRag;
