/* Hallmark · page: landing · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plant, 
  Scan,
  ChatCircleText,
  Pulse as ActivityIcon,
  ArrowRight,
  Flame,
  Heart,
  CaretRight
} from '@phosphor-icons/react';
import { PetMascot } from '../features/pet/components/PetMascot';

interface StarBurst {
  id: number;
  x: number;
  y: number;
}

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [starBursts, setStarBursts] = useState<StarBurst[]>([]);
  const nextStarburstId = useRef(0);
  const [bubbleText, setBubbleText] = useState("Chào mừng bạn! Hãy chăm sóc cây cùng mình nhé 🌿");

  const bubbleTips = [
    "Hôm nay trời rất đẹp, hãy kiểm tra lá cây nhé! ☀️",
    "Ghi nhật ký mỗi ngày giúp Bé Thóc nhanh lên cấp lắm đó! 🌱",
    "Theo dõi nhật ký thường xuyên để phát hiện sâu bệnh kịp thời! 🌾",
    "Nếu thấy lá có đốm nâu, hãy dùng tính năng Quét cây ngay nhé! 🔍",
    "Đất khô hay ẩm? Hãy chạm nhẹ vào đất để cảm nhận độ ẩm. 💧"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Rotate bubble tips periodically
    const interval = setInterval(() => {
      const randomTip = bubbleTips[Math.floor(Math.random() * bubbleTips.length)];
      setBubbleText(randomTip);
    }, 8000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const triggerStarburst = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newBurst: StarBurst = {
      id: nextStarburstId.current++,
      x,
      y
    };
    
    setStarBursts(prev => [...prev, newBurst]);
    setTimeout(() => {
      setStarBursts(prev => prev.filter(b => b.id !== newBurst.id));
    }, 420);
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] font-sans text-[var(--color-ink)] selection:bg-[var(--color-accent-2)]/30 overflow-x-hidden relative flex flex-col justify-between">
      
      {/* Navigation Bar (Clean bubble pill style) */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-2xl border-b border-[var(--color-border-main)] shadow-[0_4px_30px_rgba(0,0,0,0.02)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Plant size={26} weight="duotone" className="text-[#008A5E]" />
            <span className="text-xl font-black tracking-tight uppercase">FARMY</span>
          </div>

          <div className="flex items-center gap-4 text-sm font-bold">
            <button 
              onClick={() => navigate('/login')}
              className="text-[var(--color-ink-2)] hover:text-[var(--color-ink)] transition-colors px-3 py-2 cursor-pointer"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="btn py-2 px-5 text-xs cursor-pointer"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10 w-full">
        {/* Glow behind hero */}
        <div className="absolute top-10 w-[70%] h-[200px] bg-[var(--color-accent)]/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full bg-white/70 border border-[var(--color-border-main)] shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-3)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent-3)]"></span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-[var(--color-ink-2)] uppercase font-mono">NÔNG NGHIỆP THÔNG MINH</span>
        </div>
        
        <h1 className="text-[42px] md:text-[68px] lg:text-[84px] font-extrabold leading-[1.05] tracking-tight mb-8 max-w-5xl">
          Nông nghiệp thông minh <br />
          <span className="hl">trở nên thú vị hơn.</span>
        </h1>
        
        <p className="text-[17px] md:text-[20px] font-medium leading-relaxed text-[var(--color-ink-2)] max-w-2xl mb-12">
          Đơn giản hóa việc quản lý vườn tược. Ghi chép nhật ký sinh trưởng, quét bệnh AI và đồng hành cùng thú cưng ảo Bé Thóc đáng yêu.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-20">
          <button 
            onClick={(e) => {
              triggerStarburst(e);
              setTimeout(() => navigate('/register'), 350);
            }}
            className="btn btn--coral px-8 py-4 text-base relative cursor-pointer"
          >
            Trải nghiệm miễn phí
            <ArrowRight size={20} weight="bold" />
            
            {starBursts.map(burst => (
              <span
                key={burst.id}
                className="star-burst"
                style={{ left: burst.x, top: burst.y }}
              />
            ))}
          </button>
        </div>

        {/* Mascot Mascot Showcase (Character moment) */}
        <div className="w-full max-w-md mx-auto relative mb-28">
          <div className="absolute inset-0 bg-[var(--color-accent)]/8 blur-[80px] rounded-full -z-10" />
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              setStarBursts(prev => [...prev, { id: nextStarburstId.current++, x, y }]);
              // Poke pet interaction
              const tips = [
                "Ouch! Bạn chọc mình à? 🌾",
                "Hihi vui quá, tiếp tục chọc đi! ⭐",
                "Bé Thóc đang đói, hãy ghi nhật ký để cho mình ăn nhé! 🥦",
                "Hãy ghi chép bón phân hôm nay nhé! 🌾",
                "Chăm chỉ ghi chép là chìa khóa nông dân giỏi! 🥇"
              ];
              setBubbleText(tips[Math.floor(Math.random() * tips.length)]);
            }}
            className="card-bubble p-10 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center relative cursor-pointer group"
          >
            <div className="absolute top-[-44px] bg-white border border-[var(--color-border-main)] rounded-2xl px-5 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] text-xs font-bold leading-relaxed max-w-[280px]">
              <p className="m-0 text-[var(--color-ink)]">{bubbleText}</p>
              <div className="absolute bottom-[-6px] left-[50%] translate-x-[-50%] w-3 h-3 bg-white border-r border-b border-[var(--color-border-main)] rotate-45" />
            </div>

            <div className="transform group-hover:scale-105 transition-transform duration-500 my-4">
              <PetMascot staticMood="happy" size={150} className="drop-shadow-xl" />
            </div>
            
            <span className="text-[10px] font-bold font-mono tracking-widest text-[var(--color-ink-2)] bg-[var(--color-paper-2)] border border-[var(--color-border-main)] px-3.5 py-1 rounded-full uppercase flex items-center gap-1.5">
              <ActivityIcon size={14} weight="duotone" className="text-[var(--color-accent-2)]" />
              Chạm vào Bé Thóc
            </span>

            {starBursts.map(burst => (
              <span
                key={burst.id}
                className="star-burst"
                style={{ left: burst.x, top: burst.y }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase (Color-shift Card Grid) */}
      <section className="px-6 py-28 max-w-7xl mx-auto w-full z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="eyebrow block mb-3 font-mono font-bold text-xs uppercase text-[var(--color-accent-2)]">TÍNH NĂNG CỐT LÕI</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Được xây dựng cho nông trại của bạn.
          </h2>
          <p className="text-sm text-[var(--color-ink-2)]">
            Bộ công cụ trực quan hóa giúp biến các ghi chép khô khan thành trải nghiệm sinh động.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AI Feature */}
          <div className="card-bubble card-bubble--cyan p-8 flex flex-col justify-between min-h-[260px] text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent-2)]/10 flex items-center justify-center mb-6">
                <Scan size={24} weight="duotone" className="text-[var(--color-accent-2)]" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[var(--color-ink)] mb-2">Nhận diện sâu bệnh AI.</h3>
              <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
                Chụp ảnh lá cây bị bệnh, hệ thống AI sẽ phân tích tức thời và đưa ra hướng dẫn điều trị hữu cơ an toàn.
              </p>
            </div>
          </div>

          {/* Gamified Farm with Pet Mascot */}
          <div className="card-bubble card-bubble--pear p-8 flex flex-col justify-between min-h-[260px] text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center mb-6">
                <Heart size={24} weight="duotone" className="text-[var(--color-accent-3)]" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[var(--color-ink)] mb-2">Thú cưng đồng hành.</h3>
              <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
                Nuôi nấng Bé Thóc lớn lên bằng việc ghi nhật ký canh tác. Thú cưng vui vẻ khi bạn chăm chỉ!
              </p>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="card-bubble card-bubble--pear p-8 flex flex-col justify-between min-h-[260px] text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center mb-6">
                <ChatCircleText size={24} weight="duotone" className="text-[var(--color-ink)]" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[var(--color-ink)] mb-2">Trợ lý ảo thông minh.</h3>
              <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
                Hỏi đáp trực tiếp với trợ lý về cây trồng dựa trên chính lịch sử ghi chép nông trại của bạn.
              </p>
            </div>
          </div>

          {/* Diary Tracking */}
          <div className="card-bubble card-bubble--coral p-8 flex flex-col justify-between min-h-[260px] text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent-3)]/10 flex items-center justify-center mb-6">
                <ActivityIcon size={24} weight="duotone" className="text-[var(--color-accent-3)]" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[var(--color-ink)] mb-2">Ghi chép Sinh trưởng.</h3>
              <p className="text-xs text-[var(--color-ink-2)] leading-relaxed">
                Quản lý tiến độ tưới tiêu, bón phân một cách khoa học. Đo lường chuỗi ngày liên tiếp chăm chỉ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section (Statement layout) */}
      <section className="px-6 py-20 mb-12 max-w-5xl mx-auto w-full text-center">
        <div className="card-bubble card-bubble--pear p-12 md:p-20 overflow-hidden relative border-2 border-border-main shadow-md">
          <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-gradient-to-br from-[#008A5E]/10 to-transparent blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight relative z-10 text-[#1d1d1f]">
            Sẵn sàng canh tác vui vẻ?
          </h2>
          <p className="text-base md:text-lg text-[#2d3748] font-extrabold mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Tham gia cùng hàng ngàn nông dân Việt Nam đang ứng dụng công nghệ để nâng cao năng suất và chất lượng mùa vụ mỗi ngày.
          </p>
          <button 
            onClick={(e) => {
              triggerStarburst(e);
              setTimeout(() => navigate('/register'), 350);
            }}
            className="btn btn--coral relative z-10 px-10 py-5 text-md hover:scale-105"
          >
            Đăng ký tài khoản miễn phí
            
            {starBursts.map(burst => (
              <span
                key={burst.id}
                className="star-burst"
                style={{ left: burst.x, top: burst.y }}
              />
            ))}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-[var(--color-border-main)] relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Plant size={20} weight="duotone" className="text-[#008A5E]" />
            <span className="font-extrabold text-[var(--color-ink)] tracking-tight text-sm uppercase">FARMY</span>
          </div>
          <div className="text-[var(--color-ink-2)] text-xs font-bold font-mono flex items-center gap-4">
            <span>© 2026 FARMY.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default Landing;
