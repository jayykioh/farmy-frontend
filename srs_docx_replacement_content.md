# NỘI DUNG SAO CHÉP THAY THẾ CHO FILE WORD (DOCX)
## DỰ ÁN: FARMY DIARIES AI

Dưới đây là câu chữ và bảng biểu được định dạng giống hệt mẫu tài liệu SRS hiện tại của bạn. Bạn hãy mở file Word, bôi đen phần từ mục **6.2 Quản lý bán hàng** cho đến hết phụ lục cơ sở dữ liệu, sau đó copy toàn bộ nội dung dưới đây dán đè vào.

---

### BẮT ĐẦU PHẦN DÁN THAY THẾ (TỪ MỤC 6.2)

### 6.2   Quản lý Nhật ký canh tác (DiaryModule)

#### Use Case: Quản lý Nhật ký canh tác
*   **Use Case ID:** UC-FAR-001
*   **High Level Requirement Ref:** Cho phép người dùng ghi chép, xem, sửa, xóa nhật ký vụ mùa hằng ngày.
*   **Actor:** Người dùng (Nông dân)
*   **Description:** Nông dân ghi nhận các hoạt động nông nghiệp (tưới nước, bón phân, tình hình thời tiết, hình ảnh ruộng vườn) để theo dõi biên niên ký vụ mùa.
*   **Trigger:** Người dùng click vào chức năng "Nhật ký" trên màn hình chính.
*   **Pre-condition:** Người dùng đã đăng nhập thành công vào hệ thống.
*   **Post-processing:** Lưu nhật ký vào MongoDB, đồng bộ thời tiết, gửi tín hiệu cho PetModule cộng điểm kinh nghiệm (XP) cho thú ảo.

---

#### 6.2.1  Screen Design
#### 6.2.1.1 Danh sách Nhật ký canh tác

*   **Screen:** Danh sách Nhật ký
*   **Description:** Hiển thị danh sách các hoạt động nhật ký đã ghi chép của vụ mùa hiện tại.
*   **Screen Access:** Người dùng bấm vào biểu tượng "Nhật ký" từ Menu chính.

