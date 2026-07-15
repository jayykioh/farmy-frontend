import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ArrowRight, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { MascotLottie } from '../components/MascotLottie';
import { useAuthStore } from '../store/authStore';

const hasCompletedOnboardingLocally = (userId?: string): boolean => {
  if (!userId) return false;
  return localStorage.getItem(`onboarding_completed_${userId}`) === 'true';
};

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Vui lòng nhập email.').email('Email không hợp lệ.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const WelcomeAuth: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [errorMsg, setErrorMsg] = useState('');
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const submitLogin = async (credentials: LoginFormValues) => {
    setErrorMsg('');

    try {
      await login(credentials);
      const user = useAuthStore.getState().user;
      if (user?.onboardingCompleted || hasCompletedOnboardingLocally(user?.id)) {
        navigate('/home');
      } else {
        navigate('/onboarding-1');
      }
    } catch (error) {
      setErrorMsg(getErrorMessage(error, 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'));
    }
  };

  const handleDemoLogin = () => {
    void submitLogin({
      email: 'user@farmy.com',
      password: 'UserPassword123',
    });
  };

  const isBusy = isSubmitting;

  return (
    <div className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[linear-gradient(155deg,#f8fff7_0%,#ffffff_45%,#fff4d8_100%)] md:items-center md:justify-center">
      <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,rgba(20,30,23,0.12)_1px,transparent_0)] [background-size:26px_26px]" />
      <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary-lightest/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-secondary-light/45 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden md:h-auto md:grid md:grid-cols-[0.95fr_1.05fr] md:rounded-[36px] md:border md:border-white/80 md:bg-white/65 md:shadow-[0_30px_100px_rgba(20,30,23,0.14)] md:backdrop-blur-xl">
        <main className="relative flex flex-1 flex-col items-center justify-center px-6 pb-4 pt-10 md:items-start md:bg-[radial-gradient(circle_at_35%_25%,rgba(121,252,158,0.22),transparent_34%)] md:px-10 md:py-12 md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3.5 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary-container shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Farm companion
          </div>
          <div className="w-32 h-32 mb-4 relative flex items-center justify-center md:h-44 md:w-44">
            <MascotLottie className="w-full h-full drop-shadow-md" />
          </div>
          <div className="flex w-full max-w-[360px] flex-col gap-3 text-center md:text-left">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-text-h md:text-5xl">Grow better, every day.</h1>
            <p className="text-base font-semibold leading-7 text-text-main/65">Track your farm, build reliable habits, and care for crops with an AI assistant that remembers your field context.</p>
            <div className="mt-2 hidden grid-cols-2 gap-3 text-left md:grid">
              <div className="rounded-2xl border border-white/80 bg-white/70 p-3 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wider text-text-main/40">Streak</p>
                <p className="text-sm font-extrabold text-text-h">Daily care loop</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/70 p-3 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wider text-text-main/40">AI</p>
                <p className="text-sm font-extrabold text-text-h">Crop diagnosis</p>
              </div>
            </div>
          </div>
        </main>

        <div className="flex w-full flex-col gap-4 rounded-t-[32px] border-t border-border-main/50 bg-bg-main/95 px-6 pb-8 pt-6 shadow-[0_-20px_70px_rgba(20,30,23,0.08)] md:rounded-none md:border-l md:border-t-0 md:bg-white/80 md:px-10 md:py-12 md:shadow-none">
          <div className="mb-2 text-left">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-container/60">Secure sign in</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-text-h">Chào mừng trở lại</h2>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(submitLogin)}>
            {errorMsg ? (<div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs font-extrabold text-red-600 shadow-sm">
              {errorMsg}
            </div>) : null}
            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-main/35" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="farmer@example.com"
                  disabled={isBusy}
                  className="w-full rounded-2xl border border-border-main/55 bg-white py-3.5 pl-12 pr-5 text-base font-semibold shadow-[0_8px_24px_rgba(20,30,23,0.04)] outline-none transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                  {...registerField('email')}
                />
              </div>
              {errors.email ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="password">Mật khẩu</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-main/35" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  disabled={isBusy}
                  className="w-full rounded-2xl border border-border-main/55 bg-white py-3.5 pl-12 pr-5 text-base font-semibold shadow-[0_8px_24px_rgba(20,30,23,0.04)] outline-none transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                  {...registerField('password')}
                />
              </div>
              {errors.password ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.password.message}</p> : null}
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary-container px-6 py-3.5 font-extrabold text-white shadow-[0_16px_34px_rgba(0,109,53,0.24)] transition-all hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_20px_42px_rgba(8,168,85,0.28)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative">{isBusy ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
              {!isBusy ? <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" /> : null}
            </button>

            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-main/50"></div>
              </div>
              <div className="relative bg-bg-main px-4 text-xs text-text-main/50 font-bold">HOẶC</div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = 'http://localhost:3000/api/v1/auth/google';
              }}
              className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-border-main/45 bg-white text-base font-extrabold text-text-main shadow-[0_10px_26px_rgba(20,30,23,0.05)] transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_16px_34px_rgba(20,30,23,0.09)] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleDemoLogin}
              type="button"
              disabled={isBusy}
              className="w-full cursor-pointer rounded-2xl border border-primary/20 bg-primary/[0.08] px-6 py-3 font-extrabold text-primary-container transition-all hover:-translate-y-0.5 hover:bg-primary/[0.12] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBusy ? 'Đang kết nối...' : 'Đăng nhập Demo (user@farmy.com)'}
            </button>
          </form>
          <p className="text-sm text-text-main/60 text-center mt-2">
            Chưa có tài khoản? <button onClick={() => navigate('/register')} className="text-primary font-bold hover:underline cursor-pointer">Đăng ký ngay</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAuth;
