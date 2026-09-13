# 📚 StudyMate – Nền tảng quản lý học tập cho sinh viên

> **Slogan:** *StudyMate – Your Academic Companion (Bạn đồng hành học tập của sinh viên)*  
> **Học phần:** Phát triển ứng dụng web cơ bản (CSE122) – Trường Đại học Thủy Lợi  
> **Mô hình triển khai:** Nhóm 3 sinh viên – Tổ chức GitHub repo chuẩn hóa

---

## 1. Giới thiệu đề tài

**StudyMate** là website hỗ trợ sinh viên quản lý việc học tập trên một nền tảng duy nhất:
- Giải quyết bài toán thông tin học tập phân tán (LMS, Zalo, Messenger, file PDF, lịch cá nhân, ghi chú).
- Giúp sinh viên nắm rõ: **Hôm nay cần làm gì? Deadline nào sắp đến? Tiến độ học tập hiện tại ra sao?**
- **Điểm khác biệt (USP):** Chụp/Tải ảnh thời khóa biểu ➔ Nhận diện thông minh (AI/OCR Mockup) ➔ Xác nhận ➔ Tự động tạo lịch học & nhắc deadline mà không cần nhập tay toàn bộ.

---

## 2. Cấu trúc thư mục dự án (Project Structure)

Dự án tuân thủ cấu trúc chuẩn theo yêu cầu BTL CSE122:

```text
studymate/
├── docs/                                  # Tài liệu mô tả đề tài, phân công, mockup
│   ├── figma-canva/
│   │   └── README.md                      # Lưu trữ liên kết Figma / Canva mockup
│   ├── de-tai-studymate.md                # Đặc tả chi tiết chức năng & yêu cầu StudyMate
│   └── phan-cong-nhiem-vu.md              # Phân chia công việc chi tiết cho nhóm 3 sinh viên
├── assets/                                # Tài nguyên tĩnh
│   ├── images/                            # Hình ảnh sử dụng trong web
│   └── icons/                             # Biểu tượng, icon
├── pages/                                 # Toàn bộ các trang giao diện website theo Role
│   ├── # [Visitor / Khách]
│   ├── index.html                         # Trang chủ giới thiệu nền tảng (Landing Page)
│   ├── login.html                         # Đăng nhập hệ thống
│   ├── register.html                      # Đăng ký tài khoản sinh viên mới
│   │
│   ├── # [Student / Sinh viên]
│   ├── dashboard.html                     # Trang tổng quan học tập sinh viên
│   ├── subjects.html                      # Danh sách & quản lý môn học
│   ├── subject-detail.html                # Chi tiết từng môn học (Tài liệu, task riêng)
│   ├── schedule.html                      # Thời khóa biểu xem theo ngày và tuần
│   ├── tasks.html                         # Quản lý nhiệm vụ & Deadline thông minh
│   ├── exams.html                         # Lịch thi và đồng hồ đếm ngược số ngày
│   ├── documents.html                     # Kho tài liệu học tập theo môn
│   ├── progress.html                      # Theo dõi tiến độ học tập tự động
│   ├── import-schedule.html               # Nhập lịch bằng ảnh (AI/OCR) / Text / Form
│   ├── profile.html                       # Hồ sơ sinh viên & Cài đặt
│   │
│   └── # [Admin / Quản trị viên]
│       ├── admin-dashboard.html           # Thống kê tổng quan hoạt động hệ thống
│       ├── admin-users.html               # Quản lý danh sách tài khoản sinh viên
│       ├── admin-subjects.html            # Quản lý danh mục môn học mẫu
│       └── admin-announcements.html       # Quản lý thông báo toàn hệ thống
├── css/                                   # Định dạng giao diện
│   ├── style.css                          # Style chính (Màu chủ đạo xanh dương & trắng)
│   └── responsive.css                     # Responsive trên Desktop, Tablet và Mobile
├── js/                                    # Xử lý chức năng (JavaScript thuần)
│   ├── main.js                            # Script chung (Navbar, Sidebar, Toast, Modal)
│   ├── auth.js                            # Xử lý đăng nhập, đăng ký, phiên người dùng
│   ├── dashboard.js                       # Render số liệu thống kê Dashboard
│   ├── tasks.js                           # CRUD nhiệm vụ, tính deadline, trạng thái
│   ├── schedule.js                        # Render thời khóa biểu & giả lập OCR TKB
│   ├── progress.js                        # Tự động tính % tiến độ môn học
│   └── admin.js                           # Xử lý các trang quản trị
└── README.md                              # Hướng dẫn dự án
```

---

## 3. Danh sách Role và Giao diện trong hệ thống

