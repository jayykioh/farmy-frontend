import React, { useState } from 'react';
import { X, UploadCloud, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import { createAdminRAGFile } from '../../../api/admin';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const UploadRAGModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [uploadType, setUploadType] = useState<'file' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sâu bệnh');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (uploadType === 'file') {
        if (!file) {
          toast.error('Vui lòng chọn file (.pdf, .docx, .txt, .json)');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        if (title) formData.append('title', title);

        await createAdminRAGFile(formData);
      } else {
        if (!title || !content) {
          toast.error('Vui lòng nhập đủ tiêu đề và nội dung');
          setLoading(false);
          return;
        }
        await createAdminRAGFile({ title, category, content });
      }

      toast.success('Đã tải lên tài liệu tri thức thành công!');
      setFile(null);
      setTitle('');
      setContent('');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error('Lỗi khi tải lên: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-black/[0.04]">
          <h2 className="text-[18px] font-bold text-[#1d1d1f]">Tải lên Tri thức mới</h2>
          <button onClick={onClose} className="p-2 text-[#86868b] hover:bg-black/[0.04] rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {/* Upload Type Selector */}
          <div className="flex bg-black/[0.03] p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setUploadType('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[14px] font-bold rounded-lg transition-all ${
                uploadType === 'file' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-[#86868b]'
              }`}
            >
              <UploadCloud size={16} /> File đính kèm
            </button>
            <button
              type="button"
              onClick={() => setUploadType('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[14px] font-bold rounded-lg transition-all ${
                uploadType === 'text' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-[#86868b]'
              }`}
            >
              <Type size={16} /> Nhập thủ công
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1d1d1f] mb-1.5">Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-black/[0.02] border border-black/[0.04] rounded-xl text-[14px] focus:outline-none focus:border-[#08A855] focus:bg-white transition-all"
              >
                <option value="Sâu bệnh">Sâu bệnh</option>
                <option value="Phân bón">Phân bón</option>
                <option value="Kỹ thuật trồng trọt">Kỹ thuật trồng trọt</option>
                <option value="Chính sách">Chính sách & Quy định</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {uploadType === 'file' ? (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-[#1d1d1f] mb-1.5">Tiêu đề (Tùy chọn)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Để trống sẽ lấy tên file"
                    className="w-full px-4 py-3 bg-black/[0.02] border border-black/[0.04] rounded-xl text-[14px] focus:outline-none focus:border-[#08A855] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#1d1d1f] mb-1.5">Chọn File</label>
                  <div className="border-2 border-dashed border-black/[0.08] rounded-xl p-8 text-center hover:bg-black/[0.01] transition-all">
                    <input
                      type="file"
                      id="rag-file"
                      className="hidden"
                      accept=".pdf,.docx,.doc,.txt,.json"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="rag-file" className="cursor-pointer flex flex-col items-center">
                      <UploadCloud size={32} className="text-[#08A855] mb-3" />
                      <span className="text-[14px] font-bold text-[#1d1d1f]">
                        {file ? file.name : 'Nhấn để chọn file'}
                      </span>
                      <span className="text-[12px] text-[#86868b] mt-1">Hỗ trợ PDF, DOCX, TXT, JSON (Tối đa 10MB)</span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[13px] font-bold text-[#1d1d1f] mb-1.5">Tiêu đề tài liệu *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Hướng dẫn trồng lúa nước..."
                    className="w-full px-4 py-3 bg-black/[0.02] border border-black/[0.04] rounded-xl text-[14px] focus:outline-none focus:border-[#08A855] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#1d1d1f] mb-1.5">Nội dung *</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    placeholder="Nhập nội dung tri thức..."
                    className="w-full px-4 py-3 bg-black/[0.02] border border-black/[0.04] rounded-xl text-[14px] focus:outline-none focus:border-[#08A855] focus:bg-white transition-all resize-none"
                  />
                </div>
              </>
            )}
          </div>
        </form>

        <div className="p-6 border-t border-black/[0.04] flex justify-end gap-3 bg-[#fcfcfd]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-[14px] font-bold text-[#1d1d1f] hover:bg-black/[0.04] rounded-xl transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 text-[14px] font-bold text-white bg-[#08A855] hover:bg-[#08A855]/90 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            Tải lên
          </button>
        </div>
      </div>
    </div>
  );
};
