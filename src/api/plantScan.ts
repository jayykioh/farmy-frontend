import { PlantScanErrorCode } from '../types/plantScan';

export function extractPlantScanErrorCode(error: unknown): PlantScanErrorCode {
  if (!error) return 'UNKNOWN';

  // RTK Query shape
  const rtkError = error as { data?: { errorCode?: string } };
  if (rtkError.data?.errorCode) {
    return rtkError.data.errorCode as PlantScanErrorCode;
  }

  // Axios shape
  const axiosError = error as { response?: { data?: { errorCode?: string } } };
  if (axiosError.response?.data?.errorCode) {
    return axiosError.response.data.errorCode as PlantScanErrorCode;
  }

  // Generic fallback
  return 'UNKNOWN';
}
