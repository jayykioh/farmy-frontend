import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';
import { api } from '../api/client';

export const WelcomeAuth: React.FC = () => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = () => {
    window.location.assign(`${apiBaseUrl}/auth/google`);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/login', {
        email: 'user@farmy.com',
        password: 'UserPassword123',
      });
      const token = res.data?.data?.accessToken;
      if (token) {
        localStorage.setItem('access_token', token);
        navigate('/home');
      } else {
        setErrorMsg('Không lấy được token đăng nhập!');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Đăng nhập thử nghiệm thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100svh] flex flex-col relative overflow-hidden bg-bg-surface md:justify-center md:items-center">
      <div className="absolute top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/3 -right-16 w-48 h-48 bg-secondary/30 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-xl mx-auto flex flex-col h-full md:h-auto md:bg-white md:shadow-xl md:rounded-3xl md:border md:border-border-main overflow-hidden relative z-10">
        <main className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 md:py-16 relative">
          <div className="w-48 h-48 mb-8 relative flex items-center justify-center">
            <MascotLottie className="w-full h-full drop-shadow-md" />
          </div>
          <div className="text-center max-w-[320px] w-full flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-text-h">Grow better every day</h1>
            <p className="text-lg text-text-main/70">Track your farm, build habits, and care for your crops with AI.</p>
            {errorMsg && <p className="text-sm font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl">{errorMsg}</p>}
          </div>
        </main>

        <div className="w-full bg-bg-main rounded-t-[32px] md:rounded-none border-t-2 md:border-t border-border-main pt-8 pb-10 px-6 flex flex-col gap-6 shadow-2xl md:shadow-none">
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleGoogleLogin}
              type="button"
              className="w-full bg-white text-gray-700 font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-100 ease-in-out border border-gray-300 shadow-sm hover:bg-gray-50 active:scale-95 cursor-pointer"
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
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-100 ease-in-out shadow-md hover:bg-primary-dark active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Đang kết nối...' : 'Đăng nhập Demo (user@farmy.com)'}
            </button>
          </div>
          <p className="text-sm text-text-main/60 text-center">Sign in to start managing your farm</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAuth;
