import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';

export const Register: React.FC = () => {
  const navigate = useNavigate();

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
          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="fullname">Họ và tên</label>
              <input 
                id="fullname"
                type="text" 
                placeholder="Nhập họ và tên" 
                className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all outline-none" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="username">Tên đăng nhập / Email</label>
              <input 
                id="username"
                type="text" 
                placeholder="Email hoặc số điện thoại" 
                className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all outline-none" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="password">Mật khẩu</label>
              <input 
                id="password"
                type="password" 
                placeholder="Tạo mật khẩu" 
                className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all outline-none" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-text-main ml-2" htmlFor="confirm_password">Nhập lại mật khẩu</label>
              <input 
                id="confirm_password"
                type="password" 
                placeholder="Nhập lại mật khẩu" 
                className="w-full bg-white border border-border-main/80 rounded-full px-6 py-3 font-medium text-base focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all outline-none" 
              />
            </div>
            
            <button 
              onClick={() => navigate('/onboarding-1')}
              className="w-full bg-primary text-white font-bold py-3 px-6 rounded-full shadow-[0_4px_14px_rgba(8,168,85,0.25)] hover:bg-primary-container active:scale-95 transition-all cursor-pointer mt-1"
            >
              Đăng ký
            </button>
            
          </div>
          <p className="text-sm text-text-main/60 text-center mt-2">
            Đã có tài khoản? <button onClick={() => navigate('/')} className="text-primary font-bold hover:underline cursor-pointer">Đăng nhập</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
