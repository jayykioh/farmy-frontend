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
import { MascotLottie } from '../components/MascotLottie';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-primary/20 selection:text-primary flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl shadow-sm flex items-center justify-center p-2">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              FarmDiaries
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="hidden md:block px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-full shadow-sm hover:bg-slate-800 transition-all duration-200 cursor-pointer"
            >
              Bắt đầu miễn phí
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide">Ứng dụng Nông nghiệp Thông minh</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
            Canh tác thông minh, <br/>
            <span className="text-primary">
              hiệu quả mỗi ngày.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
            Nền tảng nhật ký nông nghiệp tích hợp AI đầu tiên tại Việt Nam. Theo dõi nông trại, chăm sóc cây trồng và chẩn đoán bệnh tức thì qua camera điện thoại.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/register')}
              className="cursor-pointer w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Trải nghiệm ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="cursor-pointer w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
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
          <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -z-10 transform scale-105" />
          <div className="bg-white border border-slate-200 p-8 rounded-[3rem] shadow-xl relative">
            <div className="aspect-square relative flex items-center justify-center">
              <MascotLottie className="w-[120%] h-[120%] drop-shadow-lg" />
            </div>
            
            {/* Floating UI Elements */}
            <div className="absolute -left-2 md:-left-6 top-10 md:top-20 bg-white p-3 md:p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">Cà chua</p>
                <p className="text-xs md:text-sm font-bold text-slate-900 whitespace-nowrap">Sức khỏe Tốt</p>
              </div>
            </div>
            
            <div className="absolute -right-2 md:-right-8 bottom-12 md:bottom-24 bg-white p-3 md:p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
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
      <section className="relative z-10 py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Tính năng nổi bật</h2>
            <p className="text-lg text-slate-600 leading-relaxed">Mọi thứ bạn cần để quản lý nông trại thông minh và hiệu quả hơn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 (Large) */}
            <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:bg-slate-100 transition-colors group relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
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
            <div className="md:col-span-1 md:row-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Trợ lý AI Đồng hành</h3>
                <p className="text-slate-300 leading-relaxed mb-8">
                  Hỏi đáp mọi vấn đề nông nghiệp. Trợ lý ảo am hiểu tài liệu chuyên ngành và lịch sử nông trại của bạn.
                </p>
              </div>
              <div className="mt-auto relative z-10 bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700">
                <p className="text-sm text-slate-300 italic">"Cà chua của tôi bị vàng lá phần gốc, tôi nên làm gì?"</p>
              </div>
            </div>

            {/* Feature 3 (Small) */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:bg-slate-100 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                <Cat className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Gamified Farm</h3>
              <p className="text-slate-600 leading-relaxed">
                Thú cưng đồng hành ảo thay đổi tâm trạng dựa trên tần suất ghi chép nhật ký của bạn.
              </p>
            </div>

            {/* Feature 4 (Small) */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:bg-slate-100 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-rose-500" />
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
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
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
