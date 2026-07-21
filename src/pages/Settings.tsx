/* Hallmark · page: settings · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { updatePushSubscription } from '../api/auth';
import { registerPushSubscription } from '../utils/push';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState(false);

  const handlePushToggle = async () => {
    if (pushNotifications) {
      setPushNotifications(false);
      return;
    }

    setIsPushLoading(true);
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          toast.error('Vui lòng cho phép trình duyệt gửi thông báo để sử dụng tính năng này.');
          setIsPushLoading(false);
          return;
        }
      }

      const subscription = await registerPushSubscription();
      await updatePushSubscription(subscription);
      setPushNotifications(true);
      toast.success('Đã đăng ký nhận thông báo Push thành công!');
    } catch (err: any) {
      console.error('Failed to subscribe to push notifications:', err);
      toast.error(err.message || 'Lỗi đăng ký thông báo Push. Vui lòng thử lại!');
    } finally {
      setIsPushLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100svh] bg-bg-main text-text-main text-left font-sans pb-24 relative">
      
      <PageHeader 
        title="Cài đặt"
        subtitle="Quản lý tùy chọn ứng dụng & thông báo"
        leftButton="back"
      />

      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto pt-24 px-4 md:px-8 flex flex-col gap-4">
        
        {/* Notifications Section */}
        <div className="card-bubble bg-white p-6 shadow-sm border-2 border-border-main">
          <h2 className="text-xl font-black text-text-h mb-4">Thông báo</h2>
          
          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between p-4 bg-bg-surface-1 rounded-2xl border border-border-main/50 mb-3 shadow-sm">
            <div>
              <p className="font-extrabold text-base text-text-h">Kết nối Email</p>
              <p className="text-sm font-bold text-text-secondary mt-0.5">Nhận nhắc nhở qua Email nông vụ</p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out border-2 border-border-main cursor-pointer ${
                emailNotifications ? 'bg-[#008A5E]' : 'bg-bg-surface-2'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between p-4 bg-bg-surface-1 rounded-2xl border border-border-main/50 shadow-sm">
            <div className="flex-1">
              <p className="font-extrabold text-base text-text-h">Thông báo Push</p>
              <p className="text-sm font-bold text-text-secondary mt-0.5">Nhận thông báo trực tiếp trên thiết bị</p>
            </div>
            <button 
              onClick={handlePushToggle}
              disabled={isPushLoading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full p-1 transition-colors cursor-pointer border-2 border-border-main ${
                pushNotifications ? 'bg-[#008A5E]' : 'bg-bg-surface-2'
              } ${isPushLoading ? 'opacity-50 cursor-wait' : ''}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  pushNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div className="card-bubble bg-white p-6 shadow-sm border-2 border-border-main">
          <h2 className="text-xl font-black text-text-h mb-4">Tài khoản & Liên kết</h2>
          
          {/* Account Info */}
          <button 
            onClick={() => navigate('/account-settings')}
            className="w-full text-left flex items-center justify-between p-4 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface-2 border border-border-main/50 transition-all mb-2 cursor-pointer group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-light/20 flex items-center justify-center text-[#008A5E] border border-primary-light/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-base text-text-h">Thông tin tài khoản</p>
                <p className="text-sm font-bold text-text-secondary">Xem và chỉnh sửa tên, địa chỉ vườn</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Reminders */}
          <button 
            onClick={() => navigate('/reminders')}
            className="w-full text-left flex items-center justify-between p-4 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface-2 border border-border-main/50 transition-all mb-2 cursor-pointer group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 border border-sky-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-base text-text-h">Nhắc nhở của tôi</p>
                <p className="text-sm font-bold text-text-secondary">Quản lý lịch nhắc tưới, bón phân</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Help Section */}
        <div className="card-bubble bg-white p-6 shadow-sm border-2 border-border-main">
          <h2 className="text-xl font-black text-text-h mb-4">Hỗ trợ & Pháp lý</h2>
          
          {/* Help & Support */}
          <button 
            onClick={() => navigate('/help-support')}
            className="w-full text-left flex items-center justify-between p-4 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface-2 border border-border-main/50 transition-all mb-2 cursor-pointer group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 border border-amber-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-base text-text-h">Trợ giúp & Hỗ trợ</p>
                <p className="text-sm font-bold text-text-secondary">Câu hỏi thường gặp và liên hệ kỹ thuật</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Privacy Policy */}
          <button 
            className="w-full text-left flex items-center justify-between p-4 rounded-[16px] bg-bg-surface-1 hover:bg-bg-surface-2 border border-border-main/50 transition-all mb-2 cursor-pointer group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 border border-emerald-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7.5-4.5a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-base text-text-h">Chính sách riêng tư</p>
                <p className="text-sm font-bold text-text-secondary">Quyền riêng tư và bảo mật thông tin</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Sign Out Section */}
        <button 
          onClick={() => navigate('/profile')}
          className="btn btn--coral w-full py-4 text-base font-black flex items-center justify-center gap-2 cursor-pointer active:scale-95 mt-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Trở về Hồ sơ cá nhân
        </button>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-xs font-bold text-text-secondary">FARMY AI v1.0.0 · Hallmark Hum Edition</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
