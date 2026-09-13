/**
 * STUDYMATE - SCHEDULE SCRIPT (TLU Standard Timetable)
 * Hệ thống hiển thị thời khóa biểu chuẩn 15 tiết học Đại học Thủy Lợi (sinhvien1.tlu.edu.vn)
 * Hỗ trợ chế độ xem Bảng Tuần (Matrix với Rowspan) và Thẻ Timeline danh sách
 */

const TLU_PERIODS = [
  { period: 1, time: "07:00 ➔ 07:50", label: "Tiết 1" },
  { period: 2, time: "07:55 ➔ 08:45", label: "Tiết 2" },
  { period: 3, time: "08:50 ➔ 09:40", label: "Tiết 3" },
  { period: 4, time: "09:45 ➔ 10:35", label: "Tiết 4" },
  { period: 5, time: "10:40 ➔ 11:30", label: "Tiết 5" },
  { period: 6, time: "11:35 ➔ 12:25", label: "Tiết 6" },
  { period: 7, time: "12:55 ➔ 13:45", label: "Tiết 7" },
  { period: 8, time: "13:50 ➔ 14:40", label: "Tiết 8" },
  { period: 9, time: "14:45 ➔ 15:35", label: "Tiết 9" },
  { period: 10, time: "15:40 ➔ 16:30", label: "Tiết 10" },
  { period: 11, time: "16:35 ➔ 17:25", label: "Tiết 11" },
  { period: 12, time: "17:30 ➔ 18:20", label: "Tiết 12" },
  { period: 13, time: "18:50 ➔ 19:40", label: "Tiết 13" },
  { period: 14, time: "19:45 ➔ 20:35", label: "Tiết 14" },
  { period: 15, time: "20:40 ➔ 21:30", label: "Tiết 15" }
];

const TLU_DAYS = [
  { key: "Thứ Hai", name: "Thứ hai" },
  { key: "Thứ Ba", name: "Thứ ba" },
  { key: "Thứ Tư", name: "Thứ tư" },
  { key: "Thứ Năm", name: "Thứ năm" },
  { key: "Thứ Sáu", name: "Thứ sáu" },
  { key: "Thứ Bảy", name: "Thứ bảy" },
  { key: "Chủ Nhật", name: "Chủ nhật" }
];

// 11 ca học chuẩn tuần 3 TLU từ thời khóa biểu thực tế của sinh viên
const DEFAULT_TLU_CLASSES = [
  // Thứ hai
  { day: "Thứ Hai", startPeriod: 1, span: 3, name: "Lập trình hướng đối tượng", code: "CSE201", room: "205-B5", teacher: "Khoa CNTT", time: "07:00 - 09:40" },
  { day: "Thứ Hai", startPeriod: 4, span: 3, name: "Phát triển ứng dụng web cơ bản", code: "CSE122", room: "205-B5", teacher: "Khoa CNTT", time: "09:45 - 12:25" },
  // Thứ ba
  { day: "Thứ Ba", startPeriod: 1, span: 2, name: "Lập trình hướng đối tượng", code: "CSE201", room: "211-B5", teacher: "Khoa CNTT", time: "07:00 - 08:45" },
  { day: "Thứ Ba", startPeriod: 3, span: 2, name: "Phát triển ứng dụng web cơ bản", code: "CSE122", room: "211-B5", teacher: "Khoa CNTT", time: "08:50 - 10:35" },
  { day: "Thứ Ba", startPeriod: 7, span: 3, name: "Cơ sở dữ liệu", code: "CSE220", room: "401-C5", teacher: "Khoa CNTT", time: "12:55 - 15:35" },
  // Thứ tư
  { day: "Thứ Tư", startPeriod: 4, span: 2, name: "Cơ sở dữ liệu", code: "CSE220", room: "310-B5", teacher: "Khoa CNTT", time: "09:45 - 11:30" },
  // Thứ năm
  { day: "Thứ Năm", startPeriod: 1, span: 3, name: "Hệ điều hành", code: "CSE301", room: "309-B5", teacher: "Khoa CNTT", time: "07:00 - 09:40" },
  { day: "Thứ Năm", startPeriod: 4, span: 3, name: "Mạng máy tính", code: "CSE302", room: "309-B5", teacher: "Khoa CNTT", time: "09:45 - 12:25" },
  // Thứ sáu
  { day: "Thứ Sáu", startPeriod: 1, span: 2, name: "Lập trình hướng đối tượng", code: "CSE201", room: "211-B5", teacher: "Khoa CNTT", time: "07:00 - 08:45" },
  { day: "Thứ Sáu", startPeriod: 3, span: 2, name: "Phát triển ứng dụng web cơ bản", code: "CSE122", room: "211-B5", teacher: "Khoa CNTT", time: "08:50 - 10:35" },
  // Thứ bảy
  { day: "Thứ Bảy", startPeriod: 4, span: 2, name: "Cơ sở dữ liệu", code: "CSE220", room: "310-B5", teacher: "Khoa CNTT", time: "09:45 - 11:30" }
];

