/* Hallmark · page: maintenance-mode · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React from 'react';
import { Gear, Wrench, ArrowsClockwise, Envelope } from '@phosphor-icons/react';

interface MaintenanceModeProps {
  estimatedTime?: string;
  message?: string;
  contactEmail?: string;
}

export const MaintenanceMode: React.FC<MaintenanceModeProps> = ({
  estimatedTime = '30 phút',
  message = 'Bé Thóc đang được cập nhật',
  contactEmail = 'support@farmy.ai',
}) => {
  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main font-sans flex flex-col items-center justify-center px-4 py-8 text-left">
      
      {/* Top spacing */}
      <div className="flex-1" />

      {/* Maintenance Container */}
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        
        {/* Maintenance Illustration */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-border-main card-bubble">
              <Gear size={96} weight="duotone" className="text-[#008A5E] animate-[spin_10s_linear_infinite]" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-md border-2 border-border-main">
              <Wrench size={24} weight="bold" className="text-amber-950 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Maintenance Text */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-text-h">Hệ thống đang bảo trì</h1>
          <p className="text-base font-extrabold text-[#008A5E]">{message}</p>
          <p className="text-sm font-bold text-text-secondary leading-relaxed">
            Chúng tôi đang nâng cấp Bé Thóc để phục vụ nhà nông tốt hơn. Vui lòng quay lại sau ít phút nhé!
          </p>
        </div>

        {/* Maintenance Info Card */}
        <div className="w-full card-bubble bg-white rounded-3xl border-2 border-border-main p-5 space-y-4 shadow-sm">
          
          {/* Estimated Time */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0 border border-amber-300">
              <ArrowsClockwise size={24} weight="bold" className="text-amber-700 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-text-secondary font-black uppercase">Thời gian ước tính</p>
              <p className="text-base font-black text-text-h">{estimatedTime}</p>
            </div>
          </div>

          {/* What We're Doing */}
          <div className="flex items-start gap-4 pt-4 border-t-2 border-border-main/50">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border border-emerald-300 mt-0.5">
              <Gear size={24} weight="duotone" className="text-[#008A5E]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-text-secondary font-black uppercase">Đội ngũ đang thực hiện:</p>
              <ul className="text-xs font-bold text-text-main mt-2 space-y-1">
                <li>• Nâng cấp AI chẩn đoán bệnh PlantScan</li>
                <li>• Cải thiện tốc độ gửi thông báo nhắc nhở</li>
                <li>• Bảo mật và tối ưu hóa bộ nhớ nhật ký</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stay Updated */}
        <div className="w-full card-bubble bg-bg-surface-1 rounded-2xl p-4 text-center space-y-2 border-2 border-border-main">
          <p className="text-sm font-black text-text-h">Muốn cập nhật thông báo?</p>
          <p className="text-xs font-bold text-text-secondary leading-relaxed">
            Gửi email để nhận thông báo ngay khi ứng dụng hoạt động trở lại
          </p>
          <a 
            href={`mailto:${contactEmail}?subject=Notify me when FARMY is back online`}
            className="btn btn--cyan active:scale-95 rounded-2xl inline-flex items-center gap-2 font-black text-xs px-4 py-2 cursor-pointer shadow-xs mt-1"
          >
            <Envelope size={16} weight="bold" />
            {contactEmail}
          </a>
        </div>

        {/* Thank You Message */}
        <div className="text-center">
          <p className="text-xs font-extrabold text-text-secondary">
            Cảm ơn bạn đã kiên nhẫn. Bé Thóc sẽ quay lại ngay! 🌱
          </p>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="flex-1" />
    </div>
  );
};

export default MaintenanceMode;
