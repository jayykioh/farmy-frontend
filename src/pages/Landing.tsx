import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  ScanLine, 
  MessageSquare, 
  Cat, 
  BellRing,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sprout,
  Activity,
  Smartphone
} from 'lucide-react';
import { PetMascot } from '../features/pet/components/PetMascot';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FBFBFD] font-sans text-slate-900 selection:bg-primary/20 selection:text-primary flex flex-col">
      <div className="pointer-events-none fixed inset-0 opacity-[0.4] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:24px_24px]" />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/70 bg-white/72 shadow-[0_1px_0_rgba(20,30,23,0.04)] backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-container rounded-2xl shadow-[0_10px_22px_rgba(0,109,53,0.22)] flex items-center justify-center p-2">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              FarmDiaries
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="hidden md:block cursor-pointer rounded-full px-5 py-2.5 text-sm font-extrabold text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="group relative isolate cursor-pointer overflow-hidden rounded-full bg-slate-950 px-6 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-[0_16px_34px_rgba(15,23,42,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            >
              <span className="absolute inset-0 bg-gradient-to-b from-white/14 to-transparent opacity-70" />
              <span className="relative">Bắt đầu miễn phí</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/75 px-4 py-2 text-emerald-700 shadow-[0_8px_24px_rgba(8,168,85,0.08)] backdrop-blur">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">Ứng dụng Nông nghiệp Thông minh</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
            Canh tác thông minh, <br/>
            <span className="text-emerald-600">
              hiệu quả mỗi ngày.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
            Nền tảng nhật ký nông nghiệp tích hợp AI đầu tiên tại Việt Nam. Theo dõi nông trại, chăm sóc cây trồng và chẩn đoán bệnh tức thì qua camera điện thoại.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/register')}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-[24px] bg-primary-container px-8 py-4 text-lg font-extrabold text-white shadow-[0_18px_38px_rgba(0,109,53,0.24)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:shadow-[0_22px_44px_rgba(8,168,85,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-auto"
            >
              <span className="relative">Trải nghiệm ngay</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full cursor-pointer rounded-[24px] border border-slate-200/90 bg-white/90 px-8 py-4 text-lg font-extrabold text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_34px_rgba(15,23,42,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:w-auto"
            >
              Đăng nhập
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm font-medium text-slate-500 pt-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> AI Powered
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-400" /> PWA Ready
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg relative mt-10 lg:mt-0">
          <div className="relative overflow-hidden rounded-[3rem] border border-black/[0.04] bg-white/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="aspect-square relative flex items-center justify-center">
              <PetMascot staticMood="happy" className="w-[120%] h-[120%] drop-shadow-lg" size={200} />
            </div>
            
            {/* Floating UI Elements */}
            <div className="absolute -left-2 md:-left-6 top-10 md:top-20 bg-white/95 p-3 md:p-4 rounded-2xl shadow-[0_18px_38px_rgba(20,30,23,0.12)] border border-white flex items-center gap-3 backdrop-blur">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Cà chua</p>
                <p className="text-xs md:text-sm font-bold text-slate-900 whitespace-nowrap">Sức khỏe Tốt</p>
              </div>
            </div>
            
            <div className="absolute -right-2 md:-right-8 bottom-12 md:bottom-24 bg-white/95 p-3 md:p-4 rounded-2xl shadow-[0_18px_38px_rgba(20,30,23,0.12)] border border-white flex items-center gap-3 backdrop-blur">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Nhắc nhở</p>
                <p className="text-xs md:text-sm font-bold text-slate-900 whitespace-nowrap">Đã tưới nước</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="relative z-10 border-t border-emerald-900/5 bg-white/82 py-24 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-primary-container/70">Field-ready tools</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Tính năng nổi bật</h2>
            <p className="text-lg text-slate-600 leading-relaxed">Mọi thứ bạn cần để quản lý nông trại thông minh và hiệu quả hơn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 (Large) */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[32px] border border-black/[0.04] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-[0_10px_24px_rgba(8,168,85,0.10)] border border-emerald-100 flex items-center justify-center mb-6">
                  <ScanLine className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Nhận diện bệnh bằng AI</h3>
                <p className="text-slate-600 leading-relaxed max-w-sm">
                  Chụp ảnh lá cây hoặc vùng bị bệnh, Gemini AI sẽ phân tích và đưa ra chẩn đoán tức thời cùng hướng dẫn điều trị chính xác.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500">
                <ScanLine className="w-64 h-64 translate-x-12 translate-y-12" />
              </div>
            </div>

            {/* Feature 2 (Tall) */}
            <div className="md:col-span-1 md:row-span-2 group relative overflow-hidden rounded-[32px] border border-black/[0.02] bg-[#111111] p-8 text-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Trợ lý AI Đồng hành</h3>
                <p className="text-slate-300 leading-relaxed mb-8">
                  Hỏi đáp mọi vấn đề nông nghiệp. Trợ lý ảo am hiểu tài liệu chuyên ngành và lịch sử nông trại của bạn.
                </p>
              </div>
              <div className="mt-auto relative z-10 bg-white/[0.07] backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <p className="text-sm text-slate-300 italic">"Cà chua của tôi bị vàng lá phần gốc, tôi nên làm gì?"</p>
              </div>
            </div>

            {/* Feature 3 (Small) */}
            <div className="group rounded-[32px] border border-black/[0.04] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
              <div className="w-12 h-12 bg-[#FFF8E6] rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105">
                <Cat className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Gamified Farm</h3>
              <p className="text-slate-600 leading-relaxed">
                Thú cưng đồng hành ảo thay đổi tâm trạng dựa trên tần suất ghi chép nhật ký của bạn.
              </p>
            </div>

            {/* Feature 4 (Small) */}
            <div className="group rounded-[32px] border border-black/[0.04] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
              <div className="w-12 h-12 bg-[#FFF1F2] rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
                <Activity className="w-6 h-6 text-[#F43F5E]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Theo dõi Nhật ký</h3>
              <p className="text-slate-600 leading-relaxed">
                Ghi chép quá trình sinh trưởng, tưới tiêu, bón phân một cách có hệ thống và khoa học.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-white">FarmDiaries</span>
          </div>
          <div className="text-slate-400 text-sm flex items-center gap-2">
            <span>© 2024 FarmDiaries</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>Capstone Project SDN392</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
