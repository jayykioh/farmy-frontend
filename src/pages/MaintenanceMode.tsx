import React from 'react';
import { Settings, Wrench, RefreshCw, Mail } from 'lucide-react';

interface MaintenanceModeProps {
  estimatedTime?: string;
  message?: string;
  contactEmail?: string;
}

export const MaintenanceMode: React.FC<MaintenanceModeProps> = ({
  estimatedTime = '30 phút',
  message = 'Bé Thóc đang được cập nhật',
  contactEmail = 'support@farmdiary.ai',
}) => {
  return (
    <div className="w-full min-h-[100svh] bg-[#FBFBFD] flex flex-col items-center justify-center px-4 py-8">
      
      {/* Top spacing */}
      <div className="flex-1" />

      {/* Maintenance Container */}
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        
        {/* Maintenance Illustration */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Working Bethoc */}
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.04]">
              <Settings className="w-24 h-24 text-slate-800 animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <Wrench className="w-6 h-6 text-white animate-[bounce_2s_infinite]" />
            </div>
          </div>
        </div>

        {/* Maintenance Text */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-text-h">Đang bảo trì</h1>
          <p className="text-lg font-semibold text-text-main">{message}</p>
          <p className="text-base text-text-main/60 leading-relaxed">
            Tôi đang được cải thiện để phục vụ bạn tốt hơn. Xin vui lòng quay lại sau.
          </p>
        </div>

        {/* Maintenance Info Card */}
        <div className="w-full bg-white rounded-[24px] border border-border-main/50 p-6 space-y-4">
          
          {/* Estimated Time */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-container/20 rounded-full flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-main/60 font-semibold">Thời gian ước tính</p>
              <p className="text-base font-bold text-text-main">{estimatedTime}</p>
            </div>
          </div>

          {/* What We're Doing */}
          <div className="flex items-start gap-4 pt-4 border-t border-border-main/20">
            <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-main/60 font-semibold">Chúng tôi đang:</p>
              <ul className="text-sm text-text-main/70 mt-2 space-y-1">
                <li>• Cập nhật tính năng mới</li>
                <li>• Sửa lỗi và cải thiện hiệu suất</li>
                <li>• Đảm bảo dữ liệu của bạn an toàn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stay Updated */}
        <div className="w-full bg-bg-surface-1 rounded-[16px] p-4 text-center space-y-3">
          <p className="text-sm font-semibold text-text-main">Muốn cập nhật thông tin?</p>
          <p className="text-xs text-text-main/60 leading-relaxed">
            Gửi email để nhận thông báo khi chúng tôi trở lại online
          </p>
          <a 
            href={`mailto:${contactEmail}?subject=Notify me when FarmDiary is back online`}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
          >
            <Mail className="w-4 h-4" />
            {contactEmail}
          </a>
        </div>

        {/* Thank You Message */}
        <div className="text-center">
          <p className="text-sm text-text-main/60">
            Cảm ơn bạn đã chờ đợi. Bé Thóc sẽ sớm quay lại! 🌱
          </p>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="flex-1" />
    </div>
  );
};

export default MaintenanceMode;
