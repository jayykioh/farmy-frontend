import { describe, expect, it } from 'vitest';
import { getPlantScanErrorMessage } from './plantScan';

describe('PlantScan error messages', () => {
  it('maps each backend error code to a specific message', () => {
    expect(getPlantScanErrorMessage({ data: { errorCode: 'SCAN_IMAGE_BLURRY' } })).toContain('bị mờ');
    expect(getPlantScanErrorMessage({ data: { errorCode: 'INVALID_JSON' } })).toContain('không đọc được');
    expect(getPlantScanErrorMessage({ data: { errorCode: 'PLANT_SCAN_PERSISTENCE_FAILED' } })).toContain('lưu kết quả');
  });

  it('distinguishes authentication, server and network failures', () => {
    expect(getPlantScanErrorMessage({ status: 401 })).toContain('đăng nhập');
    expect(getPlantScanErrorMessage({ status: 503 })).toContain('Máy chủ');
    expect(getPlantScanErrorMessage({ status: 'FETCH_ERROR', message: 'Failed to fetch' })).toContain('kết nối');
  });
});
