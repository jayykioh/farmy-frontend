/* Hallmark · component: HomeEcoSection · genre: playful · theme: Hum
 * states: default · hover · focus · active
 * contrast: pass (46–50)
 * Pre-emit critique: P5 H4 E5 S5 R4 V5
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  Tree,
  Drop,
  Wind,
  Sun,
  Recycle,
  Heart,
  ArrowRight,
  Star,
  CheckCircle,
  Globe,
  Plant,
} from '@phosphor-icons/react';

// ─── Inline SVG mascots ────────────────────────────────────────────────────

/** Lá Xanh — a cheeky little leaf mascot */
const LaXanh: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Lá Xanh mascot"
    role="img"
  >
    {/* Body — rounded leaf shape */}
    <ellipse cx="32" cy="36" rx="20" ry="24" fill="#4CAF50" />
    <ellipse cx="32" cy="36" rx="20" ry="24" fill="url(#leafGrad)" />
    {/* Face */}
    <circle cx="26" cy="34" r="3.5" fill="white" />
    <circle cx="38" cy="34" r="3.5" fill="white" />
    <circle cx="27" cy="34.5" r="1.8" fill="#1a472a" />
    <circle cx="39" cy="34.5" r="1.8" fill="#1a472a" />
    {/* Blush */}
    <ellipse cx="23" cy="38" rx="3" ry="1.8" fill="#ff9999" opacity="0.6" />
    <ellipse cx="41" cy="38" rx="3" ry="1.8" fill="#ff9999" opacity="0.6" />
    {/* Smile */}
    <path d="M27 42 Q32 46 37 42" stroke="#1a472a" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Stem */}
    <path d="M32 12 Q36 22 32 28" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Leaf tip */}
    <ellipse cx="32" cy="14" rx="5" ry="8" fill="#66BB6A" transform="rotate(-15 32 14)" />
    {/* Arms */}
    <path d="M13 36 Q16 30 20 34" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M51 36 Q48 30 44 34" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" fill="none" />
    <defs>
      <linearGradient id="leafGrad" x1="32" y1="12" x2="32" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#81C784" />
        <stop offset="100%" stopColor="#388E3C" />
      </linearGradient>
    </defs>
  </svg>
);

/** Bé Đất — a warm, round soil buddy */
const BeDat: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Bé Đất mascot"
    role="img"
  >
    {/* Body */}
    <ellipse cx="32" cy="40" rx="22" ry="20" fill="#8D6E63" />
    <ellipse cx="32" cy="40" rx="22" ry="20" fill="url(#datGrad)" />
    {/* Hat — a little sprout */}
    <ellipse cx="32" cy="22" rx="12" ry="6" fill="#5D4037" />
    <path d="M32 16 Q28 8 24 12 Q28 14 32 16Z" fill="#66BB6A" />
    <path d="M32 16 Q36 8 40 12 Q36 14 32 16Z" fill="#4CAF50" />
    <rect x="30" y="16" width="4" height="8" fill="#5D4037" rx="2" />
    {/* Eyes */}
    <circle cx="26" cy="38" r="3.5" fill="white" />
    <circle cx="38" cy="38" r="3.5" fill="white" />
    <circle cx="26.8" cy="38.5" r="1.8" fill="#3e2723" />
    <circle cx="38.8" cy="38.5" r="1.8" fill="#3e2723" />
    {/* Rosy cheeks */}
    <ellipse cx="22" cy="42" rx="3" ry="1.8" fill="#ff7043" opacity="0.5" />
    <ellipse cx="42" cy="42" rx="3" ry="1.8" fill="#ff7043" opacity="0.5" />
    {/* Smile */}
    <path d="M27 45 Q32 50 37 45" stroke="#3e2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Tiny arms */}
    <ellipse cx="13" cy="42" rx="6" ry="4" fill="#795548" transform="rotate(-20 13 42)" />
    <ellipse cx="51" cy="42" rx="6" ry="4" fill="#795548" transform="rotate(20 51 42)" />
    <defs>
      <linearGradient id="datGrad" x1="32" y1="20" x2="32" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A1887F" />
        <stop offset="100%" stopColor="#6D4C41" />
      </linearGradient>
    </defs>
  </svg>
);

