## Context

Các thiết kế giao diện của **FarmDiaries AI** đã được xây dựng và phê duyệt đầy đủ trên Stitch MCP. Chúng ta cần triển khai việc pull toàn bộ các màn hình thiết kế này và tích hợp chúng vào mã nguồn PWA React của `project/frontend` nhằm tạo lập khung sườn giao diện tĩnh (scaffold components) hoàn chỉnh, giúp lập trình viên frontend có được mã nguồn giao diện chuẩn xác nhất làm bệ phóng để code logic.

## Goals / Non-Goals

**Goals:**
- Tải toàn bộ (pull) mã nguồn HTML/CSS/JS từ dự án Stitch `11281679273137683533` về máy cục bộ.
- Tổ chức và tạo mới các tệp React PWA Pages/Components tại `project/frontend/src/` đại diện cho từng màn hình UI tương ứng.
- Tích hợp chuẩn hệ màu sắc của **AgriPlay Native System** (Ethereal Harvest) và phông chữ **Nunito Sans** vào tệp CSS trung tâm `project/frontend/src/index.css`.
- Đảm bảo cấu trúc định tuyến (routing) của React Router được khai báo và liên kết các trang này với nhau một cách chính xác.

**Non-Goals:**
- Kết nối các dịch vụ API backend hoặc tích hợp cơ sở dữ liệu.
- Xử lý các logic nghiệp vụ phức tạp của AI Chat, PlantScan, hay BullMQ Scheduler.
- Tối ưu hóa SEO hay cấu hình Web Push thực tế (chỉ dựng giao diện tĩnh).

## Decisions

### 1. Đồng bộ mã nguồn từ Stitch MCP về React Components
- **Lựa chọn:** Tải toàn bộ HTML tĩnh của từng screen từ Stitch thông qua API (sử dụng download URL của file html từ `list_screens`) và bọc chúng vào các React functional components tương ứng đặt tại `project/frontend/src/pages/`.
- **Lý do:** Điều này giúp giữ nguyên vẹn 100% cấu trúc giao diện thô từ Stitch, tránh việc copy tay gây sai lệch hoặc thiếu sót các class CSS/JS tương tác thô đã sinh ra từ Stitch.

### 2. Tích hợp Hệ màu sắc AgriPlay Native (Ethereal Harvest)
- **Lựa chọn:** Khai báo bộ CSS variables toàn cục trong `project/frontend/src/index.css`:
  ```css
  :root {
    --color-surface-canvas: #faf8ff;
    --color-primary-green: #08a855;
    --color-accent-gold: #ffc107;
    --color-navy-black: #0f172a;
    --color-border: #bccabb;
  }
  ```
- **Lý do:** Đảm bảo tất cả các UI component khi được tích hợp sẽ tự động áp dụng đúng màu sắc thương hiệu và dễ dàng tùy biến hoặc chuyển đổi chủ đề (Day/Night) trong tương lai.

## Risks / Trade-offs

- **Risk**: Mã nguồn HTML từ Stitch có thể chứa một số thẻ hoặc thuộc tính không hoàn toàn tương thích với JSX (ví dụ `class` thay vì `className`, inline styles dạng chuỗi).
  - *Mitigation*: Thực hiện làm sạch và chuẩn hóa nhẹ mã nguồn HTML (chuyển đổi `class` thành `className` hoặc bọc trong cấu trúc React thích hợp) khi đưa vào các page components.
- **Risk**: Định tuyến thủ công có thể dẫn đến việc các trang chưa được kết nối đúng luồng.
  - *Mitigation*: Thiết lập một hệ thống định tuyến tập trung tại `project/frontend/src/App.tsx` mô phỏng chính xác theo đúng tài liệu Navigation Model của `screen_flow.md`.
