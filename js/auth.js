/**
 * STUDYMATE - AUTH SCRIPT
 * Quản lý đăng nhập, đăng ký, phiên người dùng (Student / Admin)
 */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      // Kiểm tra tài khoản mẫu
      if (email === "admin@studymate.edu.vn" && password === "admin123") {
        const userObj = {
          name: "Quản trị viên Hệ thống",
          email: email,
          role: "Quản trị viên"
        };
        sessionStorage.setItem("studymate_is_authenticated", "true");
        sessionStorage.setItem("studymate_user", JSON.stringify(userObj));
        localStorage.setItem("studymate_user", JSON.stringify(userObj));
        showToast("Đăng nhập quyền Admin thành công!", "success");
        setTimeout(() => {
          window.location.href = "admin-dashboard.html";
        }, 1000);
      } else if (password.length >= 6) {
        let userName = "";
        try {
          const registeredUsers = JSON.parse(localStorage.getItem("studymate_registered_users") || "[]");
          const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (found && found.name) userName = found.name;
        } catch (e) {}

        if (!userName) {
          try {
            const savedUser = JSON.parse(localStorage.getItem("studymate_user") || "null");
            if (savedUser && savedUser.email && savedUser.email.toLowerCase() === email.toLowerCase() && savedUser.name) {
              userName = savedUser.name;
            }
          } catch (e) {}
        }

        if (!userName) {
          userName = email.split("@")[0] || "Sinh viên";
        }

        const userObj = {
          name: userName,
          email: email || "student@studymate.edu.vn",
          role: "Sinh viên CNTT - ĐH Thủy Lợi"
        };
        sessionStorage.setItem("studymate_is_authenticated", "true");
        localStorage.setItem("studymate_is_authenticated", "true");
        sessionStorage.setItem("studymate_user", JSON.stringify(userObj));
        localStorage.setItem("studymate_user", JSON.stringify(userObj));
        showToast("Đăng nhập thành công! Đang chuyển hướng...", "success");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        showToast("Mật khẩu phải từ 6 ký tự trở lên!", "danger");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value;

      if (!fullName || !email || !password) {
        showToast("Vui lòng điền đầy đủ các thông tin!", "warning");
        return;
      }

      const userObj = {
        name: fullName,
        email: email,
        role: "Sinh viên CNTT - ĐH Thủy Lợi"
      };
      sessionStorage.setItem("studymate_is_authenticated", "true");
      localStorage.setItem("studymate_is_authenticated", "true");
      sessionStorage.setItem("studymate_user", JSON.stringify(userObj));
      localStorage.setItem("studymate_user", JSON.stringify(userObj));

      // Lưu vào danh sách tài khoản đã đăng ký để khi đăng nhập lại vẫn giữ đúng tên
      try {
        const registeredUsers = JSON.parse(localStorage.getItem("studymate_registered_users") || "[]");
        const idx = registeredUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
        if (idx >= 0) {
          registeredUsers[idx] = userObj;
        } else {
          registeredUsers.push(userObj);
        }
        localStorage.setItem("studymate_registered_users", JSON.stringify(registeredUsers));
      } catch (e) {}

      showToast("Đăng ký thành công! Đang chuyển hướng đến Dashboard...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1200);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("studymate_is_authenticated");
      sessionStorage.removeItem("studymate_user");
      localStorage.removeItem("studymate_is_authenticated");
      localStorage.removeItem("studymate_user");
      window.location.replace("index.html");
    });
  }
});

