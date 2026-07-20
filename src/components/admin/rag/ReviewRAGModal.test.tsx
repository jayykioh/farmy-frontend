import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReviewRAGModal } from './ReviewRAGModal';

vi.mock('../../../api/admin', () => ({
  confirmAdminRAGFile: vi.fn(),
}));

describe('ReviewRAGModal', () => {
  it('renders backend validation_report score contract', () => {
    render(
      <ReviewRAGModal
        isOpen
        onClose={vi.fn()}
        onSuccess={vi.fn()}
        file={{
          _id: 'knowledge-1',
          title: 'Bệnh đạo ôn',
          validation_report: {
            score: 82,
            is_agriculture_related: true,
            language_detected: 'vi',
            category_match: true,
            warnings: ['Cần kiểm tra nguồn'],
            rejection_reason: null,
          },
        } as any}
      />,
    );

    expect(screen.getByText('82%')).toBeInTheDocument();
    expect(screen.getByText('Liên quan nông nghiệp')).toBeInTheDocument();
    expect(screen.getByText('Cần kiểm tra nguồn')).toBeInTheDocument();
  });
});
