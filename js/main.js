/**
 * STUDYMATE - MAIN JAVASCRIPT
 * Xử lý giao diện dùng chung: Sidebar mobile, Toast thông báo, Khởi tạo dữ liệu mẫu
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSampleData();
  updateUserHeader();
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

// 2. Hiển thị thông báo Toast
function showToast(message, type = "info") {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  let icon = "🔔";
  if (type === "success") icon = "✅";
  if (type === "warning") icon = "⚠️";
  if (type === "danger") icon = "❌";

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// 3. Khởi tạo dữ liệu mẫu LocalStorage (nếu chưa có)
function initSampleData() {
  if (!localStorage.getItem("studymate_subjects")) {
    const defaultSubjects = [
      { id: "CSE122", name: "Phát triển ứng dụng web cơ bản", credits: 3, teacher: "ThS. Nguyễn Văn A", room: "A203" },
      { id: "CSE281", name: "Cấu trúc dữ liệu và giải thuật", credits: 4, teacher: "TS. Trần Thị B", room: "B102" },
      { id: "MATH101", name: "Giải tích 1", credits: 3, teacher: "PGS. Lê Văn C", room: "C301" },
      { id: "ENG201", name: "Tiếng Anh chuyên ngành", credits: 2, teacher: "ThS. Phạm Thị D", room: "D405" }
    ];
    localStorage.setItem("studymate_subjects", JSON.stringify(defaultSubjects));
  }

  if (!localStorage.getItem("studymate_tasks")) {
    const defaultTasks = [
      { id: 1, title: "Báo cáo BTL Website StudyMate", subjectId: "CSE122", deadline: "2026-09-20T23:59", priority: "high", status: "in-progress" },
      { id: 2, title: "Bài tập Linked List & Stack", subjectId: "CSE281", deadline: "2026-09-15T23:59", priority: "medium", status: "pending" },
      { id: 3, title: "Ôn tập tích phân & chuỗi số", subjectId: "MATH101", deadline: "2026-09-14T17:00", priority: "urgent", status: "pending" },
      { id: 4, title: "Dịch bài đọc Unit 3 AI Ethics", subjectId: "ENG201", deadline: "2026-09-18T20:00", priority: "low", status: "completed" },
      { id: 5, title: "Thiết kế wireframe Figma CSE122", subjectId: "CSE122", deadline: "2026-09-10T23:59", priority: "high", status: "completed" }
    ];
    localStorage.setItem("studymate_tasks", JSON.stringify(defaultTasks));
  }

  if (!localStorage.getItem("studymate_exams")) {
    const defaultExams = [
      { id: 1, subjectId: "MATH101", subjectName: "Giải tích 1", date: "2026-09-25", time: "08:00", room: "C301" },
      { id: 2, subjectId: "CSE281", subjectName: "Cấu trúc dữ liệu và giải thuật", date: "2026-10-02", time: "13:30", room: "B102" },
      { id: 3, subjectId: "CSE122", subjectName: "Bảo vệ BTL Web cơ bản", date: "2026-10-10", time: "07:30", room: "A203" }
    ];
    localStorage.setItem("studymate_exams", JSON.stringify(defaultExams));
  }
}

// 4. Cập nhật thông tin User trên Header
function updateUserHeader() {
  const currentUser = JSON.parse(localStorage.getItem("studymate_user")) || {
    name: "Nguyễn Văn Sinh Viên",
    role: "Sinh viên K65 - CNTT",
    email: "student@studymate.edu.vn"
  };

  const nameElem = document.querySelector(".user-name");
  const roleElem = document.querySelector(".user-role");
  if (nameElem) nameElem.textContent = currentUser.name;
  if (roleElem) roleElem.textContent = currentUser.role;
}
