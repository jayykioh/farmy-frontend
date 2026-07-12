import { extractPlantScanErrorCode } from './plantScan';

describe('extractPlantScanErrorCode', () => {
  it('should return UNKNOWN for null or undefined error', () => {
    expect(extractPlantScanErrorCode(null)).toBe('UNKNOWN');
    expect(extractPlantScanErrorCode(undefined)).toBe('UNKNOWN');
  });

  it('should return errorCode for RTK Query shape', () => {
    const error = {
      data: {
        errorCode: 'SCAN_IMAGE_BLURRY',
      },
    };
    expect(extractPlantScanErrorCode(error)).toBe('SCAN_IMAGE_BLURRY');
  });

  it('should return errorCode for Axios shape', () => {
    const error = {
      response: {
        data: {
          errorCode: 'AI_SCAN_QUOTA_BUSY',
        },
      },
    };
    expect(extractPlantScanErrorCode(error)).toBe('AI_SCAN_QUOTA_BUSY');
  });

  it('should return UNKNOWN for missing errorCode', () => {
    const rtkError = { data: {} };
    expect(extractPlantScanErrorCode(rtkError)).toBe('UNKNOWN');

    const axiosError = { response: { data: {} } };
    expect(extractPlantScanErrorCode(axiosError)).toBe('UNKNOWN');
  });

  it('should return UNKNOWN for arbitrary object', () => {
    expect(extractPlantScanErrorCode({ message: 'Network Error' })).toBe('UNKNOWN');
  });
});
