# Tasks: Xử lý Auth Refresh & baseQueryWithReauth

## 1. Triển khai Base API & Logic Reauth
- [ ] Tạo file `src/services/api.ts`.
- [ ] Triển khai `baseQuery` sử dụng `fetchBaseQuery`, cài đặt `baseUrl` (ví dụ: lấy từ biến môi trường).
- [ ] Cấu hình `prepareHeaders` trong `baseQuery` để lấy token từ `(getState() as RootState).auth.token` và set header `Authorization: Bearer <token>`.
- [ ] Import `Mutex` từ thư viện `async-mutex` (cài đặt qua `npm install async-mutex`) để xử lý race conditions trong quá trình làm mới token.
- [ ] Triển khai hàm `baseQueryWithReauth` bọc ngoài `baseQuery`.
- [ ] Xử lý lỗi `401` bên trong `baseQueryWithReauth`: khóa mutex, gọi API refresh, dispatch `updateToken` nếu thành công, hoặc dispatch `logout` nếu thất bại, sau đó giải phóng mutex.
- [ ] Tạo và export `apiSlice` bằng cách sử dụng `createApi` và `baseQueryWithReauth`.

## 2. Cấu hình Redux Store
- [ ] Cập nhật file `src/store/index.ts`.
- [ ] Import `apiSlice` từ `src/services/api`.
- [ ] Thêm `[apiSlice.reducerPath]: apiSlice.reducer` vào `rootReducer`.
- [ ] Thêm `apiSlice.middleware` vào mảng `middleware` trong `configureStore` (đảm bảo nối thêm vào `getDefaultMiddleware()`).

## 3. (Tùy chọn) Dọn dẹp & Export
- [ ] Tạo một endpoint giả lập trong `apiSlice` (ví dụ: `getUserProfile`) chỉ để xác minh thiết lập hoạt động đúng.
- [ ] Export các hook tự động sinh ra từ `apiSlice`.
