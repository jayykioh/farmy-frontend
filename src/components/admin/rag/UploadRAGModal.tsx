import React, { useState } from 'react';
import { X, CloudArrowUp, TextT } from '@phosphor-icons/react';
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
          toast.error('Vui lòng chọn file (.pdf, .docx, .json)');
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
          <button onClick={onClose} className="p-2 text-[#86868b] hover:bg-black/[0.04] rounded-full transition-all active:scale-95">
            <X size={20} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {/* Upload Type Selector */}
          <div className="flex bg-black/[0.03] p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setUploadType('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[14px] font-bold rounded-2xl transition-all active:scale-95 ${
                uploadType === 'file' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-[#86868b]'
              }`}
            >
              <CloudArrowUp size={16} weight="bold" /> File đính kèm
            </button>
            <button
              type="button"
              onClick={() => setUploadType('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-[14px] font-bold rounded-2xl transition-all active:scale-95 ${
                uploadType === 'text' ? 'bg-white shadow-sm text-[#1d1d1f]' : 'text-[#86868b]'
              }`}
            >
              <TextT size={16} weight="bold" /> Nhập thủ công
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-h mb-1.5">Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-bg-surface-1 border-2 border-border-main rounded-2xl text-sm font-medium focus:outline-none focus:border-[#008A5E] focus:bg-white transition-all"
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
                  <label className="block text-xs font-bold text-text-h mb-1.5">Tiêu đề (Tùy chọn)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Để trống sẽ lấy tên file"
                    className="w-full px-4 py-3 bg-bg-surface-1 border-2 border-border-main rounded-2xl text-sm font-medium focus:outline-none focus:border-[#008A5E] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-h mb-1.5">Chọn File</label>
                  <div className="border-2 border-dashed border-border-main rounded-2xl p-8 text-center hover:bg-bg-surface-1 transition-all">
                    <input
                      type="file"
                      id="rag-file"
                      className="hidden"
                      accept=".pdf,.docx,.json"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="rag-file" className="cursor-pointer flex flex-col items-center">
                      <CloudArrowUp size={32} weight="duotone" className="text-[#008A5E] mb-3" />
                      <span className="text-sm font-bold text-text-h">
                        {file ? file.name : 'Nhấn để chọn file'}
                      </span>
                      <span className="text-xs text-text-secondary mt-1 font-medium">Hỗ trợ PDF, DOCX, JSON (Tối đa 10MB)</span>
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-text-h mb-1.5">Tiêu đề tài liệu *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Hướng dẫn trồng lúa nước..."
                    className="w-full px-4 py-3 bg-bg-surface-1 border-2 border-border-main rounded-2xl text-sm font-medium focus:outline-none focus:border-[#008A5E] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-h mb-1.5">Nội dung *</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    placeholder="Nhập nội dung tri thức..."
                    className="w-full px-4 py-3 bg-bg-surface-1 border-2 border-border-main rounded-2xl text-sm font-medium focus:outline-none focus:border-[#008A5E] focus:bg-white transition-all resize-none"
                  />
                </div>
              </>
            )}
          </div>
        </form>

        <div className="p-6 border-t-2 border-border-main flex justify-end gap-3 bg-bg-surface-1">
          <button
            type="button"
            onClick={onClose}
            className="btn btn--soft text-sm font-bold active:scale-95 rounded-2xl"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn--cyan text-sm font-extrabold active:scale-95 rounded-2xl flex items-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            Tải lên
          </button>
        </div>
      </div>
    </div>
  );
};
