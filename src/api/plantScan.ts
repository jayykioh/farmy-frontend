import type { PlantScanErrorCode } from '../types/plantScan';

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

export function getPlantScanErrorMessage(error: unknown): string {
  const code = extractPlantScanErrorCode(error);
  const messages: Record<PlantScanErrorCode, string> = {
    SCAN_INVALID_FILE: 'Ảnh không hợp lệ hoặc vượt quá dung lượng 5 MB. Hãy chọn ảnh JPG, PNG hoặc WebP khác.',
    SCAN_INVALID_INPUT: 'Chưa có đủ thông tin về cây trồng. Hãy chọn loại cây rồi thử lại.',
    SCAN_IMAGE_BLURRY: 'Ảnh bị mờ. Hãy giữ chắc máy, lấy nét vào vùng bị ảnh hưởng rồi chụp lại.',
    SCAN_QUOTA_EXCEEDED: 'Bạn đã dùng hết lượt quét hôm nay. Hãy quay lại vào ngày mai.',
    AI_SCAN_QUOTA_BUSY: 'Dịch vụ phân tích đang quá tải. Hãy thử lại sau vài phút.',
    NOT_A_PLANT_IMAGE: 'Ảnh không nhận diện được cây trồng. Hãy chụp rõ lá, thân hoặc quả cần kiểm tra.',
    PLANT_SCAN_PERSISTENCE_FAILED: 'Đã phân tích nhưng chưa thể lưu kết quả. Hãy thử lại để lịch sử không bị mất.',
    SCAN_NOT_FOUND: 'Không tìm thấy kết quả quét này hoặc kết quả đã bị xóa.',
    INVALID_IMAGE_TYPE: 'Định dạng ảnh không được hỗ trợ. Hãy sử dụng ảnh JPG, PNG hoặc WebP.',
    INVALID_JSON: 'AI đã trả về kết quả không đọc được. Hãy gửi lại ảnh để phân tích lần nữa.',
    INVALID_SCHEMA: 'Kết quả AI chưa đủ trường dữ liệu an toàn. Hãy thử quét lại bằng ảnh rõ hơn.',
    LLM_ERROR: 'Dịch vụ AI tạm thời không phản hồi. Hãy thử lại sau ít phút.',
    UNKNOWN: '',
  };
  if (code !== 'UNKNOWN') return messages[code];

  const candidate = error as {
    status?: number | string;
    data?: { message?: string };
    response?: { status?: number; data?: { message?: string } };
    message?: string;
  };
  const status = candidate.status ?? candidate.response?.status;
  const rawMessage = candidate.data?.message ?? candidate.response?.data?.message ?? candidate.message ?? '';

  if (status === 401) return 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại trước khi quét.';
  if (status === 403) return 'Tài khoản hiện không có quyền sử dụng tính năng quét.';
  if (status === 413) return 'Ảnh quá lớn để tải lên. Hãy chọn ảnh dưới 5 MB.';
  if (status === 415) return 'Máy chủ không hỗ trợ định dạng ảnh này. Hãy đổi sang JPG, PNG hoặc WebP.';
  if (status === 422) return 'Ảnh chưa đủ điều kiện phân tích. Hãy chụp rõ vùng cây bị ảnh hưởng.';
  if (status === 429) return 'Bạn đang gửi quá nhiều yêu cầu. Hãy chờ một lát rồi thử lại.';
  if (typeof status === 'number' && status >= 500) return 'Máy chủ phân tích đang gặp sự cố. Hãy thử lại sau ít phút.';
  if (status === 'FETCH_ERROR' || /network|failed to fetch|load failed/i.test(rawMessage)) {
    return 'Không thể kết nối tới máy chủ. Hãy kiểm tra mạng rồi thử lại.';
  }
  if (/timeout|timed out/i.test(rawMessage)) {
    return 'Quá trình tải ảnh đã hết thời gian chờ. Hãy kiểm tra mạng và thử lại.';
  }
  return 'Không thể hoàn tất lần quét này. Hãy kiểm tra ảnh và thử lại.';
}
