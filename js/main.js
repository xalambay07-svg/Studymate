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

