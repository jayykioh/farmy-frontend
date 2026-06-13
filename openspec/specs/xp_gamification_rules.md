# Quy định Nghiệp vụ: Hệ thống Điểm Tích Lũy (XP) & Gamification (Pet Module)

Tài liệu này đặc tả chi tiết nghiệp vụ tích lũy điểm kinh nghiệm (XP), tăng cấp (Level Up), quản lý chuỗi ngày hoạt động (Streak), và tác động tâm trạng Thú Ảo Bé Thóc.

---

## 1. Bảng Quy Đổi Điểm Tích Lũy (Scoreboard & XP Rules)

| Phân nhóm | Hành động | Điểm nhận được (XP) | Tâm trạng Bé Thóc | Điều kiện & Tần suất áp dụng |
| :--- | :--- | :---: | :---: | :--- |
| **Ghi nhật ký** | 📝 Tạo một nhật ký vụ mùa (Diary Log) | **+30 XP** | `happy` (Vui vẻ) / `excited` (Hào hứng) | Áp dụng cho mỗi lần thêm nhật ký. Nếu đạt mốc chuỗi ngày liên tiếp (Streak 7, 14, 30 ngày), tâm trạng sẽ đổi thành `excited` kèm lời thoại ăn mừng. |
| **Nhắc nhở** | 💧 Hoàn thành nhắc nhở sớm | **+10 XP** | `happy` (Vui vẻ) | Khi người dùng click nút "Xong" thủ công trên danh sách nhắc nhở. |
| | ⏰ Bỏ lỡ nhắc nhở quá giờ | **0 XP** | `sad` (Buồn bã) | Trạng thái tự động kích hoạt bởi hệ thống khi nhắc nhở trôi qua quá thời gian quy định (sau tối đa số lần retry BullMQ). |
| **Farm Snap** *(Phase 2)* | 📸 Đăng snap ảnh vườn có nhãn | **+10 XP** | `excited` (Hào hứng) | Mỗi snap đăng thành công và chứa nhãn hợp lệ (`cropType` + `condition`). |
| | 🔥 Snap đầu tiên trong ngày | **+5 XP Bonus** | `excited` (Hào hứng) | Thưởng thêm khi đăng tấm ảnh đầu tiên trong ngày (tính theo UTC+7). |
| | ❤️ Nhận 10 tim trên Snap | **+5 XP Bonus** | `excited` (Hào hứng) | Thưởng thành tích khi tấm ảnh đạt cột mốc tương tác từ cộng đồng. |
| **Báo động** | ⚠️ Sâu bệnh / Cảnh báo nguy cơ | **0 XP** | `worried` (Lo lắng) | Kích hoạt khi AI phát hiện nguy hại lớn trên cây trồng, mascot rung lắc cảnh báo người dùng. |

---

## 2. Nghiệp Vụ Chuỗi Ngày Liên Tục (Streak Logic)

Hệ thống tính chuỗi ngày liên tục dựa vào thời gian địa phương Việt Nam (**UTC+7**). 

### Quy tắc so sánh ngày:
Gọi $D_{last}$ là ngày của nhật ký gần nhất được lưu và $D_{today}$ là ngày hiện tại. Cả hai đều được đưa về mốc `00:00:00` theo giờ địa phương (Local Start of Day).

1. **Ghi nhật ký liên tiếp** ($\Delta D = 1$ ngày):
   - Tăng chuỗi: `streak_count = streak_count + 1`.
   - Cập nhật $D_{last} = D_{today}$.
   - Nếu đạt mốc 7, 14, 30 ngày liên tiếp, Bé Thóc chuyển sang trạng thái `excited` (Hào hứng) với lời thoại đặc biệt.
2. **Ghi nhật ký nhiều lần trong ngày** ($\Delta D = 0$ ngày):
   - Giữ nguyên chuỗi ngày `streak_count`.
   - Cộng thêm XP (+30 XP) bình thường cho mỗi log mới.
3. **Đứt chuỗi / Quên ghi nhật ký** ($\Delta D > 1$ ngày):
   - Đặt lại chuỗi ngày về `1`: `streak_count = 1`.
   - Cập nhật $D_{last} = D_{today}$.
   - Thú ảo có lời nhắc nhở nhẹ nhàng về việc quên duy trì chuỗi làm vườn.

---

## 3. Công Thức Tăng Cấp (Level Up Progression)

Cấp độ khởi điểm là **Cấp 1** (`level = 1`), điểm kinh nghiệm tích lũy khởi điểm là **0** (`xp = 0`).

### Quy tắc thăng cấp:
Điểm kinh nghiệm yêu cầu để thăng cấp tiếp theo tỉ lệ thuận với cấp độ hiện tại:
$$\text{XP yêu cầu lên cấp } (L + 1) = L \times 100 \text{ XP}$$

- Lvl 1 cần **100 XP** để lên Lvl 2
- Lvl 2 cần **200 XP** để lên Lvl 3
- Lvl 3 cần **300 XP** để lên Lvl 4
- ...
- Lvl $N$ cần **$N \times 100$ XP** để thăng cấp.

### Xử lý thừa điểm (Rollover XP):
Khi cộng thêm điểm kinh nghiệm $\Delta XP$:
$$\text{xp}_{\text{mới}} = \text{xp} + \Delta XP$$
- Nếu $\text{xp}_{\text{mới}} \ge \text{XP yêu cầu}$, hệ thống sẽ:
  1. Trừ bớt điểm thăng cấp: $\text{xp}_{\text{mới}} = \text{xp}_{\text{mới}} - \text{XP yêu cầu}$.
  2. Tăng cấp độ: `level = level + 1`.
  3. Lặp lại bước kiểm tra nếu điểm dư vẫn đủ để thăng cấp tiếp (Multi-level Up).
  4. Đổi tâm trạng Bé Thóc thành `excited` kèm thông báo ăn mừng thăng cấp đặc biệt: *"Chúc mừng bạn đã đạt Cấp X!"*.

---

## 4. Trạng Thái Thú Ảo Bé Thóc & Visual Overlays

Mascot Bé Thóc tích hợp các hiệu ứng SVG hoạt họa tương ứng với 5 trạng thái tâm trạng:

1. **`excited` (Hào hứng)**:
   - Vương miện vàng bay bổng nhịp nhàng phía trên đầu Bé Thóc.
   - Các hạt pháo hoa giấy (confetti) đa sắc màu bay tung tóe ra xung quanh.
   - Hiệu ứng phát sáng vàng hổ phách bao bọc mascot.
2. **`happy` (Vui vẻ)**:
   - Những chiếc lá xanh nhỏ nhắn xoay vòng bay lên.
   - Trái tim màu hồng bay bổng ngẫu nhiên biểu thị sự gắn bó với chủ vườn.
3. **`sad` (Buồn bã)**:
   - Những giọt nước mắt màu xanh da trời rơi lã chã từ hai mắt.
   - Một đám mây mưa nhỏ màu xám ngậm sấm sét bay ở góc phải, rơi hạt mưa xuống.
4. **`worried` (Lo lắng)**:
   - Giọt mồ hôi lo lắng lăn xuống từ trán Bé Thóc.
   - Mascot rung lắc nhẹ liên tục cảnh báo vườn cần được chăm sóc khẩn cấp.
5. **`neutral` (Bình thường)**:
   - Trạng thái đứng yên thư giãn, sẵn sàng chờ đợi nhiệm vụ mới.
