import type { PlantScanErrorCode } from '../types/plantScan';

export function extractPlantScanErrorCode(error: unknown): PlantScanErrorCode {
  if (!error) return 'UNKNOWN';

  // RTK Query shape
  const rtkError = error as { status?: number; data?: { errorCode?: string; error_code?: string } };
  const rtkErrorCode = rtkError.data?.errorCode ?? rtkError.data?.error_code;
  if (rtkErrorCode) {
    return rtkErrorCode as PlantScanErrorCode;
  }

  if (rtkError.status === 429) {
    return 'SCAN_QUOTA_EXCEEDED';
  }

  if (rtkError.status === 422) {
    return 'NOT_A_PLANT_IMAGE';
  }

  // Axios shape
  const axiosError = error as { response?: { status?: number; data?: { errorCode?: string; error_code?: string } } };
  const axiosErrorCode = axiosError.response?.data?.errorCode ?? axiosError.response?.data?.error_code;
  if (axiosErrorCode) {
    return axiosErrorCode as PlantScanErrorCode;
  }

  if (axiosError.response?.status === 429) {
    return 'SCAN_QUOTA_EXCEEDED';
  }

  if (axiosError.response?.status === 422) {
    return 'NOT_A_PLANT_IMAGE';
  }

  // Generic fallback
  return 'UNKNOWN';
}
