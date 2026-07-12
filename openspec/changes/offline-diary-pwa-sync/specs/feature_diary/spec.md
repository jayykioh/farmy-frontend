## MODIFIED Requirements

### Requirement: Ghi nhận nhật ký (Offline First)
Hỗ trợ tạo nhật ký offline. Frontend xử lý hàng đợi, đồng bộ dữ liệu với Canonical Hash chuẩn và duy trì UI không bị "giật" trong quá trình xác nhận đồng bộ.

#### Scenario: Lưu trữ Offline & Giới hạn dung lượng (Quota)
- **WHEN** người dùng tạo nhật ký mới
- **THEN** ảnh được resize/compress, kiểm tra dung lượng qua `navigator.storage.estimate()` (bắt `QuotaExceededError`)
- **AND** gọi `navigator.storage.persist()` (best effort)
- **AND** lưu dữ liệu vào IndexedDB (`status: pending`) TRƯỚC KHI thực hiện bất kỳ network request nào
- **AND** sau đó mới trigger App-level Sync Engine.

#### Scenario: Sinh Canonical Hash Chính xác
- **WHEN** lưu hoặc sửa draft
- **THEN** các ảnh được compress và tính SHA-256 (`imageDigests` giữ đúng thứ tự upload)
- **AND** Payload JSON chuẩn được tạo với đúng các fields: `{ diaryId, activityType, content, diaryDate, cropType, imageDigests }`
- **AND** `diaryDate` dùng ISO-8601 UTC string; các fields chuỗi dùng NFC Unicode normalization; bỏ qua (omit) undefined/null; Sắp xếp Object keys theo thứ tự Alphabet (A-Z).
- **AND** Encode UTF-8, tính SHA-256 thành `X-Request-Hash`.

#### Scenario: Chạy App-level Sync Engine với Atomic Global Lock
- **WHEN** ứng dụng phát hiện `online`, mount, hoặc login
- **THEN** Sync Engine sử dụng `navigator.locks` (fallback: IDB lease `sync_metadata` qua giao dịch `readwrite` atomic: chỉ claim nếu hết hạn/không tồn tại, liên tục heartbeat).
- **AND** tự động reset các draft có trạng thái `syncing` quá 5 phút về `pending`
- **AND** tuần tự đồng bộ các bản ghi `pending` hoặc `failed_retryable` theo đúng `userId` hiện tại.

#### Scenario: Chuyển trạng thái UI an toàn (sync_confirming)
- **WHEN** backend trả về 201 (Mới) hoặc 200 (Replay)
- **THEN** đánh dấu draft là `sync_confirming` và lưu `serverLogId`.
- **AND** `DiaryHistory` VẪN tiếp tục hiển thị bản ghi cục bộ này.
- **AND** Khi `DiaryHistory` fetch data từ backend (Yêu cầu API trả về `logId` và `idempotencyKey`), nếu tìm thấy `serverLogId` tương ứng, tiến hành XÓA bản ghi cục bộ.
