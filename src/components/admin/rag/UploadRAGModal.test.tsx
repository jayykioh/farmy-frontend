import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UploadRAGModal } from './UploadRAGModal';

vi.mock('../../../api/admin', () => ({
  createAdminRAGFile: vi.fn(),
}));

describe('UploadRAGModal', () => {
  it('advertises only file types supported by backend parser', () => {
    render(<UploadRAGModal isOpen onClose={vi.fn()} onSuccess={vi.fn()} />);

    const input = document.querySelector('#rag-file') as HTMLInputElement;
    expect(input.accept).toBe('.pdf,.docx,.json');
    expect(screen.getByText('Hỗ trợ PDF, DOCX, JSON (Tối đa 10MB)')).toBeInTheDocument();
  });
});
