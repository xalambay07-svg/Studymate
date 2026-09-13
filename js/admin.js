/**
 * STUDYMATE - ADMIN SCRIPT
 * Xử lý chức năng quản trị viên: Thống kê, Quản lý tài khoản sinh viên, Danh mục môn học
 */

document.addEventListener("DOMContentLoaded", () => {
  renderAdminUsers();
  renderAdminSubjects();
});

function renderAdminUsers() {
  const tableBody = document.getElementById("adminUsersTableBody");
  if (!tableBody) return;

  const users = [
    { mssv: "2251061234", name: "Nguyễn Văn Sinh Viên", class: "64CNTT1", email: "student@studymate.edu.vn", role: "Sinh viên", status: "Hoạt động" },
    { mssv: "2251065678", name: "Trần Minh Đức", class: "64CNTT2", email: "duc.tm@studymate.edu.vn", role: "Sinh viên", status: "Hoạt động" },
    { mssv: "2251069999", name: "Lê Thị Thu", class: "64KTPM1", email: "thu.lt@studymate.edu.vn", role: "Lớp trưởng", status: "Hoạt động" },
    { mssv: "ADMIN-01", name: "Quản trị viên Hệ thống", class: "Khoa CNTT", email: "admin@studymate.edu.vn", role: "Quản trị viên", status: "Hoạt động" }
  ];

  tableBody.innerHTML = users.map(u => `
    <tr>
      <td><code>${u.mssv}</code></td>
      <td><strong>${u.name}</strong></td>
      <td>${u.class}</td>
      <td>${u.email}</td>
      <td><span class="badge ${u.role === 'Quản trị viên' ? 'badge-danger' : 'badge-primary'}">${u.role}</span></td>
      <td><span class="badge badge-safe">● ${u.status}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Đang chỉnh sửa quyền người dùng', 'info')">Sửa</button>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Đã khóa tài khoản tạm thời', 'warning')" style="color: var(--status-danger);">Khóa</button>
      </td>
    </tr>
  `).join("");
}

function renderAdminSubjects() {
  const tableBody = document.getElementById("adminSubjectsTableBody");
  if (!tableBody) return;

  const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [];

  tableBody.innerHTML = subjects.map(s => `
    <tr>
      <td><strong>${s.id}</strong></td>
      <td>${s.name}</td>
      <td>${s.credits} tín chỉ</td>
      <td>${s.teacher}</td>
      <td>${s.room}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Chỉnh sửa thông tin môn học', 'info')">Sửa</button>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Đã xóa môn học', 'danger')" style="color: var(--status-danger);">Xóa</button>
      </td>
    </tr>
  `).join("");
}
