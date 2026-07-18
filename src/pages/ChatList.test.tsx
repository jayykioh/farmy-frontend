import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PageHeaderProvider } from '../contexts/PageHeaderContext';
import { deleteChatSession, fetchChatSessions, renameChatSession } from '../api/chat';
import ChatList from './ChatList';

vi.mock('../features/pet/components/PetMascot', () => ({
  PetMascot: () => <div data-testid="pet-mascot" />,
}));

vi.mock('../features/pet/hooks/usePetStatus', () => ({
  usePetStatus: () => ({ data: undefined }),
}));

vi.mock('../api/chat', () => ({
  fetchChatSessions: vi.fn(),
  deleteChatSession: vi.fn(),
  renameChatSession: vi.fn(),
}));

const renderChatList = () =>
  render(
    <MemoryRouter>
      <PageHeaderProvider>
        <ChatList />
      </PageHeaderProvider>
    </MemoryRouter>,
  );

describe('ChatList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchChatSessions).mockResolvedValue({
      items: [
        {
          _id: 'session-1',
          title: 'Lá lúa bị vàng thường do thiếu đạm',
          last_message_at: new Date().toISOString(),
        },
      ],
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('confirms and deletes a chat session without opening it', async () => {
    vi.mocked(deleteChatSession).mockResolvedValue(undefined);
    renderChatList();

    expect(
      await screen.findByText('Lá lúa bị vàng thường do thiếu đạm'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Xóa cuộc trò chuyện'));
    fireEvent.click(screen.getByRole('button', { name: 'Xóa hẳn' }));

    await waitFor(() => {
      expect(deleteChatSession).toHaveBeenCalledWith('session-1');
    });
    expect(
      screen.queryByText('Lá lúa bị vàng thường do thiếu đạm'),
    ).not.toBeInTheDocument();
  });

  it('edits a chat session title from the history card', async () => {
    vi.mocked(renameChatSession).mockResolvedValue({
      _id: 'session-1',
      title: 'Ruộng lúa vụ hè',
    });
    renderChatList();

    expect(
      await screen.findByText('Lá lúa bị vàng thường do thiếu đạm'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Đổi tên cuộc trò chuyện'));
    fireEvent.change(screen.getByLabelText('Tên cuộc trò chuyện'), {
      target: { value: 'Ruộng lúa vụ hè' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu tên' }));

    await waitFor(() => {
      expect(renameChatSession).toHaveBeenCalledWith(
        'session-1',
        'Ruộng lúa vụ hè',
      );
    });
    expect(screen.getByText('Ruộng lúa vụ hè')).toBeInTheDocument();
  });
});
