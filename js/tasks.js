/**
 * STUDYMATE - TASKS & DEADLINE ENGINE WITH LIVE COUNTDOWN
 * Quản lý danh sách bài tập, deadline, tiểu luận với Live Countdown Timer từng giây
 * Thuật toán tính tiến độ học tập thực tế (Authentic Progress Metrics, 0% bug-free)
 */

let countdownInterval = null;
let currentTaskFilter = "all"; // 'all' | 'pending' | 'completed' | 'high'

document.addEventListener("DOMContentLoaded", () => {
  initSubjectSelect();
  renderTasksTable();
  initTaskForm();
  startLiveCountdownTimer();
});

// Lấy danh sách nhiệm vụ từ StorageService
function getTasksData() {
  if (window.StorageService) {
    return window.StorageService.get(window.STORAGE_KEYS.TASKS, []);
  }
  return JSON.parse(localStorage.getItem("studymate_tasks")) || [];
}

// Lưu danh sách nhiệm vụ
function saveTasksData(tasks) {
  if (window.StorageService) {
    window.StorageService.set(window.STORAGE_KEYS.TASKS, tasks);
  } else {
    localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
  }
}

// Lấy danh sách môn học
function getSubjectsData() {
  if (window.StorageService) {
    return window.StorageService.get(window.STORAGE_KEYS.SUBJECTS, []);
  }
  return JSON.parse(localStorage.getItem("studymate_subjects")) || [];
}

// Khởi tạo dropdown môn học
function initSubjectSelect() {
  const select = document.getElementById("taskSubject");
  if (!select) return;

  const subjects = getSubjectsData();
  select.innerHTML = subjects.map(s => `
    <option value="${s.id}">${s.code || s.id} - ${s.name}</option>
  `).join("");
}

/**
 * THUẬT TOÁN ĐẾM NGƯỢC THỜI GIAN THỰC (COUNTDOWN TIMER)
 * Tính chính xác ngày, giờ, phút, giây còn lại đến hạn nộp
 */
function getTimeRemaining(deadlineStr) {
  const total = Date.parse(deadlineStr) - Date.now();
  const isOverdue = total < 0;
  const absTotal = Math.abs(total);

  const seconds = Math.floor((absTotal / 1000) % 60);
  const minutes = Math.floor((absTotal / 1000 / 60) % 60);
  const hours = Math.floor((absTotal / (1000 * 60 * 60)) % 24);
  const days = Math.floor(absTotal / (1000 * 60 * 60 * 24));

  return {
    total,
    isOverdue,
    days,
    hours,
    minutes,
    seconds
  };
}

// Bắt đầu interval cập nhật đồng hồ đếm ngược mỗi giây
function startLiveCountdownTimer() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    updateAllCountdownBadges();
  }, 1000);
}

// Cập nhật text đếm ngược cho các row đang hiển thị
function updateAllCountdownBadges() {
  const badgeElements = document.querySelectorAll(".live-countdown-badge");
  badgeElements.forEach(el => {
    const deadline = el.getAttribute("data-deadline");
    if (!deadline) return;

    const tr = getTimeRemaining(deadline);
    if (tr.isOverdue) {
      el.className = "badge badge-danger live-countdown-badge";
      el.innerHTML = `⚠️ Quá hạn ${tr.days}d ${tr.hours}h ${tr.minutes}m`;
    } else if (tr.days === 0 && tr.hours < 24) {
      el.className = "badge badge-danger live-countdown-badge";
      el.innerHTML = `🔥 Còn ${tr.hours}h ${tr.minutes}m ${tr.seconds}s`;
    } else if (tr.days <= 3) {
      el.className = "badge badge-warning live-countdown-badge";
      el.innerHTML = `⏳ Còn ${tr.days}d ${tr.hours}h ${tr.minutes}m`;
    } else {
      el.className = "badge badge-safe live-countdown-badge";
      el.innerHTML = `Còn ${tr.days} ngày ${tr.hours}h`;
    }
  });
}

/**
 * THUẬT TOÁN TÍNH TIẾN ĐỘ HOÀN THÀNH THỰC TẾ (AUTHENTIC PROGRESS)
 * Tuyệt đối không hiển thị % ảo (chuẩn 0% khi chưa làm bài)
 */