let currentViewMode = "table";

document.addEventListener("DOMContentLoaded", () => {
  updateScheduleStudentInfo();
  initScheduleView();
  initOcrUpload();
  initTextParser();
});

function updateScheduleStudentInfo() {
  const elem = document.getElementById("scheduleStudentName");
  if (!elem) return;
  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem("studymate_user") || localStorage.getItem("studymate_user"));
  } catch(e) {}
  const userName = (user && user.name && user.name.trim()) ? user.name.trim() : "Sinh viên";
  elem.textContent = userName;
}

function setScheduleViewMode(mode) {
  currentViewMode = mode;
  const btnTable = document.getElementById("btnModeTable");
  const btnCards = document.getElementById("btnModeCards");

  if (btnTable && btnCards) {
    if (mode === "table") {
      btnTable.className = "st-pill-btn active";
      btnTable.style.background = "";
      btnTable.style.color = "";
      btnCards.className = "st-pill-btn";
      btnCards.style.background = "none";
      btnCards.style.color = "var(--theme-text-secondary)";
    } else {
      btnCards.className = "st-pill-btn active";
      btnCards.style.background = "";
      btnCards.style.color = "";
      btnTable.className = "st-pill-btn";
      btnTable.style.background = "none";
      btnTable.style.color = "var(--theme-text-secondary)";
    }
  }

  initScheduleView();
}

function initScheduleView() {
  const container = document.getElementById("scheduleGrid");
  if (!container) return;

  if (currentViewMode === "table") {
    renderTableView(container);
  } else {
    renderCardsView(container);
  }
}

// Chế độ 1: Bảng ma trận Tuần chuẩn TLU (Giống giao diện sinhvien1.tlu.edu.vn)
function renderTableView(container) {
  const covered = {};
  TLU_DAYS.forEach(d => { covered[d.key] = {}; });

  let html = `
    <div class="st-card" style="padding: 0; overflow: hidden; border: 1px solid var(--theme-border);">
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 900px;">
          <thead>
            <tr style="background: rgba(255,255,255,0.04); border-bottom: 2px solid var(--theme-border);">
              <th style="padding: 0.85rem 1rem; width: 140px; font-weight: 600; color: var(--theme-text-secondary); font-size: 0.825rem; border-right: 1px solid var(--theme-border);">
                Tiết / Giờ học
              </th>
  `;

  TLU_DAYS.forEach(d => {
    html += `
      <th style="padding: 0.85rem 1rem; font-weight: 600; color: var(--theme-text-primary); font-size: 0.875rem; border-right: 1px solid var(--theme-border); text-align: center;">
        ${d.name}
      </th>
    `;
  });

  html += `</tr></thead><tbody>`;

  TLU_PERIODS.forEach(p => {
    html += `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.06); height: 58px;">
        <td style="padding: 0.5rem 0.85rem; border-right: 1px solid var(--theme-border); background: rgba(255,255,255,0.02);">
          <div style="font-weight: 700; font-size: 0.825rem; color: var(--theme-text-primary);">${p.label}</div>
          <div style="font-size: 0.725rem; color: var(--theme-text-muted);">${p.time}</div>
        </td>
    `;

    TLU_DAYS.forEach(d => {
      if (covered[d.key][p.period]) {
        return;
      }

      const session = DEFAULT_TLU_CLASSES.find(c => c.day === d.key && c.startPeriod === p.period);

      if (session) {
        for (let i = 1; i < session.span; i++) {
          covered[d.key][p.period + i] = true;
        }

        html += `
          <td rowspan="${session.span}" style="padding: 0.6rem 0.75rem; border-right: 1px solid var(--theme-border); vertical-align: top; background: rgba(37,99,235,0.08);">
            <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; gap: 0.35rem;">
              <div style="font-weight: 600; color: #93c5fd; font-size: 0.875rem; line-height: 1.35;">
                ${session.name}
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.35rem;">
                <span style="font-size: 0.75rem; font-weight: 700; color: #f87171; background: rgba(239,68,68,0.12); padding: 2px 7px; border-radius: 4px; border: 1px solid rgba(239,68,68,0.25);">
                  ${session.room}
                </span>
                <span style="font-size: 0.725rem; color: var(--theme-text-muted);">
                  ${session.time}
                </span>
              </div>
            </div>
          </td>
        `;
      } else {
        html += `
          <td style="padding: 0.5rem; border-right: 1px solid var(--theme-border); background: transparent;"></td>
        `;
      }
    });

    html += `</tr>`;
  });

  html += `</tbody></table></div></div>`;
  container.innerHTML = html;
}

