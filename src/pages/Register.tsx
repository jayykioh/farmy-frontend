import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ArrowRight, LockKeyhole, Mail, Sprout, UserRound, ShieldCheck, X } from 'lucide-react';
import { PetMascot } from '../features/pet/components/PetMascot';
import { useAuthStore } from '../store/authStore';

const registerSchema = z.object({
  name: z.string().trim().min(1, 'Vui lòng nhập họ tên.'),
  email: z.string().trim().min(1, 'Vui lòng nhập email.').email('Email không hợp lệ.'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu.'),
  confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu.'),
  acceptPolicy: z.boolean().refine((val) => val === true, {
    message: 'Bạn phải đồng ý với chính sách bảo mật & phân tích AI.',
  }),
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
  const [showPolicyModal, setShowPolicyModal] = useState(false);
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
      // @ts-ignore - for zod literal true init
      acceptPolicy: false,
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
    <div className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#FBFBFD] md:items-center md:justify-center">
      <div className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden md:h-auto md:grid md:grid-cols-[0.95fr_1.05fr] md:rounded-[36px] md:border md:border-black/[0.04] md:bg-white/80 md:shadow-[0_24px_80px_rgba(0,0,0,0.04)] md:backdrop-blur-xl">
        <main className="relative flex flex-1 flex-col items-center justify-center px-6 pb-4 pt-10 md:items-start md:bg-transparent md:px-10 md:py-12 md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-black/[0.02] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
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

        <div className="flex w-full flex-col gap-4 rounded-t-[32px] border-t border-black/[0.04] bg-white px-6 pb-8 pt-6 shadow-[0_-20px_40px_rgba(0,0,0,0.02)] md:rounded-none md:border-l md:border-t-0 md:bg-white/95 md:px-10 md:py-12 md:shadow-none backdrop-blur-2xl">
          <div className="mb-2 text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Create account</p>
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

            <div className="mt-1 flex items-start gap-3 px-1">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  id="acceptPolicy"
                  className="peer appearance-none w-5 h-5 rounded-[6px] border-2 border-border-main/55 bg-white checked:bg-primary checked:border-primary transition-all cursor-pointer shadow-sm hover:border-primary/50"
                  {...registerField('acceptPolicy')}
                />
                <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <label htmlFor="acceptPolicy" className="text-sm font-medium text-text-main/70 cursor-pointer">
                  Tôi đã đọc và đồng ý với{' '}
                  <button type="button" onClick={() => setShowPolicyModal(true)} className="font-bold text-primary hover:underline outline-none">
                    Chính sách Bảo mật & Phân tích AI
                  </button>
                </label>
                {errors.acceptPolicy ? <p className="text-xs font-semibold text-red-600 mt-1">{errors.acceptPolicy.message}</p> : null}
              </div>
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

      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-black/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-black text-xl text-text-h">Chính sách Phân tích AI & Dữ liệu</h3>
              </div>
              <button onClick={() => setShowPolicyModal(false)} className="p-2 text-text-main/40 hover:text-text-main/80 transition-colors bg-black/[0.02] hover:bg-black/[0.04] rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4 text-sm font-medium text-text-main/70 leading-relaxed">
                <p>
                  Để cung cấp tính năng <strong>Khám bệnh cây trồng (Plant Scan)</strong> và <strong>Trợ lý Nông nghiệp (Pet AI)</strong>, Farmy sử dụng công nghệ trí tuệ nhân tạo (Gemini Vision AI).
                </p>
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                  <h4 className="font-bold text-primary text-base">Việc thu thập dữ liệu bao gồm:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Hình ảnh cây trồng:</strong> Hình ảnh bạn upload để chẩn đoán bệnh sẽ được mã hóa và gửi đến mô hình AI để phân tích.</li>
                    <li><strong>Nhật ký & Hội thoại:</strong> Nội dung chat và nhật ký của bạn có thể được AI ngữ cảnh hóa để đưa ra lời khuyên cá nhân hóa nhất.</li>
                  </ul>
                </div>
                <p>
                  Bằng việc tạo tài khoản, bạn đồng ý cấp quyền cho Farmy sử dụng các dữ liệu trên để cải thiện độ chính xác của AI và trải nghiệm của bạn. Farmy cam kết không bán dữ liệu của bạn cho bên thứ ba.
                </p>
                <p className="text-xs text-text-main/50 italic">
                  Bạn có thể tùy chỉnh các quyền chia sẻ dữ liệu này trong phần Cài đặt Tài khoản sau khi đăng nhập.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-black/[0.04] flex justify-end">
              <button 
                onClick={() => setShowPolicyModal(false)}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Đã hiểu và Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
