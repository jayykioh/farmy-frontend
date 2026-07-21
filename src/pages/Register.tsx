/* Hallmark · page: register · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ArrowRight, LockKey, EnvelopeSimple, Plant, User, ShieldCheck, X } from '@phosphor-icons/react';
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
    <div className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-bg-main text-left font-sans md:items-center md:justify-center p-0 md:p-6">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden md:h-auto md:grid md:grid-cols-[0.95fr_1.05fr] card-bubble bg-white shadow-xl border-2 border-border-main">
        <main className="relative flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-10 md:items-start md:bg-bg-surface-1 md:px-10 md:py-12 md:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-border-main bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-[#008A5E] shadow-xs">
            <Plant className="h-4 w-4 text-[#008A5E]" weight="duotone" />
            Khởi đầu cùng Bé Thóc
          </div>
          <div className="w-36 h-36 mb-4 relative flex items-center justify-center md:h-48 md:w-48">
            <PetMascot staticMood="happy" className="w-full h-full animate-bounce" size={192} />
          </div>
          <div className="flex w-full max-w-[380px] flex-col gap-3 text-center md:text-left">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-text-h md:text-4xl">Tạo nhịp chăm vườn riêng.</h1>
            <p className="text-sm font-bold leading-relaxed text-text-secondary">
              Bắt đầu với nhật ký nông trại, nhắc việc thông minh và trợ lý AI theo sát thói quen chăm cây của bạn.
            </p>
            <div className="mt-3 hidden rounded-3xl border-2 border-border-main bg-white p-4 text-left shadow-xs md:block">
              <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary">Đã bao gồm</p>
              <p className="mt-1 text-xs font-extrabold text-text-h">Nhật ký offline, soi bệnh cây, lịch nhắc tưới và nuôi mascot nhận quà.</p>
            </div>
          </div>
        </main>

        <div className="flex w-full flex-col gap-4 bg-white px-6 pb-8 pt-6 md:px-10 md:py-12 border-t-2 md:border-t-0 md:border-l-2 border-border-main">
          <div className="mb-2 text-left">
            <p className="text-xs font-black uppercase tracking-widest text-[#008A5E]">Tạo tài khoản mới</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-text-h">Thông tin đăng ký</h2>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(submitRegister)}>
            {errorMsg ? (
              <div className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-center text-xs font-extrabold text-red-600 shadow-xs">
                {errorMsg}
              </div>
            ) : null}
            
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="fullname">Họ và tên</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" weight="duotone" />
                <input
                  id="fullname"
                  type="text"
                  autoComplete="name"
                  placeholder="Nhập tên của bạn..."
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 py-3.5 pl-12 pr-5 text-base font-extrabold text-text-main shadow-xs outline-none transition-all placeholder:text-text-secondary/60 focus:bg-white focus:border-[#008A5E] disabled:opacity-60"
                  {...registerField('name')}
                />
              </div>
              {errors.name ? <p className="ml-1 text-xs font-bold text-red-600">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="register-email">Email tài khoản</label>
              <div className="relative">
                <EnvelopeSimple className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" weight="duotone" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="nongdan@farmy.vn"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 py-3.5 pl-12 pr-5 text-base font-extrabold text-text-main shadow-xs outline-none transition-all placeholder:text-text-secondary/60 focus:bg-white focus:border-[#008A5E] disabled:opacity-60"
                  {...registerField('email')}
                />
              </div>
              {errors.email ? <p className="ml-1 text-xs font-bold text-red-600">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="register-password">Mật khẩu</label>
              <div className="relative">
                <LockKey className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" weight="duotone" />
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Tạo mật khẩu an toàn..."
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 py-3.5 pl-12 pr-5 text-base font-extrabold text-text-main shadow-xs outline-none transition-all placeholder:text-text-secondary/60 focus:bg-white focus:border-[#008A5E] disabled:opacity-60"
                  {...registerField('password')}
                />
              </div>
              {errors.password ? <p className="ml-1 text-xs font-bold text-red-600">{errors.password.message}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-text-secondary ml-1" htmlFor="confirm-password">Nhập lại mật khẩu</label>
              <div className="relative">
                <LockKey className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" weight="duotone" />
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu để xác nhận..."
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border-2 border-border-main bg-bg-surface-1 py-3.5 pl-12 pr-5 text-base font-extrabold text-text-main shadow-xs outline-none transition-all placeholder:text-text-secondary/60 focus:bg-white focus:border-[#008A5E] disabled:opacity-60"
                  {...registerField('confirmPassword')}
                />
              </div>
              {errors.confirmPassword ? <p className="ml-1 text-xs font-bold text-red-600">{errors.confirmPassword.message}</p> : null}
            </div>

            <div className="mt-1 flex items-start gap-3 px-1">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  id="acceptPolicy"
                  className="peer appearance-none w-5 h-5 rounded-lg border-2 border-border-main bg-white checked:bg-[#008A5E] checked:border-[#008A5E] transition-all cursor-pointer shadow-xs"
                  {...registerField('acceptPolicy')}
                />
                <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <label htmlFor="acceptPolicy" className="text-xs font-bold text-text-secondary cursor-pointer">
                  Tôi đã đọc và đồng ý với{' '}
                  <button type="button" onClick={() => setShowPolicyModal(true)} className="font-black text-[#008A5E] hover:underline outline-none">
                    Chính sách Bảo mật & Phân tích AI
                  </button>
                </label>
                {errors.acceptPolicy ? <p className="text-xs font-bold text-red-600 mt-1">{errors.acceptPolicy.message}</p> : null}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn--cyan w-full py-4 text-base font-black flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 active:scale-95 mt-2"
            >
              <span>{isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản nông dân'}</span>
              {!isSubmitting ? <ArrowRight className="h-5 w-5" weight="bold" /> : null}
            </button>
          </form>
          <p className="text-sm font-bold text-text-secondary text-center mt-2">
            Đã có tài khoản? <button onClick={() => navigate('/login')} className="text-[#008A5E] font-black hover:underline cursor-pointer">Đăng nhập</button>
          </p>
        </div>
      </div>

      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="card-bubble bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border-2 border-border-main animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b-2 border-border-main flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-light/20 text-[#008A5E] p-2 rounded-full border border-primary-light/30">
                  <ShieldCheck size={20} weight="duotone" />
                </div>
                <h3 className="font-black text-xl text-text-h">Chính sách Phân tích AI & Dữ liệu</h3>
              </div>
              <button onClick={() => setShowPolicyModal(false)} className="p-2 text-text-secondary hover:text-text-main transition-colors bg-bg-surface-2 rounded-full border border-border-main/50 cursor-pointer active:scale-95">
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4 text-sm font-semibold text-text-secondary leading-relaxed">
                <p>
                  Để cung cấp tính năng <strong>Khám bệnh cây trồng (Plant Scan)</strong> và <strong>Trợ lý Nông nghiệp (Pet AI)</strong>, Farmy sử dụng công nghệ trí tuệ nhân tạo (Gemini Vision AI).
                </p>
                <div className="p-4 bg-primary-light/10 rounded-2xl border-2 border-border-main space-y-2">
                  <h4 className="font-extrabold text-[#008A5E] text-base">Việc thu thập dữ liệu bao gồm:</h4>
                  <ul className="list-disc pl-5 space-y-1 font-bold">
                    <li><strong>Hình ảnh cây trồng:</strong> Hình ảnh bạn upload để chẩn đoán bệnh sẽ được mã hóa và gửi đến mô hình AI để phân tích.</li>
                    <li><strong>Nhật ký & Hội thoại:</strong> Nội dung chat và nhật ký của bạn có thể được AI ngữ cảnh hóa để đưa ra lời khuyên cá nhân hóa nhất.</li>
                  </ul>
                </div>
                <p>
                  Bằng việc tạo tài khoản, bạn đồng ý cấp quyền cho Farmy sử dụng các dữ liệu trên để cải thiện độ chính xác của AI và trải nghiệm của bạn. Farmy cam kết không bán dữ liệu của bạn cho bên thứ ba.
                </p>
                <p className="text-xs text-text-secondary italic">
                  Bạn có thể tùy chỉnh các quyền chia sẻ dữ liệu này trong phần Cài đặt Tài khoản sau khi đăng nhập.
                </p>
              </div>
            </div>
            <div className="p-4 border-t-2 border-border-main flex justify-end">
              <button 
                onClick={() => setShowPolicyModal(false)}
                className="btn btn--cyan px-6 py-2.5 font-extrabold text-sm cursor-pointer active:scale-95"
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
