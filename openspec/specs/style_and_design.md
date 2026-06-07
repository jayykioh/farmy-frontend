# Tài liệu Thiết kế & Hệ thống Style (UI/UX Style Guide & Design System)
## Dự án: FarmDiaries AI 🌱

Tài liệu này định nghĩa hệ thống thiết kế (Design System), triết lý trải nghiệm người dùng (UX) và các quy chuẩn giao diện (UI) cho ứng dụng **FarmDiaries AI**. Mục tiêu là tạo ra một ứng dụng PWA thân thiện, dễ sử dụng cho nông dân Việt Nam, đồng thời tích hợp các yếu tố công nghệ AI hiện đại và cơ chế game hóa (Gamification) sinh động.

---

## 1. Triết lý Thiết kế (Design Philosophy)

Giao diện của **FarmDiaries AI** được xây dựng dựa trên 4 nguyên tắc cốt lõi:

*   **Rural-First (Thân thiện nông thôn):** Tối ưu hóa cho môi trường sử dụng thực tế ngoài đồng ruộng (ánh sáng mạnh, tay dính đất/ẩm ướt). Font chữ to rõ, độ tương phản cao, các nút bấm có kích thước tối thiểu `48px` để dễ tương tác.
*   **Intuitive & Visual (Trực quan hóa tối đa):** Giảm thiểu các khối chữ dài dòng. Thay vào đó, sử dụng biểu tượng (Icons), thẻ màu (Color-coded badges), hình vẽ SVG động của Thú ảo và biểu đồ trực quan để truyền tải thông tin.
*   **Responsive & Lightweight (Nhanh & Nhẹ):** Ứng dụng PWA hoạt động mượt mà trên cả các dòng điện thoại Android cấu hình thấp của nông dân. Tốc độ tải trang nhanh, hỗ trợ lưu trữ cục bộ khi mất mạng.
*   **Gamified Engagement (Thu hút nhờ Game hóa):** Nhân vật thú ảo hoạt động như một người bạn đồng hành thực sự của nhà nông, phản ánh sức khỏe của vườn tược qua các trạng thái cảm xúc.

---

## 2. Bảng màu Hệ thống (Color Palette)

Hệ màu của **FarmDiaries AI** được lấy cảm hứng từ thiên nhiên nông nghiệp kết hợp với sắc tím công nghệ của trí tuệ nhân tạo.

### 2.1 Màu Chủ đạo & Nhận diện (Brand Colors)

| Màu sắc | Mã Hex | Vai trò / Ứng dụng |
| :--- | :--- | :--- |
| **Primary (Xanh Lá Mầm)** | `#10b981` (Emerald-500) <br> `#059669` (Emerald-600) | Đại diện cho nông nghiệp, cây trồng xanh tươi, sự sinh trưởng và sức khỏe. Dùng cho các nút hành động chính, trạng thái thành công. |
| **Secondary (Vàng Nắng Ấm)** | `#f59e0b` (Amber-500) <br> `#d97706` (Amber-600) | Đại diện cho ánh nắng, mùa vụ bội thu, cảnh báo nhẹ. Dùng cho thời tiết, chỉ báo Streak, và các cảnh báo ở mức trung bình. |
| **Accent (Tím Trí Tuệ)** | `#a855f7` (Purple-500) <br> `#8b5cf6` (Violet-500) | Đại diện cho Trí tuệ Nhân tạo (Gemini AI), tính năng quét chẩn đoán và Thú ảo (Pet). Tạo điểm nhấn hiện đại và công nghệ. |

### 2.2 Màu Trạng thái (System Status Colors)

*   **Thành công (Success):** `#10b981` (Xanh lá) - Lưu nhật ký thành công, kết nối Zalo đạt yêu cầu.
*   **Cảnh báo (Warning):** `#ef4444` (Đỏ cảnh báo) - Phát hiện dịch hại nặng, cảnh báo thời gian cách ly của thuốc hóa học (PHI).
*   **Thông tin (Info):** `#3b82f6` (Xanh dương) - Thông tin thời tiết đồng bộ, lịch nhắc nhở công việc.

### 2.3 Bảng màu Sáng / Tối (Light & Dark Theme Tokens)

Ứng dụng hỗ trợ chuyển đổi giao diện linh hoạt dựa trên cài đặt hệ thống để tối ưu pin và hiển thị ban đêm.

