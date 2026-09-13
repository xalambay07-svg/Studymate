# KẾ HOẠCH PHÂN CÔNG NHIỆM VỤ NHÓM 3 SINH VIÊN
## ĐỀ TÀI: STUDYMATE - HỌC PHẦN CSE122 (TRƯỜNG ĐẠI HỌC THỦY LỢI)

---

### 1. BẢNG PHÂN CÔNG CHI TIẾT

| STT | Thành viên | Vai trò | Công việc phụ trách | Sản phẩm bàn giao | Nhánh Git |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Sinh viên 1 (SV1)** | Nhóm trưởng, Frontend Layout & Auth | • Thiết kế khung sườn UI chung (CSS Variables, màu xanh dương/trắng, responsive)<br>• Xây dựng giao diện Khách & Auth (Trang chủ, Đăng nhập, Đăng ký)<br>• Trang Hồ sơ cá nhân (Profile) | `css/style.css`<br>`css/responsive.css`<br>`pages/index.html`<br>`pages/login.html`<br>`pages/register.html`<br>`pages/profile.html`<br>`js/auth.js` | `feature/home-auth` |
| 2 | **Sinh viên 2 (SV2)** | Core Student Features & Lịch học | • Xây dựng Dashboard cá nhân sinh viên (Hôm nay, Sắp đến hạn, Thống kê)<br>• Quản lý nhiệm vụ, Deadline, tự động tính ngày còn lại<br>• Giao diện Thời khóa biểu (ngày/tuần)<br>• Tính năng USP: Nhập TKB bằng ảnh (AI/OCR) & Dán text | `pages/dashboard.html`<br>`pages/schedule.html`<br>`pages/tasks.html`<br>`pages/import-schedule.html`<br>`js/dashboard.js`<br>`js/tasks.js`<br>`js/schedule.js` | `feature/student-core` |
| 3 | **Sinh viên 3 (SV3)** | Admin & Quản lý học tập nâng cao | • Quản lý danh sách môn học, chi tiết môn<br>• Quản lý lịch thi (Exams) & Kho tài liệu học tập (Documents)<br>• Theo dõi biểu đồ tiến độ học tập (Progress)<br>• Toàn bộ phân hệ Quản trị viên (Admin Dashboard, Users, Subjects, Announcements) | `pages/subjects.html`<br>`pages/subject-detail.html`<br>`pages/exams.html`<br>`pages/documents.html`<br>`pages/progress.html`<br>`pages/admin-*.html`<br>`js/progress.js`<br>`js/admin.js` | `feature/admin-management` |

---

### 2. QUY TRÌNH PHỐI HỢP & QUY TẮC GIT (THEO MỤC 6 & 8 TRONG ẢNH)

1. **Quy tắc rẽ nhánh:**
   - Tuyệt đối **không commit trực tiếp lên nhánh `main`**.
   - Mọi tính năng phát triển trên nhánh `feature/...`.
   - Hoàn thành tính năng -> Tạo Pull Request (PR) về nhánh `dev`.
   - Các thành viên review code chéo nhau (ít nhất 1 người duyệt) -> Merge vào `dev`.
   - Kiểm tra tổng thể chạy mượt mà trên `dev` -> Merge lên `main`.

2. **Quy ước đặt tên:**
   - Tên file/thư mục: viết thường không dấu, dùng dấu gạch ngang (kebab-case), ví dụ: `import-schedule.html`.
   - Tên class CSS: rõ ràng, ngữ nghĩa, tiền tố module, ví dụ: `.card-task`, `.badge-urgent`.
   - Commit message: Rõ ràng, ví dụ `feat: hoàn thiện giao diện import TKB`, `fix: sửa lỗi tính phần trăm tiến độ`.
