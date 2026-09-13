/**
 * STUDYMATE - MAIN JAVASCRIPT
 * Xử lý giao diện dùng chung: Sidebar mobile, Toast thông báo, Khởi tạo dữ liệu mẫu
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSampleData();
  updateUserHeader();
  checkPageAuth();
});

// 1. Quản lý Sidebar trên Mobile
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const sidebar = document.querySelector(".sidebar");
  let overlay = document.querySelector(".sidebar-overlay");

  if (!overlay && sidebar) {
    overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  }

  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");
    });
  }
}

// 2. Hiển thị thông báo Toast (Thiết kế tối giản, không dùng emoji)
function showToast(message, type = "info") {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  let badgeText = "Thông báo";
  if (type === "success") badgeText = "Thành công";
  if (type === "warning") badgeText = "Chú ý";
  if (type === "danger") badgeText = "Cảnh báo";

  toast.innerHTML = `<span style="font-size: 0.725rem; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.15); margin-right: 6px;">${badgeText}</span><span>${message}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// 3. Quản lý phiên đăng nhập người dùng (Authentication Gatekeeper)
function isUserLoggedIn() {
  return sessionStorage.getItem("studymate_is_authenticated") === "true" ||
         localStorage.getItem("studymate_is_authenticated") === "true" ||
         !!(sessionStorage.getItem("studymate_user") || localStorage.getItem("studymate_user"));
}

function getCurrentUser() {
  const userStr = sessionStorage.getItem("studymate_user") || localStorage.getItem("studymate_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

function logoutUser() {
  sessionStorage.removeItem("studymate_is_authenticated");
  sessionStorage.removeItem("studymate_user");
  localStorage.removeItem("studymate_is_authenticated");
  localStorage.removeItem("studymate_user");
  window.location.replace("index.html");
}

// Kiểm tra quyền truy cập các trang thành phần
function checkPageAuth() {
  const currentPath = window.location.pathname.toLowerCase();
  const protectedPages = [
    { file: "dashboard.html", name: "Dashboard học tập" },
    { file: "tasks.html", name: "Quản lý Deadline & Nhiệm vụ" },
    { file: "schedule.html", name: "Thời khóa biểu sinh viên" },
    { file: "progress.html", name: "Đo lường tiến độ học tập" },
    { file: "import-schedule.html", name: "Quét TKB bằng AI/OCR" },
    { file: "exams.html", name: "Đếm ngược kỳ thi" },
    { file: "subjects.html", name: "Quản lý Môn học" },
    { file: "subject-detail.html", name: "Chi tiết môn học" },
    { file: "documents.html", name: "Tài liệu học tập" },
    { file: "profile.html", name: "Hồ sơ cá nhân" },
    { file: "admin-dashboard.html", name: "Quản trị viên" },
    { file: "admin-users.html", name: "Quản trị người dùng" },
    { file: "admin-subjects.html", name: "Quản trị môn học" },
    { file: "admin-announcements.html", name: "Quản trị thông báo" }
  ];

  const matched = protectedPages.find(p => currentPath.endsWith(p.file));
  if (matched && !isUserLoggedIn()) {
    // Chưa đăng nhập -> Chuyển ngay về index.html và tự động mở form đăng nhập kèm thông báo
    window.location.replace(`index.html?auth=required&target=${encodeURIComponent(matched.file)}&name=${encodeURIComponent(matched.name)}`);
  }
}

// Chạy kiểm tra ngay lập tức khi file script được load để chặn hiển thị trang nếu chưa đăng nhập
checkPageAuth();

// 4. Khởi tạo dữ liệu mẫu LocalStorage (nếu chưa có)
function initSampleData() {
  if (!localStorage.getItem("studymate_subjects") || JSON.parse(localStorage.getItem("studymate_subjects")).some(s => s.id === "ENG201")) {
    const defaultSubjects = [
      { id: "CSE201", name: "Lập trình hướng đối tượng", credits: 3, teacher: "Khoa CNTT", room: "205-B5 / 211-B5" },
      { id: "CSE122", name: "Phát triển ứng dụng web cơ bản", credits: 3, teacher: "Khoa CNTT", room: "205-B5 / 211-B5" },
      { id: "CSE220", name: "Cơ sở dữ liệu", credits: 3, teacher: "Khoa CNTT", room: "401-C5 / 310-B5" },
      { id: "CSE301", name: "Hệ điều hành", credits: 3, teacher: "Khoa CNTT", room: "309-B5" },
      { id: "CSE302", name: "Mạng máy tính", credits: 3, teacher: "Khoa CNTT", room: "309-B5" }
    ];
    localStorage.setItem("studymate_subjects", JSON.stringify(defaultSubjects));
  }

  // Do not seed dummy tasks - keep empty for new user until user adds tasks
  const existingTasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  if (existingTasks.some(t => t.title === "Báo cáo BTL Website StudyMate" || t.title === "Bài tập Linked List & Stack" || t.title === "Ôn tập tích phân & chuỗi số")) {
    localStorage.setItem("studymate_tasks", JSON.stringify([]));
  } else if (!localStorage.getItem("studymate_tasks")) {
    localStorage.setItem("studymate_tasks", JSON.stringify([]));
  }

  // Do not seed dummy exams - user enters their exams manually
  const existingExams = JSON.parse(localStorage.getItem("studymate_exams")) || [];
  if (existingExams.some(e => e.subjectId === "MATH101" || e.subjectName === "Giải tích 1")) {
    localStorage.setItem("studymate_exams", JSON.stringify([]));
  } else if (!localStorage.getItem("studymate_exams")) {
    localStorage.setItem("studymate_exams", JSON.stringify([]));
  }
}

// 5. Cập nhật thông tin User trên Header & Toàn bộ giao diện
function updateUserHeader() {
  const currentUser = getCurrentUser();
  const userName = (currentUser && currentUser.name && currentUser.name.trim()) ? currentUser.name.trim() : "Sinh viên";
  const userRole = (currentUser && currentUser.role && currentUser.role.trim()) ? currentUser.role.trim() : "Sinh viên CNTT - ĐH Thủy Lợi";

  const nameElem = document.querySelector(".user-name");
  const roleElem = document.querySelector(".user-role");
  if (nameElem) nameElem.textContent = userName;
  if (roleElem) roleElem.textContent = userRole;

  // Cập nhật tất cả các badge tên người dùng tĩnh
  document.querySelectorAll(".st-user-display").forEach(el => {
    el.textContent = userName;
  });

  // Cập nhật tên sinh viên trên trang Thời khóa biểu (schedule.html)
  const schedNameElem = document.getElementById("scheduleStudentName");
  if (schedNameElem) {
    schedNameElem.textContent = userName;
  }

  // Cập nhật trang Hồ sơ cá nhân (profile.html)
  const profileNameElem = document.getElementById("profileUserName");
  if (profileNameElem) {
    profileNameElem.textContent = userName;
  }
  const profileFullNameInput = document.getElementById("profileFullName");
  if (profileFullNameInput && currentUser && currentUser.name) {
    profileFullNameInput.value = currentUser.name;
  }
  const profileEmailInput = document.getElementById("profileEmail");
  if (profileEmailInput && currentUser && currentUser.email) {
    profileEmailInput.value = currentUser.email;
  }
}