| CSS Variable | Light Theme (Mặc định) | Dark Theme (Chế độ tối) | Ý nghĩa ứng dụng |
| :--- | :--- | :--- | :--- |
| `--bg` | `#ffffff` | `#16171d` | Màu nền chính của ứng dụng |
| `--text` | `#6b6375` (Xám tím ấm) | `#9ca3af` (Xám dịu mắt) | Màu chữ nội dung (body text) |
| `--text-h` | `#08060d` (Đen đậm) | `#f3f4f6` (Trắng sáng) | Màu chữ tiêu đề (h1, h2, h3) |
| `--border` | `#e5e4e7` | `#2e303a` | Màu đường viền phân cách, khung thẻ |
| `--code-bg` | `#f4f3ec` | `#1f2028` | Nền hộp văn bản đặc thù / code |
| `--accent` | `#aa3bff` | `#c084fc` | Sắc tím nhấn mạnh AI & Pet |
| `--accent-bg` | `rgba(170, 59, 255, 0.1)` | `rgba(192, 132, 252, 0.15)`| Màu nền mờ cho các nút bấm highlight |
| `--accent-border` | `rgba(170, 59, 255, 0.5)` | `rgba(192, 132, 252, 0.5)` | Đường viền nhấn mạnh |

---

## 3. Hệ thống Kiểu chữ (Typography)

Tập trung vào tính rõ ràng và khả năng đọc dưới ánh sáng mặt trời mạnh.

*   **Font chữ chính (Sans-serif):** `Inter`, `Outfit`, hoặc `system-ui` (không dùng font có chân phức tạp).
*   **Font chữ đơn cách (Monospace):** `ui-monospace`, `Consolas` (dùng cho các thông số kỹ thuật, mã nhật ký, số liệu đếm Streak).

### Quy định Kích thước & Trọng số (Typography Scale):

1.  **Tiêu đề lớn (h1):** `56px` (Desktop) / `36px` (Mobile). Độ dày `500` (Medium). Khoảng cách chữ `-1.68px` tạo cảm giác gọn gàng, hiện đại.
2.  **Tiêu đề thẻ/phần (h2):** `24px` (Desktop) / `20px` (Mobile). Độ dày `500` (Medium). Chiều cao dòng `118%`.
3.  **Chữ nội dung (p / body):** `18px` (Màn hình lớn) / `16px` (Mobile) giúp nông dân lớn tuổi dễ đọc. Chiều cao dòng tối ưu `145%`.
4.  **Nhãn kỹ thuật / Nút (code / counter):** `15px`. Font đơn cách để các con số nhảy đồng bộ không bị lệch lưới giao diện.

---

## 4. Quy chuẩn Bố cục & Lưới (Layout & Grid Guidelines)

FarmDiaries AI ưu tiên thiết kế **Mobile-First** nhằm tối ưu hóa trải nghiệm trên điện thoại thông minh cầm tay.

*   **Độ rộng khung chứa chính (`#root`):** Khống chế tối đa `1126px`, căn giữa màn hình với viền phân tách mỏng ở hai bên (`border-inline: 1px solid var(--border)`). Trên thiết bị di động, chiều rộng tự động co giãn 100%.
*   **Thanh điều hướng dưới (Bottom Navigation Bar):** Áp dụng cho chế độ hiển thị di động. Chứa 5 nút bấm chính dạng icon + nhãn chữ:
    1.  *Trang chủ (Home):* Hiển thị thú ảo và tổng quan ngày.
    2.  *Nhật ký (Diaries):* Lịch sử canh tác số.
    3.  *Quét bệnh (Scan):* Camera AI chẩn đoán bệnh.
    4.  *Chat AI (Trợ lý):* Tư vấn trực tuyến RAG.
    5.  *Cài đặt (Settings):* Cấu hình tài khoản & thông báo.
*   **Khoảng đệm (Spacing Unit):** Áp dụng hệ số nhân 8 (`8px`, `16px`, `24px`, `32px`, `48px`) để thiết lập padding/margin nhằm tạo nhịp điệu thị giác nhất quán.

---

## 5. Quy chuẩn Thiết kế Chi tiết các Phân hệ (Module UI Specs)

### 5.1 Phân hệ Nhật ký canh tác (Diary UI)
*   **Form ghi chép nhanh:** Tối thiểu hóa việc gõ phím. Sử dụng các thẻ lựa chọn nhanh (Chips/Pills) đối với các hành động phổ biến như: `[💦 Tưới nước]`, `[🌱 Bón phân]`, `[✂️ Tỉa cành]`, `[🐛 Phun thuốc]`.
*   **Thẻ nhật ký (Diary Cards):**
    *   Hiển thị huy hiệu thời tiết tự động đồng bộ (ví dụ: `☀️ 32°C`, `🌧️ Mưa rào`) giúp nông dân có ngữ cảnh đầy đủ khi xem lại lịch sử.
    *   Ảnh chụp hoạt động canh tác được bo góc `8px`, kèm theo nút phóng to dạng lightbox.

### 5.2 Phân hệ Trợ lý AI Chat (RAG Chat UI)
*   **Bong bóng hội thoại (Message Bubbles):**
    *   *Người dùng:* Nền màu tím nhạt (`var(--accent-bg)`), viền mỏng (`var(--accent-border)`), căn lề phải.
    *   *AI Trợ lý:* Nền xám nhạt (`var(--code-bg)`), căn lề trái. Kèm theo avatar đại diện là hình Thú ảo đeo kính hoặc cầm bảng viết.
