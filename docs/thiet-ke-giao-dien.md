# TÀI LIỆU ĐẶC TẢ THIẾT KẾ GIAO DIỆN (UI/UX DESIGN SPECIFICATION)
## DỰ ÁN: STUDYMATE – NỀN TẢNG QUẢN LÝ HỌC TẬP THÔNG MINH CHO SINH VIÊN

---

## 1. TỔNG QUAN & TRIẾT LÝ THIẾT KẾ

### 1.1. Sứ mệnh sản phẩm
**StudyMate** ra đời nhằm giải quyết vấn đề phân tán thông tin học tập của sinh viên đại học (thời khóa biểu trên cổng trường, bài tập trên LMS, thông báo đột xuất trên Zalo/Messenger, tài liệu trong Google Drive/PDF). 

Website hướng tới việc trả lời 3 câu hỏi cốt lõi ngay khi sinh viên mở máy:
1. **Hôm nay cần làm gì?** (Lịch học hôm nay, việc ưu tiên trong ngày).
2. **Deadline nào sắp đến?** (Đếm ngược thời gian, cảnh báo trực quan theo màu sắc).
3. **Tiến độ học tập hiện tại ra sao?** (Tự động đo lường tỷ lệ hoàn thành theo từng môn).

### 1.2. Triết lý thiết kế (Design Principles)
- **Tập trung & Không gây xao nhãng (Distraction-Free):** Bố cục gọn gàng, giảm bớt các chi tiết rườm rà, loại bỏ các đồng hồ đếm ngược gây căng thẳng, ưu tiên không gian hiển thị thông tin học tập thực chất.
- **Thẩm mỹ hiện đại (Modern Aesthetic Glassmorphism):** Áp dụng phong cách kính mờ, các đường viền phát sáng tinh tế, nền tối huyền ảo giúp bảo vệ mắt sinh viên khi học tập vào ban đêm.
- **Ưu tiên Dashboard (Dashboard-First):** Toàn bộ thông tin quan trọng nhất được tổng hợp trực tiếp trên Dashboard, sinh viên không phải bấm quá 2 lần để tìm thấy việc cần làm.
- **Tự động hóa tối đa:** Không bắt sinh viên phải tính toán ngày tháng hay nhập phần trăm thủ công. Mọi con số đều được hệ thống tự tính.

---

## 2. HỆ THỐNG NHẬN DIỆN THẨM MỸ (DESIGN SYSTEM)

### 2.1. Hệ thống Bảng màu (Color Palette)

Website hỗ trợ hệ thống đa chủ đề (Multi-Theme) cho phép sinh viên thay đổi không gian học tập theo cảm xúc cá nhân:

| Chủ đề (Theme) | Màu nền (`--theme-background`) | Màu chủ đạo (`--theme-primary`) | Phong cách cảm xúc |
| :--- | :--- | :--- | :--- |
| **Cosmic Purple** *(Mặc định)* | `#0f0f23` (Tím đen vũ trụ) | `#8b5cf6` (Tím Neon thanh lịch) | Huyền bí, sâu lắng, tăng khả năng tư duy |
| **Warm Sepia** | `#2C2416` (Nâu gỗ trầm) | `#D2691E` (Cam đất ấm áp) | Cảm giác quán cafe học bài, gần gũi |
| **Soft Minimal** | `#18181b` (Xám than chì) | `#a855f7` (Tím nhạt tối giản) | Hiện đại, sắc nét, công nghệ cao |
| **Ocean Night** | `#082f49` (Xanh biển sâu) | `#06b6d4` (Xanh ngọc biển) | Dịu mát, thanh thản, giảm căng thẳng |
| **Forest Sage** | `#0f291e` (Xanh rêu đêm) | `#22c55e` (Xanh lá thiên nhiên) | Tươi mới, bền bỉ, tập trung cao độ |
| **Pastel Clean** | `#faf5ef` (Kem sữa thanh thoát) | `#7c3aed` (Tím Violet nổi bật) | Sáng sủa, sạch sẽ, nhẹ nhàng |