/** Giọt Sương — a sparkly water droplet */
const GiotSuong: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Giọt Sương mascot"
    role="img"
  >
    {/* Body — teardrop */}
    <path d="M32 8 C32 8 12 28 12 42 C12 53 21 60 32 60 C43 60 52 53 52 42 C52 28 32 8 32 8Z" fill="url(#dropGrad)" />
    {/* Shine */}
    <ellipse cx="24" cy="28" rx="5" ry="3" fill="white" opacity="0.4" transform="rotate(-30 24 28)" />
    {/* Eyes */}
    <circle cx="26.5" cy="42" r="3.5" fill="white" />
    <circle cx="37.5" cy="42" r="3.5" fill="white" />
    <circle cx="27.3" cy="42.5" r="1.8" fill="#0d47a1" />
    <circle cx="38.3" cy="42.5" r="1.8" fill="#0d47a1" />
    {/* Blush */}
    <ellipse cx="22" cy="47" rx="3" ry="1.8" fill="#81d4fa" opacity="0.7" />
    <ellipse cx="42" cy="47" rx="3" ry="1.8" fill="#81d4fa" opacity="0.7" />
    {/* Smile */}
    <path d="M27 51 Q32 56 37 51" stroke="#0d47a1" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Star sparkles */}
    <path d="M48 18 L49.5 21 L53 22.5 L49.5 24 L48 27 L46.5 24 L43 22.5 L46.5 21 Z" fill="#B3E5FC" opacity="0.9" />
    <path d="M15 12 L16 14.5 L18.5 15.5 L16 16.5 L15 19 L14 16.5 L11.5 15.5 L14 14.5 Z" fill="#B3E5FC" opacity="0.8" />
    <defs>
      <linearGradient id="dropGrad" x1="32" y1="8" x2="32" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#81D4FA" />
        <stop offset="50%" stopColor="#29B6F6" />
        <stop offset="100%" stopColor="#0288D1" />
      </linearGradient>
    </defs>
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────────────────

const ECO_TIPS = [
  {
    id: 1,
    icon: <Drop size={28} weight="duotone" className="text-sky-500" />,
    title: 'Tiết kiệm nước tưới',
    body: 'Dùng hệ thống tưới nhỏ giọt giúp tiết kiệm đến 50% lượng nước so với tưới phun truyền thống.',
    tag: 'Nước',
    tagColor: 'bg-sky-100 text-sky-700',
    bg: 'from-sky-50 to-cyan-50',
    border: 'border-sky-200',
    mascot: <GiotSuong size={52} />,
  },
  {
    id: 2,
    icon: <Recycle size={28} weight="duotone" className="text-emerald-600" />,
    title: 'Phân compost tự làm',
    body: 'Tận dụng rác hữu cơ bếp nhà (vỏ rau, hoa quả) ủ compost — vừa giảm rác, vừa có phân hữu cơ miễn phí.',
    tag: 'Rác hữu cơ',
    tagColor: 'bg-emerald-100 text-emerald-700',
    bg: 'from-emerald-50 to-green-50',
    border: 'border-emerald-200',
    mascot: <BeDat size={52} />,
  },
  {
    id: 3,
    icon: <Sun size={28} weight="duotone" className="text-amber-500" />,
    title: 'Trồng cây che nắng',
    body: 'Một hàng cây xanh phía tây giúp giảm nhiệt độ vườn xuống 3–5°C vào buổi chiều, bảo vệ rau màu.',
    tag: 'Nhiệt độ',
    tagColor: 'bg-amber-100 text-amber-700',
    bg: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    mascot: <LaXanh size={52} />,
  },
  {
    id: 4,
    icon: <Wind size={28} weight="duotone" className="text-indigo-500" />,
    title: 'Hàng rào cây xanh',
    body: 'Trồng hàng rào cây dứa mỹ hoặc dâm bụt giúp chắn gió, giảm xói mòn đất và tăng đa dạng sinh học.',
    tag: 'Bảo vệ đất',
    tagColor: 'bg-indigo-100 text-indigo-700',
    bg: 'from-indigo-50 to-purple-50',
    border: 'border-indigo-200',
    mascot: <LaXanh size={52} />,
  },
];

const DAILY_CHALLENGES = [
  { id: 'water', text: 'Tiết kiệm 1 xô nước hôm nay', icon: '💧', xp: 20 },
  { id: 'plant', text: 'Trồng thêm 1 cây hôm nay', icon: '🌱', xp: 50 },
  { id: 'compost', text: 'Làm compost từ rác bếp', icon: '♻️', xp: 30 },
  { id: 'share', text: 'Chia sẻ mẹo xanh với bạn bè', icon: '🤝', xp: 15 },
];

