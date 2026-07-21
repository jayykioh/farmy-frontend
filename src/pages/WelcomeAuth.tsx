/* Hallmark · page: welcome-auth · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ArrowRight, LockKey, EnvelopeSimple, Sparkle, Eye, EyeSlash } from '@phosphor-icons/react';
import { PetMascot } from '../features/pet/components/PetMascot';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Vui lòng nhập email.').email('Email không hợp lệ.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
  rememberMe: z.boolean().optional(),
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
  const [showPassword, setShowPassword] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const submitLogin = async (credentials: LoginFormValues) => {
    setErrorMsg('');

    try {
      await login(credentials);
      const user = useAuthStore.getState().user;
      if (user && (user.role === 'admin' || user.role === 'moderator')) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setErrorMsg(getErrorMessage(error, 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'));
    }
  };

  const isBusy = isSubmitting;

  return (
    <div className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-bg-main text-left font-sans md:items-center md:justify-center p-0 md:p-6">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden md:h-auto md:grid md:grid-cols-[0.95fr_1.05fr] card-bubble bg-white shadow-xl border-2 border-border-main">
        <main className="relative flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-10 md:items-start md:bg-bg-surface-1 md:px-10 md:py-12 md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-border-main bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-[#008A5E] shadow-xs">
            <Sparkle size={16} weight="duotone" className="text-[#008A5E]" />
            Bé Thóc - Trợ lý Nông trại
          </div>
          <div className="w-36 h-36 mb-4 relative flex items-center justify-center md:h-48 md:w-48">
            <PetMascot staticMood="happy" className="w-full h-full animate-bounce" size={192} />
          </div>
          <div className="flex w-full max-w-[380px] flex-col gap-3 text-center md:text-left">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-text-h md:text-4xl">
              Chăm cây thông minh mỗi ngày!
            </h1>
            <p className="text-sm font-bold leading-relaxed text-text-secondary">
              Ghi nhật ký ruộng vườn, chẩn đoán bệnh nông nghiệp bằng AI và chăm sóc cây trồng cùng Bé Thóc.
            </p>
            <div className="mt-3 hidden grid-cols-2 gap-3 text-left md:grid">
              <div className="card-bubble bg-white p-3 border-2 border-border-main">
                <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary">Duy trì Chuỗi</p>
                <p className="text-xs font-black text-text-h">Thói quen canh tác</p>
              </div>
              <div className="card-bubble bg-white p-3 border-2 border-border-main">
                <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary">Trí tuệ nhân tạo</p>
                <p className="text-xs font-black text-text-h">Chẩn đoán PlantScan</p>
              </div>
            </div>
          </div>
        </main>

        <div className="flex w-full flex-col gap-4 bg-white px-6 pb-8 pt-6 md:px-10 md:py-12 border-t-2 md:border-t-0 md:border-l-2 border-border-main">
          <div className="mb-2 text-left">
            <p className="text-xs font-black uppercase tracking-widest text-[#008A5E]">Đăng nhập an toàn</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-text-h">Chào mừng nông dân trở lại!</h2>
          </div>
          <form className="flex flex-col gap-3.5" onSubmit={handleSubmit(submitLogin)}>
            {errorMsg ? (
              <div className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-center text-xs font-extrabold text-red-600 shadow-xs">
                {errorMsg}
              </div>
            ) : null}
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="email">Email tài khoản</label>
              <div className="relative">
                <EnvelopeSimple size={20} weight="bold" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nongdan@farmy.vn"
                  disabled={isBusy}
                  className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 py-3.5 pl-12 pr-5 text-base font-extrabold text-text-main shadow-xs outline-none transition-all placeholder:text-text-secondary/60 focus:bg-white focus:border-[#008A5E] disabled:opacity-60"
                  {...registerField('email')}
                />
              </div>
              {errors.email ? <p className="ml-1 text-xs font-bold text-red-600">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="password">Mật khẩu</label>
              <div className="relative">
                <LockKey size={20} weight="bold" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu bí mật..."
                  disabled={isBusy}
                  className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 py-3.5 pl-12 pr-12 text-base font-extrabold text-text-main shadow-xs outline-none transition-all placeholder:text-text-secondary/60 focus:bg-white focus:border-[#008A5E] disabled:opacity-60"
                  {...registerField('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                </button>
              </div>
              {errors.password ? <p className="ml-1 text-xs font-bold text-red-600">{errors.password.message}</p> : null}
            </div>

            <div className="flex items-center justify-between mt-1 mb-1 px-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 rounded-lg border-2 border-border-main bg-white checked:bg-[#008A5E] checked:border-[#008A5E] transition-all cursor-pointer shadow-xs"
                    {...registerField('rememberMe')}
                  />
                  <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs font-bold text-text-secondary group-hover:text-text-main transition-colors">Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="text-xs font-bold text-[#008A5E] hover:underline transition-colors focus:outline-none cursor-pointer">
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="btn btn--cyan w-full py-4 text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 active:scale-95"
            >
              <span>{isBusy ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}</span>
              {!isBusy ? <ArrowRight className="h-5 w-5" weight="bold" /> : null}
            </button>

            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-border-main/50"></div>
              </div>
              <div className="relative bg-white px-4 text-xs text-text-secondary font-black">HOẶC</div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.href = 'http://localhost:3000/api/v1/auth/google';
              }}
              className="btn btn--soft w-full py-3.5 text-base font-black flex items-center justify-center gap-3 border-2 border-border-main shadow-xs cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Đăng nhập bằng Google
            </button>

          </form>
          <p className="text-sm font-bold text-text-secondary text-center mt-2">
            Chưa có tài khoản? <button onClick={() => navigate('/register')} className="text-[#008A5E] font-black hover:underline cursor-pointer">Tạo tài khoản ngay</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAuth;
