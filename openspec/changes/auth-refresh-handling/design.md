# Thiết kế: Xử lý Auth Refresh & baseQueryWithReauth

## Tổng quan Kiến trúc

Chúng ta sẽ cấu hình RTK Query để sử dụng một base query tùy chỉnh (`baseQueryWithReauth`) thay vì `fetchBaseQuery` tiêu chuẩn.

### 1. `prepareHeaders`
Trong cấu hình `fetchBaseQuery` cơ bản, chúng ta sẽ sử dụng `prepareHeaders` để tự động đính kèm `access_token` hiện tại từ Redux store (`RootState`) vào header `Authorization` của mọi request gửi đi.

### 2. Hàm bọc `baseQueryWithReauth`
Hàm bọc tùy chỉnh này sẽ:
1. Thử gọi request ban đầu bằng base query.
2. Nếu mã trạng thái trả về là `401` (Unauthorized):
   - Kiểm tra xem quá trình làm mới (refresh token flow) có đang diễn ra hay không (sử dụng khóa Mutex để tránh việc gọi nhiều request refresh cùng một lúc).
   - Nếu chưa diễn ra, lấy khóa (lock) và gọi API `/auth/refresh` kèm theo refresh token hiện tại.
   - Nếu làm mới thành công:
     - Dispatch `updateToken` để cập nhật access/refresh token mới vào Redux store.
     - Gọi lại request ban đầu với access token mới.
   - Nếu làm mới thất bại (ví dụ: refresh token cũng đã hết hạn hoặc không hợp lệ):
     - Dispatch `logout` để xóa trạng thái auth và chuyển hướng người dùng về trang đăng nhập.
   - Giải phóng khóa (release lock).
3. Trả về kết quả cuối cùng.

### 3. Tích hợp Redux Store
Slice `api` được tạo bởi `createApi` cần phải được thêm vào `store/index.ts`. Chúng ta phải:
- Thêm `api.reducer` vào root reducer.
- Thêm `api.middleware` vào mảng middleware của Redux store để kích hoạt các tính năng caching, invalidation, và polling.

## Cấu trúc File
- `src/services/api.ts`: Sẽ chứa logic `baseQueryWithReauth` và export base API slice.