const MASCOT_CREW = [
  {
    id: 'laxanh',
    name: 'Lá Xanh',
    role: 'Bảo vệ môi trường',
    emoji: '🌿',
    desc: 'Chiến sĩ cây xanh, yêu thiên nhiên',
    component: <LaXanh size={72} />,
    color: 'from-green-100 to-emerald-50',
    border: 'border-green-200',
  },
  {
    id: 'bedat',
    name: 'Bé Đất',
    role: 'Chuyên gia đất sạch',
    emoji: '🌍',
    desc: 'Yêu đất, ghét hóa chất độc',
    component: <BeDat size={72} />,
    color: 'from-amber-100 to-orange-50',
    border: 'border-amber-200',
  },
  {
    id: 'giotsuong',
    name: 'Giọt Sương',
    role: 'Thần nước trong lành',
    emoji: '💧',
    desc: 'Nhắc mọi người tiết kiệm nước',
    component: <GiotSuong size={72} />,
    color: 'from-sky-100 to-cyan-50',
    border: 'border-sky-200',
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────

/** Animated counter hook */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatCounter({ value, label, suffix = '', icon }: { value: number; label: string; suffix?: string; icon: React.ReactNode }) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/20 flex items-center justify-center mb-1">
        {icon}
      </div>
      <span className="text-3xl font-extrabold text-[var(--color-ink)] tracking-tight font-[var(--font-label)]">
        {count.toLocaleString('vi')}{suffix}
      </span>
      <span className="text-xs font-semibold text-[var(--color-ink-2)] leading-tight max-w-[80px]">{label}</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export const HomeEcoSection: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [activeMascot, setActiveMascot] = useState<string | null>(null);

  const currentTip = ECO_TIPS[tipIndex];

  const toggleChallenge = (id: string) => {
    setCompletedChallenges(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalXP = DAILY_CHALLENGES
    .filter(c => completedChallenges.has(c.id))
    .reduce((sum, c) => sum + c.xp, 0);

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* ── 1. Mascot Crew Section ─────────────────────────────────────── */}
      <section className="w-full text-left">
        <div className="flex items-center gap-2 mb-1 px-1">
          <h3 className="text-[18px] font-extrabold text-[var(--color-ink)] tracking-tight">
            Đội bảo vệ nông trại
          </h3>
          <span className="text-base">🐾</span>
        </div>
        <p className="text-[13px] text-[var(--color-ink-2)] font-medium px-1 mb-4">
          Những người bạn mới của Bé Thóc — cùng bảo vệ môi trường!
        </p>

        <div className="flex overflow-x-auto fade-edges-x gap-4 pb-4 pt-1 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-1">
          {MASCOT_CREW.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', damping: 20 }}
              onClick={() => setActiveMascot(activeMascot === m.id ? null : m.id)}
              className={`w-[160px] flex-shrink-0 snap-center card-bubble bg-gradient-to-b ${m.color} border ${m.border} p-4 flex flex-col items-center gap-2 cursor-pointer select-none`}
              role="button"
              tabIndex={0}
              aria-label={`Xem thông tin về ${m.name}`}
              onKeyDown={(e) => e.key === 'Enter' && setActiveMascot(activeMascot === m.id ? null : m.id)}
            >
              <motion.div
                animate={activeMascot === m.id ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                {m.component}
              </motion.div>
              <div className="text-center">
                <p className="font-extrabold text-[14px] text-[var(--color-ink)] leading-tight">{m.name}</p>
                <p className="text-[11px] text-[var(--color-ink-2)] font-semibold mt-0.5">{m.role}</p>
              </div>
              <AnimatePresence>
                {activeMascot === m.id && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-[var(--color-ink-2)] text-center italic leading-snug"
                  >
                    "{m.desc}"
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="w-full flex justify-center">
                <span className="text-[10px] font-bold text-[var(--color-ink-2)] opacity-60">
                  {activeMascot === m.id ? '▲ Thu gọn' : '▼ Xem thêm'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 2. Daily Green Challenges ──────────────────────────────────── */}
      <section className="w-full text-left">
        <div className="flex items-end justify-between mb-3 px-1">
          <div>
            <h3 className="text-[18px] font-extrabold text-[var(--color-ink)] tracking-tight flex items-center gap-2">
              Thử thách xanh hôm nay
              <Leaf size={20} weight="duotone" className="text-emerald-600" />
            </h3>
            <p className="text-[13px] text-[var(--color-ink-2)] font-medium mt-0.5">
              Hoàn thành để nhận XP và bảo vệ môi trường!
            </p>
          </div>
          {totalXP > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-[var(--color-accent)] rounded-full px-3 py-1 flex items-center gap-1"
            >
              <Star size={14} weight="fill" className="text-[var(--color-ink)]" />
              <span className="text-[12px] font-extrabold text-[var(--color-ink)] font-[var(--font-label)]">+{totalXP} XP</span>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {DAILY_CHALLENGES.map((c, i) => {
            const done = completedChallenges.has(c.id);
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', damping: 22 }}
                onClick={() => toggleChallenge(c.id)}
                className={`w-full card-bubble p-4 flex items-center gap-3 text-left cursor-pointer active:scale-[0.98] transition-all select-none ${
                  done
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-[var(--color-border-main)]'
                }`}
                aria-pressed={done}
                aria-label={`${done ? 'Bỏ hoàn thành' : 'Hoàn thành'}: ${c.text}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-xl transition-all ${
                  done ? 'bg-emerald-500 scale-110' : 'bg-[var(--color-paper-2)]'
                }`}>
                  {done ? <CheckCircle size={22} weight="fill" className="text-white" /> : c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] font-bold leading-tight ${done ? 'line-through text-[var(--color-ink-2)]' : 'text-[var(--color-ink)]'}`}>
                    {c.text}
                  </p>
                  <p className="text-[11px] font-semibold text-[var(--color-ink-2)] mt-0.5 font-[var(--font-label)]">
                    +{c.xp} XP
                  </p>
                </div>
                {done && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }}>
                    <CheckCircle size={22} weight="fill" className="text-emerald-500 shrink-0" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── 3. Eco Tips Carousel ───────────────────────────────────────── */}
      <section className="w-full text-left">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[18px] font-extrabold text-[var(--color-ink)] tracking-tight flex items-center gap-2">
            Mẹo sống xanh
            <Recycle size={20} weight="duotone" className="text-emerald-600" />
          </h3>
          <div className="flex items-center gap-1.5">
            {ECO_TIPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTipIndex(i)}
                className={`rounded-full transition-all cursor-pointer ${
                  i === tipIndex
                    ? 'w-5 h-2 bg-[var(--color-accent-2)]'
                    : 'w-2 h-2 bg-[var(--color-paper-3)] hover:bg-[var(--color-ink-2)]/30'
                }`}
                aria-label={`Mẹo số ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip.id}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ type: 'spring', damping: 28 }}
            className={`card-bubble bg-gradient-to-br ${currentTip.bg} border ${currentTip.border} p-5 flex gap-4 items-start relative overflow-hidden`}
          >
            <div className="shrink-0 mt-1">{currentTip.mascot}</div>
            <div className="flex-1 min-w-0 z-10">
              <div className="flex items-center gap-2 mb-2">
                {currentTip.icon}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentTip.tagColor}`}>
                  {currentTip.tag}
                </span>
              </div>
              <h4 className="text-[15px] font-extrabold text-[var(--color-ink)] mb-1">{currentTip.title}</h4>
              <p className="text-[13px] text-[var(--color-ink-2)] leading-relaxed font-medium">{currentTip.body}</p>
            </div>
            {/* Decorative */}
            <Leaf
              size={100}
              weight="duotone"
              className="absolute -bottom-6 -right-4 text-emerald-500/10 rotate-12 pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Swipe row */}
        <div className="flex overflow-x-auto fade-edges-x gap-3 pb-2 pt-3 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {ECO_TIPS.map((tip, i) => (
            <button
              key={tip.id}
              onClick={() => setTipIndex(i)}
              className={`flex-shrink-0 snap-center card-bubble border px-4 py-3 w-[140px] text-left cursor-pointer transition-all ${
                i === tipIndex
                  ? `bg-gradient-to-br ${tip.bg} ${tip.border} scale-[1.03]`
                  : 'bg-white border-[var(--color-border-main)]'
              }`}
              aria-pressed={i === tipIndex}
            >
              <div className="text-xl mb-1">{tip.tag === 'Nước' ? '💧' : tip.tag === 'Rác hữu cơ' ? '♻️' : tip.tag === 'Nhiệt độ' ? '☀️' : '🌬️'}</div>
              <p className="text-[12px] font-bold text-[var(--color-ink)] leading-tight">{tip.title}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── 4. Plant a Tree Movement ───────────────────────────────────── */}
      <section className="w-full text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', damping: 22 }}
          className="relative card-bubble overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-200/80 p-6 text-[var(--color-ink)] shadow-sm"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
            <Tree size={220} weight="duotone" className="absolute -bottom-10 -right-10 text-emerald-900 rotate-6" />
            <Leaf size={90} weight="duotone" className="absolute top-4 right-16 text-emerald-900" style={{transform:'rotate(-20deg)'}} />
            <Leaf size={60} weight="duotone" className="absolute top-2 right-4 text-emerald-900 rotate-12" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
            <div className="shrink-0">
              <motion.div
                animate={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <LaXanh size={88} />
              </motion.div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 border border-emerald-300 rounded-full px-3 py-1 mb-2">
                <Globe size={14} weight="duotone" className="!text-emerald-800" />
                <span className="text-[11px] font-bold !text-emerald-900">Phong trào cộng đồng</span>
              </div>
              <h3 className="text-[22px] font-extrabold leading-tight tracking-tight mb-1.5 !text-[var(--color-ink)]">
                Cùng trồng 10.000 cây xanh! 🌳
              </h3>
              <p className="text-[13.5px] !text-[var(--color-ink-2)] font-medium leading-relaxed mb-4">
                Mỗi cây bạn trồng và ghi nhật ký sẽ là 1 mầm xanh đóng góp vào mục tiêu chung. Hãy cùng Farmy phủ xanh đất nước!
              </p>

              {/* Progress bar */}
              <div className="mb-3 bg-white/90 border border-emerald-200 rounded-2xl p-3.5 shadow-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[12px] font-extrabold !text-[var(--color-ink)]">🌱 Đang khởi động cùng cộng đồng</span>
                  <span className="text-[12px] font-bold !text-emerald-800">Mục tiêu: 10.000 cây</span>
                </div>
                <div className="w-full h-3.5 bg-emerald-100 rounded-full overflow-hidden border border-emerald-200">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '45%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-xs"
                  />
                </div>
                <p className="text-[11px] !text-emerald-800 font-bold mt-1 text-right">Hãy là những người đầu tiên tham gia 🚀</p>
              </div>

              <button
                className="btn btn--cyan w-full md:w-auto cursor-pointer active:scale-[0.97] font-bold text-[14px]"
                onClick={() => {}}
                aria-label="Tham gia trồng cây"
              >
                <Plant size={18} weight="duotone" />
                Tham gia ngay
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 5. Community Impact Targets ──────────────────────────────────── */}
      <section className="w-full text-left mb-4">
        <div className="px-1 mb-4">
          <h3 className="text-[18px] font-extrabold text-[var(--color-ink)] tracking-tight flex items-center gap-2">
            Mục tiêu tác động xanh 🎯
            <Heart size={20} weight="fill" className="text-[var(--color-accent-3)]" />
          </h3>
          <p className="text-[13px] text-[var(--color-ink-2)] font-medium mt-0.5">
            Cùng hướng tới một nền nông nghiệp bền vững & phủ xanh đất nước ✨
          </p>
        </div>

        <div className="card-bubble bg-white border border-[var(--color-border-main)] p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCounter
              value={10000}
              label="Cây xanh mục tiêu"
              suffix=""
              icon={<Tree size={24} weight="duotone" className="text-emerald-600" />}
            />
            <StatCounter
              value={5000}
              label="Nông dân đồng hành"
              suffix="+"
              icon={<Globe size={24} weight="duotone" className="text-sky-500" />}
            />
            <StatCounter
              value={100}
              label="Ước tính giảm CO₂"
              suffix="T"
              icon={<Wind size={24} weight="duotone" className="text-indigo-500" />}
            />
            <StatCounter
              value={50000}
              label="Lít nước kỳ vọng tiết kiệm"
              suffix="L"
              icon={<Drop size={24} weight="duotone" className="text-cyan-500" />}
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeEcoSection;
