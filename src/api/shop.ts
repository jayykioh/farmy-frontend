import { api } from './client';

export interface ShopItem {
  _id: string;
  name: string;
  category: 'HAT' | 'OUTFIT' | 'EFFECT' | 'BACKGROUND';
  price: number;
  required_level: number;
  image_url: string;
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

  equipItem: async (itemId: string) => {
    const { data } = await api.post('/shop/equip', { itemId });
    return data;
  }
};
