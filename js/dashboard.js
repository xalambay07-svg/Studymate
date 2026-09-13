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
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const progressElem = document.getElementById("statAvgProgress");
  const progressFill = document.getElementById("statProgressFill");
  if (progressElem) progressElem.textContent = `${progressPercent}%`;
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

  if (tasks.length === 0) {
    container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--theme-text-muted); font-size: 0.9rem;">Danh sách đang trống. Bạn chưa có nhiệm vụ hoặc deadline nào. Hãy thêm ở trang <a href="tasks.html" style="color: var(--theme-primary); text-decoration: underline;">Deadline</a>!</div>`;
    return;
  }

  if (activeTasks.length === 0) {
    container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--theme-text-muted); font-size: 0.9rem;">Tuyệt vời! Bạn đã hoàn thành tất cả công việc và deadline.</div>`;
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
});


