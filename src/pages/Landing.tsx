import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sprout, 
  ChevronRight,
  ScanLine,
  MessageSquare,
  Activity,
  ArrowRight
} from 'lucide-react';
import { PetMascot } from '../features/pet/components/PetMascot';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 70, damping: 20 }
  },
};

const hoverCardVariant = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -8, 
    scale: 1.01,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
};

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
  // Parallax effect for the hero background
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 150]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbfd] font-sans text-[#1d1d1f] selection:bg-[#34C759]/20 selection:text-[#1d1d1f] overflow-x-hidden relative">
      
      {/* Ambient Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#34C759]/[0.04] blur-[140px] rounded-full"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-[#007AFF]/[0.03] blur-[120px] rounded-full"
        />
      </div>

      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/70 backdrop-blur-2xl border-b border-black/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.03)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" onClick={() => window.scrollTo(0, 0)}>
            <Sprout className="w-7 h-7 text-[#1d1d1f]" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight">FARMY</span>
          </div>
          <div className="flex items-center gap-6 text-[15px] font-semibold">
            <button 
              onClick={() => navigate('/login')}
              className="hidden md:block text-[#48484a] hover:text-[#1d1d1f] transition-colors"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-[#1d1d1f] text-white px-5 py-2.5 rounded-full hover:bg-black hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              Bắt đầu ngay
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-28 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 mb-10 rounded-full bg-white/60 border border-black/[0.05] shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]"></span>
            </span>
            <span className="text-[11px] font-bold tracking-widest text-[#1d1d1f] uppercase">Phiên bản 1.0 đã ra mắt</span>
          </motion.div>
          
          <motion.h1 variants={fadeUpVariant} className="text-[40px] md:text-[64px] lg:text-[80px] font-black leading-[1.05] tracking-tight mb-8 max-w-5xl">
            Tương lai của <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1d1d1f] via-[#48484a] to-[#86868b]">
              nông nghiệp thông minh.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUpVariant} className="text-[18px] md:text-[22px] font-medium leading-relaxed text-[#86868b] max-w-2xl mb-12">
            Đơn giản hóa việc quản lý nông trại. Ghi chép nhật ký, theo dõi thời tiết và phân tích dữ liệu trên một nền tảng tinh gọn, tập trung vào điều quan trọng nhất: cây trồng của bạn.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/register')}
              className="group flex items-center justify-center gap-2 bg-[#1d1d1f] text-white px-8 py-4 rounded-full text-[17px] font-semibold hover:bg-black hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] active:scale-95 transition-all duration-300"
            >
              Trải nghiệm miễn phí
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center justify-center bg-white text-[#1d1d1f] px-8 py-4 rounded-full text-[17px] font-semibold border border-black/[0.08] hover:border-black/[0.15] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
            >
              Tìm hiểu thêm
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section className="relative px-6 pb-32 pt-10 max-w-7xl mx-auto w-full z-10">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* AI Feature */}
          <motion.div 
            variants={fadeUpVariant}
            whileHover="hover"
            initial="rest"
            className="lg:col-span-2 rounded-[32px] bg-white p-10 flex flex-col justify-between border border-black/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          >
            <div>
              <div className="w-14 h-14 rounded-[20px] bg-[#f5f5f7] flex items-center justify-center mb-6">
                <ScanLine className="w-7 h-7 text-[#1d1d1f]" strokeWidth={2} />
              </div>
              <h3 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-3">Nhận diện bệnh AI.</h3>
              <p className="text-[#86868b] leading-relaxed text-[17px] font-medium">
                Chụp ảnh lá cây, phân tích tức thời và đưa ra hướng dẫn điều trị chính xác với độ tin cậy cao từ hệ thống chuyên gia.
              </p>
            </div>
          </motion.div>

          {/* Gamified Farm with Pet Mascot */}
          <motion.div 
            variants={fadeUpVariant}
            whileHover="hover"
            initial="rest"
            className="lg:col-span-2 rounded-[32px] bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] p-10 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/[0.02]"
          >
            <div className="mb-6 bg-white/60 backdrop-blur-xl p-4 rounded-full shadow-sm">
              <PetMascot staticMood="happy" size={120} className="drop-shadow-xl hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="text-[24px] font-bold tracking-tight text-[#1d1d1f] mb-2">Thú cưng đồng hành.</h3>
            <p className="text-[#86868b] leading-relaxed text-[16px] font-medium max-w-[320px]">
              Tâm trạng thú cưng phản ánh tần suất bạn chăm sóc nông trại, biến công việc ghi chép thành niềm vui.
            </p>
          </motion.div>

          {/* AI Assistant */}
          <motion.div 
            variants={fadeUpVariant}
            whileHover="hover"
            initial="rest"
            className="lg:col-span-2 rounded-[32px] bg-white p-10 border border-black/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          >
            <div className="w-14 h-14 rounded-[20px] bg-[#f5f5f7] flex items-center justify-center mb-6">
              <MessageSquare className="w-7 h-7 text-[#1d1d1f]" strokeWidth={2} />
            </div>
            <h3 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-3">Trợ lý ảo.</h3>
            <p className="text-[#86868b] leading-relaxed text-[17px] font-medium mb-8">
              Hỏi đáp mọi vấn đề nông nghiệp dựa trên lịch sử nông trại của bạn.
            </p>
            <div className="bg-[#f5f5f7] rounded-[20px] p-5 border border-black/[0.03]">
              <p className="text-[15px] text-[#48484a] font-medium italic">"Cà chua của tôi bị vàng lá phần gốc, tôi nên làm gì?"</p>
            </div>
          </motion.div>

          {/* Diary Tracking */}
          <motion.div 
            variants={fadeUpVariant}
            whileHover="hover"
            initial="rest"
            className="lg:col-span-2 rounded-[32px] bg-white p-10 border border-black/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          >
            <div className="w-14 h-14 rounded-[20px] bg-[#f5f5f7] flex items-center justify-center mb-6">
              <Activity className="w-7 h-7 text-[#1d1d1f]" strokeWidth={2} />
            </div>
            <h3 className="text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-3">Theo dõi Nhật ký.</h3>
            <p className="text-[#86868b] leading-relaxed text-[17px] font-medium mb-8">
              Ghi chép sinh trưởng, tưới tiêu một cách có hệ thống và khoa học.
            </p>
            <div className="flex gap-4">
              <div className="bg-[#E8F8F5] px-5 py-4 rounded-[20px] border border-[#34C759]/20 w-full sm:w-auto">
                 <p className="text-[11px] font-bold text-[#248A3D] uppercase tracking-widest mb-1">Tưới nước</p>
                 <p className="text-[16px] font-bold text-[#1d1d1f]">Hoàn thành 8:00 AM</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="relative px-6 py-24 mb-12 max-w-5xl mx-auto z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="bg-[#1d1d1f] rounded-[40px] p-12 md:p-20 overflow-hidden relative"
        >
          <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-gradient-to-br from-[#34C759]/20 to-transparent blur-[100px] pointer-events-none" />
          
          <h2 className="text-[32px] md:text-[48px] font-bold text-white mb-6 tracking-tight relative z-10">
            Sẵn sàng để bắt đầu?
          </h2>
          <p className="text-[17px] text-[#a1a1a6] font-medium mb-10 max-w-2xl mx-auto relative z-10">
            Tham gia cùng hàng ngàn nông dân Việt Nam đang ứng dụng công nghệ để nâng cao năng suất và chất lượng mùa vụ mỗi ngày.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="relative z-10 bg-white text-[#1d1d1f] px-10 py-5 rounded-full text-[17px] font-bold hover:scale-105 shadow-[0_8px_30px_rgba(255,255,255,0.2)] transition-all duration-300"
          >
            Tạo tài khoản miễn phí
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-black/[0.04] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-[#86868b]" />
            <span className="font-bold text-[#86868b] tracking-tight text-[15px]">FARMY</span>
          </div>
          <div className="text-[#86868b] text-[14px] font-medium flex items-center gap-4">
            <span>© 2026 FARMY.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default Landing;
