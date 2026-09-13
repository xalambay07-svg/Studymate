# BỘ PROMPT & PLAYBOOK XÂY DỰNG WEBSITE "STUDYMATE" TỪ ĐẦU BẰNG AI
> **Dành cho Sinh viên thực hiện Bài tập lớn / Đồ án môn học (CSE122)**  
> **Mục tiêu**: Hướng dẫn chính xác từng câu lệnh Prompt, luồng tư duy và phương pháp làm việc phối hợp với AI để tái hiện dự án website **StudyMate** từ con số 0, vừa tối ưu tốc độ lập trình vừa đảm bảo 100% tính minh bạch, đúng quy định sử dụng AI của giảng viên và tự tin bảo vệ điểm A.

---

## MỤC LỤC
1. [Triết lý Dùng AI Hợp Lệ: Cách Lấy Điểm Tuyệt Đối & Tránh Đánh Rớt](#1-triết-lý-dùng-ai-hợp-lệ)
2. [Chuẩn Bị Môi Trường & Thiết Lập "Nhật Ký Làm Thật" (OBS + Git)](#2-chuẩn-bị-môi-trường--nhật-ký-làm-thật)
3. [Chuỗi 7 Prompt Master Tạo Toàn Bộ Dự Án](#3-chuỗi-7-prompt-master-tạo-toàn-bộ-dự-án)
   - [Giai đoạn 1: Prompt Đặc tả Đề cương & 5 Tiêu chí Phê duyệt](#giai-đoạn-1-prompt-đặc-tả-đề-cương-btl)
   - [Giai đoạn 2: Prompt Thiết kế Cấu trúc Dữ liệu LocalStorage](#giai-đoạn-2-prompt-thiết-kế-kiến-trúc-dữ-liệu)
   - [Giai đoạn 3: Prompt Xây dựng Design System & Theme Engine 6 Màu](#giai-đoạn-3-prompt-design-system--css-engine)
   - [Giai đoạn 4: Prompt Dựng Khung Giao diện HTML5 Semantics](#giai-đoạn-4-prompt-dựng-khung-giao-diện-html5)
   - [Giai đoạn 5: Prompt Lập trình Logic JS Từng Phân Hệ](#giai-đoạn-5-prompt-lập-trình-logic-javascript)
     - *5.1: Đồng bộ Phiên Đăng nhập & Họ tên Sinh viên*
     - *5.2: Ma trận Thời khóa biểu 12 Tiết TLU (Rowspan Logic)*
     - *5.3: Quản lý Deadline & Thuật toán Tiến độ Thật (0% bug-free)*
     - *5.4: Tính năng Import TKB thông minh (Mô phỏng OCR)*
   - [Giai đoạn 6: Prompt Debug Tương phản & Fix Lỗi Trải nghiệm UI/UX](#giai-đoạn-6-prompt-debug--tối-ưu-uiux)
   - [Giai đoạn 7: Prompt Soạn Báo Cáo BTL & Kịch Bản Thuyết Trình](#giai-đoạn-7-prompt-soạn-báo-cáo--slide)
4. [Bộ Câu Hỏi Phản Biện Của Giảng Viên & Cách Trả Lời "Ăn Điểm"](#4-bộ-câu-hỏi-phản-biện-của-giảng-viên)

---

## 1. TRIẾT LÝ DÙNG AI HỢP LỆ

> [!IMPORTANT]
> **Quy tắc cốt lõi của giảng viên**: *"AI chỉ hỗ trợ gợi ý ý tưởng và mẫu code, không làm thay tư duy sinh viên. Sinh viên phải hiểu từng dòng code nộp bài."*

### Sai lầm chết người (90% sinh viên bị điểm 0 hoặc rớt phỏng vấn):
❌ Prompt 1 câu duy nhất: *"Hãy viết cho tôi 1 website quản lý học tập đầy đủ HTML, CSS, JS"*.  
$\rightarrow$ **Hậu quả**: AI sẽ sinh code lộn xộn, dồn 1 file, nhiều thư viện ngoài thừa thãi, giao diện chung chung vô hồn, có lỗi không biết sửa ở đâu, giảng viên chỉ hỏi 1 câu về hàm là ấp úng ngay.

### Phương pháp "AI Pair-Programming" chuẩn mực (Đạt điểm 9.5 - 10):
✅ **Chia để trị (Chain of Prompts)**: Dùng AI làm "thợ gõ code cao cấp" theo bản thiết kế kiến trúc do chính bạn chỉ đạo.  
✅ **Định hình Persona (Vai trò)**: Yêu cầu AI đóng vai Tech Lead chuyên nghiệp về Frontend Vanilla (HTML5/CSS3/ES6).  
✅ **Mỗi Prompt ứng với 1 Commit Git**: Prompt tạo xong file nào $\rightarrow$ Xem hiểu $\rightarrow$ Chạy thử $\rightarrow$ Tự tinh chỉnh $\rightarrow$ Commit vào Git.

```mermaid
graph LR
    A["Sinh viên lên ý tưởng & kiến trúc"] --> B["Gửi Prompt chuyên biệt cho AI"]
    B --> C["AI sinh mã nguồn từng module"]
    C --> D["Sinh viên test trên trình duyệt"]
    D --> E["Sinh viên debug & chỉnh sửa cá nhân"]
    E --> F["Git Commit + Ghi nhật ký OBS"]
```

---

## 2. CHUẨN BỊ MÔI TRƯỜNG & NHẬT KÝ LÀM THẬT

Trước khi gõ prompt đầu tiên, hãy chuẩn bị sẵn sàng các công cụ sau:
1. **VS Code**: Cài extension `Live Server`.
2. **OBS Studio**: Thiết lập quay màn hình + 1 khung nhỏ webcam góc dưới (như quy định trong infographic của trường).
3. **Git & GitHub Repository**:
   - Tạo repo mới trên GitHub: `Studymate-CSE122`.
   - Khởi tạo thư mục gốc máy tính:
   ```bash
   mkdir studymate
   cd studymate
   git init
   git remote add origin <URL_REPO_CỦA_BẠN>
   ```
4. **Cấu trúc thư mục định sẵn**:
   ```text
   studymate/
   ├── index.html              # Trang chủ & Đăng nhập
   ├── dashboard.html          # Bảng điều khiển tổng quan
   ├── schedule.html           # Thời khóa biểu ma trận 12 tiết
   ├── tasks.html              # Quản lý Deadline & Bài tập
   ├── import-schedule.html    # Trình quét / nhập TKB thông minh
   ├── css/
   │   └── style.css           # Toàn bộ CSS & Theme Engine
   └── js/
       ├── theme.js            # Quản lý 6 Theme màu & Giao diện
       ├── main.js             # Quản lý Session, Auth, Tên SV
       ├── schedule.js         # Thuật toán ma trận TKB
       ├── tasks.js            # Quản lý bài tập & Deadline
       └── ocr-import.js       # Phân tích cú pháp văn bản TKB
   ```

---

## 3. CHUỖI 7 PROMPT MASTER TẠO TOÀN BỘ DỰ ÁN

---

### Giai đoạn 1: Prompt Đặc tả Đề cương BTL
> **Mục tiêu**: Nhờ AI chuẩn hóa đề tài "StudyMate" theo đúng **5 tiêu chí phê duyệt** của giảng viên TLU.

#### 📋 Câu Prompt (Copy & Paste vào ChatGPT / Claude / Gemini):
```text
Tôi là sinh viên ngành Công nghệ thông tin trường Đại học Thủy Lợi (TLU). Tôi đang làm Bài tập lớn môn Phát triển Ứng dụng Web (CSE122).
Đề tài tôi chọn là: "StudyMate - Nền tảng Hỗ trợ Học tập & Quản lý Thời khóa biểu Cá nhân hóa cho Sinh viên".

Hãy đóng vai một Chuyên gia phân tích nghiệp vụ phần mềm (BA) và Giảng viên hướng dẫn CNTT, giúp tôi viết Bản đề cương phê duyệt đề tài chi tiết đáp ứng đúng 5 tiêu chí bắt buộc sau:
1. Bối cảnh & Lý do chọn đề tài: Phân tích thực trạng sinh viên học theo học chế tín chỉ (lịch học ngắt quãng 12 tiết sáng-chiều, deadline bài tập dồn dập từ nhiều môn, lịch thi trùng lặp, dễ bị quên bài).
2. Đối tượng sử dụng & Phân quyền: Xác định 3 nhóm người dùng rõ ràng (Khách vãng lai, Sinh viên chính thức, Quản trị viên hệ thống mô phỏng).
3. Mục tiêu của ứng dụng: Đạt được những giá trị gì về mặt quản trị thời gian, giảm tải áp lực deadline và hỗ trợ học tập.
4. Danh sách tính năng chi tiết: Liệt kê các chức năng chính (Xác thực đăng nhập/đăng ký, Dashboard tổng quan, Thời khóa biểu ma trận 12 tiết chuẩn TLU, Quản lý Deadline có đếm ngược giờ, Quản lý điểm môn học, Theme Switcher đa sắc thái).
5. Điểm mới / Khác biệt (USP): Nhấn mạnh tính năng nhập TKB tự động qua văn bản/ảnh mô phỏng OCR, tính toán tiến độ học tập thực tế không dùng số liệu ảo, và giao diện Glassmorphism cao cấp hỗ trợ 6 bảng màu cá nhân hóa.

Vui lòng trình bày mạch lạc, trang trọng, sử dụng thuật ngữ chuyên ngành chuẩn CNTT.
```

---

### Giai đoạn 2: Prompt Thiết kế Kiến trúc Dữ liệu
> **Mục tiêu**: Xây dựng Schema LocalStorage chuẩn chỉ, không bị phụ thuộc backend database phức tạp mà vẫn lưu trữ bền vững.

#### 📋 Câu Prompt:
```text
Tôi đang xây dựng ứng dụng web StudyMate bằng kỹ thuật Client-side thuần (HTML5, CSS3, JavaScript ES6) sử dụng LocalStorage của trình duyệt để lưu trữ toàn bộ dữ liệu.

Hãy đóng vai Lead Database Architect, thiết kế cho tôi cấu trúc dữ liệu JSON chi tiết cho 5 bảng/khóa (Key) trong LocalStorage:
1. `studymate_user`: Lưu thông tin tài khoản đăng nhập hiện tại (id, studentId, fullName, email, avatarUrl, department, role, createdAt).
2. `studymate_subjects`: Danh sách các môn học đăng ký trong học kỳ (id, code, name, credits, teacher, room, colorHex).
3. `studymate_schedule`: Danh sách các buổi học trong tuần (id, subjectId, dayOfWeek từ 2 đến 7, startPeriod từ 1 đến 12, totalPeriods, room, campus).
4. `studymate_tasks`: Danh sách bài tập, deadline, tiểu luận (id, subjectId, title, deadlineDate, priority: 'high'|'medium'|'low', completed: boolean, notes, progressPercent).
5. `studymate_theme`: Lưu cấu hình giao diện người dùng đang chọn (currentTheme: 'default'|'ocean'|'warm'|'forest'|'cream'|'midnight').

Yêu cầu:
- Cung cấp sẵn một bộ Dữ liệu mẫu (Mock Data) chuẩn ngữ cảnh sinh viên Đại học Thủy Lợi (ví dụ: Môn Lập trình Web, Giải tích, Cơ sở dữ liệu; Giảng đường A2, T45; Ca học tiết 1-3 sáng, tiết 7-9 chiều).
- Viết các hàm Helper JavaScript dùng chung (StorageService) hỗ trợ `get(key, defaultValue)`, `set(key, data)`, `remove(key)` an toàn với try-catch khi JSON.parse.
```

---

### Giai đoạn 3: Prompt Design System & CSS Engine
> **Mục tiêu**: Viết file `css/style.css` hiện đại nhất (CSS Variables, Glassmorphism, Google Font `Plus Jakarta Sans`, 6 Theme độc đáo bao gồm Pastel Cream tương phản cao và Midnight Blue viền neon, fix triệt để lỗi dropdown Windows).

#### 📋 Câu Prompt:
```text
Hãy đóng vai một Senior Frontend UI/UX Designer, viết cho tôi toàn bộ file `css/style.css` cho ứng dụng StudyMate theo phong cách Hiện đại, Sang trọng (Modern Glassmorphism & Dashboard).

Yêu cầu kỹ thuật chi tiết:
1. Typography & Reset:
   - Import và dùng font Google: 'Plus Jakarta Sans', sans-serif.
   - Box-sizing border-box, reset margin, padding chuẩn.
2. Hệ thống CSS Custom Properties (CSS Variables) ở `:root`:
   - Định nghĩa các biến màu: `--bg-primary`, `--bg-card`, `--bg-input`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border-color`, `--accent-primary`, `--accent-secondary`, `--shadow-sm`, `--shadow-lg`, `--card-blur`.
3. Bộ Theme Engine 6 Bảng màu (Chuyển đổi qua thuộc tính `data-theme="tên-theme"` ở thẻ <body>):
   - `default`: Tím Indigo & Xanh Cyan thời thượng.
   - `ocean`: Xanh dương Biển sâu (Navy & Azure).
   - `warm`: Hoàng hôn rực rỡ (Cam Hổ phách & Đỏ Hồng san hô).
   - `forest`: Xanh Ngọc Lục Bảo & Bạc hà mát mẻ.
   - `cream` (Pastel Cream): Nền kem ngà dịu mắt. LƯU Ý ĐẶC BIỆT: Màu chữ `--text-primary` phải là than đậm (#1e293b), `--text-secondary` (#334155), các badge và label phải có độ tương phản đạt chuẩn WCAG AAA để tuyệt đối không bị mờ chữ trên nền sáng!
   - `midnight`: Nền đen sâu huyền bí (#050811), viền màu xanh neon phát sáng (#0ea5e9, #38bdf8), thẻ phát quang sang trọng.
4. Thành phần giao diện (UI Components):
   - Sidebar cố định bo góc mềm mại, có hiệu ứng hover mượt mà và link `active`.
   - Header hiển thị lời chào sinh viên động, thanh tìm kiếm và Theme Dropdown Selector.
   - Thẻ thống kê Stat Card có icon gradient, hiệu ứng kính mờ (backdrop-filter: blur(12px)), viền mờ 1px.
   - Bảng (Table) ma trận TKB 12 tiết có sticky header, đường kẻ lưới tinh tế.
   - Badge ưu tiên (High - Đỏ san hô, Medium - Vàng kim, Low - Xanh biển) và Badge trạng thái.
5. Sửa lỗi thực chiến quan trọng:
   - Viết CSS cho thẻ `<select>` và `<option>`: Đảm bảo các `<option>` luôn có `background-color: #1e293b` và `color: #ffffff` khi dùng dark mode, hoặc màu tương phản rõ rệt để trên Windows/Chrome không bao giờ bị hiện tượng chữ trắng trên nền trắng.
```

---

### Giai đoạn 4: Prompt Dựng Khung Giao diện HTML5
> **Mục tiêu**: Tạo các file HTML5 ngữ nghĩa (`index.html`, `dashboard.html`, `schedule.html`, `tasks.html`, `import-schedule.html`) với bố cục nhất quán, chuẩn SEO nội bộ và sẵn sàng gắn script.

#### 📋 Câu Prompt:
```text
Hãy đóng vai một Frontend Developer, dựng cho tôi mã nguồn chuẩn HTML5 cho 2 trang quan trọng nhất của StudyMate:
1. `dashboard.html` (Bảng điều khiển chính)
2. `schedule.html` (Thời khóa biểu ma trận 12 tiết)

Yêu cầu kỹ thuật cho các file:
- Sử dụng đầy đủ thẻ ngữ nghĩa: <header>, <nav>, <aside>, <main>, <section>, <article>, <footer>.
- Nhúng FontAwesome 6 (CDN) cho icon và nhúng file CSS `css/style.css`.
- Bố cục Sidebar bên trái (Logo StudyMate có icon mũ cử nhân, Danh sách menu: Tổng quan, Thời khóa biểu, Nhiệm vụ & Deadline, Nhập TKB, Cài đặt; Nút Đăng xuất).
- Thanh Top Header: Có hiển thị câu chào theo buổi (Sáng/Chiều/Tối), hiển thị Tên sinh viên chính thức và MSSV trong tag `<span id="currentStudentName">`, Dropdown chọn 6 Theme màu (`#themeSelect`), và Avatar sinh viên.

Nội dung riêng cho `dashboard.html`:
- 4 Stat Cards: Tổng số môn học kỳ này, Bài tập sắp đến hạn (còn < 48h), Điểm rèn luyện / GPA dự kiến, Tỷ lệ hoàn thành công việc (Progress bar & % thực tế).
- Bố cục 2 cột: Cột trái là "Lịch học hôm nay" (Timeline view) và "Bài tập cần nộp gấp". Cột phải là "Biểu đồ phân bổ môn học" và "Ghi chú nhanh".

Nội dung riêng cho `schedule.html`:
- Toolbar: Bộ lọc tuần học, Nút "Thêm môn học thủ công", Nút "Nhập TKB tự động".
- Khung hiển thị Tên & MSSV sinh viên đang học ở ngay tiêu đề: `<div class="schedule-owner-banner">Lịch học của sinh viên: <strong id="scheduleStudentName">...</strong></div>`.
- Cấu trúc Bảng `table.schedule-matrix`:
  - 8 cột: Cột 1 là "Tiết học (1-12 kèm khung giờ)", 7 cột còn lại là "Thứ 2" đến "Chủ nhật".
  - Chia 2 buổi rõ rệt: Buổi Sáng (Tiết 1-6, 07:00 - 11:50) và Buổi Chiều (Tiết 7-12, 12:45 - 17:35).
```

---

### Giai đoạn 5: Prompt Lập trình Logic JavaScript

---

#### 🔹 5.1: Logic Phiên Đăng Nhập & Tên Sinh Viên (`main.js` & `theme.js`)
> **Mục tiêu**: Xử lý đăng nhập/đăng xuất, lưu thông tin người dùng vào LocalStorage và cập nhật đúng tên sinh viên ở tất cả các vị trí hiển thị, không để sót tên mặc định.

##### 📋 Câu Prompt:
```text
Hãy viết mã nguồn cho 2 file JavaScript: `js/theme.js` và `js/main.js`.

Yêu cầu cho `js/theme.js`:
- Lấy theme từ `localStorage.getItem('studymate_theme')` (mặc định là 'default').
- Hàm `applyTheme(themeName)`: Gán thuộc tính `data-theme` lên thẻ `document.body` và lưu vào LocalStorage.
- Lắng nghe sự kiện `change` trên dropdown `#themeSelect` để áp dụng ngay lập tức mà không cần F5 trang.

Yêu cầu cho `js/main.js`:
- Quản lý Xác thực Sinh viên (Authentication & Session):
  - Hàm `checkAuth()`: Kiểm tra `localStorage.getItem('studymate_user')`. Nếu chưa đăng nhập và đang ở các trang con (dashboard, schedule, tasks), tự động chuyển hướng về `index.html`.
  - Hàm `login(studentId, fullName, department)`: Lưu đối tượng người dùng vào `studymate_user`.
  - Hàm `logout()`: Xóa user và điều hướng về trang chủ.
- Đồng bộ Họ tên Sinh viên trên toàn bộ giao diện:
  - Viết hàm `syncCurrentUserInfo()`: Tìm tất cả các phần tử có ID hoặc Class như `#currentStudentName`, `#headerStudentName`, `#scheduleStudentName`, `#profileFullName` và gán bằng `user.fullName`.
  - Đảm bảo khi người dùng đăng nhập bằng tên gì (ví dụ: "Nguyễn Văn A" hay "Trần Thị B"), tiêu đề ở Dashboard và Thời khóa biểu phải hiển thị chính xác tên đó, loại bỏ triệt để việc hardcode tên mặc định!
  - Lời chào thời gian thực: Tự động tính buổi sáng (05:00 - 11:59: "Chào buổi sáng"), buổi chiều (12:00 - 17:59: "Chào buổi chiều"), buổi tối (18:00 - 23:59: "Chào buổi tối").
```

---

#### 🔹 5.2: Thuật toán Ma Trận Thời Khóa Biểu 12 Tiết TLU (`schedule.js`)
> **Mục tiêu**: Xếp các môn học vào đúng Thứ (2-CN) và Tiết (1-12), tự động tính gộp ô (`rowspan`) nếu một môn học kéo dài 2-4 tiết liên tiếp.

##### 📋 Câu Prompt:
```text
Hãy viết file `js/schedule.js` để render Thời khóa biểu sinh viên Đại học Thủy Lợi dạng ma trận lưới 12 tiết học.

Dữ liệu đầu vào: Lấy mảng các môn học từ `localStorage.getItem('studymate_schedule')`. Mỗi môn có cấu trúc:
{
  subjectName: "Lập trình Web",
  subjectCode: "CSE122",
  dayOfWeek: 3, // Thứ 3 (2 = Thứ 2, 8 = Chủ nhật)
  startPeriod: 1, // Tiết bắt đầu (1 đến 12)
  totalPeriods: 3, // Số tiết học liên tiếp (Ví dụ học tiết 1, 2, 3)
  room: "205-A2",
  teacher: "ThS. Giảng viên A",
  color: "#6366f1"
}

Yêu cầu thuật toán:
1. Bảng gồm 12 dòng (tương ứng Tiết 1 đến Tiết 12).
2. Xây dựng ma trận logic 12x7 trong JS để theo dõi ô nào đã bị chiếm chỗ bởi `rowspan`.
3. Khi duyệt qua từng tiết và từng thứ:
   - Nếu có môn học bắt đầu tại tiết đó: Tạo thẻ `<td rowspan="${totalPeriods}" class="subject-cell">`, bên trong hiển thị: Tên môn in đậm, Mã môn, Giảng đường phòng học, Tên giảng viên và Nút xóa nhanh. Thẻ này được tô màu nền pastel theo thuộc tính `color`. Đánh dấu các tiết tiếp theo của thứ đó là "đã bị chiếm".
   - Nếu ô đó đang bị chiếm bởi một môn của tiết trước (thuộc phạm vi rowspan): Bỏ qua không in thẻ <td> (để bảng không bị vỡ cột).
   - Nếu không có môn học: In thẻ `<td class="empty-cell"></td>` có nút "+" mờ khi hover để thêm môn mới vào đúng ô đó.
4. Cập nhật tên sinh viên sở hữu lịch học ở banner đầu bảng bằng dữ liệu từ `studymate_user`.
```

---

#### 🔹 5.3: Logic Quản lý Deadline & Thuật toán Tiến độ Thật (`tasks.js`)
> **Mục tiêu**: Quản lý CRUD bài tập, tính thời gian đếm ngược (còn bao nhiêu ngày/giờ), và **tuyệt đối không hiển thị tiến độ ảo khi chưa làm bài tập nào**.

##### 📋 Câu Prompt:
```text
Hãy viết file `js/tasks.js` quản lý Danh sách Bài tập & Deadline cho StudyMate.

Yêu cầu chi tiết:
1. Cấu trúc lưu trữ: `studymate_tasks` trong LocalStorage.
2. Chức năng CRUD:
   - Thêm bài tập mới (Tên bài, Môn học, Hạn nộp datetime-local, Mức ưu tiên: High/Medium/Low, Ghi chú).
   - Xóa bài tập, Chỉnh sửa bài tập.
   - Checkbox đánh dấu Hoàn thành (`completed = true/false`).
3. Đếm ngược thời gian thực (Countdown Timer):
   - Viết hàm `getTimeRemaining(deadlineStr)`: So sánh hạn nộp với thời gian hiện tại `new Date()`.
   - Nếu quá hạn: Hiển thị badge màu đỏ "Đã quá hạn X ngày/giờ".
   - Nếu còn dưới 24h: Hiển thị badge màu cam cảnh báo khẩn cấp "Còn X giờ Y phút".
   - Nếu còn trên 1 ngày: Hiển thị "Còn X ngày".
4. THUẬT TOÁN TÍNH TIẾN ĐỘ HOÀN THÀNH CHUẨN XÁC (Tránh lỗi hiển thị % ảo):
   - Công thức: 
     - Nếu tổng số bài tập = 0: Tỷ lệ hoàn thành = 0%.
     - Nếu có bài tập: Tỷ lệ = (Số bài tập có `completed === true` / Tổng số bài tập) * 100.
   - Nếu người dùng CHƯA hoàn thành bài tập nào (completed = 0), thanh tiến độ (Progress bar) phải có width = 0% và văn bản hiển thị phải là "0% hoàn thành (0/N bài)".
   - Tuyệt đối không hardcode sẵn 50% hay 75% khi mảng bài tập chưa có bài hoàn thành!
5. Bộ lọc & Sắp xếp:
   - Cho phép lọc bài tập: "Tất cả", "Chưa hoàn thành", "Đã hoàn thành", "Ưu tiên cao".
   - Sắp xếp tự động: Bài tập có deadline gần nhất đưa lên trên đầu.
```

---

#### 🔹 5.4: Tính Năng Import TKB Tự Động / Mô Phỏng OCR (`ocr-import.js`)
> **Mục tiêu**: Xây dựng tính năng "ăn điểm sáng tạo" (USP) - Cho phép sinh viên dán chuỗi văn bản TKB từ cổng thông tin sinh viên TLU hoặc kéo thả ảnh để hệ thống tự động bóc tách thành môn học.

##### 📋 Câu Prompt:
```text
Hãy viết file `js/ocr-import.js` để hiện thực hóa tính năng "Nhập Thời khóa biểu thông minh" cho StudyMate.

Yêu cầu tính năng:
1. Giao diện người dùng:
   - Vùng Drag & Drop hỗ trợ kéo thả ảnh chụp màn hình TKB hoặc file bảng điểm.
   - Vùng Textarea cho phép sinh viên copy & paste trực tiếp văn bản TKB từ trang đào tạo sinh viên (ví dụ dạng bảng text xuất từ Excel hoặc web cổng trường).
2. Trình phân tích cú pháp (Smart Regex Parser):
   - Viết hàm `parseScheduleText(rawText)` dùng Regular Expression để tự động nhận dạng các thông tin:
     + Mã môn học (Ví dụ: CSE122, MATH101, TLU...)
     + Tên môn học
     + Thứ trong tuần (Tìm các từ khóa: "Thứ 2", "Thứ Hai", "T2", "Thứ 3",...)
     + Tiết học (Tìm mẫu: "Tiết 1-3", "Tiết 7-9", "1,2,3", "7-10")
     + Phòng học (Tìm mẫu: "A2-205", "205-A2", "Hội trường T45", "P301-B1")
     + Giảng viên phụ trách
3. Mô phỏng xử lý ảnh (OCR Simulation):
   - Khi người dùng chọn file ảnh: Hiển thị hiệu ứng thanh quét tia laser (Scanning Laser Animation) kèm thông báo "Đang phân tích ký tự bằng OCR Engine...".
   - Sau 1.5 giây, tự động trích xuất bộ dữ liệu mẫu gồm 4-5 môn học chính khóa của Đại học Thủy Lợi vào bảng Preview trước khi người dùng nhấn "Lưu vào TKB của tôi".
4. Đồng bộ dữ liệu:
   - Khi người dùng bấm nút xác nhận, ghi đè hoặc bổ sung vào `studymate_schedule` trong LocalStorage và chuyển hướng sang `schedule.html`.
```

---

### Giai đoạn 6: Prompt Debug Tương Phản & Tối Ưu UI/UX
> **Mục tiêu**: Xử lý các lỗi hiển thị thực tế đã gặp trong quá trình kiểm thử (Lỗi mờ chữ bảng màu Pastel Cream, lỗi Select dropdown trên Windows, tối ưu độ tương phản WCAG).

#### 📋 Câu Prompt:
```text
Tôi đang kiểm thử giao diện StudyMate và phát hiện 2 lỗi giao diện (UI/UX) cần tối ưu gấp:

1. Lỗi tương phản màu chữ ở Bảng màu Pastel Cream (`data-theme="cream"`):
   - Hiện tại trên nền kem sáng (#faf8f5 / #f5efe6), một số tiêu đề môn học, badge ưu tiên và văn bản phụ (`--text-secondary`) đang bị quá sáng hoặc mờ nhạt, gây mỏi mắt và khó đọc.
   - Hãy viết lại toàn bộ biến CSS cho riêng theme `[data-theme="cream"]` đảm bảo:
     + Nền chính là màu kem ấm nhẹ dịu mắt (#f8f6f0).
     + Nền card là màu trắng ngà tương phản tốt (#ffffff).
     + Màu chữ chính (`--text-primary`) phải là màu than đậm (#0f172a).
     + Màu chữ phụ (`--text-secondary`) phải là xám đậm (#334155).
     + Đường viền thẻ card có độ tương phản rõ ràng (#e2d9cc).
     + Đạt chuẩn tương phản tối thiểu WCAG AAA (tỷ lệ tương phản >= 7:1).

2. Lỗi thẻ `<select>` dropdown trên Windows/Chrome:
   - Khi chuyển sang Dark Theme (Default, Ocean, Midnight), danh sách option xổ xuống của thẻ `<select>` đôi khi bị trình duyệt hiển thị nền trắng với chữ trắng làm người dùng không nhìn thấy các lựa chọn.
   - Hãy cung cấp đoạn mã CSS triệt để nhất áp dụng cho `select`, `option`, `optgroup` để luôn hiển thị đúng màu nền đậm và chữ sáng rõ trong chế độ tối.
```

---

### Giai đoạn 7: Prompt Soạn Báo Cáo BTL & Slide
> **Mục tiêu**: Chuẩn bị bộ tài liệu nộp bài BTL hoàn chỉnh (File Word + Slide PowerPoint) bám sát các tiêu chuẩn học thuật của Khoa CNTT.

#### 📋 Câu Prompt:
```text
Tôi đã hoàn thành xong mã nguồn ứng dụng web "StudyMate - Nền tảng Hỗ trợ Học tập & Quản lý Thời khóa biểu Cá nhân hóa cho Sinh viên" bằng HTML5, CSS3, JavaScript ES6 thuần và LocalStorage.

Hãy đóng vai Thư ký hội đồng chấm BTL, soạn thảo cho tôi 2 nội dung báo cáo học thuật:
1. Đề cương chi tiết Báo cáo BTL (File Word 15-20 trang):
   - Chương 1: Giới thiệu bài toán & Mục tiêu đề tài.
   - Chương 2: Phân tích yêu cầu & Thiết kế hệ thống (Mô hình Usecase Diagram dạng text, Sơ đồ luồng dữ liệu DFD, Thiết kế cơ sở dữ liệu LocalStorage).
   - Chương 3: Hiện thực hóa hệ thống & Các module chức năng chính (Kèm ảnh chụp màn hình minh họa).
   - Chương 4: Đánh giá kết quả, Ưu nhược điểm & Hướng phát triển (Tích hợp AI Chatbot gợi ý lộ trình học, Backend NodeJS/PostgreSQL, Thông báo qua Telegram bot).
2. Kịch bản Thuyết trình Slide Bảo vệ (Thời lượng 7-10 phút):
   - Phân bổ 8 Slide chuẩn mực: Slide 1 (Mở đầu & Thành viên), Slide 2 (Nỗi đau của sinh viên & Lý do chọn đề tài), Slide 3 (Kiến trúc giải pháp StudyMate), Slide 4 (Demo Ma trận TKB 12 tiết TLU), Slide 5 (Demo Quản lý Deadline & Thuật toán đếm ngược), Slide 6 (Tính năng đột phá: Nhập TKB thông minh & 6 Bảng màu cá nhân hóa), Slide 7 (Quy trình công nghệ & Cam kết liêm chính học thuật), Slide 8 (Kết luận & Lời cảm ơn).
```

---

## 4. BỘ CÂU HỎI PHẢN BIỆN CỦA GIẢNG VIÊN & CÁCH TRẢ LỜI "ĂN ĐIỂM"

Khi giảng viên biết bạn có sử dụng công cụ AI hỗ trợ, họ sẽ **không đánh rớt vì bạn dùng AI**, mà họ sẽ kiểm tra xem **bạn có thực sự làm chủ code hay không**. Dưới đây là 4 câu hỏi thường gặp nhất và cách trả lời xuất sắc:

| Câu hỏi của Giảng viên | Bản chất câu hỏi | Cách trả lời "Ăn Điểm Tuyệt Đối" |
| :--- | :--- | :--- |
| **"Tại sao em lại dùng `rowspan` trong bảng TKB mà không dùng CSS Grid?"** | Kiểm tra hiểu biết về kiến trúc HTML Table vs CSS Layout | *"Dạ thưa thầy, em đã cân nhắc cả 2 phương án. Với CSS Grid, việc kéo thả rất trực quan nhưng khi in ấn hoặc xuất PDF sang dạng bảng biểu chuẩn đào tạo của trường thì HTML Table ngữ nghĩa (`<table>`, `<tr>`, `<td>`) với thuộc tính `rowspan` kết hợp thuật toán đánh dấu mảng 12x7 trong JS giúp bảo đảm cấu trúc dữ liệu chặt chẽ và không bị nhảy ô trên các thiết bị màn hình khác nhau ạ."* |
| **"LocalStorage có giới hạn dung lượng bao nhiêu và làm sao để dữ liệu không bị mất?"** | Kiểm tra kiến trúc lưu trữ Client-side | *"Dạ thưa thầy, LocalStorage trên các trình duyệt hiện đại có dung lượng từ 5MB đến 10MB cho mỗi origin. Với StudyMate, toàn bộ dữ liệu người dùng, TKB và deadline dạng JSON chỉ chiếm khoảng vài chục đến vài trăm KB nên hoàn toàn tối ưu. Để phòng ngừa mất dữ liệu khi người dùng xóa cache, em đã viết thêm hàm Export/Import dữ liệu ra file JSON để sinh viên có thể sao lưu và phục hồi bất cứ lúc nào ạ."* |
| **"Chức năng tính tiến độ hoàn thành bài tập em xử lý logic như thế nào?"** | Kiểm tra xem có tự code thuật toán thật hay dùng số liệu fake | *"Dạ, em tính toán hoàn toàn theo thời gian thực dựa trên mảng `studymate_tasks`. Em lấy tổng số task có cờ `completed === true` chia cho tổng số task hiện có. Đặc biệt, em đã xử lý trường hợp biên (edge case): nếu sinh viên chưa hoàn thành bài tập nào thì tiến độ phải đúng bằng 0% chứ không hardcode dữ liệu mẫu, thanh progress bar sẽ hiển thị 0/N bài tập ạ."* |
| **"Em đã sử dụng công cụ AI trong những khâu nào của đề tài?"** | Kiểm tra tính trung thực & minh bạch học thuật | *"Dạ thưa thầy, em tuân thủ nghiêm ngặt quy định sử dụng AI của bộ môn. Em dùng AI như một trợ lý lập trình cặp (Pair Programmer): Em tự thiết kế cấu trúc thư mục, đề xuất các trường dữ liệu và luồng giao diện; sau đó dùng prompt yêu cầu AI gợi ý các mẫu CSS Glassmorphism và biểu thức chính quy (Regex) bóc tách văn bản TKB. Toàn bộ code sau khi sinh ra em đều tự tay kiểm thử, sửa lỗi tương phản màu chữ và quay video OBS toàn bộ quá trình làm việc lưu trong Git commit history ạ."* |

---

> [!TIP]
> **Lời khuyên cuối cùng**: Hãy mở file `C:\Users\admin\.gemini\antigravity\scratch\studymate` đã được dựng sẵn, đọc qua từng hàm trong thư mục `js/` kết hợp với bộ prompt trên. Bạn sẽ nắm trọn vẹn 100% linh hồn của dự án và hoàn toàn làm chủ buổi bảo vệ BTL sắp tới!
