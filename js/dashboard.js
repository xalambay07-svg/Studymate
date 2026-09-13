/**
 * STUDYMATE - DASHBOARD SCRIPT
 * Tổng hợp thông tin học tập, deadline gần nhất, việc hôm nay, tự động tính tiến độ
 */

document.addEventListener("DOMContentLoaded", () => {
  renderDashboardStats();
  renderTodaySchedule();
  renderUpcomingDeadlines();
});

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
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const progressElem = document.getElementById("statAvgProgress");
  const progressFill = document.getElementById("statProgressFill");
  if (progressElem) progressElem.textContent = `${progressPercent}%`;
  if (progressFill) progressFill.style.width = `${progressPercent}%`;

  // 4. Kỳ thi sắp tới
  const examsElem = document.getElementById("statExamsCount");
  if (examsElem) examsElem.textContent = exams.length;
}

function renderTodaySchedule() {
  const container = document.getElementById("todayScheduleList");
  if (!container) return;

  const todayClasses = [
    { time: "07:00 - 09:00", subject: "Phát triển ứng dụng web cơ bản (CSE122)", room: "Phòng A203", teacher: "ThS. Nguyễn Văn A" },
    { time: "09:15 - 11:30", subject: "Cấu trúc dữ liệu và giải thuật (CSE281)", room: "Phòng B102", teacher: "TS. Trần Thị B" }
  ];

  container.innerHTML = todayClasses.map(c => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid var(--border-color);">
      <div style="display: flex; gap: 1rem; align-items: center;">
        <span class="badge badge-primary" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">${c.time}</span>
        <div>
          <div style="font-weight: 600; color: var(--text-main);">${c.subject}</div>
          <div style="font-size: 0.8125rem; color: var(--text-muted);">🏛️ ${c.room} • 👨‍🏫 ${c.teacher}</div>
        </div>
      </div>
      <span class="badge badge-safe">Đang diễn ra</span>
    </div>
  `).join("");
}

function renderUpcomingDeadlines() {
  const container = document.getElementById("upcomingDeadlinesList");
  if (!container) return;

  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  const activeTasks = tasks.filter(t => t.status !== "completed");

  if (activeTasks.length === 0) {
    container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">Tuyệt vời! Không có deadline nào chưa hoàn thành 🎉</div>`;
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
      badgeText = "Hạn hôm nay / Rất gần!";
    } else if (diffHours <= 72) {
      badgeClass = "badge-warning";
      badgeText = `Sắp đến hạn (${Math.ceil(diffHours / 24)} ngày)`;
    }

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 0; border-bottom: 1px solid var(--border-color);">
        <div>
          <div style="font-weight: 600;">${task.title}</div>
          <div style="font-size: 0.8125rem; color: var(--text-muted);">Môn: ${task.subjectId} • Hạn chót: ${task.deadline.replace("T", " ")}</div>
        </div>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
    `;
  }).join("");
}
