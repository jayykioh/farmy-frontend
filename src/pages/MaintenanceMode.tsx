import React from 'react';

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
    <div className="w-full min-h-[100svh] bg-gradient-to-b from-bg-surface-1 to-primary-container/10 flex flex-col items-center justify-center px-4 py-8">
      
      {/* Top spacing */}
      <div className="flex-1" />

      {/* Maintenance Container */}
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        
        {/* Maintenance Illustration */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Working Bethoc */}
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-container/20 rounded-3xl flex items-center justify-center">
              <svg className="w-28 h-28 text-primary" viewBox="0 0 24 24" fill="currentColor">
                {/* Cute working character with tools */}
                <g opacity="0.9">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M8 14c0-2.21 1.79-4 4-4s4 1.79 4 4v2H8v-2z" />
                  {/* Tools */}
                  <rect x="15" y="7" width="3" height="8" rx="1" opacity="0.6" />
                  <path d="M18 9l2-2" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                </g>
              </svg>
            </div>
            {/* Wrench Icon */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-warning rounded-full flex items-center justify-center shadow-lg animate-spin" style={{animationDuration: '3s'}}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.5 8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm4-7h-1V1h-2v1H9V1H7v1H5.5C4.12 2 3 3.12 3 4.5v15C3 20.88 4.12 22 5.5 22h13c1.38 0 2.5-1.12 2.5-2.5v-15C19.5 3.12 18.38 2 17 2zm0 16.5H5.5v-9h11.5v9z" />
              </svg>
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
              <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-main/60 font-semibold">Thời gian ước tính</p>
              <p className="text-base font-bold text-text-main">{estimatedTime}</p>
            </div>
          </div>

          {/* What We're Doing */}
          <div className="flex items-start gap-4 pt-4 border-t border-border-main/20">
            <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
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
