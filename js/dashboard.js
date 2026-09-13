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

  initAestheticClockAndGreeting();
  renderDashboardStats();
  renderTodaySchedule();
  renderUpcomingDeadlines();
  renderDashboardProgress();
}

function renderDashboardStats() {
  const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [];
  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  const exams = JSON.parse(localStorage.getItem("studymate_exams")) || [];

  // 1. Số môn học & Tổng số tín chỉ
  const subjectsCountElem = document.getElementById("statSubjectsCount");
  const subjectsSubElem = document.getElementById("statSubjectsSub");
  if (subjectsCountElem) subjectsCountElem.textContent = subjects.length;
  if (subjectsSubElem) {
    const totalCredits = subjects.reduce((sum, s) => sum + (parseInt(s.credits) || 3), 0);
    subjectsSubElem.textContent = `${totalCredits} tín chỉ kỳ này`;
  }

  // 2. Nhiệm vụ chưa hoàn thành
  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const pendingTasksElem = document.getElementById("statPendingTasks");
  const pendingTasksSubElem = document.getElementById("statPendingTasksSub");
  if (pendingTasksElem) pendingTasksElem.textContent = pendingTasks.length;
  if (pendingTasksSubElem) {
    pendingTasksSubElem.textContent = pendingTasks.length === 0 ? "Đang kiểm soát tốt" : "Cần ưu tiên hoàn thành";
  }

  // 3. Tiến độ trung bình
  const completedTasks = tasks.filter(t => t.status === "completed");
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const progressElem = document.getElementById("statAvgProgress");
  const progressSubElem = document.getElementById("statProgressSub");
  const progressFill = document.getElementById("statProgressFill");
  if (progressElem) progressElem.textContent = `${progressPercent}%`;
  if (progressSubElem) {
    progressSubElem.textContent = tasks.length > 0 ? `${completedTasks.length}/${tasks.length} task đã làm` : "Tự động tính từ Task";
  }
  if (progressFill) progressFill.style.width = `${progressPercent}%`;

  // 4. Kỳ thi sắp tới (Tính toán thời gian đến ngày thi dựa trên nhập tay của người dùng)
  renderNearestExamStat();
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
    <div class="st-schedule-card">
      <div class="st-schedule-card-top">
        <span class="st-schedule-time">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          ${c.time}
        </span>
        <span class="badge ${c.status === 'Hôm nay' ? 'badge-safe' : 'badge-warning'}" style="font-size: 0.75rem; padding: 0.22rem 0.65rem; white-space: nowrap;">${c.status}</span>
      </div>
      <div class="st-schedule-subject">${c.subject}</div>
      <div class="st-schedule-meta">
        <span class="st-meta-room">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          ${c.room}
        </span>
        <span class="st-meta-sep">•</span>
        <span>${c.teacher}</span>
      </div>
    </div>
  `).join("");
}

function renderUpcomingDeadlines() {
  const container = document.getElementById("upcomingDeadlinesList");
  if (!container) return;

  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  const activeTasks = tasks.filter(t => t.status !== "completed");

  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="st-empty-deadline-box">
        <div class="st-empty-icon-glow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="st-empty-title">Không còn deadline tồn đọng</div>
        <div class="st-empty-desc">Bạn đang kiểm soát rất tốt tiến độ học tập. Thư giãn hoặc lên kế hoạch trước cho tuần tới!</div>
        <button type="button" onclick="openQuickTaskModal()" class="st-action-btn st-action-primary" style="margin-top: 1rem; font-size: 0.825rem; padding: 0.45rem 1.1rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          + Thêm nhiệm vụ mới
        </button>
      </div>
    `;
    return;
  }

  if (activeTasks.length === 0) {
    container.innerHTML = `
      <div class="st-empty-deadline-box">
        <div class="st-empty-icon-glow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="st-empty-title">Đã hoàn thành tất cả!</div>
        <div class="st-empty-desc">Toàn bộ nhiệm vụ đã được giải quyết xong xuôi. Giữ vững phong độ này nhé!</div>
        <button type="button" onclick="openQuickTaskModal()" class="st-action-btn st-action-primary" style="margin-top: 1rem; font-size: 0.825rem; padding: 0.45rem 1.1rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          + Thêm deadline mới
        </button>
      </div>
    `;
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

    const formattedDeadline = task.deadline ? task.deadline.replace("T", " ") : "";

    return `
      <div class="st-schedule-card" style="padding: 0.85rem 1.1rem;">
        <div class="st-schedule-card-top">
          <span style="font-size: 0.75rem; font-weight: 700; color: #a78bfa; background: rgba(139, 92, 246, 0.15); padding: 0.2rem 0.6rem; border-radius: 6px; border: 1px solid rgba(139, 92, 246, 0.3);">
            ${task.subjectId || "CHUNG"}
          </span>
          <span class="badge ${badgeClass}" style="font-size: 0.75rem; padding: 0.22rem 0.65rem;">${badgeText}</span>
        </div>
        <div class="st-schedule-subject" style="font-size: 0.95rem;">${task.title}</div>
        <div class="st-schedule-meta">
          <span>Hạn: ${formattedDeadline}</span>
          <button type="button" onclick="quickCompleteTask('${task.id}')" style="margin-left: auto; background: none; border: none; color: #10b981; font-size: 0.775rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.3rem;" title="Đánh dấu hoàn thành">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Xong
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderDashboardProgress() {
  const container = document.getElementById("dashboardProgressContainer");
  if (!container) return;

  const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [];
  const tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];

  if (subjects.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--theme-text-muted); font-size: 0.85rem;">
        Chưa có môn học nào để tính tiến độ.
      </div>
    `;
    return;
  }

  const gradientFills = [
    "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)",
    "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
    "linear-gradient(90deg, #10b981 0%, #14b8a6 100%)",
    "linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)",
    "linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)"
  ];

  const badgeColors = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f472b6"];

  let html = subjects.slice(0, 3).map((sub, idx) => {
    const subTasks = tasks.filter(t => t.subjectId === sub.id);
    const doneTasks = subTasks.filter(t => t.status === "completed");
    
    // Tính tiến độ thật 100% từ bài tập thực tế của sinh viên (không dùng phần trăm giả)
    const percent = subTasks.length > 0 
      ? Math.round((doneTasks.length / subTasks.length) * 100) 
      : 0;
    
    const taskCountStr = subTasks.length > 0 
      ? `${doneTasks.length}/${subTasks.length} việc` 
      : `0/0 việc`;

    const gradient = gradientFills[idx % gradientFills.length];
    const badgeColor = percent > 0 ? badgeColors[idx % badgeColors.length] : "var(--theme-text-muted)";

    return `
      <div class="st-progress-item">
        <div class="st-progress-item-top">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="st-subject-id-badge">${sub.id}</span>
            <span class="st-progress-subject-name">${sub.name}</span>
          </div>
          <strong style="color: ${badgeColor}; font-size: 0.85rem;">${percent}% <span style="font-weight: 500; opacity: 0.75; font-size: 0.775rem;">(${taskCountStr})</span></strong>
        </div>
        <div class="st-progress-track">
          <div class="st-progress-fill-gradient" style="width: ${percent}%; ${percent > 0 ? `background: ${gradient};` : 'background: transparent;'}"></div>
        </div>
      </div>
    `;
  }).join("");

  if (tasks.length === 0) {
    html += `
      <div style="margin-top: 0.25rem; padding: 0.65rem 0.85rem; border-radius: 10px; background: rgba(255, 255, 255, 0.03); border: 1px dashed var(--theme-border); font-size: 0.8rem; color: var(--theme-text-muted); text-align: center; line-height: 1.5;">
        Chưa có bài tập nào được tạo. Hãy bấm <a href="tasks.html" style="color: var(--theme-primary); font-weight: 600; text-decoration: underline;">+ Thêm Deadline</a> để bắt đầu tính tiến độ nhé!
      </div>
    `;
  }

  container.innerHTML = html;
}