### 2.2. Quy ước màu sắc trạng thái Deadline (Cốt lõi bài toán)
Mỗi bài tập và nhiệm vụ được tự động gắn thẻ màu dựa trên thời gian thực:
- 🟢 **An toàn (`--status-safe`):** Còn nhiều thời gian (trên 3 ngày). Màu xanh lá nhẹ nhàng mang lại sự an tâm.
- 🟡 **Cảnh báo (`--status-warning`):** Sắp đến hạn (từ 1 đến 3 ngày). Màu vàng hổ phách nhắc nhở sinh viên cần bắt đầu chuẩn bị.
- 🔴 **Khẩn cấp (`--status-danger`):** Hạn chót rất gần (trong vòng 24 giờ / Hạn hôm nay). Màu đỏ nổi bật thu hút sự chú ý tối đa.
- ⚫ **Quá hạn (`--status-overdue`):** Đã trôi qua thời hạn. Màu xám tro nhắc nhở sinh viên hoàn tất bổ sung hoặc liên hệ giảng viên.

### 2.3. Hiệu ứng Kính mờ (Glassmorphism & Elevation)
- **Độ mờ hậu cảnh (Backdrop Blur):** `backdrop-filter: blur(16px)` tạo chiều sâu cho thanh điều hướng và các thẻ nội dung.
- **Nền thẻ trong suốt:** Sử dụng `rgba(255, 255, 255, 0.05)` trên nền tối, tạo cảm giác nhẹ nhàng, nổi bật trên không gian học tập.
- **Đường viền tinh tế (Subtle Borders):** `1px solid rgba(255, 255, 255, 0.12)`, khi di chuột (hover) sẽ sáng nhẹ lên `rgba(255, 255, 255, 0.22)`.
- **Bo góc mềm mại (Border Radius):** 
  - Nút bấm và thẻ trạng thái: `var(--radius-full)` (Pill shape).
  - Thẻ card nội dung: `14px` đến `20px`.

### 2.4. Phông chữ & Kiểu chữ (Typography)
- **Font họ:** Phông hệ thống hiện đại (`-apple-system`, `Segoe UI`, `Roboto`, sans-serif) giúp tải trang tức thì, không bị giật chữ.
- **Tỷ lệ chữ:**
  - Tiêu đề màn hình: `1.75rem` - `2.25rem`, nét chữ thanh mảnh (`font-weight: 600 - 700`).
  - Đồng hồ thời gian thực: `2.5rem`, nét cực mỏng (`font-weight: 200`), phong cách đồng hồ số cao cấp.
  - Văn bản nội dung: `0.875rem` (14px), khoảng cách dòng `1.5` chuẩn đọc mỏi mắt thời gian dài.
  - Nhãn phụ và thời gian: `0.75rem` (12px), in hoa nhẹ (`letter-spacing: 0.05em`).

---

## 3. BỐ CỤC KHUNG SƯỜN & ĐIỀU HƯỚNG (LAYOUT & NAVIGATION)

### 3.1. Thanh điều hướng trên cùng (Frosted Glass Topbar)
Thanh điều hướng được cố định (`fixed top-0`) với chiều cao `60px`, trải dài toàn màn hình:
1. **Bên trái (Brand Identity):**
   - Icon sách mở tinh tế (`📖`).
   - Tên thương hiệu: `Studies` + `<span class="accent-word">Mate</span>`.
2. **Ở giữa (Pill Navigation Links):**
   - Các nút điều hướng dạng viên thuốc bo tròn:
     - 📊 `Dashboard` (Trang tổng quan sinh viên).
     - 📅 `Lịch học` (Thời khóa biểu theo tuần).
     - ✅ `Deadline` (Quản lý bài tập & hạn chót).
     - 📖 `Môn học` (Danh sách môn & giảng viên).
     - 🎯 `Kỳ thi` (Lịch thi & đếm ngược ngày).
     - 📸 `OCR TKB` (Tính năng nhập lịch bằng ảnh).
     - 📂 `Tài liệu` (Kho slide, bài tập, đề cương).
     - 📈 `Tiến độ` (Báo cáo tỷ lệ hoàn thành).
   - Nút đang chọn có nền `var(--theme-card-active)` và viền sáng nhận diện.
3. **Bên phải (Quick Utilities):**
   - Nút bật/tắt âm thanh mưa thư giãn khi học bài (`🌧️`).
   - Nút mở bảng đổi Theme 6 màu (`🎨`).
   - Nút thông tin tài khoản sinh viên (`👤 Minh Đức`).
   - Nút menu 3 gạch (`☰`) xuất hiện khi xem trên điện thoại.

