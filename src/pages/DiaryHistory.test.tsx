import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import DiaryHistory from './DiaryHistory';
import { PageHeaderProvider } from '../contexts/PageHeaderContext';

const hooks = vi.hoisted(() => ({
  useGetDiariesQuery: vi.fn(),
  useGetDiaryDetailQuery: vi.fn(),
  useGetDiaryLogsQuery: vi.fn(),
  useUpdateDiaryMutation: vi.fn(),
  useDeleteDiaryMutation: vi.fn(),
}));

vi.mock('../store/api/farmApi', () => hooks);
vi.mock('../features/pet/components/PetMascot', () => ({ PetMascot: () => <div data-testid="pet" /> }));
vi.mock('../features/pet/hooks/usePetStatus', () => ({ usePetStatus: () => ({ data: null }) }));
vi.mock('../store/authStore', () => ({ useAuthStore: () => 'user-1' }));
vi.mock('../lib/indexedDB', () => ({
  OFFLINE_DIARY_DRAFTS_CHANGED: 'offline-diary-drafts-changed',
  deleteOfflineDiaryDraft: vi.fn(),
  listOfflineDiaryDraftsByUser: vi.fn().mockResolvedValue([]),
}));
vi.mock('../lib/diaryDraftConfirmation', () => ({
  filterVisibleOfflineDrafts: vi.fn(() => []),
  getConfirmedOfflineDraftIds: vi.fn(() => []),
}));

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
};

const renderHistory = (entry = '/diary/history/diary-2') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <PageHeaderProvider>
        <Routes>
          <Route path="/diary/history/:id" element={<><DiaryHistory /><LocationProbe /></>} />
          <Route path="/diary/history" element={<><DiaryHistory /><LocationProbe /></>} />
          <Route path="/diary/create" element={<LocationProbe />} />
        </Routes>
      </PageHeaderProvider>
    </MemoryRouter>,
  );

describe('DiaryHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hooks.useGetDiariesQuery.mockReturnValue({
      data: [
        { _id: 'diary-1', crop_type: 'Lúa', status: 'active', start_date: '2026-01-01' },
        { _id: 'diary-2', crop_type: 'Bắp', status: 'active', start_date: '2026-01-01' },
      ],
      isLoading: false,
    });
    hooks.useGetDiaryDetailQuery.mockReturnValue({
      data: { _id: 'diary-2', crop_type: 'Bắp', status: 'active', start_date: '2026-01-01' },
      isLoading: false,
      isError: false,
    });
    hooks.useGetDiaryLogsQuery.mockReturnValue({
      data: [
        {
          _id: 'log-1',
          activity_type: 'Tưới nước',
          content: 'Đã tưới',
          image_url: 'https://example.test/diary.jpg',
          created_at: '2026-07-20T00:00:00.000Z',
        },
      ],
      isLoading: false,
      isError: false,
    });
    hooks.useUpdateDiaryMutation.mockReturnValue([vi.fn()]);
    hooks.useDeleteDiaryMutation.mockReturnValue([vi.fn()]);
  });

  it('uses the path id for diary detail instead of falling back to the first diary', async () => {
    renderHistory();

    await waitFor(() => {
      expect(hooks.useGetDiaryDetailQuery).toHaveBeenCalledWith('diary-2', { skip: false });
    });
  });

  it('does not fetch the first diary when no detail id is provided', async () => {
    renderHistory('/diary/history');

    await waitFor(() => {
      expect(hooks.useGetDiaryDetailQuery).toHaveBeenCalledWith('', { skip: true });
    });
  });

  it('renders remote diary log images', async () => {
    renderHistory();

    const image = await screen.findByAltText('Ảnh hoạt động Tưới nước');
    expect(image).toHaveAttribute('src', 'https://example.test/diary.jpg');
  });

  it('preserves current diary id when adding a new activity', async () => {
    renderHistory();

    fireEvent.click(screen.getByRole('button', { name: 'Thêm hoạt động mới' }));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/diary/create?diaryId=diary-2');
    });
  });
});
