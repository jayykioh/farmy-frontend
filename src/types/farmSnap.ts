export type SnapCondition = 'healthy' | 'issue' | 'harvest' | 'other';
export type SnapReactionType = 'like' | 'helpful' | 'worry' | 'celebrate';

export interface FarmSnap {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;

  // Media
  imageUrl: string;
  caption?: string;

  // AI Training Labels
  cropType: string;
  condition: SnapCondition;
  conditionNote?: string;

  // Auto-collected metadata
  location?: { lat: number; lng: number; province: string; district?: string };
  weather?: { temp: number; humidity: number; condition: string };
  capturedAt: string;

  // Gamification
  xpEarned: number;

  // Engagement
  reactions: { type: SnapReactionType; count: number; userReacted: boolean }[];
  commentCount: number;

  createdAt: string;
}

export interface FarmSnapComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface CreateSnapPayload {
  imageFile?: File;
  imageUrl?: string;
  cropType: string;
  condition: SnapCondition;
  conditionNote?: string;
  caption?: string;
  location?: { lat: number; lng: number };
  weather?: { temp: number; humidity: number; condition: string };
  capturedAt: string;
}
