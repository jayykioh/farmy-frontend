# Đề xuất: Xử lý Auth Refresh & baseQueryWithReauth

## Bối cảnh
Khi tương tác với backend API, access token của người dùng chắc chắn sẽ hết hạn. Nếu một lệnh gọi API thất bại với mã lỗi `401 Unauthorized`, frontend cần có một cơ chế để tự động yêu cầu access token mới bằng cách sử dụng refresh token, và sau đó tự động gọi lại (retry) request ban đầu đã bị lỗi.

## Mục tiêu
Triển khai một hàm bọc (wrapper) `baseQueryWithReauth` xung quanh `fetchBaseQuery` của RTK Query nhằm xử lý việc hết hạn token một cách mượt mà, đảm bảo người dùng vẫn được duy trì trạng thái đăng nhập mà không bị gián đoạn.

## Lợi ích
- **Trải nghiệm người dùng liền mạch**: Người dùng sẽ không bị đăng xuất đột ngột khi access token ngắn hạn của họ hết hạn.
- **Tập trung logic xác thực (Auth Logic)**: Can thiệp vào các response ở một nơi duy nhất đảm bảo tất cả các endpoint của RTK Query đều được hưởng lợi từ việc tự động làm mới token.
- **Bảo mật**: Cho phép sử dụng access token có thời hạn ngắn, giảm thiểu rủi ro nếu token bị lộ.