function calculateAuthenticProgress(tasks) {
  if (!tasks || tasks.length === 0) {
    return { percent: 0, completedCount: 0, totalCount: 0, text: "Chưa có nhiệm vụ nào" };
  }

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed === true || t.status === "completed").length;
  const percent = Math.round((completedCount / totalCount) * 100);

  return {
    percent,
    completedCount,
    totalCount,
    text: `${percent}% hoàn thành (${completedCount}/${totalCount} bài)`
  };
}

// Cập nhật thanh tiến độ tổng quát
function updateProgressHeaderWidget() {
  const tasks = getTasksData();
  const progress = calculateAuthenticProgress(tasks);

  const progressElem = document.getElementById("taskGlobalProgressText");
  const progressFill = document.getElementById("taskGlobalProgressBar");

  if (progressElem) {
    progressElem.textContent = progress.text;
  }
  if (progressFill) {
    progressFill.style.width = `${progress.percent}%`;
    progressFill.style.transition = "width 0.4s ease";
  }
}

// Lọc nhiệm vụ
window.setTaskFilter = function(filter) {
  currentTaskFilter = filter;
  document.querySelectorAll(".task-filter-btn").forEach(btn => {
    if (btn.getAttribute("data-filter") === filter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  renderTasksTable();
};

// Render Bảng Nhiệm vụ
function renderTasksTable() {
  const tableBody = document.getElementById("tasksTableBody");
  if (!tableBody) return;

  const tasks = getTasksData();
  const subjects = getSubjectsData();
  const subjectMap = {};
  subjects.forEach(s => {
    subjectMap[s.id] = s;
    if (s.code) subjectMap[s.code] = s;
  });

  updateProgressHeaderWidget();

  if (tasks.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem 1.5rem; color: var(--theme-text-muted);">
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--theme-text-primary); margin-bottom: 0.35rem;">
            Danh sách bài tập đang trống
          </div>
          <div style="font-size: 0.85rem; color: var(--theme-text-muted); max-width: 460px; margin: 0 auto; line-height: 1.5;">
            Tiến độ hiện tại là <strong>0%</strong>. Hãy bấm <strong>+ Thêm bài tập mới</strong> để bắt đầu quản lý và đếm ngược deadline!
          </div>
        </td>
      </tr>
    `;
    return;
  }

  // Lọc theo currentTaskFilter
  let filteredTasks = tasks.filter(t => {
    const isDone = t.completed === true || t.status === "completed";
    if (currentTaskFilter === "pending") return !isDone;
    if (currentTaskFilter === "completed") return isDone;
    if (currentTaskFilter === "high") return t.priority === "high" || t.priority === "urgent";
    return true;
  });

  // Sắp xếp: Deadline gần nhất lên đầu
  filteredTasks.sort((a, b) => {
    const timeA = new Date(a.deadlineDate || a.deadline || "2099-01-01").getTime();
    const timeB = new Date(b.deadlineDate || b.deadline || "2099-01-01").getTime();
    return timeA - timeB;
  });

  tableBody.innerHTML = filteredTasks.map(t => {
    const isDone = t.completed === true || t.status === "completed";
    const deadlineVal = t.deadlineDate || t.deadline || "2026-09-30T23:59:00";
    const sub = subjectMap[t.subjectId] || { name: t.subjectName || "Môn học", code: t.subjectCode || "TLU", colorHex: "#2563EB" };

    let priorityBadge = `<span class="badge badge-primary">Thường</span>`;
    if (t.priority === "high" || t.priority === "urgent") {
      priorityBadge = `<span class="badge badge-danger" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35);">🔥 Khẩn cấp</span>`;
    } else if (t.priority === "medium") {
      priorityBadge = `<span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.35);">⚡ Quan trọng</span>`;
    }

    const formattedDeadline = deadlineVal.replace("T", " ");

    return `
      <tr style="${isDone ? 'opacity: 0.65; background: rgba(255,255,255,0.01);' : ''}">
        <td style="text-align: center; width: 45px;">
          <input type="checkbox" ${isDone ? "checked" : ""} onchange="toggleTaskStatus('${t.id}')" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--theme-primary);">
        </td>
        <td>
          <div style="${isDone ? 'text-decoration: line-through; color: var(--theme-text-muted);' : 'font-weight: 700; color: var(--theme-text-primary);'} font-size: 0.925rem;">
            ${t.title}
          </div>
          ${t.notes ? `<div style="font-size: 0.775rem; color: var(--theme-text-muted); margin-top: 2px;">📝 ${t.notes}</div>` : ''}
        </td>
        <td>
          <span style="font-size: 0.75rem; font-weight: 700; color: ${sub.colorHex}; background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
            ${sub.code}
          </span>
        </td>
        <td style="font-size: 0.825rem; color: var(--theme-text-secondary); white-space: nowrap;">
          ${formattedDeadline}
        </td>
        <td>${priorityBadge}</td>
        <td>
          <span class="live-countdown-badge" data-deadline="${deadlineVal}">
            Đang tính...
          </span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button type="button" class="st-pill-btn" onclick="deleteTask('${t.id}')" style="color: #ef4444; border-color: rgba(239,68,68,0.3); padding: 0.25rem 0.65rem; font-size: 0.75rem;">
            Xóa
          </button>
        </td>
      </tr>
    `;
  }).join("");

  updateAllCountdownBadges();
}

