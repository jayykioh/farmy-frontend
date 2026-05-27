import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';

export const WelcomeAuth: React.FC = () => {
  const navigate = useNavigate();

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
          </div>
        </main>

        <div className="w-full bg-bg-main rounded-t-[32px] md:rounded-none border-t-2 md:border-t border-border-main pt-8 pb-10 px-6 flex flex-col gap-6 shadow-2xl md:shadow-none">
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/onboarding-1')}
              className="w-full bg-primary text-on-primary font-bold py-4 px-6 rounded-full flex items-center justify-center gap-3 transition-all duration-100 ease-in-out border-2 border-primary hover:bg-primary-container active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.72 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="currentColor"></path>
                <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.72 17.58C14.74 18.24 13.48 18.64 12 18.64C9.14 18.64 6.71 16.71 5.84 14.13H2.16V16.98C3.98 20.59 7.7 23 12 23Z" fill="currentColor"></path>
                <path d="M5.84 14.13C5.62 13.47 5.49 12.75 5.49 12C5.49 11.25 5.62 10.53 5.84 9.87V7.02H2.16C1.41 8.52 1 10.22 1 12C1 13.78 1.41 15.48 2.16 16.98L5.84 14.13Z" fill="currentColor"></path>
                <path d="M12 5.36C13.62 5.36 15.06 5.92 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.98 3.41 2.16 7.02L5.84 9.87C6.71 7.29 9.14 5.36 12 5.36Z" fill="currentColor"></path>
              </svg>
              Continue with Google
            </button>
          </div>
          <p className="text-sm text-text-main/60 text-center">Start your farming journey</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAuth;