### 👥 Khách / Visitor
- `pages/index.html`: Giới thiệu tổng quan StudyMate, các tính năng nổi bật, phản hồi sinh viên.
- `pages/login.html`: Giao diện đăng nhập cho Sinh viên và Admin (có sẵn tài khoản mẫu).
- `pages/register.html`: Giao diện đăng ký nhanh cho sinh viên mới.

### 🎓 Sinh viên / Student
- `pages/dashboard.html`: Thẻ việc cần làm hôm nay, deadline sắp đến, tỷ lệ tiến độ môn học.
- `pages/subjects.html`: Danh sách môn học với mã môn, giảng viên, số tín chỉ.
- `pages/subject-detail.html`: Xem chi tiết 1 môn học cụ thể.
- `pages/schedule.html`: Xem thời khóa biểu theo ngày / theo tuần trực quan.
- `pages/tasks.html`: Quản lý deadline kèm mức độ ưu tiên, đếm ngược số ngày.
- `pages/exams.html`: Lịch thi, giờ thi, số ngày còn lại đến kỳ thi.
- `pages/documents.html`: Phân loại slide, bài tập, đề cương ôn tập.
- `pages/progress.html`: Bảng biểu đồ tiến độ học tập tự động tính từ nhiệm vụ đã hoàn thành.
- `pages/import-schedule.html`: **USP** – Tải ảnh TKB trường lên để AI/OCR nhận diện, chỉnh sửa và xác nhận lưu.
- `pages/profile.html`: Cập nhật thông tin sinh viên, email, lớp sinh hoạt.

### 🛡️ Quản trị viên / Admin
- `pages/admin-dashboard.html`: Thống kê số lượng sinh viên, tổng số môn học, tỷ lệ nộp bài tập.
- `pages/admin-users.html`: Danh sách tài khoản sinh viên, quyền, trạng thái hoạt động.
- `pages/admin-subjects.html`: Quản lý danh mục môn học của trường.
- `pages/admin-announcements.html`: Tạo và gửi thông báo chung cho sinh viên.

---

## 4. Phân công nhóm 3 sinh viên

| Sinh viên | Vai trò | Trách nhiệm & Nhánh Git | Giao diện phụ trách |
| :--- | :--- | :--- | :--- |
| **SV1** | Frontend + Layout Core | • Xây dựng style chung (`css/style.css`, `css/responsive.css`)<br>• Trang Landing Page, Luồng Auth & Profile<br>• **Nhánh:** `feature/home-auth` | `index.html`<br>`login.html`<br>`register.html`<br>`profile.html` |
| **SV2** | Core Student Features | • Xây dựng luồng cốt lõi sinh viên: Dashboard, TKB, Quản lý Tasks<br>• Xây dựng tính năng USP Import TKB bằng ảnh OCR<br>• **Nhánh:** `feature/student-core` | `dashboard.html`<br>`schedule.html`<br>`tasks.html`<br>`import-schedule.html` |
| **SV3** | Admin & Academic Details | • Xây dựng quản lý môn học, tài liệu, lịch thi, tiến độ<br>• Toàn bộ phân hệ Quản trị viên (Admin)<br>• **Nhánh:** `feature/admin-management` | `subjects.html`<br>`exams.html`, `documents.html`<br>`progress.html`<br>Toàn bộ trang `admin-*.html` |

---

## 5. Tổ chức GitHub Repo & Luồng rẽ nhánh

```text
       [ feature/home-auth ] --------┐
                                     │  (Pull Request & Review)
       [ feature/student-core ] ----─┼──────> [ dev ] ──────> [ main ]
                                     │     (Kiểm tra, test)  (Bản nộp BTL)
    [ feature/admin-management ] ────┘
```

- `main`: Nhánh ổn định cao nhất, dùng để nộp bài và demo. Không commit trực tiếp vào `main`.
- `dev`: Nhánh tích hợp chung của cả nhóm.
- Mỗi sinh viên tạo nhánh `feature/...` riêng từ `dev`, commit rõ ràng, sau đó mở Pull Request (PR) để các thành viên review trước khi merge.

---

## 6. Hướng dẫn chạy thử dự án

1. Mở file `pages/index.html` trực tiếp bằng trình duyệt Web (Chrome, Edge, Firefox) hoặc dùng extension **Live Server** trong VS Code:
   - Nhấp chuột phải vào `pages/index.html` ➔ Chọn **Open with Live Server**.
2. Tài khoản demo có sẵn trên giao diện:
   - **Sinh viên:** `student@studymate.edu.vn` / Mật khẩu: `123456`
   - **Quản trị viên:** `admin@studymate.edu.vn` / Mật khẩu: `admin123`
