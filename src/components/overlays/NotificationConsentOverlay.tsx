import React, { useState } from 'react';
import { MascotLottie } from '../MascotLottie';
import { updatePushSubscription } from '../../api/auth';

// ────────────────────────────────────────────────────────────────
//  Notification Consent Overlay
//  Giữ nguyên 100% UI đẹp từ OnboardingStep3.
//  Thay vì là một /route, đây là overlay full-screen đè lên Home
//  khi user chưa từng được hỏi quyền notification.
// ────────────────────────────────────────────────────────────────

type Props = {
  userId: string;
  onDismiss: () => void;
};

const STORAGE_KEY_PREFIX = 'notification_onboarding_seen_v1:';

export const getNotificationSeenKey = (userId: string) =>
  `${STORAGE_KEY_PREFIX}${userId}`;

export const hasSeenNotificationOnboarding = (userId: string): boolean =>
  localStorage.getItem(getNotificationSeenKey(userId)) === 'true';

const markNotificationOnboardingSeen = (userId: string) => {
  localStorage.setItem(getNotificationSeenKey(userId), 'true');
};

const registerPushSubscription = async () => {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    const registration = await navigator.serviceWorker.ready;
    const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!VAPID_KEY) return;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_KEY,
    });

    const { endpoint, keys } = subscription.toJSON() as {
      endpoint: string;
      keys: { p256dh: string; auth: string };
    };

    if (endpoint && keys?.p256dh && keys?.auth) {
      await updatePushSubscription({ endpoint, keys });
    }
  } catch (err) {
    // User denied or browser doesn't support — non-fatal
    console.warn('[Push] Could not subscribe:', err);
  }
};

export const NotificationConsentOverlay: React.FC<Props> = ({ userId, onDismiss }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const dismiss = (markSeen = true) => {
    if (markSeen) markNotificationOnboardingSeen(userId);
    onDismiss();
  };

  const handleAllow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await registerPushSubscription();
        }
      }
    } finally {
      dismiss(true);
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    dismiss(true);
  };

  return (
    // Overlay full-screen — same visual effect as the original /onboarding-3 page
    <div className="fixed inset-0 z-[9999] w-full h-full min-h-[100svh] bg-gradient-to-b from-blue-100 to-green-50 overflow-hidden font-sans text-left flex flex-col">

      {/* Top App Bar (Branding) */}
      <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between mx-auto max-w-[1024px]">
        <div className="w-10 h-10" /> {/* Spacer */}
        <div className="flex h-10 items-center justify-center rounded-full bg-white/80 px-5 backdrop-blur-md shadow-sm border border-slate-200/50">
          <span className="text-sm font-extrabold text-slate-800 tracking-tight">FarmDiaries</span>
        </div>
        <div className="w-10 h-10" /> {/* Spacer */}
      </header>

      {/* Main Canvas */}
      <main className="relative flex-1 w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center pt-24 pb-24 md:pb-0 h-screen md:h-screen">
        {/* Mascot Section */}
        <div className="relative w-full aspect-square md:aspect-auto md:w-1/2 flex items-center justify-center z-10 md:h-full">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Mascot Lottie */}
            <MascotLottie state="sleepy" className="w-full h-full" />
            {/* Floating Bell Element */}
            <div className="absolute bottom-10 right-10 origin-top animate-[spin_2s_ease-in-out_infinite]">
              <svg className="w-12 h-12 text-[#FFC107] drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Atmospheric Notes */}
        <div className="absolute top-1/4 left-10 md:left-20 opacity-40 animate-pulse">
          <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-12 md:right-32 opacity-30 animate-bounce">
          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.69 2 6 4.69 6 8c0 3.31 2.69 6 6 6s6-2.69 6-6c0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
          </svg>
        </div>

        {/* Bottom/Right Sheet UI */}
        <section className="w-full md:w-1/2 bg-white md:bg-white/90 md:backdrop-blur-xl z-50 rounded-t-[40px] md:rounded-3xl px-6 pt-8 pb-12 flex flex-col items-center gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.08),inset_0_-4px_8px_rgba(0,0,0,0.05)] md:shadow-xl md:border md:border-border-main/50 transition-transform self-end md:self-center md:mr-8 md:py-12 absolute md:relative bottom-0 md:bottom-auto">

          {/* Progress Indicator — Step 3 of 3 */}
          <div className="flex items-center gap-1.5 mb-2" aria-label="Onboarding progress: step 3 of 3">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="h-1.5 w-6 rounded-full bg-slate-800" />
          </div>

          {/* Content */}
          <div className="text-center space-y-4 px-4">
            <h2 className="text-2xl font-bold text-text-h leading-tight">
              Nhận thông báo trình duyệt
            </h2>
            <p className="text-lg text-text-main/70">
              Cho phép Bé Thóc gửi thông báo nhanh để cập nhật tình trạng sức khỏe cây trồng của bạn.
            </p>
          </div>

          {/* Action Area */}
          <div className="w-full max-w-[340px] mt-6 space-y-4">
            <button
              onClick={() => { void handleAllow(); }}
              disabled={isProcessing}
              className="w-full text-white font-extrabold text-base h-14 rounded-2xl flex items-center justify-center bg-slate-900 hover:bg-slate-800 shadow-sm active:scale-[0.98] transition-all duration-100 cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? 'Đang xử lý...' : 'Cho phép thông báo'}
            </button>
            <div className="flex justify-center pt-2">
              <button
                onClick={handleSkip}
                disabled={isProcessing}
                className="text-text-main/50 font-bold hover:text-text-main text-sm transition-colors cursor-pointer"
              >
                Để sau
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Wavy Grass Background */}
      <svg className="absolute bottom-0 left-0 w-full h-[120px] fill-[#10B981] z-0 pointer-events-none opacity-50 md:opacity-100" preserveAspectRatio="none" viewBox="0 0 1440 120">
        <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
      </svg>
    </div>
  );
};

export default NotificationConsentOverlay;
