import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { updatePushSubscription } from '../api/auth';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [zaloNotifications, setZaloNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState(false);

  const handlePushToggle = async () => {
    if (pushNotifications) {
      // Logic to unsubscribe would go here
      setPushNotifications(false);
      return;
    }

    setIsPushLoading(true);
    try {
      // In a real app, this would use navigator.serviceWorker and pushManager.subscribe()
      // with a VAPID public key. For this integration, we mock the subscription payload.
      const mockSubscription = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/mock-endpoint-id',
        keys: {
          p256dh: 'mock-p256dh-key',
          auth: 'mock-auth-key'
        }
      };

      await updatePushSubscription(mockSubscription);
      setPushNotifications(true);
      alert('Đã đăng ký nhận thông báo Push thành công!');
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
      alert('Lỗi đăng ký thông báo Push. Vui lòng thử lại!');
    } finally {
      setIsPushLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100svh] bg-bg-surface-1 text-left font-sans pb-24 md:pb-8">
      
      <PageHeader 
        title="Settings"
        subtitle="Cài đặt ứng dụng"
        leftButton="back"
      />

      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto pt-24 md:pt-20 px-4 md:px-8 flex flex-col gap-4">
        
        {/* Notifications Section */}
        <div className="bg-white rounded-[24px] border border-border-main/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-4">Thông báo</h2>
          
          {/* Zalo Notifications Toggle */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-main/20">
            <div className="flex-1">
              <p className="font-semibold text-base text-text-main">Kết nối Zalo</p>
              <p className="text-sm text-text-main/60 mt-1">Nhận nhắc nhở qua Zalo</p>
            </div>
            <button 
              onClick={() => setZaloNotifications(!zaloNotifications)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors cursor-pointer ${
                zaloNotifications ? 'bg-primary-container' : 'bg-border-main/20'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  zaloNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold text-base text-text-main">Thông báo Push</p>
              <p className="text-sm text-text-main/60 mt-1">Nhận thông báo trên thiết bị</p>
            </div>
            <button 
              onClick={handlePushToggle}
              disabled={isPushLoading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors cursor-pointer ${
                pushNotifications ? 'bg-primary-container' : 'bg-border-main/20'
              } ${isPushLoading ? 'opacity-50 cursor-wait' : ''}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  pushNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white rounded-[24px] border border-border-main/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-4">Tài khoản</h2>
          
          {/* Account Info */}
          <button 
            onClick={() => navigate('/account-settings')}
            className="w-full text-left flex items-center justify-between p-4 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface hover:shadow-sm transition-all mb-2 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-base text-text-main">Thông tin tài khoản</p>
                <p className="text-sm text-text-main/60">Xem và chỉnh sửa thông tin</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-main/40 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Reminders */}
          <button 
            onClick={() => navigate('/reminders')}
            className="w-full text-left flex items-center justify-between p-4 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface hover:shadow-sm transition-all mb-2 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <p className="font-semibold text-base text-text-main">Nhắc nhở của tôi</p>
                <p className="text-sm text-text-main/60">Quản lý các nhắc nhở</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-main/40 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-[24px] border border-border-main/50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-4">Hỗ trợ</h2>
          
          {/* Help & Support */}
          <button 
            onClick={() => navigate('/help-support')}
            className="w-full text-left flex items-center justify-between p-4 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface hover:shadow-sm transition-all mb-2 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-base text-text-main">Trợ giúp & Hỗ trợ</p>
                <p className="text-sm text-text-main/60">Câu hỏi thường gặp và liên hệ</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-main/40 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Privacy Policy */}
          <button 
            className="w-full text-left flex items-center justify-between p-4 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface hover:shadow-sm transition-all mb-2 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7.5-4.5a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-base text-text-main">Chính sách riêng tư</p>
                <p className="text-sm text-text-main/60">Quyền riêng tư và điều khoản</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-main/40 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Sign Out Section */}
        <button 
          className="w-full bg-white hover:bg-bg-surface-1 text-error-main font-bold rounded-[24px] border border-error-main/20 p-4 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>

        {/* App Version */}
        <div className="text-center py-6">
          <p className="text-sm text-text-main/50">FarmDiaries AI v1.0.0</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
