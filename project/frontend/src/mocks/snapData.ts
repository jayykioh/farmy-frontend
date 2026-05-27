import type { FarmSnap } from '../types/farmSnap';

export const mockSnaps: FarmSnap[] = [
  {
    id: 'snap-1',
    userId: 'user-1',
    userName: 'Nguyễn Văn Ruộng',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruong',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f233481e3a9?auto=format&fit=crop&q=80',
    caption: 'Phát hiện lá vàng ở gốc, cần kiểm tra ngay 😢',
    cropType: 'Lúa',
    condition: 'issue',
    conditionNote: 'Lá vàng ở gốc',
    location: { lat: 10.3781, lng: 105.4339, province: 'An Giang' },
    weather: { temp: 32, humidity: 74, condition: 'Trời nắng' },
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    xpEarned: 10,
    reactions: [
      { type: 'like', count: 12, userReacted: true },
      { type: 'helpful', count: 8, userReacted: false },
      { type: 'worry', count: 2, userReacted: false },
      { type: 'celebrate', count: 0, userReacted: false }
    ],
    commentCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'snap-2',
    userId: 'user-2',
    userName: 'Trần Thị Thu',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thu',
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80',
    caption: 'Bưởi năm nay đậu trái đẹp quá bà con ơi! 🥰',
    cropType: 'Bưởi',
    condition: 'healthy',
    location: { lat: 10.0322, lng: 105.7845, province: 'Bến Tre' },
    weather: { temp: 29, humidity: 80, condition: 'Mây rải rác' },
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    xpEarned: 10,
    reactions: [
      { type: 'like', count: 24, userReacted: false },
      { type: 'helpful', count: 1, userReacted: false },
      { type: 'worry', count: 0, userReacted: false },
      { type: 'celebrate', count: 15, userReacted: true }
    ],
    commentCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: 'snap-3',
    userId: 'user-3',
    userName: 'Lê Vườn',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vuon',
    imageUrl: 'https://images.unsplash.com/photo-1620215714041-3316d25227cc?auto=format&fit=crop&q=80',
    caption: 'Chuẩn bị thu hoạch mẻ rau cải đầu tiên 🥬',
    cropType: 'Rau màu',
    condition: 'harvest',
    location: { lat: 11.9404, lng: 108.4583, province: 'Đà Lạt' },
    weather: { temp: 22, humidity: 85, condition: 'Sương mù' },
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    xpEarned: 10,
    reactions: [
      { type: 'like', count: 45, userReacted: true },
      { type: 'helpful', count: 0, userReacted: false },
      { type: 'worry', count: 0, userReacted: false },
      { type: 'celebrate', count: 32, userReacted: false }
    ],
    commentCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];
