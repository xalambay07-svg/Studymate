# HƯỚNG DẪN TRIỂN KHAI DỰ ÁN STUDYMATE (DEPLOYMENT GUIDE)

Dự án **StudyMate** là ứng dụng web tĩnh hoàn chỉnh (HTML5, CSS3, JavaScript thuần, LocalStorage), do đó có thể triển khai chạy mượt mà theo 3 phương thức dưới đây:

---

## CÁCH 1: KHỞI CHẠY TRỰC TIẾP TRÊN MÁY TÍNH (LOCAL DEPLOYMENT)

### Lựa chọn A: Dùng file chạy nhanh 1-Click (Khuyên dùng)
1. Truy cập thư mục dự án `studymate/`.
2. Nhấp đúp chuột vào file `start.bat`.
3. Trình duyệt sẽ tự động mở trang web tại địa chỉ: `http://localhost:3000/`.

### Lựa chọn B: Sử dụng extension Live Server trong VS Code
1. Mở thư mục dự án `studymate` trong VS Code.
2. Cài đặt tiện ích mở rộng **Live Server** (của Ritwick Dey).
3. Nhấp chuột phải vào file `pages/index.html` ➔ Chọn **Open with Live Server**.

---

## CÁCH 2: TRIỂN KHAI ONLINE MIỄN PHÍ QUA GITHUB PAGES (CHUẨN BTL CSE122)

Theo hướng dẫn tổ chức BTL của Trường Đại học Thủy Lợi, nhóm sinh viên đẩy code lên GitHub và bật GitHub Pages để giảng viên chấm trực tuyến:

1. **Đẩy mã nguồn lên GitHub:**
   ```bash
   git remote add origin https://github.com/<tai-khoan-cua-ban>/cse122-studymate.git
   git branch -M main
   git push -u origin main
   ```
2. **Kích hoạt GitHub Pages:**
   - Vào repository trên GitHub ➔ Chọn tab **Settings**.
   - Ở cột bên trái, chọn **Pages**.
   - Tại mục **Build and deployment** ➔ Source: chọn **Deploy from a branch**.
   - Branch: chọn `main` ➔ Thư mục: `/(root)` ➔ Bấm **Save**.
3. **Truy cập đường link công khai:**
   - Sau 1 - 2 phút, GitHub sẽ cấp link dạng:  
     `https://<tai-khoan-cua-ban>.github.io/cse122-studymate/`
   - File `index.html` ở thư mục gốc sẽ tự động chuyển hướng người xem vào `pages/index.html`.

---

## CÁCH 3: TRIỂN KHAI ONLINE 1-CLICK QUA VERCEL / NETLIFY

Dự án đã được cấu hình sẵn file `vercel.json`:
1. Truy cập [vercel.com](https://vercel.com/) và đăng nhập bằng tài khoản GitHub.
2. Bấm **Add New...** ➔ Chọn **Project**.
3. Chọn repository `cse122-studymate` ➔ Bấm **Deploy**.
4. Vercel sẽ tự động cấp một tên miền tốc độ cao miễn phí dạng:  
   `https://studymate-cse122.vercel.app/`
