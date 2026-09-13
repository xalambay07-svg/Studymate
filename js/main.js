/**
 * STUDYMATE - MAIN JAVASCRIPT
 * Xử lý giao diện dùng chung: Sidebar mobile, Toast thông báo, Đồng bộ User, Khởi tạo dữ liệu mẫu, Role Switcher
 */

document.addEventListener("DOMContentLoaded", () => {
  initSampleData();
  initMobileMenu();
  updateUserHeader();
  initRoleSwitcherUI();
});

// 1. Quản lý Sidebar trên Mobile
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn, .st-mobile-btn");
  const sidebar = document.querySelector(".sidebar, .st-mobile-drawer");
  let overlay = document.querySelector(".sidebar-overlay, .st-drawer-overlay");

  if (!overlay && sidebar) {
    overlay = document.createElement("div");
    overlay.className = "st-drawer-overlay";
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
  const user = getCurrentUser();
  return !!user && user.role !== "guest";
}

function getCurrentUser() {
  // Lấy từ StorageService hoặc localStorage
  const userStr = sessionStorage.getItem("studymate_user") || localStorage.getItem("studymate_user");
  if (!userStr) {
    // Mặc định nạp Sinh viên chính thức TLU nếu chưa có
    return (window.TLU_MOCK_DATA && window.TLU_MOCK_DATA.studymate_user) ? window.TLU_MOCK_DATA.studymate_user : {
      id: "usr_tlu_2026_01",
      studentId: "2251172468",
      fullName: "Nguyễn Hoàng Nam",
      email: "nam.nh2251172468@e.tlu.edu.vn",
      department: "Khoa Công nghệ Thông tin - Lớp 64CNTT3",
      role: "student"
    };
  }
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
  
  // Chuyển sang role Khách vãng lai
  if (window.StorageService) {
    window.StorageService.setRole('guest');
  } else {
    localStorage.setItem("studymate_user", JSON.stringify({
      id: "usr_guest",
      studentId: "GUEST_TLU",
      fullName: "Khách vãng lai",
      email: "guest@studymate.vn",
      department: "Bản xem thử",
      role: "guest"
    }));
  }
  window.location.replace("index.html");
}

// 4. Khởi tạo dữ liệu mẫu LocalStorage chuẩn TLU
function initSampleData() {
  if (window.StorageService) {
    window.StorageService.initMockData(false);
  } else {
    // Fallback nếu chưa nạp storage.js
    if (!localStorage.getItem("studymate_subjects")) {
      const defaultSubjects = [
        { id: "sub_cse122", code: "CSE122", name: "Phát triển Ứng dụng Web", credits: 3, teacher: "TS. Kiều Tuấn Dũng", room: "P.402-A2", colorHex: "#2563EB" },
        { id: "sub_cse281", code: "CSE281", name: "Hệ Quản trị Cơ sở Dữ liệu", credits: 3, teacher: "ThS. Trần Thị Mai", room: "P.301-T45", colorHex: "#059669" },
        { id: "sub_mat101", code: "MAT101", name: "Giải tích 1", credits: 3, teacher: "TS. Lê Quang Vinh", room: "P.205-A1", colorHex: "#D97706" },
        { id: "sub_cse370", code: "CSE370", name: "Mạng Máy tính & Truyền thông", credits: 3, teacher: "ThS. Đỗ Mạnh Cường", room: "Lab.502-K1", colorHex: "#7C3AED" },
        { id: "sub_phy102", code: "PHY102", name: "Vật lý Đại cương 2", credits: 2, teacher: "TS. Hoàng Thị Yến", room: "P.104-B1", colorHex: "#DB2777" }
      ];
      localStorage.setItem("studymate_subjects", JSON.stringify(defaultSubjects));
    }
  }
}

