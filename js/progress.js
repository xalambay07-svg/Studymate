/**
 * STUDYMATE - PROGRESS SCRIPT
 * Tự động tính toán tiến độ học tập môn học:
 * Tiến độ (%) = (Nhiệm vụ đã hoàn thành / Tổng số nhiệm vụ của môn) * 100
 */

document.addEventListener("DOMContentLoaded", () => {
  renderProgressOverview();
});

function renderProgressOverview() {
  const container = document.getElementById("progressListContainer");
  if (!container) return;

  const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [];
  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];

  if (subjects.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted);">Chưa có dữ liệu môn học để tính tiến độ.</p>`;
    return;
  }

  container.innerHTML = subjects.map(sub => {
    // Lọc các task thuộc môn học này
    const subTasks = tasks.filter(t => t.subjectId === sub.id);
    const total = subTasks.length;
    const completed = subTasks.filter(t => t.status === "completed").length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    let badgeStatus = "badge-primary";
    if (percent >= 80) badgeStatus = "badge-safe";
    else if (percent <= 30) badgeStatus = "badge-warning";

    return `
      <div class="card" style="margin-bottom: 1.25rem;">
        <div class="card-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div>
              <h4 style="font-size: 1.1rem; font-weight: 700;">${sub.name} (${sub.id})</h4>
              <p style="color: var(--text-muted); font-size: 0.8125rem;">👨‍🏫 ${sub.teacher} • ${sub.credits} tín chỉ</p>
            </div>
            <div style="text-align: right;">
              <span class="badge ${badgeStatus}" style="font-size: 0.9rem;">${percent}% Hoàn thành</span>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">${completed} / ${total} nhiệm vụ</div>
            </div>
          </div>
          
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.5rem;">
            <span>Chưa hoàn thành: <strong>${total - completed}</strong> việc</span>
            <a href="tasks.html" style="font-weight: 600;">Xem chi tiết nhiệm vụ &rarr;</a>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