### 3.2. Không gian làm việc trung tâm (Student Workspace)
Loại bỏ hoàn toàn các đồng hồ đếm ngược Pomodoro truyền thống. Thay vào đó, phần đầu màn hình làm việc gồm:
- **Đồng hồ số thời gian thực & Ngày tháng:** Hiển thị giờ hiện tại (`17:45`, `Chủ Nhật, 13 tháng 9`) giúp sinh viên định hình thời gian trong ngày.
- **Câu danh ngôn truyền cảm hứng (Daily Motivation Quote):** Mỗi ngày một câu nói tích cực tạo động lực học tập.
- **Thanh công cụ hành động nhanh (Action Pills Bar):** Các nút bấm nổi nhanh:
  - `+ Thêm nhiệm vụ / bài tập`
  - `📸 Quét TKB bằng ảnh (AI/OCR)`
  - `📅 Xem toàn bộ lịch học tuần`
  - `🎯 Đếm ngược kỳ thi`

---

## 4. ĐẶC TẢ CHI TIẾT TỪNG MÀN HÌNH CHỨC NĂNG

### 4.1. Màn hình Cổng thông tin / Trang chủ (`index.html`)
- **Mục đích:** Giới thiệu tổng quan về nền tảng StudyMate, giải thích vấn đề thực tế sinh viên gặp phải và đưa ra giải pháp.
- **Các khối giao diện chính:**
  1. *Header & Hero:* Giới thiệu slogan *"Biến dữ liệu học tập rời rạc thành một kế hoạch có thể theo dõi"*, nút kêu gọi mở Dashboard và quét ảnh TKB.
  2. *Bộ 4 chỉ số thống kê nhanh:* Môn học kỳ này (4 môn), Deadline sắp tới (3 việc), Tiến độ hoàn thành (70%), Kỳ thi gần nhất (12 ngày).
  3. *3 Cột trụ học tập cốt lõi:*
     - Khối "Hôm nay cần làm gì?": Hiển thị trực quan lịch học đang diễn ra và chuẩn bị tới.
     - Khối "Deadline nào sắp đến?": Cảnh báo deadline phân màu khẩn cấp.
     - Khối "Tiến độ học tập ra sao?": Thanh tiến độ từng môn học.
  4. *Spotlight tính năng USP:* Trình bày minh họa luồng *Chụp ảnh ➔ AI nhận diện ➔ Xác nhận ➔ Tự động tạo lịch*.

### 4.2. Màn hình Dashboard sinh viên (`dashboard.html`)
- **Mục đích:** Bàn làm việc hằng ngày của sinh viên, mở ra là nắm bắt ngay toàn bộ nhiệm vụ quan trọng.
- **Các khối giao diện chính:**
  1. *Header thời gian & Lời chào thân thiện:* *"Chào buổi chiều, Minh Đức! Hãy tập trung vào việc quan trọng nhất hôm nay"*.
  2. *Lưới 4 thẻ thống kê:* Tổng số môn (4), Việc chưa xong (3), Tiến độ trung bình (67%), Kỳ thi sắp tới (3).
  3. *Hai khung kính mờ trung tâm (2 Columns):*
     - Cột trái - **📅 Lịch học hôm nay:** Thẻ môn học, thời gian học (07:00 - 09:00), phòng học (A203), giảng viên hướng dẫn, badge trạng thái ("Đang diễn ra" / "Sắp tới").
     - Cột phải - **⏰ Deadline cần ưu tiên:** Danh sách bài tập sắp hết hạn, tự động gắn nhãn (Hạn hôm nay, Còn 2 ngày), kèm nút bấm mở danh sách chi tiết.
  4. *Hộp thoại StudyMate AI:* Đề xuất thứ tự ưu tiên học tập thông minh dựa trên độ gấp của deadline và độ khó của môn học.

### 4.3. Màn hình Quản lý Nhiệm vụ & Deadline (`tasks.html`)
- **Mục đích:** Cho phép sinh viên thêm mới, theo dõi, tick hoàn thành và phân loại bài tập.
- **Các khối giao diện chính:**
  1. *Form thêm bài tập mới:*
     - Tên nhiệm vụ / bài tập (Text input).
     - Chọn môn học tương ứng (Select dropdown liên kết danh mục môn).
     - Ngày giờ hạn chót (Datetime picker).
     - Mức độ ưu tiên (Bình thường / Ưu tiên cao / Khẩn cấp).
     - Nút "+ Lưu nhiệm vụ".
  2. *Bảng nhiệm vụ thời gian thực (Glass Table):*
     - Cột checkbox hoàn thành: Khi tick chọn, chữ tự động gạch ngang và hệ thống tự cập nhật lại % tiến độ của môn học đó.
     - Tên bài tập, Mã môn học.
     - Hạn nộp cụ thể (Ngày & giờ).
     - Thẻ trạng thái tự tính: `🟢 Còn nhiều thời gian`, `🟡 Sắp đến hạn`, `🔴 Hạn hôm nay`, `⚫ Đã quá hạn`.
     - Nút xóa nhiệm vụ.