// Chế độ 2: Danh sách thẻ theo ngày
function renderCardsView(container) {
  let html = `<div style="display: flex; flex-direction: column; gap: 1.5rem;">`;

  TLU_DAYS.forEach(d => {
    const sessions = DEFAULT_TLU_CLASSES.filter(c => c.day === d.key);
    if (sessions.length === 0) return;

    html += `
      <div class="st-card" style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--theme-border); padding-bottom: 0.65rem;">
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--theme-text-primary); text-transform: capitalize;">
            ${d.name}
          </div>
          <span style="font-size: 0.8rem; color: var(--theme-text-muted);">
            ${sessions.length} ca học
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
    `;

    sessions.forEach(s => {
      const endPeriod = s.startPeriod + s.span - 1;
      html += `
        <div style="padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--theme-border); display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <span class="badge badge-primary" style="font-size: 0.775rem;">Tiết ${s.startPeriod} - ${endPeriod} (${s.time})</span>
              <span style="font-size: 0.75rem; font-weight: 700; color: #f87171; background: rgba(239,68,68,0.12); padding: 2px 7px; border-radius: 4px; border: 1px solid rgba(239,68,68,0.25);">${s.room}</span>
            </div>
            <div style="font-weight: 600; font-size: 0.975rem; color: var(--theme-text-primary); margin-bottom: 0.25rem;">
              ${s.name}
            </div>
            <div style="font-size: 0.8rem; color: var(--theme-text-muted);">
              Mã môn: ${s.code} • ${s.teacher}
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <a href="documents.html" class="st-pill-btn" style="padding: 0.35rem 0.8rem; font-size: 0.75rem; text-decoration: none;">Tài liệu môn</a>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
  });

  html += `</div>`;
  container.innerHTML = html;
}

// USP: Xử lý nhận diện OCR từ ảnh chụp thời khóa biểu
function initOcrUpload() {
  const dropzone = document.getElementById("ocrDropzone");
  const fileInput = document.getElementById("ocrFileInput");
  const resultArea = document.getElementById("ocrResultArea");
  const ocrTableBody = document.getElementById("ocrTableBody");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      simulateOcrProcessing(e.target.files[0].name);
    }
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateOcrProcessing(e.dataTransfer.files[0].name);
    }
  });
}

function simulateOcrProcessing(fileName) {
  const resultArea = document.getElementById("ocrResultArea");
  const ocrTableBody = document.getElementById("ocrTableBody");
  if (!resultArea || !ocrTableBody) return;

  showToast(`Đang quét ảnh "${fileName}" và xử lý nhận diện AI/OCR...`, "info");
  resultArea.style.display = "block";
  ocrTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--theme-text-muted);">Đang quét OCR và bóc tách dữ liệu môn học... Vui lòng đợi 1 giây!</td></tr>`;

  setTimeout(() => {
    const detectedSchedule = DEFAULT_TLU_CLASSES.map(c => ({
      day: c.day,
      time: `Tiết ${c.startPeriod} - ${c.startPeriod + c.span - 1} (${c.time})`,
      subject: c.name,
      room: c.room
    }));

    ocrTableBody.innerHTML = detectedSchedule.map(row => `
      <tr>
        <td><input type="text" class="form-control" value="${row.day}" style="padding: 0.35rem 0.6rem;"></td>
        <td><input type="text" class="form-control" value="${row.time}" style="padding: 0.35rem 0.6rem;"></td>
        <td><input type="text" class="form-control" value="${row.subject}" style="padding: 0.35rem 0.6rem;"></td>
        <td><input type="text" class="form-control" value="${row.room}" style="padding: 0.35rem 0.6rem;"></td>
        <td>
          <button class="st-pill-btn" onclick="this.closest('tr').remove()" style="color: var(--status-danger); padding: 0.25rem 0.6rem; font-size: 0.75rem;">Xóa</button>
        </td>
      </tr>
    `).join("");

    showToast("Nhận diện AI/OCR thành công! Đã tìm thấy 11 ca học từ TKB Thủy Lợi.", "success");
  }, 1000);
}

function initTextParser() {
  const btnParse = document.getElementById("btnParseText");
  const textArea = document.getElementById("pasteTextSchedule");

  if (!btnParse || !textArea) return;

  btnParse.addEventListener("click", () => {
    const text = textArea.value.trim();
    if (!text) {
      showToast("Vui lòng dán nội dung văn bản lịch học!", "warning");
      return;
    }
    showToast("Đã phân tích văn bản thành công!", "success");
    simulateOcrProcessing("văn bản dán nhanh");
  });
}

function confirmAndSaveSchedule() {
  showToast("Đã lưu lịch học tự động vào Thời khóa biểu!", "success");
  setTimeout(() => {
    window.location.href = "schedule.html";
  }, 1000);
}

