/**
 * STUDYMATE - SCHEDULE & OCR SCRIPT (Aesthetic StudyMate style)
 * Xử lý xem thời khóa biểu và tính năng nổi bật USP: Nhập lịch bằng ảnh (AI/OCR) & Text
 */

document.addEventListener("DOMContentLoaded", () => {
  initScheduleView();
  initOcrUpload();
  initTextParser();
});

function initScheduleView() {
  const scheduleContainer = document.getElementById("scheduleGrid");
  if (!scheduleContainer) return;

  const scheduleData = [
    { day: "Thứ Hai", time: "07:00 - 09:00", name: "Phát triển ứng dụng web cơ bản", code: "CSE122", room: "A203", teacher: "ThS. Nguyễn Văn A" },
    { day: "Thứ Hai", time: "09:15 - 11:30", name: "Cấu trúc dữ liệu và giải thuật", code: "CSE281", room: "B102", teacher: "TS. Trần Thị B" },
    { day: "Thứ Ba", time: "07:30 - 09:45", name: "Giải tích 1", code: "MATH101", room: "C301", teacher: "PGS. Lê Văn C" },
    { day: "Thứ Tư", time: "13:00 - 15:15", name: "Tiếng Anh chuyên ngành", code: "ENG201", room: "D405", teacher: "ThS. Phạm Thị D" },
    { day: "Thứ Sáu", time: "08:00 - 11:00", name: "Thực hành Web phòng máy", code: "CSE122-Lab", room: "PM-302", teacher: "ThS. Nguyễn Văn A" }
  ];

  scheduleContainer.innerHTML = scheduleData.map(item => `
    <div class="st-card" style="margin-bottom: 1rem; border-left: 3px solid var(--theme-primary); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem;">
          <span class="badge badge-primary">${item.day}</span>
          <span style="font-size: 0.8125rem; color: var(--theme-text-muted);">🕒 ${item.time}</span>
        </div>
        <h3 style="font-size: 1.05rem; font-weight: 600; color: var(--theme-text-primary); margin-bottom: 0.25rem;">
          ${item.name} (${item.code})
        </h3>
        <p style="color: var(--theme-text-muted); font-size: 0.8125rem;">
          🏛️ Phòng: <strong>${item.room}</strong> • 👨‍🏫 Giảng viên: ${item.teacher}
        </p>
      </div>
      <div>
        <a href="documents.html" class="st-pill-btn" style="padding: 0.35rem 0.8rem; font-size: 0.75rem;">📂 Tài liệu môn</a>
      </div>
    </div>
  `).join("");
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
  ocrTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--theme-text-muted);">⚡ Đang quét OCR và bóc tách dữ liệu môn học... Vui lòng đợi 1 giây!</td></tr>`;

  setTimeout(() => {
    const detectedSchedule = [
      { day: "Thứ Hai", time: "07:00 - 09:00", subject: "Lập trình nâng cao", room: "A203" },
      { day: "Thứ Ba", time: "09:00 - 11:00", subject: "Giải tích 2", room: "B101" },
      { day: "Thứ Năm", time: "13:00 - 15:30", subject: "Cơ sở dữ liệu", room: "C205" }
    ];

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

    showToast("Nhận diện AI/OCR thành công! Kiểm tra và bấm lưu.", "success");
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