### 4.4. Màn hình Thời khóa biểu & Lịch học (`schedule.html`)
- **Mục đích:** Theo dõi lịch lên lớp cả tuần một cách trực quan, rõ ràng phòng học và giảng viên.
- **Các khối giao diện chính:**
  1. *Thanh điều khiển:* Nút chuyển đổi xem lịch theo tuần / theo ngày, nút chuyển nhanh đến tính năng quét ảnh TKB.
  2. *Danh sách thẻ lịch học (Timeline Cards):*
     - Viền màu sắc tương ứng theo môn học.
     - Hiển thị thứ trong tuần (Thứ Hai, Thứ Ba, v.v.), khung giờ học cụ thể.
     - Tên môn học đầy đủ và mã môn chuẩn (CSE122, CSE281).
     - Biểu tượng phòng học (🏛️ Phòng A203, B102) và tên giảng viên.
     - Nút tắt mở nhanh tài liệu của môn học đó.

### 4.5. Màn hình Nhập lịch học thông minh AI/OCR - Tính năng USP (`import-schedule.html`)
- **Mục đích:** Giúp sinh viên nhập toàn bộ thời khóa biểu vào hệ thống chỉ trong vài giây mà không cần gõ tay từng chữ.
- **3 Phương thức nhập dữ liệu:**
  1. *Cách 1: Tải ảnh chụp thời khóa biểu (OCR/AI):*
     - Khung kéo thả ảnh rộng rãi, có biểu tượng máy ảnh và hỗ trợ click chọn file JPG/PNG.
     - Có nút bấm *"⚡ Dùng thử ảnh TKB mẫu"* để sinh viên và ban giám khảo trải nghiệm thử ngay lập tức.
     - Hệ thống quét dữ liệu và bóc tách thành 4 trường: Thứ, Giờ, Tên môn, Phòng học.
  2. *Cách 2: Dán văn bản Text:*
     - Khung textarea nhận diện các định dạng văn bản sao chép từ tin nhắn lớp.
     - Nút bấm phân tích cú pháp tự động chuyển văn bản thành cấu trúc lịch.
  3. *Cách 3: Nhập mã lớp học chung:*
     - Ô nhập mã lớp (ví dụ: `64CNTT1-2026`) do lớp trưởng khởi tạo để tự động đồng bộ thời khóa biểu toàn lớp.
  4. *Bảng kiểm tra và xác nhận (Verification Area):*
     - Hiển thị kết quả bóc tách dạng bảng để sinh viên có thể sửa trực tiếp từng ô trước khi bấm nút *"💾 Xác nhận & Lưu vào TKB"*.

### 4.6. Màn hình Danh sách Môn học & Chi tiết môn (`subjects.html`, `subject-detail.html`)
- **`subjects.html`:**
  - Hiển thị danh sách môn học dạng thẻ Card kính mờ.
  - Thông tin số tín chỉ, giảng viên, phòng học thường xuyên.
  - Thanh tiến độ học tập riêng của từng môn (ví dụ: Web 80%, CTDL 50%, Giải tích 30%).
  - Nút xem chi tiết môn và xem kho tài liệu môn.
- **`subject-detail.html`:**
  - Cung cấp cái nhìn chuyên sâu vào 1 môn học cụ thể:
    - Bảng bài tập riêng của môn học đó.
    - Danh sách tài liệu slide, đề cương ôn thi đã tải lên.
    - Thông tin chi tiết về kỳ thi cuối kỳ (ngày thi, phòng thi, hình thức thi trắc nghiệm/vấn đáp/bảo vệ BTL).

### 4.7. Màn hình Lịch thi & Đếm ngược (`exams.html`)
- **Mục đích:** Giúp sinh viên kiểm soát lịch thi cuối kỳ, không bị quên ngày thi hay nhầm ca thi.
- **Giao diện:**
  - Bảng danh sách kỳ thi gồm: Tên môn, Ngày thi, Ca thi/Giờ thi, Phòng thi.
  - Cột đếm ngược số ngày còn lại (ví dụ: `⏳ Còn 12 ngày`, `🟢 Còn 27 ngày`).
  - Nút tải đề cương ôn thi tương ứng.

