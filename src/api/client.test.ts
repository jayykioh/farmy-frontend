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
});
