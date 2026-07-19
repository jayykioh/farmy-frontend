import React, { useEffect, useState } from 'react';
import { getAdminConfig, updateAdminConfig } from '../api/admin';
import { Settings, ShieldAlert, Cpu, Save, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#08A855]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.01)] overflow-hidden">
      <div className="p-6 border-b border-black/[0.04]">
        <h2 className="font-bold text-lg text-[#1d1d1f] flex items-center gap-2">
          <Settings size={20} className="text-[#08A855]" />
          <span>Cấu hình vận hành hệ thống</span>
        </h2>
        <p className="text-[#86868b] text-[13px] mt-1">
          Quản lý các trạng thái hoạt động trực tiếp của hệ thống Farmy. Thay đổi sẽ có hiệu lực ngay lập tức.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
        {/* Maintenance Mode Option */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-black/[0.03]">
          <div className="flex flex-col">
            <span className="font-bold text-[#1d1d1f] text-[15px] flex items-center gap-1.5">
              <ShieldAlert size={16} className="text-amber-500" />
              Chế độ bảo trì hệ thống (Maintenance Mode)
            </span>
            <span className="text-[#86868b] text-[13px] mt-0.5 max-w-md">
              Khi được kích hoạt, tất cả người dùng thường sẽ không thể truy cập các chức năng của ứng dụng (trừ trang báo bảo trì). Chỉ quản trị viên mới có quyền truy cập để gỡ lỗi.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className="text-[#08A855] focus:outline-none transition-all active:scale-95 shrink-0"
          >
            {maintenanceMode ? (
              <ToggleRight size={44} className="text-red-500" />
            ) : (
              <ToggleLeft size={44} className="text-slate-300" />
            )}
          </button>
        </div>

        {/* Maintenance mode warning */}
        {maintenanceMode && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-800 text-[13px]">
            <AlertTriangle size={18} className="shrink-0 text-red-600 mt-[2px]" />
            <p className="font-medium">
              <strong>Chú ý:</strong> Ứng dụng hiện đang được đặt ở chế độ bảo trì. Người nông dân sẽ nhìn thấy màn hình "Hệ thống đang bảo trì" khi truy cập.
            </p>
          </div>
        )}

        {/* Rate Limiting Option */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-[#1d1d1f] text-[15px] flex items-center gap-1.5">
            <Cpu size={16} className="text-indigo-500" />
            Giới hạn số lượng yêu cầu API (Rate Limiting)
          </label>
          <p className="text-[#86868b] text-[13px]">
            Số lượng yêu cầu tối đa mà một người dùng có thể gửi lên máy chủ trong vòng 1 phút (mặc định là 100).
          </p>
          <div className="flex items-center gap-3 mt-1">
            <input
              type="number"
              min={10}
              max={1000}
              value={rateLimit}
              onChange={(e) => setRateLimit(parseInt(e.target.value, 10))}
              className="w-32 bg-[#f5f5f7] border border-black/[0.04] rounded-xl px-4 py-2.5 text-[14px] font-bold text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-[#08A855] focus:ring-1 focus:ring-[#08A855] transition-all"
            />
            <span className="text-[13.5px] text-[#86868b] font-medium">yêu cầu / phút</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-black/[0.04] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#08A855] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold shadow-[0_4px_12px_rgba(8,168,85,0.15)] hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:active:scale-100 transition-all"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save size={16} />
            )}
            <span>Lưu cấu hình</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
