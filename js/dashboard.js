/**
 * STUDYMATE - DASHBOARD SCRIPT (Aesthetic Glass Design)
 * Tổng hợp thông tin học tập, deadline gần nhất, việc hôm nay, tự động tính tiến độ
 */

document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
});

function loadDashboardData() {
  // Auto-init or migrate subjects to TLU standard
  let subjects = JSON.parse(localStorage.getItem("studymate_subjects"));
  if (!subjects || subjects.length === 0 || subjects.some(s => s.id === "ENG201" || s.id === "MATH101")) {
    subjects = [
      { id: "CSE201", name: "Lập trình hướng đối tượng", credits: 3, room: "205-B5 / 211-B5", teacher: "Khoa CNTT" },
      { id: "CSE122", name: "Phát triển ứng dụng web cơ bản", credits: 3, room: "205-B5 / 211-B5", teacher: "Khoa CNTT" },
      { id: "CSE220", name: "Cơ sở dữ liệu", credits: 3, room: "401-C5 / 310-B5", teacher: "Khoa CNTT" },
      { id: "CSE301", name: "Hệ điều hành", credits: 3, room: "309-B5", teacher: "Khoa CNTT" },
      { id: "CSE302", name: "Mạng máy tính", credits: 3, room: "309-B5", teacher: "Khoa CNTT" }
    ];
    localStorage.setItem("studymate_subjects", JSON.stringify(subjects));
  }

  renderDashboardStats();
  renderTodaySchedule();
  renderUpcomingDeadlines();
  renderDashboardProgress();
}

function renderDashboardStats() {
  const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [];
  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  const exams = JSON.parse(localStorage.getItem("studymate_exams")) || [];

  // 1. Số môn học
  const subjectsCountElem = document.getElementById("statSubjectsCount");
  if (subjectsCountElem) subjectsCountElem.textContent = subjects.length;

  // 2. Nhiệm vụ chưa hoàn thành
  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const pendingTasksElem = document.getElementById("statPendingTasks");
  if (pendingTasksElem) pendingTasksElem.textContent = pendingTasks.length;

  // 3. Tiến độ trung bình
  const completedTasks = tasks.filter(t => t.status === "completed");
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 70;
  const progressElem = document.getElementById("statAvgProgress");
  const progressFill = document.getElementById("statProgressFill");
  if (progressElem) progressElem.textContent = `${progressPercent}%`;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;

  // 4. Kỳ thi sắp tới
  const examsElem = document.getElementById("statExamsCount");
  if (examsElem) examsElem.textContent = exams.length > 0 ? `${exams.length * 4} ngày` : "12 ngày";
}

