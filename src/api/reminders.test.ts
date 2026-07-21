import { getReminderCompletionMessage, type Reminder } from './reminders';

it('describes the completed task and linked season', () => {
  const reminder = {
    title: 'Tưới nước',
    diary: { crop_type: 'Lúa', season: 'Đông Xuân 2026' },
  } as Reminder;

  expect(getReminderCompletionMessage(reminder)).toBe(
    'Đã hoàn thành "Tưới nước" ở mùa vụ Lúa · Đông Xuân 2026 hôm nay!',
  );
});

it('does not render undefined for legacy diaries without a season name', () => {
  const reminder = {
    title: 'Tưới nước',
    diary: { crop_type: 'Lúa' },
  } as Reminder;

  expect(getReminderCompletionMessage(reminder)).toBe(
    'Đã hoàn thành "Tưới nước" ở mùa vụ Lúa hôm nay!',
  );
});
