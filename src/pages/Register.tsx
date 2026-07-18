import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ArrowRight, LockKeyhole, Mail, Sprout, UserRound } from 'lucide-react';
import { PetMascot } from '../features/pet/components/PetMascot';
import { useAuthStore } from '../store/authStore';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Vui lòng nhập họ tên.'),
  email: z.string().trim().min(1, 'Vui lòng nhập email.').email('Email không hợp lệ.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
  confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu.'),
}).refine((values) => values.password === values.confirmPassword, {
  message: 'Mật khẩu nhập lại không khớp.',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [errorMsg, setErrorMsg] = useState('');
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const submitRegister = async (values: RegisterFormValues) => {
    setErrorMsg('');

    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate('/home');
    } catch (error) {
      setErrorMsg(getErrorMessage(error, 'Đăng ký thất bại. Vui lòng thử lại.'));
    }
  };

  return (
    <div className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[linear-gradient(155deg,#f8fff7_0%,#ffffff_45%,#fff4d8_100%)] md:items-center md:justify-center">
      <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:radial-gradient(circle_at_1px_1px,rgba(20,30,23,0.12)_1px,transparent_0)] [background-size:26px_26px]" />
      <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary-lightest/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-secondary-light/45 blur-3xl" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden md:h-auto md:grid md:grid-cols-[0.95fr_1.05fr] md:rounded-[36px] md:border md:border-white/80 md:bg-white/65 md:shadow-[0_30px_100px_rgba(20,30,23,0.14)] md:backdrop-blur-xl">
        <main className="relative flex flex-1 flex-col items-center justify-center px-6 pb-4 pt-10 md:items-start md:bg-[radial-gradient(circle_at_35%_25%,rgba(121,252,158,0.22),transparent_34%)] md:px-10 md:py-12 md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3.5 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary-container shadow-sm">
            <Sprout className="h-3.5 w-3.5" />
            Start your farm log
          </div>
          <div className="w-32 h-32 mb-4 relative flex items-center justify-center md:h-44 md:w-44">
            <PetMascot staticMood="happy" className="w-full h-full drop-shadow-md" size={176} />
          </div>
          <div className="flex w-full max-w-[360px] flex-col gap-3 text-center md:text-left">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-text-h md:text-5xl">Tạo nhịp chăm vườn riêng.</h1>
            <p className="text-base font-semibold leading-7 text-text-main/65">Bắt đầu với nhật ký nông trại, nhắc việc thông minh và trợ lý AI theo sát thói quen chăm cây của bạn.</p>
            <div className="mt-2 hidden rounded-3xl border border-white/80 bg-white/70 p-4 text-left shadow-sm md:block">
              <p className="text-xs font-black uppercase tracking-wider text-text-main/40">Included</p>
              <p className="mt-1 text-sm font-extrabold text-text-h">Offline diary, crop scans, reminders, and pet progress.</p>
            </div>
          </div>
        </main>

        <div className="flex w-full flex-col gap-4 rounded-t-[32px] border-t border-border-main/50 bg-bg-main/95 px-6 pb-8 pt-6 shadow-[0_-20px_70px_rgba(20,30,23,0.08)] md:rounded-none md:border-l md:border-t-0 md:bg-white/80 md:px-10 md:py-12 md:shadow-none">
          <div className="mb-2 text-left">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-container/60">Create account</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-text-h">Thông tin đăng ký</h2>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(submitRegister)}>
            {errorMsg ? (<div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs font-extrabold text-red-600 shadow-sm">
              {errorMsg}
            </div>) : null}
            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="fullname">Họ và tên</label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-main/35" />
                <input
                  id="fullname"
                  type="text"
                  autoComplete="name"
                  placeholder="Nhập họ và tên"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-border-main/55 bg-white py-3.5 pl-12 pr-5 text-base font-semibold shadow-[0_8px_24px_rgba(20,30,23,0.04)] outline-none transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                  {...registerField('name')}
                />
              </div>
              {errors.name ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="register-email">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-main/35" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="farmer@example.com"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-border-main/55 bg-white py-3.5 pl-12 pr-5 text-base font-semibold shadow-[0_8px_24px_rgba(20,30,23,0.04)] outline-none transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                  {...registerField('email')}
                />
              </div>
              {errors.email ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="register-password">Mật khẩu</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-main/35" />
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Tạo mật khẩu"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-border-main/55 bg-white py-3.5 pl-12 pr-5 text-base font-semibold shadow-[0_8px_24px_rgba(20,30,23,0.04)] outline-none transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                  {...registerField('password')}
                />
              </div>
              {errors.password ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.password.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="confirm-password">Nhập lại mật khẩu</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-main/35" />
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-border-main/55 bg-white py-3.5 pl-12 pr-5 text-base font-semibold shadow-[0_8px_24px_rgba(20,30,23,0.04)] outline-none transition-all placeholder:text-text-main/30 focus:border-primary/45 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
                  {...registerField('confirmPassword')}
                />
              </div>
              {errors.confirmPassword ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.confirmPassword.message}</p> : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary-container px-6 py-3.5 font-extrabold text-white shadow-[0_16px_34px_rgba(0,109,53,0.24)] transition-all hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_20px_42px_rgba(8,168,85,0.28)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative">{isSubmitting ? 'Đang đăng ký...' : 'Tạo tài khoản'}</span>
              {!isSubmitting ? <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" /> : null}
            </button>
          </form>
          <p className="text-sm text-text-main/60 text-center mt-2">
            Đã có tài khoản? <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline cursor-pointer">Đăng nhập</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