*   **Chỉ báo sinh dữ liệu (Streaming Indicator):** Hiển thị hiệu ứng nhấp nháy mờ dần khi AI đang truyền câu trả lời dạng stream (SSE).
*   **Đánh giá nhanh:** Icon Upvote/Downvote thiết kế mờ ở cuối mỗi câu trả lời của AI, đổi màu xanh/đỏ khi được nhấn để phản hồi tức thì chất lượng câu trả lời.

### 5.3 Phân hệ Chẩn đoán bệnh (Plant Scan UI)
*   **Trình tải ảnh:** Thiết kế vùng kéo thả ảnh lớn, nét đứt, có hình camera lớn ở trung tâm.
*   **Thông báo chất lượng ảnh:**
    *   Nếu phát hiện ảnh mờ thông qua chỉ số Laplacian hệ thống, hiển thị cảnh báo màu vàng: `⚠️ Ảnh hơi mờ, kết quả chẩn đoán có thể kém chính xác. Bạn có muốn chụp lại không?`.
*   **Bảng kết quả chẩn đoán (Diagnosis Dashboard):**
    *   Hiển thị tên bệnh bằng chữ đậm màu đỏ.
    *   **Hộp PHI (Thời gian cách ly an toàn):** Hiển thị nổi bật bằng viền đỏ đứt nét nếu khuyến nghị sử dụng thuốc hóa học, ghi rõ số ngày cần cách ly trước khi thu hoạch để đảm bảo an toàn thực phẩm.

### 5.4 Phân hệ Thú ảo & Gamification (Pet UI)
*   **Hoạt ảnh nhân vật (SVG Pet):**
    *   *Trạng thái `happy` (Vui vẻ):* Pet nhảy nhẹ, mắt cười, tai vẫy. Kích hoạt khi vừa ghi nhật ký xong.
    *   *Trạng thái `neutral` (Bình thường):* Đứng yên thở nhẹ.
    *   *Trạng thái `worried` (Lo lắng):* Pet đổ mồ hôi, mắt tròn xoe lo sợ. Kích hoạt khi người dùng quét ảnh phát hiện sâu bệnh nặng.
    *   *Trạng thái `sad` (Ủ rũ):* Pet ngồi co ro, mắt rưng rưng nước. Kích hoạt khi người dùng quên ghi nhật ký quá 36 giờ.
    *   *Trạng thái `excited` (Hào hứng):* Pet đội vương miện, tay cầm cúp, có pháo hoa bay xung quanh. Kích hoạt khi mở khóa huy hiệu Streak.
*   **Bong bóng lời thoại (Dialogue Bubble):** Hiển thị chữ viết nghiêng mềm mại nằm ngay phía trên đầu nhân vật, có thể click vào để xem gợi ý hành động nhanh.

---

## 6. Vi tương tác & Hiệu ứng chuyển động (Micro-interactions & Transitions)

Các chuyển động tinh tế giúp ứng dụng tạo cảm giác cao cấp và sống động:

*   **Hiệu ứng gợn sóng (Ripple Effect):** Kích hoạt trên tất cả các nút bấm khi người dùng chạm vào (tap).
*   **Hiệu ứng chuyển trang (Page Transitions):** Sử dụng hiệu ứng trượt nhẹ (slide-in) từ phải qua trái khi chuyển đổi tab điều hướng để mang lại cảm giác mượt mà giống ứng dụng native.
*   **Hiệu ứng đếm số (Count-up Animation):** Con số ngày Streak tăng dần từ `N` lên `N+1` kèm theo hiệu ứng nảy nhẹ (scale bounce) của thẻ hiển thị số ngày.
*   **Khung xương tải dữ liệu (Skeleton Loading):** Sử dụng các mảng xám mờ chuyển động ánh sáng quét ngang để hiển thị cấu trúc thẻ nhật ký/kết quả chẩn đoán trong khi chờ tải API, thay thế hoàn toàn cho vòng xoay loading cổ điển.

---

## 7. Thiết kế PWA & Khả năng hoạt động Ngoại tuyến (Offline UI Specification)

*   **Chỉ báo trạng thái mạng:** Khi thiết bị mất kết nối Internet, ở góc trên màn hình hiển thị một thanh thông báo nhỏ màu xám nhạt: `🔌 Bạn đang ngoại tuyến. Nhật ký sẽ được tự động đồng bộ khi có mạng trở lại.`.
*   **Chế độ vô hiệu hóa tạm thời:** Các chức năng yêu cầu API trực tuyến như **Quét bệnh AI** và **Chat trợ lý RAG** sẽ tự động được làm mờ (opacity 0.5) và hiển thị tooltip giải thích lý do khi người dùng cố gắng click khi offline.
