import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReminderCard } from './ReminderCard';

describe('ReminderCard', () => {
  it('shows the crop and season for a diary reminder', () => {
    render(
      <ReminderCard
        reminder={{
          _id: 'reminder-1',
          user_id: 'user-1',
          diary_id: 'diary-1',
          diary: {
            _id: 'diary-1',
            crop_type: 'Lúa',
            season: 'Đông Xuân 2026',
          },
          title: 'Tưới nước',
          remind_at: '2026-07-21T08:54:00.000Z',
          status: 'pending',
          created_at: '2026-07-20T08:54:00.000Z',
          updated_at: '2026-07-20T08:54:00.000Z',
        }}
      />,
    );

    expect(screen.getByText('Mùa vụ: Lúa · Đông Xuân 2026')).toBeInTheDocument();
  });

  it('shows only the crop for a legacy diary without season', () => {
    render(
      <ReminderCard
        reminder={{
          _id: 'reminder-legacy',
          user_id: 'user-1',
          diary_id: 'diary-legacy',
          diary: { _id: 'diary-legacy', crop_type: 'Lúa' },
          title: 'Tưới nước',
          remind_at: '2026-07-21T08:54:00.000Z',
          status: 'pending',
          created_at: '2026-07-20T08:54:00.000Z',
          updated_at: '2026-07-20T08:54:00.000Z',
        }}
      />,
    );

    expect(screen.getByText('Mùa vụ: Lúa')).toBeInTheDocument();
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });
});
