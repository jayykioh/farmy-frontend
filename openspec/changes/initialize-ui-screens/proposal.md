## Why

Hiện tại các màn hình UI của FarmDiaries AI đã được thiết kế và cập nhật đầy đủ trên Stitch MCP board. Chúng ta cần đồng bộ (pull) toàn bộ mã nguồn HTML/CSS/JS của các màn hình thiết kế này về dự án frontend React PWA để khởi tạo (initialize) các trang giao diện, đảm bảo sự nhất quán tuyệt đối về cấu trúc trực quan và hệ màu sắc của AgriPlay Native System trước khi thực hiện lập trình logic tương tác và kết nối API.

## What Changes

- Khởi tạo thư mục và các tệp thành phần giao diện (UI screen components) mới trong thư mục `project/frontend/src/` từ mã nguồn thiết kế Stitch.
- Đồng bộ toàn bộ các màn hình chính bao gồm:
  - Welcome & Auth (SCR-01)
  - Onboarding Setup Wizard 3 bước (SCR-01B, SCR-01C, SCR-01D)
  - Home / Mascot Garden (SCR-02)
  - Diary List & Farm History (SCR-03) và Create/Edit Diary Entry Sheet (SCR-03B/C)
  - Chat Session List (SCR-05B) & Active AI Chat (SCR-05A) kèm PlantScan Diagnosis result card
  - Accessory Shop (SCR-06)
  - Profile & Progress (SCR-07)
  - XP & Streak Celebration modal overlay (SCR-08)
  - Reminder List (SCR-09) và Create Reminder Sheet (SCR-09B)
- Tích hợp hệ thống màu sắc AgriPlay Native (Ethereal Harvest) và font Nunito Sans vào cấu trúc CSS dùng chung của frontend.
- Đảm bảo xây dựng các component UI theo đúng mô tả và thiết kế trên tài liệu design.
- Liên kết các screen tương ứng theo screen flow để có thể routing và navigation.
## Capabilities

### New Capabilities
- `ui-screens-initialization`: Pull toàn bộ HTML/CSS từ các thiết kế Stitch về mã nguồn PWA frontend để làm nền tảng phát triển giao diện chính thức.

### Modified Capabilities
<!-- No modified capabilities since this is the initial UI scaffolding sync -->

## Impact

- **Frontend (`project/frontend`)**: Tạo các file UI components dạng HTML tĩnh hoặc React JSX thô từ Stitch để chuẩn bị cho quá trình code logic.
- **Styling (`project/frontend/src/index.css`)**: Tích hợp các biến màu CSS từ AgriPlay Native System (Ethereal Harvest).
- **Dependencies**: Không ảnh hưởng đến các thư viện bên ngoài hay APIs hiện có.
