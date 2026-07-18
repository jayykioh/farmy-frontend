export const resolveImageUrl = (url?: string | null): string => {
  if (!url) return 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=400&auto=format&fit=crop';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url;
  
  // Use VITE_API_URL and strip /api/v1 to get the storage base url
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
