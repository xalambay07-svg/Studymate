/**
 * STUDYMATE - TASKS & DEADLINES SCRIPT
 * Quản lý nhiệm vụ, deadline, tự động tính số ngày còn lại và cập nhật trạng thái
 */

document.addEventListener("DOMContentLoaded", () => {
  renderTasksTable();
  initTaskForm();
});

function renderTasksTable() {
  const tableBody = document.getElementById("tasksTableBody");
  if (!tableBody) return;

  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];

  if (tasks.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">Chưa có nhiệm vụ nào. Nhấn "Thêm nhiệm vụ mới" để tạo!</td></tr>`;
    return;
  }

  tableBody.innerHTML = tasks.map(t => {
    // Tự động tính số ngày và mức độ gấp
    const deadlineDate = new Date(t.deadline);
    const now = new Date();
    const diffHours = Math.round((deadlineDate - now) / (1000 * 60 * 60));
    
    let statusBadge = "";
    if (t.status === "completed") {
      statusBadge = `<span class="badge badge-safe">✓ Hoàn thành</span>`;
    } else if (diffHours < 0) {
      statusBadge = `<span class="badge badge-overdue">⚫ Đã quá hạn (${Math.abs(Math.floor(diffHours/24))} ngày)</span>`;
    } else if (diffHours <= 24) {
      statusBadge = `<span class="badge badge-danger">🔴 Hạn hôm nay (${diffHours} giờ)</span>`;
    } else if (diffHours <= 72) {
      statusBadge = `<span class="badge badge-warning">🟡 Sắp đến hạn (${Math.ceil(diffHours/24)} ngày)</span>`;
    } else {
      statusBadge = `<span class="badge badge-safe">🟢 Còn nhiều thời gian (${Math.ceil(diffHours/24)} ngày)</span>`;
    }

    let priorityBadge = "";
    if (t.priority === "urgent") priorityBadge = `<span class="badge badge-danger">Khẩn cấp</span>`;
    else if (t.priority === "high") priorityBadge = `<span class="badge badge-warning">Ưu tiên cao</span>`;
    else priorityBadge = `<span class="badge badge-primary">Bình thường</span>`;

    return `
      <tr>
        <td>
          <input type="checkbox" ${t.status === "completed" ? "checked" : ""} onchange="toggleTaskStatus(${t.id})">
        </td>
        <td>
          <strong style="${t.status === "completed" ? "text-decoration: line-through; color: var(--text-muted);" : ""}">${t.title}</strong>
        </td>
        <td><span class="badge badge-primary">${t.subjectId}</span></td>
        <td>${t.deadline.replace("T", " ")}</td>
        <td>${priorityBadge}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="deleteTask(${t.id})" style="color: var(--status-danger);">Xóa</button>
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
    showToast("Thêm nhiệm vụ thành công!", "success");
  });
}

function toggleTaskStatus(id) {
  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = task.status === "completed" ? "pending" : "completed";
    localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
    renderTasksTable();
    showToast("Cập nhật tiến độ thành công!", "success");
  }
}

function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
  renderTasksTable();
  showToast("Đã xóa nhiệm vụ!", "info");
}

