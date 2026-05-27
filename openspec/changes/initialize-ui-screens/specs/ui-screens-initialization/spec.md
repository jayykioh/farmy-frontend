## ADDED Requirements

### Requirement: Stitch Screens Pull and Scaffold
Hệ thống SHALL tải xuống toàn bộ mã nguồn HTML từ các màn hình trên dự án Stitch `11281679273137683533` và tự động khởi tạo thành các tệp tin React Page Components tĩnh tương ứng trong cấu trúc thư mục của `project/frontend/src/pages/`.

#### Scenario: Pull thành công và tạo các tệp component giao diện tĩnh
- **WHEN** chạy quy trình đồng bộ hóa dữ liệu thiết kế từ Stitch về dự án frontend
- **THEN** các tệp giao diện của 4 tab chính (Home, Diary, AI Pet, Profile) và các màn hình thiết lập (Onboarding, Shop, Reminders) MUST được sinh ra đầy đủ dưới dạng các React component độc lập.

### Requirement: Tích hợp hệ màu AgriPlay Native
Hệ thống SHALL tích hợp và khai báo các biến phong cách (CSS variables) của hệ màu Ethereal Harvest và phông chữ Nunito Sans vào tệp tin định kiểu toàn cục `project/frontend/src/index.css` để các trang kế thừa.

#### Scenario: Đồng bộ thành công hệ thống định kiểu phong cách
- **WHEN** tệp tin định kiểu toàn cục `index.css` được biên dịch và tải trong ứng dụng
- **THEN** tất cả các trang giao diện MUST thừa hưởng đúng màu nền chủ đạo xanh sữa (#FAF8FF/#F1FCF1), màu nút 3D chủ đạo (#08A855) và phông chữ rounded Nunito Sans.

### Requirement: Thiết lập luồng điều hướng tập trung
Hệ thống SHALL khai báo cấu trúc định tuyến (React Router) đồng bộ toàn bộ luồng di chuyển giữa các trang và các Bottom Sheet (trượt lên) đúng theo mô tả của tài liệu Navigation Model v5.3.

#### Scenario: Luồng điều hướng chuyển trang và Bottom Sheet hoạt động chính xác
- **WHEN** người dùng thực hiện chuyển tab hoặc tương tác để mở các trang Bottom Sheet (như tạo nhật ký mới SCR-03B hoặc thêm nhắc nhở SCR-09B)
- **THEN** ứng dụng MUST hiển thị chính xác luồng điều hướng mượt mà, chuyển trang đúng đích mà không xảy ra lỗi định tuyến.
