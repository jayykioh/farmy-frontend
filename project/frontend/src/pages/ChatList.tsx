import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotLottie } from '../components/MascotLottie';

export const ChatList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-[100svh] bg-bg-surface-1 text-left font-sans pb-[100px] relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-[-20px] w-40 h-40 bg-primary-light/20 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-[-20px] w-60 h-60 bg-secondary-light/20 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl mx-auto px-4 md:px-8 pt-4 pb-12 relative min-h-[100svh] flex flex-col">
        
        {/* Header - TopAppBar alternative */}
        <div className="flex justify-between items-center mb-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border border-border-main/50 shadow-sm p-1">
              <MascotLottie className="w-full h-full -mt-1" />
            </div>
            <h1 className="text-2xl font-extrabold text-text-h">Tri Kỷ AI</h1>
          </div>
          <button 
            onClick={() => navigate('/chat/active')}
            className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-full font-bold shadow-sm active:scale-95 hover:bg-primary-container transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Chat mới
          </button>
        </div>

        {/* Chat List Section */}
        <div className="space-y-4">
          
          {/* Session Card 1 */}
          <div 
            onClick={() => navigate('/chat/active')}
            className="bg-white border border-border-main/50 p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-50 border border-yellow-100 text-yellow-800 text-[11px] font-extrabold rounded-lg uppercase tracking-wider">Lúa</span>
                <span className="text-text-main/50 text-[12px] font-bold">Vụ Hè Thu</span>
              </div>
              <span className="text-text-main/50 text-[12px] font-bold">Hôm qua</span>
            </div>
            <div className="mt-1">
              <p className="text-text-main font-extrabold text-lg line-clamp-1">Tư vấn bệnh vàng lá</p>
              <p className="text-text-main/80 text-sm line-clamp-2 mt-1">Bé Thóc ơi, lúa nhà mình bị vàng lá ở phần ngọn, không biết là do thiếu phân hay bị rầy nâu vậy?</p>
            </div>
          </div>

          {/* Session Card 2 */}
          <div 
            onClick={() => navigate('/chat/active')}
            className="bg-white border border-border-main/50 p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary-lightest/30 border border-primary-lightest/50 text-primary-container text-[11px] font-extrabold rounded-lg uppercase tracking-wider">Cà phê</span>
                <span className="text-text-main/50 text-[12px] font-bold">Vườn Đắk Lắk</span>
              </div>
              <span className="text-text-main/50 text-[12px] font-bold">Thứ 2</span>
            </div>
            <div className="mt-1">
              <p className="text-text-main font-extrabold text-lg line-clamp-1">Bón phân định kỳ tháng 10</p>
              <p className="text-text-main/80 text-sm line-clamp-2 mt-1">Cảm ơn Bé Thóc, mình đã bón phân theo công thức bạn chỉ, cây xanh mướt hơn hẳn luôn...</p>
            </div>
          </div>

          {/* Session Card 3 */}
          <div 
            onClick={() => navigate('/chat/active')}
            className="bg-white border border-border-main/50 p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-50 border border-blue-100 text-blue-800 text-[11px] font-extrabold rounded-lg uppercase tracking-wider">Chung</span>
                <span className="text-text-main/50 text-[12px] font-bold">Hỏi đáp nông nghiệp</span>
              </div>
              <span className="text-text-main/50 text-[12px] font-bold">2 tuần trước</span>
            </div>
            <div className="mt-1">
              <p className="text-text-main font-extrabold text-lg line-clamp-1">Cách ủ phân hữu cơ</p>
              <p className="text-text-main/80 text-sm line-clamp-2 mt-1">Hướng dẫn mình cách tận dụng rơm rạ sau mùa gặt để làm phân bón hữu cơ tại nhà nhé.</p>
            </div>
          </div>
        </div>

        {/* Mascot & Interaction Hint */}
        <div className="mt-12 flex flex-col items-center">
          <div className="relative">
            {/* Mascot Lottie */}
            <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
              <MascotLottie className="w-full h-full drop-shadow-lg" />
            </div>
            {/* Speech Bubble */}
            <div className="bg-white border border-border-main/50 absolute -top-8 left-1/2 -translate-x-1/2 px-5 py-2 rounded-[20px] rounded-br-sm whitespace-nowrap shadow-sm animate-[bounce_4s_ease-in-out_infinite]">
              <p className="text-text-main font-bold text-sm">Bé Thóc luôn lắng nghe bạn!</p>
            </div>
          </div>
          <p className="text-text-main/70 text-sm mt-4 text-center max-w-[240px]">Lịch sử trò chuyện của bạn sẽ được lưu giữ tại đây.</p>
        </div>
      </main>
    </div>
  );
};

export default ChatList;
