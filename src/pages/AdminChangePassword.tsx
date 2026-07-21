/* Hallmark · page: admin-change-password · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { changeAdminPassword } from '../api/admin';
import { LockKey, Eye, EyeSlash } from '@phosphor-icons/react';

export const AdminChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Mật khẩu mới phải chứa ít nhất 8 ký tự');
      return;
    }

    const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error('Mật khẩu mới quá yếu! Phải gồm chữ hoa, chữ thường và chữ số.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsSubmitting(true);
    try {
      await changeAdminPassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      toast.success('Đổi mật khẩu thành công! 🎉');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-bubble bg-white border-2 border-border-main rounded-3xl p-6 max-w-lg mx-auto shadow-xs font-sans text-left">
      <h2 className="text-xl font-black text-text-h mb-1 flex items-center gap-2">
        <LockKey size={20} weight="duotone" className="text-[#008A5E]" /> Thay đổi mật khẩu tài khoản
      </h2>
      <p className="text-xs text-text-secondary mb-6 font-bold leading-relaxed">
        Sử dụng mật khẩu mạnh gồm chữ hoa, chữ thường và chữ số để bảo vệ quyền truy cập tài khoản quản trị.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="currentPassword">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              placeholder="Nhập mật khẩu hiện tại..."
              disabled={isSubmitting}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 py-3 px-4 text-base font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E] disabled:opacity-60 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main active:scale-95 transition-transform cursor-pointer"
            >
              {showCurrent ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="newPassword">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNew ? 'text' : 'password'}
              placeholder="Tạo mật khẩu mới an toàn..."
              disabled={isSubmitting}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 py-3 px-4 text-base font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E] disabled:opacity-60 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main active:scale-95 transition-transform cursor-pointer"
            >
              {showNew ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="confirmNewPassword">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu mới..."
              disabled={isSubmitting}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 py-3 px-4 text-base font-extrabold text-text-main outline-none focus:bg-white focus:border-[#008A5E] disabled:opacity-60 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main active:scale-95 transition-transform cursor-pointer"
            >
              {showConfirm ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn--cyan active:scale-95 rounded-2xl w-full py-4 text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 mt-2"
        >
          {isSubmitting ? 'Đang thực hiện...' : 'Cập nhật mật khẩu ngay'}
        </button>
      </form>
    </div>
  );
};

export default AdminChangePassword;