### 4.8. Màn hình Kho tài liệu học tập (`documents.html`)
- **Mục đích:** Tập trung toàn bộ file học tập vào một nơi, phân loại rõ ràng theo từng môn học.
- **Giao diện:**
  - Bộ lọc danh mục: *Tất cả, Slide bài giảng, Bài tập/Lab, Đề cương ôn thi*.
  - Thẻ tài liệu: Tên file, dung lượng, thời gian cập nhật.
  - Nút xem trước trực tiếp (Preview) và nút tải về máy (Download).

### 4.9. Màn hình Báo cáo tiến độ học tập (`progress.html`)
- **Mục đích:** Trực quan hóa kết quả học tập tự động cho sinh viên.
- **Cơ chế hoạt động:**
  - Công thức: `Tiến độ (%) = (Nhiệm vụ đã hoàn thành / Tổng số nhiệm vụ môn) * 100`.
  - Mỗi môn học có 1 thẻ card riêng hiển thị số bài tập đã xong / tổng số bài tập.
  - Thanh tiến độ hiển thị dải màu gradient tương thích với từng Theme.

### 4.10. Màn hình Hồ sơ cá nhân sinh viên (`profile.html`)
- **Mục đích:** Quản lý thông tin tài khoản và cấu hình hệ thống nhắc nhở.
- **Giao diện:**
  - Khối bên trái: Avatar sinh viên, Họ tên, Mã sinh viên (MSSV), Lớp sinh hoạt, Khoa, Trường.
  - Khối bên phải: Form chỉnh sửa số điện thoại, email, tùy chọn nhận thông báo nhắc deadline trước 24 giờ qua email, nhận gợi ý từ StudyMate AI.

### 4.11. Cổng xác thực: Đăng nhập & Đăng ký (`login.html`, `register.html`)
- **Thiết kế:** Thẻ card kính mờ đặt chính giữa màn hình (Centered Card Layout).
- **Tính năng:**
  - Form đăng nhập hỗ trợ tài khoản Sinh viên và tài khoản Quản trị viên.
  - Có sẵn tài khoản demo hiển thị ngay trên màn hình để chấm điểm và kiểm thử nhanh.
  - Chuyển hướng thông minh: Sinh viên vào `dashboard.html`, Admin vào `admin-dashboard.html`.

### 4.12. Phân hệ Quản trị viên (`admin-dashboard.html`, `admin-users.html`, v.v.)
- **Thống kê hệ thống:** Tổng số sinh viên hoạt động, số lượng môn học toàn trường, lượt quét AI/OCR TKB thành công, tỷ lệ hoàn thành deadline trung bình của toàn trường.
- **Quản lý tài khoản sinh viên:** Bảng người dùng, quyền tài khoản, trạng thái khóa/mở tài khoản.
- **Quản lý thông báo chung:** Cho phép Admin soạn thảo và phát thông báo học vụ tới toàn bộ sinh viên hoặc theo từng khóa/lớp.

---

## 5. TƯƠNG TÁC NGƯỜI DÙNG & TRẢI NGHIỆM ĐẶC TRƯNG (UX & MICRO-INTERACTIONS)

1. **Trình phát âm thanh môi trường thư giãn (Ambient Sound Player):**
   - Được tích hợp ngay trên thanh Navbar với biểu tượng hạt mưa (`🌧️`).
   - Sử dụng Web Audio API để tạo tiếng mưa rơi và âm thanh tĩnh lặng giúp sinh viên thư giãn, tăng độ tập trung mà không cần tải file MP3 dung lượng nặng.
2. **Thông báo Toast tức thời (Floating Toast Notifications):**
   - Mọi thao tác người dùng (Lưu bài tập, đổi theme, bật âm thanh, quét TKB) đều có thông báo dạng Toast xuất hiện nhẹ nhàng ở góc dưới bên phải màn hình trong 3 giây và tự ẩn.
3. **Hiển thị thích ứng hoàn hảo trên mọi thiết bị (Full Responsive):**
   - **Desktop (> 1024px):** Thanh điều hướng đầy đủ chữ và icon, lưới chia 2-3 cột rộng rãi.
   - **Tablet (768px - 1024px):** Tự động chuyển đổi các thẻ thống kê thành 2 cột cân xứng.
   - **Mobile (< 768px):** Thanh điều hướng chuyển thành nút menu 3 gạch mở ngăn kéo trượt mượt mà (Slide-in Drawer), các thẻ card hiển thị 1 cột tối ưu cuộn chạm.