// Bật tắt trạng thái Hoàn thành
window.toggleTaskStatus = function(taskId) {
  const tasks = getTasksData();
  const task = tasks.find(t => String(t.id) === String(taskId));
  if (task) {
    const newStatus = !(task.completed === true || task.status === "completed");
    task.completed = newStatus;
    task.status = newStatus ? "completed" : "pending";
    task.progressPercent = newStatus ? 100 : 0;
    saveTasksData(tasks);

    if (newStatus && typeof showToast === "function") {
      showToast("🎉 Xuất sắc! Bạn đã hoàn thành thêm một bài tập.", "success");
    }
    renderTasksTable();
  }
};

// Xóa bài tập
window.deleteTask = function(taskId) {
  if (confirm("Bạn có chắc muốn xóa bài tập này khỏi danh sách?")) {
    const tasks = getTasksData();
    const filtered = tasks.filter(t => String(t.id) !== String(taskId));
    saveTasksData(filtered);
    if (typeof showToast === "function") showToast("Đã xóa bài tập!", "info");
    renderTasksTable();
  }
};

// Khởi tạo Form Thêm bài tập
function initTaskForm() {
  const form = document.getElementById("formAddTask") || document.getElementById("addTaskForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value.trim();
    const subjectId = document.getElementById("taskSubject").value;
    const deadlineDate = document.getElementById("taskDeadline").value;
    const priority = document.getElementById("taskPriority").value;
    const notes = document.getElementById("taskNotes") ? document.getElementById("taskNotes").value.trim() : "";

    if (!title || !deadlineDate) {
      if (typeof showToast === "function") showToast("Vui lòng điền đủ tên bài tập và hạn nộp!", "warning");
      return;
    }

    const tasks = getTasksData();
    const newTask = {
      id: "tsk_" + Date.now(),
      subjectId: subjectId,
      title: title,
      deadlineDate: deadlineDate,
      priority: priority,
      completed: false,
      status: "pending",
      notes: notes,
      progressPercent: 0
    };

    tasks.push(newTask);
    saveTasksData(tasks);

    form.reset();
    initSubjectSelect();
    if (typeof showToast === "function") showToast("Đã thêm bài tập mới kèm đếm ngược deadline!", "success");
    renderTasksTable();
  });
}

// Thiết lập bộ lọc danh sách bài tập
window.setTaskFilter = function(filter, btnElem) {
  currentTaskFilter = filter;
  if (btnElem) {
    document.querySelectorAll(".task-filter-btn").forEach(b => {
      b.classList.remove("badge-primary", "active");
      b.style.background = "rgba(255,255,255,0.08)";
      b.style.color = "var(--theme-text-secondary)";
    });
    btnElem.classList.add("badge-primary", "active");
    btnElem.style.background = "var(--theme-primary)";
    btnElem.style.color = "#ffffff";
  }
  renderTasksTable();
};

// Gắn toàn cục
if (typeof window !== "undefined") {
  window.renderTasksTable = renderTasksTable;
  window.calculateAuthenticProgress = calculateAuthenticProgress;
}
