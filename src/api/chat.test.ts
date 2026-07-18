import { describe, expect, it, vi, beforeEach } from 'vitest';
import { api, getAccessToken, getCsrfToken } from './client';
import { deleteChatSession, renameChatSession, streamChatMessage } from './chat';

vi.mock('./client', () => ({
  api: {
    defaults: { baseURL: 'https://api.test/api/v1' },
    delete: vi.fn(),
    patch: vi.fn(),
  },
  getAccessToken: vi.fn(),
  getCsrfToken: vi.fn(),
}));

const createSseResponse = () => {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(
          'event: meta\ndata: {"session_id":"session-1","user_message_id":"user-1"}\n\n' +
            'event: token\ndata: {"delta":"Xin chao"}\n\n' +
            'event: done\ndata: {"assistant_message_id":"assistant-1","citations":[]}\n\n',
        ),
      );
      controller.close();
    },
  });

  return new Response(stream, { status: 200 });
};

describe('streamChatMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAccessToken).mockReturnValue('access-token');
    vi.mocked(getCsrfToken).mockResolvedValue('csrf-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createSseResponse()));
  });

  it('sends CSRF token, credentials, and bearer auth for the streaming POST', async () => {
    const onToken = vi.fn();
    const onDone = vi.fn();

    await streamChatMessage('Lá lúa bị vàng', undefined, { onToken, onDone });

    expect(getCsrfToken).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      'https://api.test/api/v1/chat/stream',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': 'csrf-token',
        }),
      }),
    );
    expect(onToken).toHaveBeenCalledWith('Xin chao');
    expect(onDone).toHaveBeenCalledWith({
      assistant_message_id: 'assistant-1',
      citations: [],
    });
  });

  it('deletes a chat session through the shared API client', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({ data: { success: true } });

    await deleteChatSession('session-1');

    expect(api.delete).toHaveBeenCalledWith('/chat/sessions/session-1');
  });

  it('renames a chat session through the shared API client', async () => {
    vi.mocked(api.patch).mockResolvedValueOnce({
      data: { success: true, data: { _id: 'session-1', title: 'Ruộng lúa vụ hè' } },
    });

    await expect(
      renameChatSession('session-1', 'Ruộng lúa vụ hè'),
    ).resolves.toEqual({ _id: 'session-1', title: 'Ruộng lúa vụ hè' });

    expect(api.patch).toHaveBeenCalledWith('/chat/sessions/session-1', {
      title: 'Ruộng lúa vụ hè',
    });
  });
});
