/**
 * STUDYMATE - TASKS & DEADLINES SCRIPT
 * Quản lý nhiệm vụ, deadline, tự động tính số ngày còn lại và cập nhật trạng thái
 * Mặc định để trống danh sách cho người dùng mới; lưu trữ khi người dùng thêm mới
 */

document.addEventListener("DOMContentLoaded", () => {
  initSubjectSelect();
  renderTasksTable();
  initTaskForm();
});

function initSubjectSelect() {
  const select = document.getElementById("taskSubject");
  if (!select) return;

  const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [
    { id: "CSE201", name: "Lập trình hướng đối tượng" },
    { id: "CSE122", name: "Phát triển ứng dụng web cơ bản" },
    { id: "CSE220", name: "Cơ sở dữ liệu" },
    { id: "CSE301", name: "Hệ điều hành" },
    { id: "CSE302", name: "Mạng máy tính" }
  ];

  select.innerHTML = subjects.map(s => `
    <option value="${s.id}" style="background-color: #171533; color: #ffffff;">${s.id} - ${s.name}</option>
  `).join("");
}

function renderTasksTable() {
  const tableBody = document.getElementById("tasksTableBody");
  if (!tableBody) return;

  // Lọc sạch các bài tập mẫu giả lập cũ nếu còn sót lại
  let tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  if (tasks.some(t => t.title === "Báo cáo BTL Website StudyMate" || t.title === "Bài tập Linked List & Stack" || t.title === "Ôn tập tích phân & chuỗi số")) {
    tasks = [];
    localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
  }

  // Nếu người dùng chưa thêm công việc nào -> Để trống danh sách với thông báo nhẹ nhàng
  if (tasks.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3.5rem 1.5rem; color: var(--theme-text-muted);">
          <div style="font-size: 1.05rem; font-weight: 600; color: var(--theme-text-primary); margin-bottom: 0.35rem;">
            Danh sách đang trống
          </div>
          <div style="font-size: 0.85rem; color: var(--theme-text-muted); max-width: 480px; margin: 0 auto; line-height: 1.5;">
            Bạn chưa có công việc hoặc deadline nào. Hãy điền thông tin ở biểu mẫu phía trên và nhấn <strong>+ Lưu nhiệm vụ</strong> để bắt đầu theo dõi tiến độ!
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = tasks.map(t => {
    // Tự động tính số ngày và mức độ gấp
    const deadlineDate = new Date(t.deadline);
    const now = new Date();
    const diffHours = Math.round((deadlineDate - now) / (1000 * 60 * 60));
    
    let statusBadge = "";
    if (t.status === "completed") {
      statusBadge = `<span class="badge badge-safe">Hoàn thành</span>`;
    } else if (diffHours < 0) {
      statusBadge = `<span class="badge badge-overdue">Đã quá hạn (${Math.abs(Math.floor(diffHours/24))} ngày)</span>`;
    } else if (diffHours <= 24) {
      statusBadge = `<span class="badge badge-danger">Hạn hôm nay (${diffHours} giờ)</span>`;
    } else if (diffHours <= 72) {
      statusBadge = `<span class="badge badge-warning">Sắp đến hạn (${Math.ceil(diffHours/24)} ngày)</span>`;
    } else {
      statusBadge = `<span class="badge badge-safe">Còn nhiều thời gian (${Math.ceil(diffHours/24)} ngày)</span>`;
    }

    let priorityBadge = "";
    if (t.priority === "urgent") priorityBadge = `<span class="badge badge-danger">Khẩn cấp</span>`;
    else if (t.priority === "high") priorityBadge = `<span class="badge badge-warning">Ưu tiên cao</span>`;
    else priorityBadge = `<span class="badge badge-primary">Bình thường</span>`;

    return `
      <tr>
        <td style="text-align: center;">
          <input type="checkbox" ${t.status === "completed" ? "checked" : ""} onchange="toggleTaskStatus(${t.id})" style="width: 17px; height: 17px; cursor: pointer;">
        </td>
        <td>
          <strong style="${t.status === "completed" ? "text-decoration: line-through; color: var(--theme-text-muted);" : "color: var(--theme-text-primary);"}">${t.title}</strong>
        </td>
        <td><span class="badge badge-primary" style="font-size: 0.8rem;">${t.subjectId}</span></td>
        <td style="font-size: 0.85rem; color: var(--theme-text-secondary);">${t.deadline.replace("T", " ")}</td>
        <td>${priorityBadge}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="st-pill-btn" onclick="deleteTask(${t.id})" style="color: var(--status-danger); border-color: rgba(239,68,68,0.3); padding: 0.25rem 0.65rem; font-size: 0.775rem;">Xóa</button>
        </td>
      </tr>
    `;
  }).join("");
}

function initTaskForm() {
  const form = document.getElementById("addTaskForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value.trim();
    const subjectId = document.getElementById("taskSubject").value;
    const deadline = document.getElementById("taskDeadline").value;
    const priority = document.getElementById("taskPriority").value;

    if (!title || !deadline) {
      showToast("Vui lòng nhập tên công việc và hạn chót!", "warning");
      return;
    }

    const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
    const newTask = {
      id: Date.now(),
      title,
      subjectId,
      deadline,
      priority,
      status: "pending"
    };

    tasks.unshift(newTask);
    localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
    form.reset();
    renderTasksTable();
    showToast("Đã lưu công việc mới vào danh sách!", "success");
  });
}

function toggleTaskStatus(id) {
  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = task.status === "completed" ? "pending" : "completed";
    localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
    renderTasksTable();
    showToast(task.status === "completed" ? "Đã đánh dấu hoàn thành!" : "Đã chuyển về chưa hoàn thành!", "success");
  }
}

function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
  renderTasksTable();
  showToast("Đã xóa công việc khỏi danh sách!", "info");
}

