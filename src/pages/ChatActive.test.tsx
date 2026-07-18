import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PageHeaderProvider } from '../contexts/PageHeaderContext';
import { streamChatMessage } from '../api/chat';
import ChatActive from './ChatActive';

vi.mock('../features/pet/components/PetMascot', () => ({
  PetMascot: () => <div data-testid="pet-mascot" />,
}));

vi.mock('../features/pet/hooks/usePetStatus', () => ({
  usePetStatus: () => ({ data: undefined }),
}));

vi.mock('../components/chat/ChatSourceCards', () => ({
  ChatSourceCards: () => <div data-testid="source-cards" />,
}));

vi.mock('../api/chat', () => ({
  fetchChatMessages: vi.fn(),
  streamChatMessage: vi.fn(),
  submitChatFeedback: vi.fn(),
}));

const renderChatActive = () =>
  render(
    <MemoryRouter initialEntries={["/chat/active"]}>
      <PageHeaderProvider>
        <Routes>
          <Route path="/chat/active" element={<ChatActive />} />
        </Routes>
      </PageHeaderProvider>
    </MemoryRouter>,
  );

describe('ChatActive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollTo = vi.fn();
  });

  it('shows stream error messages directly in the assistant chat bubble', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(streamChatMessage).mockRejectedValue(
      new Error('Gemini API key is not configured.'),
    );
    renderChatActive();

    const input = screen.getByPlaceholderText('Nhắn tin Bé Thóc...');
    fireEvent.change(input, { target: { value: 'con chó đông béo' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(streamChatMessage).toHaveBeenCalled();
    });
    expect(
      screen.getByText('Lỗi hệ thống: Gemini API key is not configured.'),
    ).toBeInTheDocument();
  });
});