// 5. Cập nhật thông tin User trên Header & Toàn bộ giao diện
function updateUserHeader() {
  const currentUser = getCurrentUser();
  const userName = (currentUser && (currentUser.fullName || currentUser.name)) ? (currentUser.fullName || currentUser.name).trim() : "Sinh viên";
  const userStudentId = (currentUser && currentUser.studentId) ? currentUser.studentId : "2251172468";
  const userRole = (currentUser && currentUser.role === "admin") ? "Quản trị viên (Mock Admin)" : 
                   (currentUser && currentUser.role === "guest") ? "Khách vãng lai" : "Sinh viên CNTT - ĐH Thủy Lợi";

  // Lời chào theo buổi (Sáng / Chiều / Tối)
  const hour = new Date().getHours();
  let greetingPrefix = "Chào buổi tối, ";
  if (hour >= 5 && hour < 12) greetingPrefix = "Chào buổi sáng, ";
  else if (hour >= 12 && hour < 18) greetingPrefix = "Chào buổi chiều, ";

  const heroPrefixElem = document.getElementById("heroGreetingPrefix");
  if (heroPrefixElem) heroPrefixElem.textContent = greetingPrefix;

  const heroNameElem = document.getElementById("heroGreetingName");
  if (heroNameElem) heroNameElem.textContent = userName;

  const nameElem = document.querySelector(".user-name");
  const roleElem = document.querySelector(".user-role");
  if (nameElem) nameElem.textContent = userName;
  if (roleElem) roleElem.textContent = userRole;

  // Cập nhật tất cả các badge tên người dùng tĩnh
  document.querySelectorAll(".st-user-display, #displayUserName, #currentStudentName, #headerStudentName").forEach(el => {
    el.textContent = userName;
  });

  // Cập nhật tên sinh viên trên trang Thời khóa biểu (schedule.html)
  const schedNameElem = document.getElementById("scheduleStudentName");
  if (schedNameElem) {
    schedNameElem.textContent = `${userName} (${userStudentId})`;
  }

  // Cập nhật trang Hồ sơ cá nhân (profile.html)
  const profileNameElem = document.getElementById("profileUserName");
  if (profileNameElem) profileNameElem.textContent = userName;
  
  const profileFullNameInput = document.getElementById("profileFullName");
  if (profileFullNameInput && currentUser) {
    profileFullNameInput.value = userName;
  }
  const profileStudentIdInput = document.getElementById("profileStudentId");
  if (profileStudentIdInput && currentUser) {
    profileStudentIdInput.value = userStudentId;
  }
}

