import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlantScan from './PlantScan';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { farmApi } from '../store/api/farmApi';
import { PageHeaderProvider } from '../contexts/PageHeaderContext';
import { api } from '../api/client';

// Mock PetMascot
vi.mock('../features/pet/components/PetMascot', () => ({
  PetMascot: () => <div data-testid="mascot-lottie" />
}));

// Mock the axios api instance
vi.mock('../api/client', () => ({
  api: vi.fn(),
}));

// Mock URL
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
window.URL.createObjectURL = mockCreateObjectURL;
window.URL.revokeObjectURL = mockRevokeObjectURL;

describe('PlantScan Component', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        [farmApi.reducerPath]: farmApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(farmApi.middleware),
    });
    mockCreateObjectURL.mockReturnValue('blob:test-url');
    mockRevokeObjectURL.mockClear();
    mockCreateObjectURL.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <PageHeaderProvider>
            <PlantScan />
          </PageHeaderProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders initial viewfinder state', () => {
    renderComponent();
    expect(screen.getByText('Giữ camera sát lá bị bệnh để AI chẩn đoán tốt nhất')).toBeInTheDocument();
  });

  it('appends FormData correctly and changes to analyzing state on file select', async () => {
    renderComponent();
    
    const mockResponse = {
      data: {
        success: true,
        data: {
          scan_id: '123',
          status: 'completed',
          diagnosis: {
            disease_name: 'Đốm lá',
            confidence: 0.95,
            treatment: { chemical: 'ABC', organic: 'DEF' }
          }
        }
      }
    };
    
    // api is the mocked axios instance, we delay the response to test loading state
    let resolveApi: (value: unknown) => void;
    vi.mocked(api).mockImplementationOnce(() => new Promise((resolve) => {
      resolveApi = resolve;
    }));

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    
    // Should be in analyzing state before promise resolves
    expect(screen.getByText('Đang phân tích...')).toBeInTheDocument();
    
    // Resolve the api call
    resolveApi!(mockResponse);

    await waitFor(() => {
      expect(screen.getByText('Đốm lá')).toBeInTheDocument();
      expect(screen.getByText('ABC')).toBeInTheDocument();
    });
  });

  it('renders cached response correctly', async () => {
    renderComponent();
    
    const mockResponse = {
      data: {
        success: true,
        data: {
          scan_id: '123',
          status: 'cached',
          diagnosis: {
            disease_name: 'Sâu cuốn lá',
            confidence: 0.88,
            treatment: { chemical: 'XYZ' }
          }
        }
      }
    };
    
    vi.mocked(api).mockResolvedValueOnce(mockResponse);

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText('Sâu cuốn lá')).toBeInTheDocument();
      expect(screen.getByText('(Từ bộ nhớ đệm)')).toBeInTheDocument();
    });
  });

  it('displays alert on SCAN_IMAGE_BLURRY error', async () => {
    renderComponent();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    const mockError = {
      response: {
        status: 400,
        data: {
          success: false,
          errorCode: 'SCAN_IMAGE_BLURRY',
          message: 'Image is too blurry'
        }
      }
    };
    
    vi.mocked(api).mockRejectedValueOnce(mockError);

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Ảnh quá mờ, vui lòng giữ chắc tay và chụp lại.');
      expect(screen.getByText('Giữ camera sát lá bị bệnh để AI chẩn đoán tốt nhất')).toBeInTheDocument(); // back to viewfinder
    });
  });

  it('displays generic error on UNKNOWN error without crashing', async () => {
    renderComponent();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    vi.mocked(api).mockRejectedValueOnce(new Error('Network error'));

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Có lỗi xảy ra trong quá trình quét. Vui lòng thử lại.');
      expect(screen.getByText('Giữ camera sát lá bị bệnh để AI chẩn đoán tốt nhất')).toBeInTheDocument();
    });
  });

  it('calls revokeObjectURL when retaking photo', async () => {
    renderComponent();
    
    const mockResponse = {
      data: {
        success: true,
        data: {
          scan_id: '123',
          status: 'completed',
          diagnosis: { disease_name: 'Test', confidence: 1 }
        }
      }
    };
    
    vi.mocked(api).mockResolvedValueOnce(mockResponse);

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await waitFor(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    const retakeBtn = screen.getByText('Chụp lại');
    fireEvent.click(retakeBtn);

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    expect(screen.getByText('Giữ camera sát lá bị bệnh để AI chẩn đoán tốt nhất')).toBeInTheDocument();
  });
});
