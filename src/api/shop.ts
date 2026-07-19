import { api } from './client';

export interface ShopItem {
  _id: string;
  name: string;
  category: 'HAT' | 'OUTFIT' | 'EFFECT' | 'BACKGROUND';
  price: number;
  required_level: number;
  image_url: string;
  /** Per-item anchor override for precise positioning on the pet mascot */
  anchor?: {
    top?: string;
    left?: string;
    width?: string;
    transform?: string;
    zIndex?: number;
  };
}

export const shopApi = {
  getItems: async (): Promise<ShopItem[]> => {
    const { data } = await api.get('/shop/items');
    return data.data; // Server returns { success: true, data: ShopItem[] }
  },

  buyItem: async (itemId: string) => {
    const { data } = await api.post('/shop/buy', { itemId });
    return data;
  },

  /** Toggle equip — equips if not equipped, unequips if already equipped */
  equipItem: async (itemId: string) => {
    const { data } = await api.post('/shop/equip', { itemId });
    return data;
  },

  /** Semantic alias for clarity — same endpoint, toggle behavior */
  unequipItem: async (itemId: string) => {
    const { data } = await api.post('/shop/equip', { itemId });
    return data;
  },
};