// =========================================================================
// QUẢN LÝ KỲ THI GẦN NHẤT & TÍNH TOÁN ĐẾM NGƯỢC THỜI GIAN
// =========================================================================

function calculateDaysRemaining(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  const targetDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getNearestExam() {
  const exams = JSON.parse(localStorage.getItem("studymate_exams")) || [];
  if (exams.length === 0) return null;

  const examsWithDiff = exams.map(e => ({
    ...e,
    diffDays: calculateDaysRemaining(e.date)
  }));

  // Sắp xếp các kỳ thi sắp tới (diffDays >= 0)
  const upcoming = examsWithDiff.filter(e => e.diffDays !== null && e.diffDays >= 0);
  if (upcoming.length > 0) {
    upcoming.sort((a, b) => a.diffDays - b.diffDays);
    return upcoming[0];
  }

  // Nếu tất cả kỳ thi đã qua
  examsWithDiff.sort((a, b) => b.diffDays - a.diffDays);
  return { ...examsWithDiff[0], isPast: true };
}

function renderNearestExamStat() {
  const examsElem = document.getElementById("statExamsCount");
  const examDetailElem = document.getElementById("statExamDetail");
  const examBadgeElem = document.getElementById("statExamBadge");
  const cardElem = document.getElementById("statExamsCard");

  if (cardElem) {
    cardElem.onclick = () => openExamModal();
    cardElem.style.cursor = "pointer";
  }

  const nearest = getNearestExam();

  if (!nearest) {
    if (examsElem) {
      examsElem.textContent = "Chưa đặt";
      examsElem.style.fontSize = "1.85rem";
      examsElem.style.color = "var(--theme-text-primary)";
    }
    if (examDetailElem) {
      examDetailElem.textContent = "Nhấn để nhập ngày thi";
      examDetailElem.style.color = "var(--theme-text-muted)";
    }
    if (examBadgeElem) {
      examBadgeElem.textContent = "+ Nhập ngày";
      examBadgeElem.className = "badge badge-primary";
    }
  } else if (nearest.isPast) {
    if (examsElem) {
      examsElem.textContent = "Đã kết thúc";
      examsElem.style.fontSize = "1.6rem";
      examsElem.style.color = "var(--theme-text-muted)";
    }
    if (examDetailElem) {
      examDetailElem.textContent = `${nearest.subjectName} (${formatDateDisplay(nearest.date)})`;
      examDetailElem.style.color = "var(--theme-text-muted)";
    }
    if (examBadgeElem) {
      examBadgeElem.textContent = "Đặt kỳ thi mới";
      examBadgeElem.className = "badge badge-warning";
    }
  } else {
    const d = nearest.diffDays;
    let valText = `${d} ngày`;
    if (d === 0) valText = "Hôm nay!";
    else if (d === 1) valText = "1 ngày";

    if (examsElem) {
      examsElem.textContent = valText;
      examsElem.style.fontSize = "2.15rem";
      if (d === 0) {
        examsElem.style.color = "#ef4444";
      } else if (d <= 3) {
        examsElem.style.color = "#f59e0b";
      } else {
        examsElem.style.color = "var(--theme-text-primary)";
      }
    }

    if (examDetailElem) {
      const roomPart = nearest.room ? ` • ${nearest.room}` : '';
      examDetailElem.textContent = `${nearest.subjectName}${roomPart}`;
      examDetailElem.style.color = "var(--theme-text-secondary)";
    }

    if (examBadgeElem) {
      if (d === 0) {
        examBadgeElem.textContent = "Hôm nay";
        examBadgeElem.className = "badge badge-overdue";
      } else if (d <= 3) {
        examBadgeElem.textContent = `Còn ${d} ngày`;
        examBadgeElem.className = "badge badge-warning";
      } else {
        examBadgeElem.textContent = formatDateDisplay(nearest.date);
        examBadgeElem.className = "badge badge-safe";
      }
    }
  }
}

// =========================================================================
// EXAM MODAL CONTROLLER (THIẾT LẬP KỲ THI & TÍNH ĐẾM NGƯỢC THỜI GIAN)
// =========================================================================

function openExamModal(examId) {
  const modal = document.getElementById("examModal");
  if (!modal) return;

  const subjectSelect = document.getElementById("examSubjectSelect");
  const customInput = document.getElementById("examCustomSubjectInput");
  const dateInput = document.getElementById("examDateInput");
  const timeInput = document.getElementById("examTimeInput");
  const roomInput = document.getElementById("examRoomInput");
  const noteInput = document.getElementById("examNoteInput");
  const editIdInput = document.getElementById("examEditId");
  const deleteBtn = document.getElementById("examDeleteBtn");
  const modalTitle = document.getElementById("examModalTitle");

  // Populate subjects
  const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [];
  if (subjectSelect) {
    let optionsHtml = `<option value="">-- Chọn môn học từ kỳ này --</option>`;
    subjects.forEach(sub => {
      optionsHtml += `<option value="${sub.id}">${sub.id} - ${sub.name}</option>`;
    });
    optionsHtml += `<option value="custom">+ Môn thi khác (Nhập tên)...</option>`;
    subjectSelect.innerHTML = optionsHtml;
  }

  const exams = JSON.parse(localStorage.getItem("studymate_exams")) || [];
  let targetExam = null;

  if (examId) {
    targetExam = exams.find(e => String(e.id) === String(examId));
  } else {
    // If no ID passed, try opening the nearest exam if one exists, otherwise empty for new
    const nearest = getNearestExam();
    if (nearest) targetExam = nearest;
  }

  if (targetExam) {
    if (editIdInput) editIdInput.value = targetExam.id;
    if (modalTitle) modalTitle.textContent = "Chỉnh sửa kỳ thi & Ngày thi";
    if (deleteBtn) deleteBtn.style.display = "block";

    // Set subject
    const matchedSubject = subjects.find(s => s.id === targetExam.subjectId || s.name === targetExam.subjectName);
    if (matchedSubject && subjectSelect) {
      subjectSelect.value = matchedSubject.id;
      if (customInput) customInput.style.display = "none";
    } else {
      if (subjectSelect) subjectSelect.value = "custom";
      if (customInput) {
        customInput.style.display = "block";
        customInput.value = targetExam.subjectName || "";
      }
    }

    if (dateInput) dateInput.value = targetExam.date || "";
    if (timeInput) timeInput.value = targetExam.time || "08:00";
    if (roomInput) roomInput.value = targetExam.room || "";
    if (noteInput) noteInput.value = targetExam.note || "";
  } else {
    // New exam
    resetExamFormForNew();
  }

  previewExamCountdown();
  renderSavedExamsList();
  modal.classList.add("active");
}

function resetExamFormForNew() {
  const editIdInput = document.getElementById("examEditId");
  const modalTitle = document.getElementById("examModalTitle");
  const deleteBtn = document.getElementById("examDeleteBtn");
  const subjectSelect = document.getElementById("examSubjectSelect");
  const customInput = document.getElementById("examCustomSubjectInput");
  const dateInput = document.getElementById("examDateInput");
  const timeInput = document.getElementById("examTimeInput");
  const roomInput = document.getElementById("examRoomInput");
  const noteInput = document.getElementById("examNoteInput");

  if (editIdInput) editIdInput.value = "";
  if (modalTitle) modalTitle.textContent = "Thiết lập kỳ thi & Ngày thi";
  if (deleteBtn) deleteBtn.style.display = "none";

  if (subjectSelect) {
    if (subjectSelect.options.length > 1) {
      subjectSelect.selectedIndex = 1;
    } else {
      subjectSelect.selectedIndex = 0;
    }
  }
  if (customInput) {
    customInput.style.display = "none";
    customInput.value = "";
  }

  // Pre-fill tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];
  if (dateInput) dateInput.value = tomorrowStr;
  if (timeInput) timeInput.value = "08:00";
  if (roomInput) roomInput.value = "Phòng 205-B5";
  if (noteInput) noteInput.value = "";

  previewExamCountdown();
}

function closeExamModal() {
  const modal = document.getElementById("examModal");
  if (modal) modal.classList.remove("active");
}

function handleExamSubjectSelectChange() {
  const subjectSelect = document.getElementById("examSubjectSelect");
  const customInput = document.getElementById("examCustomSubjectInput");
  if (!subjectSelect || !customInput) return;

  if (subjectSelect.value === "custom") {
    customInput.style.display = "block";
    customInput.focus();
  } else {
    customInput.style.display = "none";
  }
}

function previewExamCountdown() {
  const dateInput = document.getElementById("examDateInput");
  const previewBox = document.getElementById("examCountdownLivePreview");
  if (!dateInput || !previewBox) return;

  const dateVal = dateInput.value;
  if (!dateVal) {
    previewBox.style.display = "none";
    return;
  }

  const days = calculateDaysRemaining(dateVal);
  if (days === null) {
    previewBox.style.display = "none";
    return;
  }

  previewBox.style.display = "block";
  if (days > 1) {
    previewBox.innerHTML = `Đếm ngược: Còn <strong>${days} ngày</strong> nữa là đến ngày thi (${formatDateDisplay(dateVal)})`;
    previewBox.style.color = "#a78bfa";
    previewBox.style.borderColor = "rgba(139, 92, 246, 0.3)";
  } else if (days === 1) {
    previewBox.innerHTML = `Đếm ngược: <strong>Ngày mai thi!</strong> (Còn 1 ngày - chuẩn bị đầy đủ thẻ SV & dụng cụ thi)`;
    previewBox.style.color = "#f59e0b";
    previewBox.style.borderColor = "rgba(245, 158, 11, 0.3)";
  } else if (days === 0) {
    previewBox.innerHTML = `Đếm ngược: <strong>KỲ THI DIỄN RA HÔM NAY!</strong> Chúc bạn làm bài thật tốt!`;
    previewBox.style.color = "#ef4444";
    previewBox.style.borderColor = "rgba(239, 68, 68, 0.4)";
  } else {
    previewBox.innerHTML = `Lưu ý: Ngày thi này <strong>đã trôi qua ${Math.abs(days)} ngày trước</strong>.`;
    previewBox.style.color = "#94a3b8";
    previewBox.style.borderColor = "rgba(148, 163, 184, 0.3)";
  }
}

function handleExamFormSubmit(event) {
  if (event) event.preventDefault();

  const editId = document.getElementById("examEditId")?.value;
  const subjectSelect = document.getElementById("examSubjectSelect");
  const customInput = document.getElementById("examCustomSubjectInput");
  const dateInput = document.getElementById("examDateInput");
  const timeInput = document.getElementById("examTimeInput");
  const roomInput = document.getElementById("examRoomInput");
  const noteInput = document.getElementById("examNoteInput");

  const dateVal = dateInput ? dateInput.value : "";
  if (!dateVal) {
    alert("Vui lòng chọn ngày thi!");
    return;
  }

  let subjectId = "";
  let subjectName = "";
  const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [];

  if (subjectSelect && subjectSelect.value === "custom") {
    subjectName = customInput ? customInput.value.trim() : "";
    if (!subjectName) {
      alert("Vui lòng nhập tên môn thi!");
      if (customInput) customInput.focus();
      return;
    }
    subjectId = "OTHER";
  } else if (subjectSelect && subjectSelect.value) {
    subjectId = subjectSelect.value;
    const matched = subjects.find(s => s.id === subjectId);
    subjectName = matched ? matched.name : subjectId;
  } else {
    alert("Vui lòng chọn hoặc nhập tên môn thi!");
    return;
  }

  const exams = JSON.parse(localStorage.getItem("studymate_exams")) || [];
  const examData = {
    id: editId ? editId : "exam-" + Date.now(),
    subjectId: subjectId,
    subjectName: subjectName,
    date: dateVal,
    time: timeInput ? (timeInput.value || "08:00") : "08:00",
    room: roomInput ? roomInput.value.trim() : "",
    note: noteInput ? noteInput.value.trim() : ""
  };

  if (editId) {
    const idx = exams.findIndex(e => String(e.id) === String(editId));
    if (idx !== -1) {
      exams[idx] = examData;
    } else {
      exams.push(examData);
    }
  } else {
    exams.push(examData);
  }

  localStorage.setItem("studymate_exams", JSON.stringify(exams));

  renderDashboardStats();
  if (typeof renderExamsTable === "function") {
    renderExamsTable();
  }

  const days = calculateDaysRemaining(dateVal);
  let toastMsg = `Đã lưu lịch thi: ${subjectName}`;
  if (days > 1) toastMsg += ` (Còn ${days} ngày)`;
  else if (days === 1) toastMsg += ` (Ngày mai thi)`;
  else if (days === 0) toastMsg += ` (Hôm nay thi!)`;

  if (typeof showToast === "function") {
    showToast(toastMsg, "success");
  } else {
    alert(toastMsg);
  }

  closeExamModal();
}

function handleDeleteCurrentExam() {
  const editId = document.getElementById("examEditId")?.value;
  if (!editId) return;

  if (!confirm("Bạn có chắc chắn muốn xóa kỳ thi này?")) return;

  let exams = JSON.parse(localStorage.getItem("studymate_exams")) || [];
  exams = exams.filter(e => String(e.id) !== String(editId));
  localStorage.setItem("studymate_exams", JSON.stringify(exams));

  renderDashboardStats();
  if (typeof renderExamsTable === "function") {
    renderExamsTable();
  }

  if (typeof showToast === "function") {
    showToast("Đã xóa kỳ thi thành công.", "info");
  }

  closeExamModal();
}

function renderSavedExamsList() {
  const section = document.getElementById("savedExamsListSection");
  const container = document.getElementById("savedExamsListItems");
  if (!section || !container) return;

  const exams = JSON.parse(localStorage.getItem("studymate_exams")) || [];
  if (exams.length <= 1) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  container.innerHTML = exams.map(e => {
    const d = calculateDaysRemaining(e.date);
    let badgeText = d !== null ? (d > 0 ? `Còn ${d} ngày` : (d === 0 ? "Hôm nay!" : "Đã qua")) : "";
    let badgeColor = d > 3 ? "#10b981" : (d >= 0 ? "#f59e0b" : "#94a3b8");

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; font-size: 0.825rem;">
        <div style="cursor: pointer; flex: 1;" onclick="openExamModal('${e.id}')">
          <span style="font-weight: 600; color: #ffffff;">${e.subjectName}</span>
          <span style="color: #94a3b8; margin-left: 6px;">(${formatDateDisplay(e.date)})</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 0.75rem; font-weight: 600; color: ${badgeColor};">${badgeText}</span>
          <button type="button" onclick="openExamModal('${e.id}')" style="background: none; border: none; color: #60a5fa; cursor: pointer; font-size: 0.75rem;">Sửa</button>
        </div>
      </div>
    `;
  }).join("");
}

// Attach event listener for clicking outside modal to close
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("examModal");
  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === this) {
        closeExamModal();
      }
    });
  }

  const taskModal = document.getElementById("quickTaskModal");
  if (taskModal) {
    taskModal.addEventListener("click", function(e) {
      if (e.target === this) {
        closeQuickTaskModal();
      }
    });
  }
});

// =========================================================================
// AESTHETIC CLOCK & DYNAMIC GREETING ENGINE
// =========================================================================

function initAestheticClockAndGreeting() {
  const clockElem = document.getElementById("liveHeroClock");
  const greetingPrefixElem = document.getElementById("heroGreetingPrefix");
  const greetingNameElem = document.getElementById("heroGreetingName");
  const currentDateElem = document.getElementById("heroCurrentDate");
  const quoteElem = document.getElementById("heroQuote");

  // Get user name
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("studymate_user"));
  } catch(e) {}
  const userName = user && user.name ? user.name : "Sinh viên";
  if (greetingNameElem) greetingNameElem.textContent = userName;

  const quotes = [
    "Tập trung làm chủ từng tiết học hôm nay để kiến tạo thành công ngày mai.",
    "Bắt đầu từ những nhiệm vụ nhỏ nhất, từng bước chinh phục mục tiêu lớn.",
    "Kỷ luật là cầu nối giữa mục tiêu và thành tựu học tập xuất sắc.",
    "Duy trì thói quen học tập đều đặn mỗi ngày là bí quyết của điểm A.",
    "Hoàn thành deadline sớm hôm nay, thảnh thơi trọn vẹn ngày mai."
  ];
  
  if (quoteElem) {
    const quoteIndex = new Date().getDate() % quotes.length;
    quoteElem.textContent = `"${quotes[quoteIndex]}"`;
  }

  function tick() {
    const now = new Date();
    const hours = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, "0");
    const secs = String(now.getSeconds()).padStart(2, "0");
    const formattedHours = String(hours).padStart(2, "0");

    if (clockElem) {
      clockElem.textContent = `${formattedHours}:${mins}:${secs}`;
    }

    if (greetingPrefixElem) {
      if (hours >= 5 && hours < 12) {
        greetingPrefixElem.textContent = "Chào buổi sáng, ";
      } else if (hours >= 12 && hours < 18) {
        greetingPrefixElem.textContent = "Chào buổi chiều, ";
      } else if (hours >= 18 && hours < 23) {
        greetingPrefixElem.textContent = "Chào buổi tối, ";
      } else {
        greetingPrefixElem.textContent = "Cú đêm chăm chỉ, ";
      }
    }

    if (currentDateElem) {
      const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const dayName = days[now.getDay()];
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      currentDateElem.textContent = `${dayName}, ${day}/${month}/${year}`;
    }
  }

  tick();
  setInterval(tick, 1000);
}

function quickCompleteTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  const idx = tasks.findIndex(t => String(t.id) === String(taskId));
  if (idx !== -1) {
    tasks[idx].status = "completed";
    localStorage.setItem("studymate_tasks", JSON.stringify(tasks));
    if (typeof showToast === "function") {
      showToast(`Đã hoàn thành nhiệm vụ "${tasks[idx].title}"!`, "success");
    }
    renderDashboardStats();
    renderUpcomingDeadlines();
    renderDashboardProgress();
  }
}

// =========================================================================
// QUICK TASK / DEADLINE MODAL
// =========================================================================

function openQuickTaskModal() {
  const modal = document.getElementById("quickTaskModal");
  if (!modal) return;

  const select = document.getElementById("quickTaskSubject");
  if (select) {
    const subjects = JSON.parse(localStorage.getItem("studymate_subjects")) || [];
    let html = `<option value="">-- Chọn môn học --</option>`;
    subjects.forEach(s => {
      html += `<option value="${s.id}">${s.id} - ${s.name}</option>`;
    });
    html += `<option value="CHUNG">Môn khác / Việc chung</option>`;
    select.innerHTML = html;
  }

  // Pre-fill tomorrow 23:59
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];
  const dateInput = document.getElementById("quickTaskDeadline");
  if (dateInput) {
    dateInput.value = `${tomorrowDate}T23:59`;
  }

  modal.classList.add("active");
}

function closeQuickTaskModal() {
  const modal = document.getElementById("quickTaskModal");
  if (modal) modal.classList.remove("active");
}

function handleQuickTaskSubmit(event) {
  if (event) event.preventDefault();

  const titleInput = document.getElementById("quickTaskTitle");
  const subjectInput = document.getElementById("quickTaskSubject");
  const deadlineInput = document.getElementById("quickTaskDeadline");
  const priorityInput = document.getElementById("quickTaskPriority");

  const title = titleInput ? titleInput.value.trim() : "";
  const subjectId = subjectInput ? subjectInput.value : "CHUNG";
  const deadline = deadlineInput ? deadlineInput.value : "";
  const priority = priorityInput ? priorityInput.value : "medium";

  if (!title) {
    alert("Vui lòng nhập tên nhiệm vụ hoặc deadline!");
    if (titleInput) titleInput.focus();
    return;
  }

  if (!deadline) {
    alert("Vui lòng chọn thời hạn hoàn thành!");
    return;
  }

  let tasks = JSON.parse(localStorage.getItem("studymate_tasks")) || [];
  const newTask = {
    id: "task-" + Date.now(),
    title: title,
    subjectId: subjectId,
    deadline: deadline,
    priority: priority,
    status: "pending",
    progress: 0,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  localStorage.setItem("studymate_tasks", JSON.stringify(tasks));

  if (titleInput) titleInput.value = "";
  closeQuickTaskModal();

  renderDashboardStats();
  renderUpcomingDeadlines();
  renderDashboardProgress();

  if (typeof showToast === "function") {
    showToast(`Đã thêm deadline: "${title}"`, "success");
  } else {
    alert(`Đã thêm deadline: "${title}"`);
  }
}