##### Screen Content
| Tên trường (Item) | Loại (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| **Lọc theo ngày** | DatePicker | Cho phép chọn ngày để xem nhật ký tương ứng |
| **Loại cây trồng** | Label | Hiển thị loại cây đang canh tác (Ví dụ: Lúa nước, Bưởi da xanh) |
| **Danh sách hoạt động** | Timeline List | Hiển thị danh sách các nhật ký theo thứ tự thời gian gần nhất |
| **Nút Thêm Nhật ký** | Button | Đi tới màn hình tạo nhật ký mới |

##### Screen Actions
| Tên Action | Mô tả | Thành công | Thất bại |
| :--- | :--- | :--- | :--- |
| **Xem chi tiết** | Click vào 1 dòng nhật ký để xem chi tiết hoạt động | Hiển thị popup chi tiết ghi chú và hình ảnh | |
| **Thêm mới** | Chuyển sang màn hình tạo nhật ký mới | Chuyển trang thành công | |

---

#### 6.2.1.2 Tạo Nhật ký mới

*   **Screen:** Tạo Nhật ký mới
*   **Description:** Giao diện cho phép nông dân nhập thông tin chăm sóc cây trồng hằng ngày.
*   **Screen Access:** Người dùng bấm nút "Thêm mới" trên màn hình Danh sách Nhật ký.

##### Screen Content
| Tên trường (Item) | Loại (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| **Ngày ghi** | Date Picker | Mặc định là ngày hôm nay. Cho phép chọn ngày khác |
| **Hoạt động chăm sóc** | ComboBox | Chọn loại hoạt động: Tưới nước, Bón phân, Xịt thuốc, Làm cỏ, Thu hoạch |
| **Đính kèm ảnh** | Upload Button | Tải ảnh trực tiếp lên bộ lưu trữ Cloudflare R2 |
| **Độ ẩm / Thời tiết** | Text Field | Điền tự động dựa trên định vị GPS hoặc nhập tay |
| **Ghi chú thêm** | Text Area | Nhập mô tả chi tiết tình hình thực tế |
| **Nút Lưu** | Button | Lưu dữ liệu vào hệ thống |

##### Screen Actions
| Tên Action | Mô tả | Thành công | Thất bại |
| :--- | :--- | :--- | :--- |
| **Lưu nhật ký** | Hệ thống kiểm tra dữ liệu đầu vào và lưu trữ | Lưu thành công, thú cưng được cộng XP, chuyển về danh sách nhật ký | Thông báo lỗi: "Vui lòng chọn hoạt động chăm sóc" |
| **Tải ảnh** | Tải ảnh chụp thực địa lên | Ảnh được tải lên thành công qua pre-signed URL | Thông báo: "Dung lượng ảnh vượt quá 5MB hoặc sai định dạng" |

---

### 6.3   Trợ lý Chẩn đoán sâu bệnh (PlantScanModule)

#### Use Case: Quét ảnh chẩn đoán bệnh cây
*   **Use Case ID:** UC-FAR-002
*   **High Level Requirement Ref:** Chụp ảnh lá cây và nhận kết quả chẩn đoán sâu bệnh thời gian thực từ AI.
*   **Actor:** Người dùng (Nông dân)
*   **Description:** Nông dân dùng camera quét ảnh lá cây bị bệnh, AI phân tích đưa ra tên bệnh, cách điều trị và cảnh báo cách ly an toàn (PHI Warning).
*   **Trigger:** Người dùng click vào biểu tượng "Quét bệnh" (Camera) trên thanh Menu.
*   **Pre-condition:** Thiết bị có camera hoạt động và đã kết nối mạng Internet.
*   **Post-processing:** Lưu kết quả chẩn đoán vào MongoDB để làm tri thức và cập nhật tâm trạng thú cưng sang `worried` nếu có bệnh nặng.

---

#### 6.3.1  Screen Design
#### 6.3.1.1 Chẩn đoán sâu bệnh (Plant Scan)

*   **Screen:** Chẩn đoán sâu bệnh
*   **Description:** Giao diện chụp ảnh lá cây bị hại và hiển thị kết quả phân tích sâu bệnh từ Gemini AI.
*   **Screen Access:** Click vào biểu tượng Camera "Quét bệnh" trên thanh Menu.

##### Screen Content
| Tên trường (Item) | Loại (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| **Khung ảnh chụp** | Camera View | Hiển thị màn hình camera thời gian thực để canh góc chụp lá cây |
| **Nút Chụp/Chọn ảnh** | Button | Kích hoạt camera chụp ảnh hoặc chọn ảnh có sẵn từ thư viện |
| **Tên bệnh phát hiện** | Label (Bold) | Hiển thị tên sâu bệnh được phát hiện bởi AI |
| **Độ tin cậy** | Progress Bar | Hiển thị phần trăm độ tin cậy của AI đối với chẩn đoán (Ví dụ: 95%) |
| **Giải pháp hóa học** | Text Area | Liệt kê các loại thuốc bảo vệ thực vật khuyên dùng |
| **Giải pháp sinh học** | Text Area | Hướng dẫn cách xử lý hữu cơ, dọn dẹp vệ sinh vườn |
| **Cảnh báo cách ly (PHI)**| Alert Box | **⚠️ Cực kỳ quan trọng:** Cảnh báo số ngày cách ly sau phun thuốc trước khi thu hoạch |

##### Screen Actions
| Tên Action | Mô tả | Thành công | Thất bại |
| :--- | :--- | :--- | :--- |
| **Gửi ảnh chẩn đoán** | Hệ thống gửi ảnh lên AI để phân tích | Trả về thông tin bệnh chi tiết trên màn hình | Thông báo: "Ảnh quá mờ, vui lòng chụp lại rõ nét hơn" hoặc "Giới hạn quét 3 ảnh/ngày" |
| **Xác nhận kết quả** | Người dùng bấm Thích/Không thích để phản hồi chất lượng AI | Ghi nhận phản hồi thành công vào MongoDB | |

---

### 6.4   Trợ lý ảo AI & Tra cứu tri thức (ChatModule & RAG)

#### Use Case: Trò chuyện với Trợ lý AI nông nghiệp
*   **Use Case ID:** UC-FAR-003
*   **High Level Requirement Ref:** Hỏi đáp kiến thức kỹ thuật canh tác nông nghiệp Việt Nam có ngữ cảnh.
*   **Actor:** Người dùng (Nông dân)
*   **Description:** Nông dân trò chuyện bằng văn bản tự nhiên với AI. AI tự động truy tìm các đoạn tài liệu nông nghiệp liên quan nhất (RAG) và kết hợp với dữ liệu trạng thái thú cưng để trả lời chính xác, thân thiện.
*   **Trigger:** Click vào nút "Trợ lý AI" từ màn hình chính.
*   **Pre-condition:** Đăng nhập thành công và có kết nối Internet.
*   **Post-processing:** Lưu tin nhắn hội thoại vào lịch sử chat MongoDB (TTL 90 ngày).

---

#### 6.4.1  Screen Design
#### 6.4.1.1 Trò chuyện với Trợ lý AI

*   **Screen:** Khung chat Trợ lý AI
*   **Description:** Giao diện trò chuyện tương tác hai chiều dạng tin nhắn thoại/chữ với Mascot AI.
*   **Screen Access:** Click vào biểu tượng "Trợ lý AI" ở Menu dưới cùng.

##### Screen Content
| Tên trường (Item) | Loại (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| **Mascot hoạt hình** | Image/GIF | Hình ảnh Mascot thú ảo động (biểu cảm vui, buồn, lo lắng theo trạng thái thực tế của Pet) |
| **Nội dung tin nhắn** | Chat Bubble | Hiển thị các tin nhắn hỏi đáp phân biệt màu sắc giữa nông dân và AI |
| **Thao tác nhanh** | Action Button | Các nút bấm nhanh như: `[📝 Nhật ký hôm nay]`, `[🐛 Xử lý sâu bệnh]` để đi nhanh đến chức năng khác |
| **Hộp nhập văn bản** | Input Field | Cho phép nhập câu hỏi nông nghiệp |
| **Nút gửi** | Button | Gửi tin nhắn đi |

##### Screen Actions
| Tên Action | Mô tả | Thành công | Thất bại |
| :--- | :--- | :--- | :--- |
| **Gửi câu hỏi** | Gửi tin nhắn và nhận câu trả lời tư vấn | Trả lời hiển thị sau 1-3 giây kèm khuyến nghị dựa trên tri thức RAG | Thông báo: "Mạng không ổn định" hoặc "Hệ thống AI đang bận, vui lòng thử lại sau vài giây" |
| **Chọn nút nhanh** | Bấm vào nút gợi ý hành động nhanh | Hệ thống tự động điền câu hỏi tương ứng hoặc chuyển hướng trang | |

---

### 6.5   Thú cưng ảo & Cửa hàng phụ kiện (Pet & ShopModule)

#### Use Case: Nuôi thú cưng ảo nông nghiệp
*   **Use Case ID:** UC-FAR-004
*   **High Level Requirement Ref:** Cơ chế trò chơi hóa tăng động lực ghi nhật ký vụ mùa hằng ngày.
*   **Actor:** Người dùng (Nông dân)
*   **Description:** Người dùng theo dõi sức khỏe/tâm trạng của thú cưng trên màn hình chính, tích lũy điểm kinh nghiệm (XP) từ các nhiệm vụ nông trại để mua sắm vật phẩm phụ kiện trong Shop và trang bị cho thú cưng.
*   **Trigger:** Truy cập trang chủ hệ thống.
*   **Pre-condition:** Người dùng đã đăng ký tài khoản thành công.
*   **Post-processing:** Cập nhật trạng thái thú cưng trong collection `pet_states` của MongoDB.

---

#### 6.5.1  Screen Design
#### 6.5.1.1 Giao diện Thú cưng ảo trên Trang chủ

*   **Screen:** Giao diện Thú cưng Trang chủ
*   **Description:** Hiển thị Mascot đồng hành, điểm streak, cấp độ và lời chào thoại thông minh.
*   **Screen Access:** Tự động hiển thị ngay khi đăng nhập vào hệ thống (Trang chủ).

##### Screen Content
| Tên trường (Item) | Loại (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| **Mascot thú ảo** | Interactive Widget | Hiển thị thú ảo mang các phụ kiện đã mua. Bấm vào Pet để xem hành động |
| **Bóng lời thoại** | Speech Bubble | Hiển thị lời chào hoặc lời khuyên nông nghiệp thông minh của AI |
| **Thanh Streak** | Badge | Hiển thị số ngày liên tục người dùng ghi nhật ký (Ví dụ: 🔥 5 ngày) |
| **Thanh Level / XP** | Progress Bar | Hiển thị Cấp độ hiện tại và số điểm XP tích lũy |
| **Nút Cửa hàng (Shop)** | Button | Click để mở màn hình cửa hàng mua sắm |

##### Screen Actions
| Tên Action | Mô tả | Thành công | Thất bại |
| :--- | :--- | :--- | :--- |
| **Bấm vào Thú cưng** | Click trực tiếp vào hình thú ảo | Thú ảo thực hiện hoạt ảnh nhào lộn vui nhộn và đổi câu thoại | |

---

#### 6.5.1.2 Cửa hàng phụ kiện thú cưng (Pet Shop)

*   **Screen:** Cửa hàng Thú cưng
*   **Description:** Danh sách các phụ kiện (nón lá, kính mát, áo mưa...) mà nông dân có thể mua bằng điểm kinh nghiệm (XP) đã tích lũy.
*   **Screen Access:** Click nút "Cửa hàng" (Shop) trên giao diện trang chủ thú cưng.

##### Screen Content
| Tên trường (Item) | Loại (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| **Điểm XP hiện tại** | Label | Số XP người dùng đang sở hữu |
| **Danh sách vật phẩm** | Grid Card | Hiển thị ảnh vật phẩm, tên vật phẩm, và giá mua bằng điểm XP |
| **Nút Mua** | Button | Cho phép mua vật phẩm nếu đủ điểm XP |
| **Nút Trang bị** | Button | Mặc hoặc cởi phụ kiện cho Thú cưng |

##### Screen Actions
| Tên Action | Mô tả | Thành công | Thất bại |
| :--- | :--- | :--- | :--- |
| **Mua vật phẩm** | Dùng điểm XP để mua phụ kiện mới | Điểm XP bị trừ, vật phẩm chuyển sang trạng thái "Đã sở hữu" | Thông báo: "Bạn không đủ điểm XP để mua vật phẩm này" |
| **Trang bị vật phẩm** | Mặc phụ kiện đã mua lên Mascot | Thú cưng trên trang chủ được cập nhật giao diện mới | |

---

### 6.6   Quản lý Lịch nhắc nhở (ReminderModule)

#### Use Case: Quản lý lịch nhắc nhở chăm sóc cây
*   **Use Case ID:** UC-FAR-005
*   **High Level Requirement Ref:** Thiết lập lịch nhắc tưới nước, bón phân tự động qua Zalo và Web Push.
*   **Actor:** Người dùng (Nông dân)
*   **Description:** Cho phép người dùng lên lịch nhắc nhở các hoạt động canh tác định kỳ. Hệ thống sẽ tự động gửi thông báo qua Zalo OA ZNS hoặc Web Push khi tới hẹn.
*   **Trigger:** Chọn tính năng "Lên lịch nhắc nhở" trên màn hình.
*   **Pre-condition:** Người dùng đã cấu hình nhận thông báo (liên kết Zalo hoặc cài đặt ứng dụng PWA).
*   **Post-processing:** Lưu lịch nhắc vào MongoDB, đưa tác vụ vào hàng đợi BullMQ để gửi đi đúng giờ.

---

#### 6.6.1  Screen Design
#### 6.6.1.1 Đặt lịch nhắc nhở mới

*   **Screen:** Đặt lịch nhắc nhở
*   **Description:** Biểu mẫu cho phép nông dân lên lịch bón phân, tưới nước cho vườn.
*   **Screen Access:** Chọn menu "Nhắc nhở" $\rightarrow$ "Tạo lịch nhắc".

##### Screen Content
| Tên trường (Item) | Loại (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| **Vườn cây áp dụng** | ComboBox | Chọn khu vườn cần áp dụng (Ví dụ: Vườn Lúa 1, Vườn Bưởi) |
| **Hoạt động** | ComboBox | Chọn loại hoạt động cần nhắc (Tưới nước, Bón phân, Thu hoạch) |
| **Thời gian nhắc** | Time/Date Picker | Chọn giờ và ngày cần gửi thông báo nhắc nhở |
| **Chu kỳ nhắc** | RadioButton | Lựa chọn nhắc: Một lần, Hằng ngày, Hằng tuần |
| **Kênh thông báo** | ComboBox | Lựa chọn ưu tiên nhận tin: Tự động (Zalo + Push), Chỉ Zalo, Chỉ PWA Push |

##### Screen Actions
| Tên Action | Mô tả | Thành công | Thất bại |
| :--- | :--- | :--- | :--- |
| **Lưu lịch nhắc** | Hệ thống ghi nhận lịch hẹn và đưa vào hàng đợi | Tạo lịch thành công, hiển thị trong danh sách lịch nhắc nhở | Thông báo: "Thời gian nhắc nhở không được ở quá khứ" |

---

### 6.7   Báo cáo vụ mùa & Khuyến nghị tuần (InsightModule)

#### Use Case: Nhận báo cáo phân tích vụ mùa hàng tuần
*   **Use Case ID:** UC-FAR-006
*   **High Level Requirement Ref:** Nhận phân tích tổng quan hoạt động và khuyến nghị nông nghiệp từ AI Gemini theo tuần.
*   **Actor:** Người dùng (Nông dân)
*   **Description:** Mỗi sáng Chủ nhật, AI tự động quét nhật ký cả tuần của người dùng, phân tích xu hướng và tạo một bản báo cáo khuyến nghị chi tiết gửi qua Zalo/Email.
*   **Trigger:** Cronjob của hệ thống tự động chạy vào lúc 6:00 AM Chủ nhật.
*   **Pre-condition:** Nông dân có phát sinh ít nhất 1 nhật ký hoạt động trong tuần.
*   **Post-processing:** Bản tin phân tích lưu vào collection `weekly_insights` và gửi thông báo cho người dùng.

---

#### 6.7.1  Screen Design
#### 6.7.1.1 Xem báo cáo tuần (AI Insights)

*   **Screen:** Bản tin Khuyến nghị Tuần (AI Insights)
*   **Description:** Giao diện hiển thị các phân tích tổng hợp của AI về vụ vụ mùa trong tuần qua.
*   **Screen Access:** Người dùng bấm vào thông báo nhận được hoặc truy cập mục "Khuyến nghị" trên thanh công cụ.

##### Screen Content
| Tên trường (Item) | Loại (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| **Chọn tuần báo cáo** | ComboBox | Lựa chọn khoảng thời gian tuần cần xem lại báo cáo cũ |
| **Đánh giá hoạt động**| Text Field | Tổng số ngày đã ghi nhật ký, các chỉ số tưới nước/bón phân trong tuần |
| **Nội dung khuyến nghị**| Markdown Area | Bản báo cáo chi tiết do AI phân tích (độ sinh trưởng, lời khuyên lượng nước bón phân, phòng bệnh cho tuần tới) |
| **Đánh giá AI** | Star Rating | Cho phép người dùng đánh giá mức độ hữu ích của báo cáo (1 đến 5 sao) |

##### Screen Actions
| Tên Action | Mô tả | Thành công | Thất bại |
| :--- | :--- | :--- | :--- |
| **Đánh giá báo cáo** | Gửi số sao đánh giá chất lượng phân tích của AI | Lưu đánh giá vào MongoDB để huấn luyện và tối ưu AI | |

---

### 6.8   Quản lý Tài khoản (AuthModule)

#### Use Case: Quản lý tài khoản Nông dân
*   **Use Case ID:** UC-FAR-007
*   **Actor:** Người dùng (Nông dân)
*   **Description:** Cho phép người dùng đăng ký, đăng nhập tài khoản, cập nhật thông tin cá nhân và liên kết với tài khoản Zalo cá nhân.
*   **Pre-condition:** Đã cài đặt ứng dụng.
*   **Post-processing:** Lưu thông tin tài khoản và access token mã hóa vào MongoDB.

---

#### 6.8.1  Screen Design
#### 6.8.1.1 Thiết lập tài khoản & Liên kết Zalo

*   **Screen:** Cài đặt tài khoản
*   **Description:** Quản lý thông tin hồ sơ và kết nối nhận thông báo qua Zalo OA.
*   **Screen Access:** Người dùng click vào ảnh đại diện $\rightarrow$ chọn "Cài đặt tài khoản".

##### Screen Content
| Tên trường (Item) | Loại (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| **Tên nông dân** | Text Field | Họ và tên hiển thị của nông dân |
| **Vị trí địa lý** | Text Field | Nhập tỉnh/thành sinh sống (để dự báo thời tiết chuẩn xác hơn) |
| **Liên kết Zalo** | Button | Bấm để mở liên kết xác thực tài khoản Zalo OA |
| **Bật nhận tin nhắn** | Toggle Switch | Bật/Tắt chế độ nhận tin nhắn nhắc nhở chăm sóc qua Zalo |
| **Nút Cập nhật** | Button | Lưu thay đổi thông tin |

##### Screen Actions
| Tên Action | Mô tả | Thành công | Thất bại |
| :--- | :--- | :--- | :--- |
| **Liên kết Zalo** | Thực hiện OAuth với Zalo App | Nhận zalo_user_id thành công, đổi trạng thái nút thành "Đã liên kết" | Thông báo: "Liên kết thất bại, vui lòng thử lại" |
| **Cập nhật hồ sơ** | Lưu các thông tin thay đổi | Thông tin được cập nhật thành công vào MongoDB | Thông báo: "Họ tên không được để trống" |

---

### 7. YÊU CẦU PHI CHỨC NĂNG VÀ MÔI TRƯỜNG PHÁT TRIỂN

#### 7.1 Yêu cầu phi chức năng:
*   **Giao diện:** Thân thiện với nông dân, tối ưu hóa kích thước chữ tương phản cao, hỗ trợ sử dụng offline-first (PWA) khi làm việc ngoài đồng không có sóng điện thoại.
*   **Hiệu suất:** Tốc độ phản hồi API thông thường dưới $200\text{ms}$. Tốc độ phản hồi tìm kiếm vector ngữ nghĩa trên pgvector dưới $20\text{ms}$.
*   **Bảo mật:** Toàn bộ access token của Zalo phải được mã hóa đối xứng AES-256 trước khi lưu. Kiểm soát Magic Bytes của tất cả hình ảnh tải lên để chặn mã độc.
*   **Độ tin cậy:** AI chẩn đoán bệnh lá cây phải có độ tin cậy được phân tích (confidence score) tối thiểu $80\%$.

#### 7.2 Yêu cầu môi trường phát triển:
*   **Phần cứng tối thiểu:** Điện thoại thông minh (smartphone) có camera độ phân giải từ 5MP trở lên (phục vụ quét ảnh bệnh cây trồng), dung lượng RAM trống tối thiểu 1GB.
*   **Phần mềm chạy client:** Mọi hệ điều hành hỗ trợ trình duyệt web hiện đại có hỗ trợ PWA Service Workers (iOS/Android/Windows/macOS - Safari, Chrome, Edge).
*   **Kết nối mạng:** Kết nối mạng Internet không dây (3G/4G/Wifi) để giao tiếp với AI server và tải ảnh lên Cloudflare R2 Cloud Storage.

---

### 8.  PHỤ LỤC: THIẾT KẾ CƠ SỞ DỮ LIỆU CHUẨN

Hệ thống sử dụng cơ sở dữ liệu chính **MongoDB Atlas** làm nguồn dữ liệu nghiệp vụ gốc (Source of Truth) kết hợp với bảng vector search index trên **pgvector (Postgres)**:

#### 8.1 Các Collections chính trong MongoDB

##### 1. Collection `users` (Thông tin tài khoản)
*   `_id` (String - UUID v4): Khóa chính định danh người dùng.
*   `email` (String - Unique): Địa chỉ email đăng ký.
*   `passwordHash` (String): Mật khẩu đã mã hóa bcrypt.
*   `role` (String): Vai trò người dùng (`user` | `admin` | `moderator`).
*   `full_name` (String): Tên đầy đủ.
*   `location` (String - Nullable): Địa chỉ tỉnh/thành sinh sống.
*   `zalo_user_id` (String - Nullable): ID định danh liên kết Zalo.
*   `zalo_access_token_encrypted` (String - Nullable): Token liên kết mã hóa AES-256.
*   `zalo_notification_enabled` (Boolean): Cho phép gửi tin nhắn Zalo.

##### 2. Collection `farm_plots` (Quản lý vườn)
*   `_id` (String - UUID v4): Khóa chính.
*   `user_id` (String): Tham chiếu liên kết sang `users._id`.
*   `name` (String): Tên khu vườn/ruộng.
*   `area_size` (Number): Diện tích vườn ($m^2$).
*   `description` (String - Nullable): Mô tả khu vườn.

##### 3. Collection `diaries` (Thông tin vụ mùa)
*   `_id` (String - UUID v4): Khóa chính.
*   `plot_id` (String): Tham chiếu liên kết sang `farm_plots._id`.
*   `crop_type` (String): Loại cây trồng chính (Ví dụ: Lúa nước, Bưởi).
*   `start_date` (Date): Ngày gieo trồng bắt đầu vụ mùa.
*   `status` (String): Trạng thái vụ mùa (`active` | `completed` | `abandoned`).

##### 4. Collection `diary_logs` (Nhật ký hằng ngày)
*   `_id` (String - UUID v4): Khóa chính.
*   `diary_id` (String): Tham chiếu liên kết sang `diaries._id`.
*   `activity_type` (String): Loại hoạt động chăm sóc (Tưới nước, Bón phân...).
*   `content` (String): Nội dung ghi chép chi tiết của nông dân.
*   `photo_urls` (Array of Strings): Link ảnh thực tế vụ mùa lưu trên Cloudflare R2.
*   `watered` (Boolean): Đã tưới nước trong ngày hay chưa.
*   `fertilized` (Boolean): Đã bón phân trong ngày hay chưa.
*   `weather` (Object): Chứa thông tin thời tiết đồng bộ từ API (`temp`, `humidity`, `description`).

##### 5. Collection `pet_states` (Trạng thái thú cưng)
*   `_id` (String - UUID v4): Khóa chính.
*   `user_id` (String - Unique): Tham chiếu liên kết sang `users._id`.
*   `mood` (String): Tâm trạng thú ảo (`happy`, `neutral`, `sad`, `worried`, `excited`).
*   `streak_count` (Number): Chuỗi ngày liên tục ghi nhật ký canh tác của nông dân.
*   `xp` (Number): Điểm kinh nghiệm tích lũy của Pet.
*   `level` (Number): Cấp độ của Pet.
*   `equipped_items` (Array of Strings): Danh sách phụ kiện thú cưng đang mặc.

##### 6. Collection `plant_scans` (Lịch sử quét bệnh)
*   `_id` (String - UUID v4): Khóa chính.
*   `user_id` (String): Tham chiếu liên kết sang `users._id`.
*   `imageUrl` (String): Link ảnh lá cây bị bệnh lưu trên Cloudflare R2.
*   `pHash` (String): Khóa băm nhận dạng ảnh phục vụ kiểm tra trùng lặp ảnh.
*   `cropType` (String): Loại cây được quét ảnh.
*   `diagnosis` (Object): Chứa kết quả bệnh (`disease`), độ tin cậy (`confidence`), triệu chứng (`symptoms`), và giải pháp xử lý (`treatment`).

---

#### 8.2 Bảng vector search index trên PostgreSQL (pgvector)

##### Tên bảng: `embeddings`
*   `id` (BigSerial - Primary Key): Khóa chính tự tăng.
*   `source_id` (Text): Lưu trữ MongoDB ObjectId dạng chuỗi (tham chiếu ngược đến nguồn gốc dữ liệu).
*   `source_type` (Text): Phân loại dữ liệu vector (`diary_entry` | `knowledge_chunk`).
*   `chunk_index` (Integer): Thứ tự phân chia nhỏ của văn bản.
*   `text` (Text): Nội dung đoạn văn bản tri thức gốc nông nghiệp.
*   `embedding` (vector(768)): Cột lưu trữ vector nhúng 768 chiều (Gemini text-embedding-004).
*   `is_active` (Boolean): Trạng thái hoạt động của vector index.

---

### KẾT THÚC PHẦN DÁN THAY THẾ
