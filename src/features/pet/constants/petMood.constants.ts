import type { PetMood } from '../types/pet.types';

// ─── Mood UI Metadata ─────────────────────────────────────────────────────────

export interface MoodUIConfig {
  label     : string;
  emoji     : string;
  /** Used as aria-label description */
  description : string;
  /** Tailwind / CSS color hint for the card border / glow */
  colorClass  : string;
}

export const PET_MOOD_UI_MAP: Record<PetMood, MoodUIConfig> = {
  excited: {
    label       : 'Phấn khích',
    emoji       : '🎉',
    description : 'Bé Thóc đang rất hào hứng vì chuỗi streak của bạn!',
    colorClass  : 'text-yellow-400',
  },
  happy: {
    label       : 'Vui vẻ',
    emoji       : '😊',
    description : 'Bé Thóc rất vui vì bạn đã ghi nhật ký hôm nay!',
    colorClass  : 'text-green-400',
  },
  neutral: {
    label       : 'Bình thường',
    emoji       : '😐',
    description : 'Bé Thóc đang chờ bạn bắt đầu ngày mới.',
    colorClass  : 'text-gray-400',
  },
  sad: {
    label       : 'Buồn',
    emoji       : '😢',
    description : 'Bé Thóc buồn vì bạn đã bỏ quên nhật ký nhiều ngày.',
    colorClass  : 'text-blue-400',
  },
  worried: {
    label       : 'Lo lắng',
    emoji       : '😟',
    description : 'Bé Thóc lo lắng vì hôm qua bạn không ghi nhật ký.',
    colorClass  : 'text-orange-400',
  },
  sleepy: {
    label       : 'Buồn ngủ',
    emoji       : '💤',
    description : 'Bé Thóc muốn ngủ rồi, nhưng vẫn đợi bạn ghi nhật ký!',
    colorClass  : 'text-purple-400',
  },
  hungry: {
    label       : 'Đói bụng',
    emoji       : '🍚',
    description : 'Bé Thóc đang đói, ghi nhật ký để cho Thóc ăn nào!',
    colorClass  : 'text-amber-400',
  },
};

/** Ordered by priority for display decisions (highest first) */
export const MOOD_PRIORITY_ORDER: PetMood[] = [
  'excited',
  'happy',
  'sad',
  'worried',
  'sleepy',
  'hungry',
  'neutral',
];
