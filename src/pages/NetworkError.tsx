import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="w-full min-h-[100svh] bg-bg-surface-1 text-left font-sans flex flex-col items-center justify-center px-4 py-8">
      
      {/* Top spacing */}
      <div className="flex-1" />

      {/* Error Container */}
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        
        {/* Network Error Icon */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="w-32 h-32 bg-warning-container/20 rounded-full flex items-center justify-center">
            <svg className="w-20 h-20 text-warning" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
          </div>
          {/* Broken signal indicator */}
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-error rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </div>
        </div>

        {/* Error Text */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-text-h">Mất kết nối</h1>
          <p className="text-lg font-semibold text-text-main">{message}</p>
          <p className="text-base text-text-main/60 leading-relaxed">
            Bé Thóc không thể nói chuyện với máy chủ. Kiểm tra lại kết nối Wi-Fi hoặc dữ liệu di động của bạn.
          </p>
        </div>

        {/* Troubleshooting Card */}
        <div className="w-full bg-white rounded-[20px] border border-border-main/50 p-5 space-y-3">
          <p className="text-sm font-semibold text-text-main uppercase">Cách khắc phục:</p>
          <ul className="space-y-2 text-sm text-text-main/60">
            <li className="flex gap-3">
              <span className="font-bold text-warning mt-0.5">1</span>
              <span>Bật Chế độ Máy bay rồi tắt để reset mạng</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-warning mt-0.5">2</span>
              <span>Kiểm tra xem bạn có được kết nối Wi-Fi hay không</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-warning mt-0.5">3</span>
              <span>Thử tắt và bật lại thiết bị của bạn</span>
            </li>
          </ul>
        </div>

        {/* Offline Content Message */}
        <div className="w-full bg-bg-surface-1 border border-primary-container/30 rounded-[16px] p-4 flex gap-3 items-start">
          <svg className="w-6 h-6 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-text-main/70 leading-relaxed">
            <p className="font-semibold text-text-main mb-1">Mẹo:</p>
            <p>Dữ liệu nông trại của bạn được lưu trên thiết bị. Khi kết nối quay lại, tất cả sẽ được đồng bộ tự động.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleRetry}
            className="flex-1 bg-primary text-white font-bold text-base py-3 rounded-full shadow-md hover:bg-primary-container hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Thử Lại
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white border border-border-main/50 text-text-main font-bold text-base py-3 rounded-full shadow-sm hover:bg-bg-surface-1 hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
            </svg>
            Trang Chủ
          </button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="flex-1" />

      {/* Status Footer */}
      <div className="text-center text-xs text-text-main/40">
        <p>Trạng thái: <span className="text-error">Offline</span></p>
      </div>
    </div>
  );
};

export default NetworkError;
