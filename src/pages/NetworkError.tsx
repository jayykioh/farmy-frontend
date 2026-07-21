/* Hallmark · page: network-error · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowsClockwise, House, WifiSlash, Warning } from '@phosphor-icons/react';

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  message = 'Không có kết nối internet',
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main font-sans flex flex-col items-center justify-center px-4 py-8 text-left">
      
      {/* Top spacing */}
      <div className="flex-1" />

      {/* Error Container */}
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        
        {/* Network Error Icon */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <div className="w-36 h-36 card-bubble bg-white rounded-full flex items-center justify-center border-4 border-border-main shadow-md">
            <WifiSlash size={80} weight="duotone" className="text-amber-500" />
          </div>
          {/* Broken signal indicator */}
          <div className="absolute -top-1 -right-1 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-md border-2 border-border-main">
            <Warning size={20} weight="bold" className="text-white" />
          </div>
        </div>

        {/* Error Text */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-text-h">Mất kết nối mạng</h1>
          <p className="text-base font-extrabold text-amber-600">{message}</p>
          <p className="text-sm font-bold text-text-secondary leading-relaxed">
            Bé Thóc không thể trò chuyện với máy chủ. Kiểm tra lại kết nối Wi-Fi hoặc 4G/5G của bạn nhé.
          </p>
        </div>

        {/* Troubleshooting Card */}
        <div className="w-full card-bubble bg-white rounded-3xl border-2 border-border-main p-5 space-y-3 shadow-xs">
          <p className="text-xs font-black text-text-secondary uppercase">Các bước kiểm tra nhanh:</p>
          <ul className="space-y-2 text-xs font-extrabold text-text-main">
            <li className="flex gap-3 items-center">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black shrink-0">1</span>
              <span>Bật Chế độ Máy bay rồi tắt đi để làm mới sóng mạng</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black shrink-0">2</span>
              <span>Kiểm tra modem Wi-Fi hoặc dung lượng gói cước 4G</span>
            </li>
            <li className="flex gap-3 items-center">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-black shrink-0">3</span>
              <span>Thử đóng và mở lại ứng dụng FARMY AI</span>
            </li>
          </ul>
        </div>

        {/* Offline Content Message */}
        <div className="w-full card-bubble bg-bg-surface-1 border-2 border-border-main rounded-2xl p-4 flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-primary-light/20 flex items-center justify-center text-[#008A5E] shrink-0 mt-0.5 border border-primary-light/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-xs text-text-secondary leading-relaxed">
            <p className="font-black text-text-h mb-0.5">Lưu ý yên tâm:</p>
            <p className="font-bold">Nhật ký vườn của bạn sẽ được tạm lưu trên máy. Khi có mạng trở lại, dữ liệu sẽ được tự động đồng bộ lên mây!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleRetry}
            className="btn btn--cyan active:scale-95 rounded-2xl flex-1 py-3.5 text-base font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ArrowsClockwise size={20} weight="bold" />
            Thử kết nối lại
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn--soft active:scale-95 rounded-2xl flex-1 py-3.5 text-base font-bold text-text-secondary border-2 border-border-main/50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <House size={20} weight="bold" />
            Trang chủ
          </button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="flex-1" />

      {/* Status Footer */}
      <div className="text-center text-xs font-bold text-text-secondary">
        <p>Trạng thái hệ thống: <span className="text-amber-600 font-extrabold">Chế độ ngoại tuyến (Offline)</span></p>
      </div>
    </div>
  );
};

export default NetworkError;
