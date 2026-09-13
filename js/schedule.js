/**
 * STUDYMATE - SCHEDULE & OCR IMPORT SCRIPT
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
    <div class="card" style="margin-bottom: 1rem; border-left: 4px solid var(--primary);">
      <div class="card-body" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge badge-primary" style="margin-bottom: 0.5rem;">${item.day} • ${item.time}</span>
          <h4 style="font-size: 1.1rem; font-weight: 700;">${item.name} (${item.code})</h4>
          <p style="color: var(--text-muted); font-size: 0.875rem;">🏛️ Phòng: <strong>${item.room}</strong> | 👨‍🏫 Giảng viên: ${item.teacher}</p>
        </div>
        <div>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Đang mở tài liệu môn...', 'info')">📂 Tài liệu</button>
        </div>
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

  // Drag and drop
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

  showToast(`Đang tải ảnh "${fileName}" và xử lý nhận diện AI/OCR...`, "info");
  resultArea.style.display = "block";
  ocrTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem;">⚡ Đang quét OCR và phân tích cấu trúc lịch học... Vui lòng đợi 1 giây!</td></tr>`;

  setTimeout(() => {
    const detectedSchedule = [
      { day: "Thứ Hai", time: "07:00 - 09:00", subject: "Lập trình nâng cao", room: "A203" },
      { day: "Thứ Ba", time: "09:00 - 11:00", subject: "Giải tích 2", room: "B101" },
      { day: "Thứ Năm", time: "13:00 - 15:30", subject: "Cơ sở dữ liệu", room: "C205" }
    ];

    ocrTableBody.innerHTML = detectedSchedule.map((row, idx) => `
      <tr>
        <td><input type="text" class="form-control" value="${row.day}" style="padding: 0.25rem 0.5rem;"></td>
        <td><input type="text" class="form-control" value="${row.time}" style="padding: 0.25rem 0.5rem;"></td>
        <td><input type="text" class="form-control" value="${row.subject}" style="padding: 0.25rem 0.5rem;"></td>
        <td><input type="text" class="form-control" value="${row.room}" style="padding: 0.25rem 0.5rem;"></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="this.closest('tr').remove()" style="color: var(--status-danger);">Xóa</button>
        </td>
      </tr>
    `).join("");

    showToast("Nhận diện thành công! Vui lòng kiểm tra và bấm Xác nhận lưu.", "success");
  }, 1200);
}

// Xử lý dán text lịch học
function initTextParser() {
  const btnParse = document.getElementById("btnParseText");
  const textArea = document.getElementById("pasteTextSchedule");

  if (!btnParse || !textArea) return;

  btnParse.addEventListener("click", () => {
    const text = textArea.value.trim();
    if (!text) {
      showToast("Vui lòng dán nội dung lịch học dạng văn bản!", "warning");
      return;
    }

    showToast("Đã phân tích văn bản thành công và thêm vào bảng kiểm tra!", "success");
    simulateOcrProcessing("văn bản dán nhanh");
  });
}

function confirmAndSaveSchedule() {
  showToast("Đã lưu lịch học tự động vào Thời khóa biểu thành công!", "success");
  setTimeout(() => {
    window.location.href = "schedule.html";
  }, 1200);
}
