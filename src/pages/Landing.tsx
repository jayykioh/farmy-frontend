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
  Sprout
} from 'lucide-react';
import { MascotLottie } from '../components/MascotLottie';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FBF8] font-sans text-slate-800 overflow-x-hidden selection:bg-primary/20 selection:text-primary flex flex-col">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 w-full flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#058a43] rounded-xl shadow-lg flex items-center justify-center p-2">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            FarmDiaries <span className="text-primary">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="hidden md:block px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            Bắt đầu miễn phí
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex-1 pt-12 pb-24 md:pt-20 md:pb-32 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">Enterprise-Grade Smart Agriculture</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
            Grow better <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#0ea5e9] to-[#058a43]">
              every single day.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
            Nền tảng nhật ký nông nghiệp tích hợp AI đầu tiên tại Việt Nam. Theo dõi nông trại, chăm sóc cây trồng và chẩn đoán bệnh tức thì qua camera điện thoại.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/register')}
              className="cursor-pointer w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-bold rounded-full shadow-[0_8px_24px_rgba(8,168,85,0.3)] hover:shadow-[0_12px_32px_rgba(8,168,85,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Trải nghiệm ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="cursor-pointer w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-full border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-sm"
            >
              Đăng nhập
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm font-medium text-slate-500 pt-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Powered by Gemini
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> PWA Ready
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg relative mt-10 lg:mt-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] blur-2xl -z-10 transform rotate-6 scale-105" />
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 p-8 rounded-[3rem] shadow-2xl relative">
            <div className="aspect-square relative flex items-center justify-center">
              <MascotLottie className="w-[120%] h-[120%] drop-shadow-2xl" />
            </div>
            
            {/* Floating Glass Cards */}
            <div className="absolute -left-2 md:-left-6 top-10 md:top-20 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Cà chua</p>
                <p className="text-xs md:text-sm font-bold text-slate-800 whitespace-nowrap">Sức khỏe 100%</p>
              </div>
            </div>
            
            <div className="absolute -right-2 md:-right-8 bottom-12 md:bottom-24 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Nhắc nhở</p>
                <p className="text-xs md:text-sm font-bold text-slate-800 whitespace-nowrap">Đã tưới nước</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Công nghệ hiện đại cho nông nghiệp truyền thống</h2>
            <p className="text-lg text-slate-600">Được thiết kế chuyên biệt cho nhà nông, FarmDiaries ứng dụng AI để tối ưu hóa quá trình canh tác mỗi ngày.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<ScanLine className="w-6 h-6 text-emerald-600" />}
              iconBg="bg-emerald-100"
              title="Smart Vision"
              desc="Chẩn đoán bệnh cây trồng ngay lập tức qua ảnh chụp với độ chính xác cao bằng Gemini Vision."
            />
            <FeatureCard 
              icon={<MessageSquare className="w-6 h-6 text-blue-600" />}
              iconBg="bg-blue-100"
              title="AI Companion"
              desc="Hỏi đáp mọi vấn đề nông nghiệp. AI trả lời dựa trên tài liệu chuẩn và dữ liệu nhật ký của bạn."
            />
            <FeatureCard 
              icon={<Cat className="w-6 h-6 text-amber-600" />}
              iconBg="bg-amber-100"
              title="Gamified Farm"
              desc="Thú cưng đồng hành ảo thay đổi tâm trạng dựa trên tần suất ghi chép nhật ký của bạn."
            />
            <FeatureCard 
              icon={<BellRing className="w-6 h-6 text-purple-600" />}
              iconBg="bg-purple-100"
              title="Smart Alerts"
              desc="Nhận cảnh báo quan trọng qua App, Email và Zalo trực tiếp đến thiết bị của bạn."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-white">FarmDiaries AI</span>
          </div>
          <p className="text-sm">
            Capstone Project SDN392 • FPT University
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, iconBg, title, desc }: { icon: React.ReactNode, iconBg: string, title: string, desc: string }) => (
  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
