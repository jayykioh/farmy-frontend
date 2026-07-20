import { afterEach, describe, expect, it, vi } from 'vitest';

const loadClientWithApiUrl = async (apiUrl: string) => {
  vi.resetModules();
  vi.stubEnv('VITE_API_URL', apiUrl);

  const { api } = await import('./client');
  return api;
};

describe('API client base URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    localStorage.clear();
  });

  it('normalizes a local API URL with a trailing shell semicolon', async () => {
    const api = await loadClientWithApiUrl('http://localhost:3000/api/v1;');

    expect(api.defaults.baseURL).toBe('http://localhost:3000/api/v1');
  });

  it('disables the default JSON content type for FormData uploads', async () => {
    const api = await loadClientWithApiUrl('https://farmy-backend.example.com');
    const formData = new FormData();
    formData.append('image', new File(['leaf'], 'leaf.png', { type: 'image/png' }));
    formData.append('crop_type', 'Lúa');

    let capturedContentType: unknown;
    await api.post('/auth/login', formData, {
      adapter: async (config) => {
        capturedContentType = config.headers.get?.('Content-Type');

        return {
          data: { success: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {},
        };
      },
    });

    expect(capturedContentType).toBe(false);
  });
});