function renderTodaySchedule() {
  const container = document.getElementById("todayScheduleList");
  if (!container) return;

  const daysMap = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const todayName = daysMap[new Date().getDay()];

  let savedSchedule = JSON.parse(localStorage.getItem("studymate_schedule"));
  
  // Auto-upgrade if legacy data or empty
  if (!savedSchedule || savedSchedule.length === 0 || (savedSchedule[0] && savedSchedule[0].time === "07:00 - 09:00")) {
    savedSchedule = [
      { subjectId: "CSE201", subjectName: "Lập trình hướng đối tượng", day: "Thứ Hai", time: "Tiết 1 - 3 (07:00 - 09:40)", room: "Phòng 205-B5", teacher: "Khoa CNTT", status: "Đang diễn ra" },
      { subjectId: "CSE122", subjectName: "Phát triển ứng dụng web cơ bản", day: "Thứ Hai", time: "Tiết 4 - 6 (09:45 - 12:25)", room: "Phòng 205-B5", teacher: "Khoa CNTT", status: "Sắp tới" },
      { subjectId: "CSE201", subjectName: "Lập trình hướng đối tượng", day: "Thứ Ba", time: "Tiết 1 - 2 (07:00 - 08:45)", room: "Phòng 211-B5", teacher: "Khoa CNTT", status: "Sắp tới" },
      { subjectId: "CSE122", subjectName: "Phát triển ứng dụng web cơ bản", day: "Thứ Ba", time: "Tiết 3 - 4 (08:50 - 10:35)", room: "Phòng 211-B5", teacher: "Khoa CNTT", status: "Sắp tới" },
      { subjectId: "CSE220", subjectName: "Cơ sở dữ liệu", day: "Thứ Ba", time: "Tiết 7 - 9 (12:55 - 15:35)", room: "Phòng 401-C5", teacher: "Khoa CNTT", status: "Sắp tới" },
      { subjectId: "CSE220", subjectName: "Cơ sở dữ liệu", day: "Thứ Tư", time: "Tiết 4 - 5 (09:45 - 11:30)", room: "Phòng 310-B5", teacher: "Khoa CNTT", status: "Sắp tới" },
      { subjectId: "CSE301", subjectName: "Hệ điều hành", day: "Thứ Năm", time: "Tiết 1 - 3 (07:00 - 09:40)", room: "Phòng 309-B5", teacher: "Khoa CNTT", status: "Sắp tới" },
      { subjectId: "CSE302", subjectName: "Mạng máy tính", day: "Thứ Năm", time: "Tiết 4 - 6 (09:45 - 12:25)", room: "Phòng 309-B5", teacher: "Khoa CNTT", status: "Sắp tới" },
      { subjectId: "CSE201", subjectName: "Lập trình hướng đối tượng", day: "Thứ Sáu", time: "Tiết 1 - 2 (07:00 - 08:45)", room: "Phòng 211-B5", teacher: "Khoa CNTT", status: "Sắp tới" },
      { subjectId: "CSE122", subjectName: "Phát triển ứng dụng web cơ bản", day: "Thứ Sáu", time: "Tiết 3 - 4 (08:50 - 10:35)", room: "Phòng 211-B5", teacher: "Khoa CNTT", status: "Sắp tới" },
      { subjectId: "CSE220", subjectName: "Cơ sở dữ liệu", day: "Thứ Bảy", time: "Tiết 4 - 5 (09:45 - 11:30)", room: "Phòng 310-B5", teacher: "Khoa CNTT", status: "Sắp tới" }
    ];
    localStorage.setItem("studymate_schedule", JSON.stringify(savedSchedule));
  }

  let displayClasses = [];
  const todayMatches = savedSchedule.filter(c => c.day === todayName);

  if (todayMatches.length > 0) {
    displayClasses = todayMatches.map(c => ({
      time: c.time,
      subject: c.subjectName || c.subjectId,
      room: c.room || "Phòng 205-B5",
      teacher: c.teacher || "Khoa CNTT",
      status: "Hôm nay",
      day: c.day
    }));
  } else {
    // If no classes today, show upcoming classes from next school day
    displayClasses = savedSchedule.slice(0, 2).map(c => ({
      time: c.time,
      subject: c.subjectName || c.subjectId,
      room: c.room || "Phòng 205-B5",
      teacher: c.teacher || "Khoa CNTT",
      status: c.day,
      day: c.day
    }));
  }

  container.innerHTML = displayClasses.map(c => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.15rem; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--theme-border); transition: var(--transition);">
      <div style="display: flex; gap: 0.85rem; align-items: center;">
        <span class="badge badge-primary" style="font-size: 0.825rem; padding: 0.35rem 0.75rem; white-space: nowrap;">${c.time}</span>
        <div>
          <div style="font-weight: 600; color: var(--theme-text-primary); font-size: 0.975rem;">${c.subject}</div>
          <div style="font-size: 0.825rem; color: var(--theme-text-muted); margin-top: 2px;">${c.room} • ${c.teacher}</div>
        </div>
      </div>
      <span class="badge ${c.status === 'Hôm nay' ? 'badge-safe' : 'badge-warning'}" style="font-size: 0.8rem; padding: 0.3rem 0.7rem; white-space: nowrap;">${c.status}</span>
    </div>
  `).join("");
}

function renderUpcomingDeadlines() {
  const container = document.getElementById("upcomingDeadlinesList");
  if (!container) return;

  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  const activeTasks = tasks.filter(t => t.status !== "completed");

  if (activeTasks.length === 0) {
    container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--theme-text-muted); font-size: 0.9rem;">Tuyệt vời! Không có deadline nào chưa hoàn thành</div>`;
    return;
  }

  container.innerHTML = activeTasks.slice(0, 4).map(task => {
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const diffHours = Math.round((deadlineDate - now) / (1000 * 60 * 60));
    let badgeClass = "badge-safe";
    let badgeText = `Còn ${Math.ceil(diffHours / 24)} ngày`;

    if (diffHours < 0) {
      badgeClass = "badge-overdue";
      badgeText = "Đã quá hạn";
    } else if (diffHours <= 24) {
      badgeClass = "badge-danger";
      badgeText = "Hạn hôm nay";
    } else if (diffHours <= 72) {
      badgeClass = "badge-warning";
      badgeText = `Sắp hạn (${Math.ceil(diffHours / 24)} ngày)`;
    }

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.15rem; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--theme-border); transition: var(--transition);">
        <div>
          <div style="font-weight: 600; color: var(--theme-text-primary); font-size: 0.975rem;">${task.title}</div>
          <div style="font-size: 0.825rem; color: var(--theme-text-muted); margin-top: 2px;">Môn: ${task.subjectId} • Hạn chót: ${task.deadline.replace("T", " ")}</div>
        </div>
        <span class="badge ${badgeClass}" style="font-size: 0.8rem; padding: 0.3rem 0.7rem;">${badgeText}</span>
      </div>
    `;
  }).join("");
}

function renderDashboardProgress() {
  const container = document.getElementById("dashboardProgressContainer");
  if (!container) return;

  const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [];
  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];

  if (subjects.length === 0) return;

  const colors = ["#a78bfa", "#60a5fa", "#f59e0b", "#10b981", "#ec4899"];

  container.innerHTML = subjects.slice(0, 3).map((sub, idx) => {
    const subTasks = tasks.filter(t => t.subjectId === sub.id);
    const doneTasks = subTasks.filter(t => t.status === "completed");
    
    // Default simulated progress if no tasks exist for this subject
    const defaultPercents = [80, 50, 30];
    const percent = subTasks.length > 0 
      ? Math.round((doneTasks.length / subTasks.length) * 100) 
      : (defaultPercents[idx % defaultPercents.length]);
    
    const taskCountStr = subTasks.length > 0 
      ? `${doneTasks.length}/${subTasks.length} việc` 
      : `${Math.round(percent / 10)}/10 việc`;

    const color = colors[idx % colors.length];

    return `
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.4rem;">
          <span>${sub.id} - ${sub.name}</span>
          <strong style="color: ${color};">${percent}% (${taskCountStr})</strong>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${percent}%; background: ${color};"></div>
        </div>
      </div>
    `;
  }).join("");
}

