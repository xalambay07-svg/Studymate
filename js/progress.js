/**
 * STUDYMATE - PROGRESS SCRIPT (Aesthetic Glass)
 * Tự động tính toán tiến độ học tập: Tiến độ (%) = (Nhiệm vụ đã hoàn thành / Tổng số nhiệm vụ của môn) * 100
 */

document.addEventListener("DOMContentLoaded", () => {
  renderProgressOverview();
});

function renderProgressOverview() {
  const container = document.getElementById("progressListContainer");
  if (!container) return;

  const subjects = (window.StorageService ? window.StorageService.get(window.STORAGE_KEYS.SUBJECTS) : null) ||
                   JSON.parse(localStorage.getItem("studymate_subjects")) || [];
  const tasks = (window.StorageService ? window.StorageService.get(window.STORAGE_KEYS.TASKS) : null) ||
                JSON.parse(localStorage.getItem("studymate_tasks")) || [];

  if (subjects.length === 0) {
    container.innerHTML = `<div class="st-card" style="text-align: center; padding: 2rem; color: var(--theme-text-muted);">Chưa có dữ liệu môn học để tính tiến độ.</div>`;
    return;
  }

  container.innerHTML = subjects.map(sub => {
    const subCode = sub.code || sub.id;
    const subTasks = tasks.filter(t => t.subjectId === sub.id || t.subjectId === sub.code);
    const total = subTasks.length;
    const completed = subTasks.filter(t => t.completed === true || t.status === "completed").length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const colorHex = sub.colorHex || "#2563EB";

    let badgeStatus = "badge-primary";
    let badgeText = `${percent}% Hoàn thành`;
    if (total === 0) {
      badgeStatus = "badge-safe";
      badgeText = "0% (Chưa có bài tập)";
    } else if (percent >= 80) {
      badgeStatus = "badge-safe";
    } else if (percent <= 30) {
      badgeStatus = "badge-warning";
    }

    return `
      <div class="st-card" style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h4 style="font-size: 1.05rem; font-weight: 600; color: var(--theme-text-primary);">${sub.name} (${subCode})</h4>
            <p style="color: var(--theme-text-muted); font-size: 0.8125rem;">${sub.teacher} • ${sub.credits || 3} tín chỉ • Phòng: ${sub.room || "Chưa xếp"}</p>
          </div>
          <div style="text-align: right;">
            <span class="badge ${badgeStatus}">${badgeText}</span>
            <div style="font-size: 0.75rem; color: var(--theme-text-muted); margin-top: 0.25rem;">${completed} / ${total} nhiệm vụ</div>
          </div>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${percent}%; background: ${percent === 0 ? 'rgba(255,255,255,0.1)' : colorHex};"></div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: var(--theme-text-secondary); margin-top: 0.65rem;">
          <span>Chưa hoàn thành: <strong>${total - completed}</strong> bài tập</span>
          <a href="tasks.html" style="font-weight: 500; color: var(--theme-primary);">Xem nhiệm vụ &rarr;</a>
        </div>
      </div>
    `;
  }).join("");
}