// 6. Interactive 3-Role Switcher Widget (Phục vụ Giảng viên & Hội đồng nghiệm thu)
function initRoleSwitcherUI() {
  if (document.getElementById("stRoleSwitcherContainer")) return;

  const user = getCurrentUser();
  const currentRole = user ? user.role : "student";

  const container = document.createElement("div");
  container.id = "stRoleSwitcherContainer";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  container.style.fontFamily = "'Plus Jakarta Sans', sans-serif";

  const roleLabels = {
    guest: "👤 Khách vãng lai",
    student: "🎓 Sinh viên (Chính thức)",
    admin: "🛡️ Quản trị viên (Admin)"
  };

  container.innerHTML = `
    <div style="position: relative;">
      <button id="stRoleToggleBtn" type="button" style="display: flex; align-items: center; gap: 8px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 8px 14px; border-radius: 9999px; box-shadow: 0 8px 24px rgba(0,0,0,0.35); font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${currentRole === 'admin' ? '#ef4444' : currentRole === 'student' ? '#10b981' : '#f59e0b'};"></span>
        <span id="stCurrentRoleText">${roleLabels[currentRole] || "🎓 Sinh viên"}</span>
        <span style="font-size: 0.7rem; opacity: 0.7;">▾</span>
      </button>

      <!-- Dropdown Menu -->
      <div id="stRoleDropdown" style="display: none; position: absolute; bottom: 44px; right: 0; width: 270px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 14px; padding: 12px; box-shadow: 0 16px 36px rgba(0,0,0,0.5); color: #fff;">
        <div style="font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 8px;">
          Mô phỏng Phân quyền (3 Roles)
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button type="button" onclick="switchUserRole('student')" style="display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; padding: 8px 10px; border-radius: 8px; border: none; background: ${currentRole === 'student' ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}; color: #fff; font-size: 0.825rem; font-weight: 600; cursor: pointer; transition: background 0.15s;">
            <span style="font-size: 1rem;">🎓</span>
            <div>
              <div style="color: ${currentRole === 'student' ? '#34d399' : '#fff'};">Sinh viên chính thức</div>
              <div style="font-size: 0.7rem; color: #94a3b8;">Nguyễn Hoàng Nam (64CNTT3)</div>
            </div>
          </button>

          <button type="button" onclick="switchUserRole('guest')" style="display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; padding: 8px 10px; border-radius: 8px; border: none; background: ${currentRole === 'guest' ? 'rgba(245, 158, 11, 0.2)' : 'transparent'}; color: #fff; font-size: 0.825rem; font-weight: 600; cursor: pointer; transition: background 0.15s;">
            <span style="font-size: 1rem;">👤</span>
            <div>
              <div style="color: ${currentRole === 'guest' ? '#fbbf24' : '#fff'};">Khách vãng lai (Guest)</div>
              <div style="font-size: 0.7rem; color: #94a3b8;">Chỉ xem Landing & TKB demo</div>
            </div>
          </button>

          <button type="button" onclick="switchUserRole('admin')" style="display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; padding: 8px 10px; border-radius: 8px; border: none; background: ${currentRole === 'admin' ? 'rgba(239, 68, 68, 0.2)' : 'transparent'}; color: #fff; font-size: 0.825rem; font-weight: 600; cursor: pointer; transition: background 0.15s;">
            <span style="font-size: 1rem;">🛡️</span>
            <div>
              <div style="color: ${currentRole === 'admin' ? '#f87171' : '#fff'};">Quản trị viên (Mock Admin)</div>
              <div style="font-size: 0.7rem; color: #94a3b8;">Quản lý môn, reset dữ liệu BTL</div>
            </div>
          </button>
        </div>

        <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 10px; padding-top: 10px;">
          <button type="button" onclick="resetAllStudyMateData()" style="width: 100%; padding: 7px; border-radius: 8px; border: 1px dashed rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1); color: #fca5a5; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: background 0.2s;">
            🔄 Khôi phục Dữ liệu mẫu TLU (Reset)
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const toggleBtn = document.getElementById("stRoleToggleBtn");
  const dropdown = document.getElementById("stRoleDropdown");

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
}

// Chuyển vai trò người dùng
function switchUserRole(role) {
  if (window.StorageService) {
    window.StorageService.setRole(role);
  } else {
    let user = getCurrentUser() || {};
    user.role = role;
    if (role === "guest") {
      user.fullName = "Khách vãng lai";
      user.studentId = "GUEST_TLU";
    } else if (role === "admin") {
      user.fullName = "Quản trị viên Học vụ (Mock Admin)";
      user.studentId = "ADMIN_TLU_01";
    } else {
      user.fullName = "Nguyễn Hoàng Nam";
      user.studentId = "2251172468";
    }
    localStorage.setItem("studymate_user", JSON.stringify(user));
  }

  showToast(`Đã chuyển sang vai trò: ${role.toUpperCase()}`, "success");

  setTimeout(() => {
    if (role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else if (role === "guest") {
      window.location.href = "index.html";
    } else {
      window.location.href = "dashboard.html";
    }
  }, 400);
}

// Khôi phục toàn bộ dữ liệu mẫu TLU
function resetAllStudyMateData() {
  if (confirm("Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu Đại học Thủy Lợi (TLU)? Thao tác này sẽ đặt lại TKB 12 tiết, bài tập và môn học chuẩn.")) {
    if (window.StorageService) {
      window.StorageService.initMockData(true);
    } else {
      localStorage.clear();
      initSampleData();
    }
    showToast("Đã khôi phục dữ liệu mẫu TLU thành công!", "success");
    setTimeout(() => {
      window.location.reload();
    }, 600);
  }
}
