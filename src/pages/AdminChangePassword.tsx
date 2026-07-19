import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { changeAdminPassword } from '../api/admin';
import { Lock, Eye, EyeOff } from 'lucide-react';

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
    <div className="bg-white border border-border-main/55 rounded-[24px] p-6 max-w-lg mx-auto shadow-sm">
      <h2 className="text-xl font-bold text-text-h mb-2 flex items-center gap-2">
        <Lock className="w-5 h-5 text-[#08a855]" /> Thay đổi mật khẩu tài khoản
      </h2>
      <p className="text-sm text-text-main/70 mb-6 font-medium">
        Đảm bảo sử dụng mật khẩu mạnh có chữ hoa, chữ thường và chữ số để giữ bảo mật cho tài khoản quản trị.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-sm font-bold text-text-main" htmlFor="currentPassword">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              placeholder="Nhập mật khẩu hiện tại"
              disabled={isSubmitting}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-2xl border border-border-main/55 bg-white py-3 px-4 text-base font-semibold shadow-sm outline-none focus:border-primary/45 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-main/40 hover:text-text-main/70 cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-text-main" htmlFor="newPassword">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNew ? 'text' : 'password'}
              placeholder="Nhập mật khẩu mới"
              disabled={isSubmitting}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-border-main/55 bg-white py-3 px-4 text-base font-semibold shadow-sm outline-none focus:border-primary/45 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-main/40 hover:text-text-main/70 cursor-pointer"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-text-main" htmlFor="confirmNewPassword">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu mới"
              disabled={isSubmitting}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-border-main/55 bg-white py-3 px-4 text-base font-semibold shadow-sm outline-none focus:border-primary/45 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-main/40 hover:text-text-main/70 cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full bg-[#08A855] text-white py-3.5 rounded-2xl font-bold hover:bg-[#07964b] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Đang thực hiện...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default AdminChangePassword;
