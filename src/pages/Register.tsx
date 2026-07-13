import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { MascotLottie } from '../components/MascotLottie';
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
      navigate('/onboarding-1');
    } catch (error) {
      setErrorMsg(getErrorMessage(error, 'Đăng ký thất bại. Vui lòng thử lại.'));
    }
  };

  return (
    <div className="w-full min-h-[100svh] flex flex-col relative overflow-hidden bg-bg-surface md:justify-center md:items-center">
      <div className="absolute top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/3 -right-16 w-48 h-48 bg-secondary/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-xl mx-auto flex flex-col h-full md:h-auto md:bg-white md:shadow-xl md:rounded-3xl md:border md:border-border-main overflow-hidden relative z-10">
        <main className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-4 md:py-8 relative">
          <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
            <MascotLottie className="w-full h-full drop-shadow-md" />
          </div>
          <div className="text-center max-w-[320px] w-full flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-text-h">Tạo tài khoản mới</h1>
            <p className="text-base text-text-main/70">Bắt đầu hành trình nông nghiệp thông minh của bạn.</p>
          </div>
        </main>

        <div className="w-full bg-bg-main rounded-t-[32px] md:rounded-none border-t-2 md:border-t border-border-main pt-6 pb-8 px-6 flex flex-col gap-4 shadow-2xl md:shadow-none">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(submitRegister)}>
            {errorMsg ? (<div className="bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-semibold rounded-full px-4 py-2 text-center mb-2">
              {errorMsg}
            </div>) : null}
            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="fullname">Họ và tên</label>
              <input
                id="fullname"
                type="text"
                autoComplete="name"
                placeholder="Nhập họ và tên"
                disabled={isSubmitting}
                className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all outline-none disabled:opacity-60"
                {...registerField('name')}
              />
              {errors.name ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="farmer@example.com"
                disabled={isSubmitting}
                className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all outline-none disabled:opacity-60"
                {...registerField('email')}
              />
              {errors.email ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="register-password">Mật khẩu</label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="Tạo mật khẩu"
                disabled={isSubmitting}
                className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all outline-none disabled:opacity-60"
                {...registerField('password')}
              />
              {errors.password ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.password.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="confirm-password">Nhập lại mật khẩu</label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                disabled={isSubmitting}
                className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all outline-none disabled:opacity-60"
                {...registerField('confirmPassword')}
              />
              {errors.confirmPassword ? <p className="ml-2 text-xs font-semibold text-red-600">{errors.confirmPassword.message}</p> : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-3 px-6 rounded-full shadow-[0_4px_14px_rgba(8,168,85,0.25)] hover:bg-primary-container active:scale-95 transition-all cursor-pointer mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>
          <p className="text-sm text-text-main/60 text-center mt-2">
            Đã có tài khoản? <button onClick={() => navigate('/')} className="text-primary font-bold hover:underline cursor-pointer">Đăng nhập</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
