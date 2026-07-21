/* Hallmark · page: celebration · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46-50)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PetMascot } from '../features/pet/components/PetMascot';

export const Celebration: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-main relative text-left font-sans flex flex-col items-center justify-center overflow-hidden p-4">
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-yellow-400 animate-bounce">
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <div className="absolute top-20 right-12 text-yellow-400 animate-bounce delay-100">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>
      <div className="absolute bottom-40 left-8 text-[#008A5E] opacity-60 animate-bounce delay-200">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
      <div className="absolute bottom-52 right-10 text-yellow-400 animate-bounce delay-300">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </div>

      {/* Main Content Canvas */}
      <main className="w-full max-w-md px-4 flex flex-col items-center z-10 relative">
        
        {/* Mascot & XP Container */}
        <div className="relative mb-6 mt-8 w-48 h-48 flex items-center justify-center animate-bounce">
          {/* Bé Thóc Mascot Image */}
          <div className="w-40 h-40 rounded-full border-4 border-border-main shadow-lg bg-white overflow-hidden p-2 flex items-center justify-center card-bubble">
             <PetMascot staticMood="excited" className="w-full h-full -mt-2" size={144} />
          </div>
          {/* Floating XP Popup */}
          <div className="absolute -top-3 -right-3 card-bubble bg-yellow-400 text-yellow-950 border-2 border-border-main rounded-full px-5 py-2 shadow-md animate-pulse z-20">
            <span className="text-2xl font-black">+30 XP</span>
          </div>
        </div>

        {/* Typography Context */}
        <div className="text-center mb-6 flex flex-col gap-1">
          <h1 className="text-4xl font-black text-[#008A5E]">Xuất sắc lắm!</h1>
          <p className="text-base font-extrabold text-text-secondary">Bạn đã hoàn thành nhật ký nông vụ hôm nay.</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-6 flex flex-col gap-3 card-bubble bg-white p-5 shadow-sm border-2 border-border-main">
          <div className="flex justify-between items-end px-1">
            <span className="font-black text-text-h text-sm">Cấp độ 4</span>
            <span className="font-black text-[#008A5E] text-sm">120 / 150 XP</span>
          </div>
          {/* Thick, rounded track */}
          <div className="h-6 bg-bg-surface-1 rounded-full overflow-hidden border-2 border-border-main relative w-full">
            {/* Indicator */}
            <div className="h-full bg-[#008A5E] relative rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2" style={{ width: '80%' }}>
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-t-full"></div>
            </div>
          </div>
        </div>

        {/* Badge Card */}
        <div className="card-bubble bg-white border-2 border-border-main p-4 flex items-center gap-4 w-full mb-8 relative overflow-hidden">
          <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center border-2 border-yellow-300 shadow-xs relative z-10 flex-shrink-0">
            <svg className="w-8 h-8 text-yellow-600 drop-shadow-xs" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <div className="flex flex-col relative z-10">
            <span className="text-lg font-black text-text-h">Chuỗi 7 ngày liên tục!</span>
            <span className="text-sm font-bold text-text-secondary">Đã mở khóa huy hiệu Chăm Chỉ.</span>
          </div>
        </div>

        {/* Continue Button */}
        <button 
          onClick={() => navigate('/diary')}
          className="btn btn--cyan w-full py-4 text-xl font-black cursor-pointer shadow-md"
        >
          Tiếp tục chăm vườn
        </button>
      </main>

    </div>
  );
};

export default Celebration;
