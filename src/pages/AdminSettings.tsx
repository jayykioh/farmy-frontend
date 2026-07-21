/* Hallmark · page: admin-settings · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useEffect, useState } from 'react';
import { getAdminConfig, updateAdminConfig } from '../api/admin';
import { Gear, ShieldWarning, Cpu, FloppyDisk, Warning, ToggleLeft, ToggleRight } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export const AdminSettings: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [rateLimit, setRateLimit] = useState(100);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminConfig()
      .then((res) => {
        setMaintenanceMode(res.maintenanceMode);
        setRateLimit(res.rateLimit);
      })
      .catch((err) => {
        toast.error('Lỗi tải cấu hình hệ thống: ' + (err.message || err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    updateAdminConfig({ maintenanceMode, rateLimit })
      .then((res) => {
        toast.success('Cập nhật cấu hình hệ thống thành công!');
        setMaintenanceMode(res.maintenanceMode);
        setRateLimit(res.rateLimit);
      })
      .catch((err) => {
        toast.error('Lỗi lưu cấu hình: ' + (err.message || err));
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-border-main border-t-[#008A5E]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto card-bubble bg-white rounded-3xl border-2 border-border-main shadow-xs overflow-hidden text-left font-sans">
      <div className="p-6 border-b-2 border-border-main">
        <h2 className="font-black text-xl text-text-h flex items-center gap-2">
          <Gear size={22} weight="duotone" className="text-[#008A5E]" />
          <span>Cấu hình vận hành hệ thống</span>
        </h2>
        <p className="text-text-secondary text-xs font-bold mt-1">
          Quản lý các trạng thái hoạt động trực tiếp của ứng dụng FARMY. Thay đổi có hiệu lực ngay lập tức.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
        {/* Maintenance Mode Option */}
        <div className="flex items-start justify-between gap-4 p-5 rounded-2xl bg-bg-surface-1 border-2 border-border-main">
          <div className="flex flex-col">
            <span className="font-black text-text-h text-base flex items-center gap-2">
              <ShieldWarning size={18} weight="bold" className="text-amber-500" />
              Chế độ bảo trì hệ thống (Maintenance Mode)
            </span>
            <span className="text-text-secondary text-xs font-bold mt-1 max-w-md leading-relaxed">
              Khi bật, người dùng sẽ thấy thông báo "Hệ thống đang bảo trì" và không thể truy cập ứng dụng. Chỉ tài khoản quản trị mới có thể sử dụng.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className="text-[#008A5E] focus:outline-none active:scale-95 transition-all cursor-pointer shrink-0"
          >
            {maintenanceMode ? (
              <ToggleRight size={48} weight="bold" className="text-red-500" />
            ) : (
              <ToggleLeft size={48} weight="bold" className="text-text-secondary/40" />
            )}
          </button>
        </div>

        {/* Maintenance mode warning */}
        {maintenanceMode && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-900 text-xs font-bold">
            <Warning size={20} weight="bold" className="shrink-0 text-red-600 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-black text-red-700">Cảnh báo:</strong> Ứng dụng hiện đang ở Chế độ Bảo trì. Tất cả nông dân đang dùng app sẽ bị tạm ngắt truy cập.
            </p>
          </div>
        )}

        {/* Rate Limiting Option */}
        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-bg-surface-1 border-2 border-border-main">
          <label className="font-black text-text-h text-base flex items-center gap-2">
            <Cpu size={18} weight="bold" className="text-indigo-600" />
            Giới hạn yêu cầu API (Rate Limiting)
          </label>
          <p className="text-text-secondary text-xs font-bold leading-relaxed">
            Số lượt truy vấn tối đa một IP / tài khoản được gửi lên hệ thống trong 1 phút (mặc định: 100).
          </p>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="number"
              min={10}
              max={1000}
              value={rateLimit}
              onChange={(e) => setRateLimit(parseInt(e.target.value, 10))}
              className="w-36 bg-white border-2 border-border-main rounded-xl px-4 py-2.5 text-sm font-black text-text-h outline-none focus:border-[#008A5E] transition-all"
            />
            <span className="text-xs text-text-secondary font-black">lượt request / phút</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t-2 border-border-main flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn--cyan active:scale-95 rounded-2xl px-6 py-3 text-sm font-black flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
            ) : (
              <FloppyDisk size={18} weight="bold" />
            )}
            <span>Lưu thiết lập</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
