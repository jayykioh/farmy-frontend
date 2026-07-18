import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  ChevronRight,
  ScanLine,
  MessageSquare,
  Activity
} from 'lucide-react';
import { PetMascot } from '../features/pet/components/PetMascot';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans text-[#1d1d1f] selection:bg-[#30d158]/20 selection:text-[#1d1d1f] overflow-x-hidden">
      {/* Navigation Bar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/70 backdrop-blur-[20px] saturate-[180%] border-b border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.02)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
            <Sprout className="w-7 h-7 text-[#1d1d1f]" strokeWidth={2.5} />
            <span className="text-xl font-semibold tracking-tight">FarmDiaries</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => navigate('/login')}
              className="hidden md:block text-[#1d1d1f] hover:text-[#86868b] transition-colors"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-[#1d1d1f] text-white px-5 py-2 rounded-full hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            >
              Bắt đầu
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white/40 border border-black/[0.05] shadow-sm backdrop-blur-md animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse"></span>
          <span className="text-xs font-semibold tracking-wide text-[#86868b] uppercase">Phiên bản 1.0 đã ra mắt</span>
        </div>
        
        <h1 className="text-[clamp(2.5rem,5vw+1rem,5rem)] font-bold leading-[1.05] tracking-tight mb-6 max-w-4xl animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          Tương lai của <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1d1d1f] to-[#86868b]">nông nghiệp thông minh.</span>
        </h1>
        
        <p className="text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed text-[#86868b] max-w-2xl mb-12 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          Đơn giản hóa việc quản lý nông trại. Ghi chép nhật ký, theo dõi thời tiết và phân tích dữ liệu trên một nền tảng tinh gọn, tập trung vào điều quan trọng nhất: cây trồng của bạn.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <button 
            onClick={() => navigate('/register')}
            className="group flex items-center justify-center gap-2 bg-[#1d1d1f] text-white px-8 py-4 rounded-full text-lg font-medium hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            Trải nghiệm miễn phí
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center justify-center bg-white text-[#1d1d1f] px-8 py-4 rounded-full text-lg font-medium border border-black/5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            Tìm hiểu thêm
          </button>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="px-6 pb-32 pt-16 max-w-7xl mx-auto w-full animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* AI Feature */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-8 flex flex-col justify-between border border-black/[0.04]">
            <div>
              <ScanLine className="w-8 h-8 text-[#1d1d1f] mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-2">Nhận diện bệnh AI.</h3>
              <p className="text-[#86868b] leading-relaxed text-[15px]">
                Chụp ảnh lá cây, phân tích tức thời và đưa ra hướng dẫn điều trị chính xác.
              </p>
            </div>
          </div>

          {/* Gamified Farm with Pet Mascot */}
          <div className="lg:col-span-2 rounded-3xl bg-[#f5f5f7] p-8 flex flex-col items-center justify-center text-center">
            <div className="mb-4">
              <PetMascot staticMood="happy" size={100} className="drop-shadow-sm" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-[#1d1d1f] mb-1">Thú cưng đồng hành.</h3>
            <p className="text-[#86868b] leading-relaxed text-[15px] max-w-[280px]">
              Tâm trạng thú cưng phản ánh tần suất bạn chăm sóc nông trại.
            </p>
          </div>

          {/* AI Assistant */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-8 border border-black/[0.04]">
            <MessageSquare className="w-8 h-8 text-[#1d1d1f] mb-4" strokeWidth={1.5} />
            <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-2">Trợ lý ảo.</h3>
            <p className="text-[#86868b] leading-relaxed text-[15px] mb-6">
              Hỏi đáp mọi vấn đề nông nghiệp dựa trên lịch sử nông trại của bạn.
            </p>
            <div className="bg-[#f5f5f7] rounded-2xl p-4">
              <p className="text-[13px] text-[#86868b] italic">"Cà chua của tôi bị vàng lá phần gốc, tôi nên làm gì?"</p>
            </div>
          </div>

          {/* Diary Tracking */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-8 border border-black/[0.04]">
            <Activity className="w-8 h-8 text-[#1d1d1f] mb-4" strokeWidth={1.5} />
            <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-2">Theo dõi Nhật ký.</h3>
            <p className="text-[#86868b] leading-relaxed text-[15px] mb-6">
              Ghi chép sinh trưởng, tưới tiêu một cách có hệ thống và khoa học.
            </p>
            <div className="flex gap-3">
              <div className="bg-[#f5f5f7] p-3 rounded-xl border border-black/[0.02]">
                 <p className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">Tưới nước</p>
                 <p className="text-[13px] font-medium text-[#1d1d1f] mt-1">Hoàn thành 8:00 AM</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-12 border-t border-black/[0.05]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-[#86868b]" />
            <span className="font-semibold text-[#86868b] tracking-tight">FarmDiaries</span>
          </div>
          <div className="text-[#86868b] text-sm font-medium flex items-center gap-4">
            <span>© 2026 FarmDiaries.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 800ms cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}} />
    </div>
  );
};

export default Landing;
