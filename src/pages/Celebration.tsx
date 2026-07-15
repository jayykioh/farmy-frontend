import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PetMascot } from '../features/pet/components/PetMascot';

export const Celebration: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-surface-1 relative text-left font-sans flex flex-col items-center justify-center overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-lightest/50 to-bg-surface-1"></div>

      {/* Decorative Elements (Confetti/Stars) */}
      <div className="absolute top-10 left-10 text-yellow-400 animate-[bounce_3s_ease-in-out_infinite]">
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <div className="absolute top-20 right-12 text-yellow-400 animate-[bounce_2s_ease-in-out_infinite] delay-100">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <div className="absolute bottom-40 left-8 text-primary-light animate-[bounce_2s_ease-in-out_infinite] opacity-50 delay-200">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
      <div className="absolute bottom-52 right-10 text-yellow-400 animate-[bounce_3s_ease-in-out_infinite] delay-300">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>

      {/* Main Content Canvas */}
      <main className="w-full max-w-md px-6 flex flex-col items-center z-10 relative">
        
        {/* Mascot & XP Container */}
        <div className="relative mb-8 mt-12 w-48 h-48 flex items-center justify-center animate-[bounce_2s_ease-in-out_infinite]">
          {/* Bé Thóc Mascot Image */}
          <div className="w-40 h-40 rounded-full border-[6px] border-white shadow-2xl bg-white overflow-hidden p-2 flex items-center justify-center">
             <PetMascot staticMood="excited" className="w-full h-full -mt-2" size={144} />
          </div>
          {/* Floating XP Popup */}
          <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 border-4 border-yellow-100 rounded-full px-5 py-2 shadow-[0_6px_0_0_#fde047] animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite] z-20">
            <span className="text-2xl font-black">+30XP</span>
          </div>
        </div>

        {/* Typography Context */}
        <div className="text-center mb-8 flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-primary">Great job!</h1>
          <p className="text-lg font-medium text-text-main/70">You completed today’s farm diary.</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8 flex flex-col gap-3 bg-white p-4 rounded-[24px] shadow-sm border border-border-main/50">
          <div className="flex justify-between items-end px-2">
            <span className="font-bold text-text-main/70">Level 4</span>
            <span className="font-extrabold text-primary">120 / 150 XP</span>
          </div>
          {/* Thick, rounded track */}
          <div className="h-6 bg-bg-surface-1 rounded-full overflow-hidden border border-border-main/30 relative w-full">
            {/* Indicator */}
            <div className="h-full bg-primary relative rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2" style={{ width: '80%' }}>
              {/* Highlight 'shine' */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-t-full"></div>
            </div>
          </div>
        </div>

        {/* Badge Card */}
        <div className="bg-white border border-border-main/50 rounded-[20px] p-4 flex items-center gap-4 w-full mb-12 shadow-sm relative overflow-hidden group hover:border-yellow-300 transition-colors">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-yellow-100/50 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 w-14 h-14 rounded-full flex items-center justify-center border border-yellow-200 shadow-sm relative z-10 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-yellow-500 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-xl font-extrabold text-text-main">7-day streak!</span>
            <span className="font-medium text-text-main/70">Consistency unlocked.</span>
          </div>
        </div>

        {/* Continue Button */}
        <button 
          onClick={() => navigate('/diary')}
          className="w-full bg-primary text-white font-bold text-xl rounded-full py-4 px-8 border-b-[4px] border-primary-container active:border-b-0 active:translate-y-[4px] hover:brightness-105 transition-all duration-100 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-[0_10px_20px_rgba(8,168,85,0.2)]"
        >
          Continue
        </button>
      </main>

    </div>
  );
};

export default Celebration;
