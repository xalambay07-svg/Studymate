/**
 * STUDYMATE - THEME & AMBIENT AUDIO ENGINE (StudyMate VIBES)
 * Hỗ trợ đổi 6 chủ đề thẩm mỹ và phát âm thanh thư giãn học tập
 */

// 1. Áp dụng Theme đã lưu ngay khi khởi động
(function initTheme() {
  const savedTheme = localStorage.getItem("studymate_theme") || "cosmic";
  document.documentElement.setAttribute("data-theme", savedTheme);
})();

document.addEventListener("DOMContentLoaded", () => {
  initThemePicker();
  initAmbientAudio();
  initLiveClockAndQuote();
  initMobileDrawer();
});

// 2. Quản lý Theme Picker Dropdown
function initThemePicker() {
  const themeBtn = document.getElementById("themePickerBtn");
  const dropdown = document.getElementById("themeDropdown");
  if (!themeBtn || !dropdown) return;

  themeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== themeBtn) {
      dropdown.classList.remove("show");
    }
  });

  const options = dropdown.querySelectorAll(".theme-option");
  const currentTheme = localStorage.getItem("studymate_theme") || "cosmic";

  options.forEach(opt => {
    const themeName = opt.getAttribute("data-theme");
    if (themeName === currentTheme) opt.classList.add("active");

    opt.addEventListener("click", () => {
      options.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");

      document.documentElement.setAttribute("data-theme", themeName);
      localStorage.setItem("studymate_theme", themeName);
      dropdown.classList.remove("show");
      showToast(`Đã chuyển sang chủ đề ${opt.innerText.trim()}`, "info");
    });
  });
}

// 3. Trình phát âm thanh thư giãn Web Audio API (Tiếng mưa & White noise tĩnh lặng)
let audioCtx = null;
let noiseNode = null;
let gainNode = null;
let isPlayingAmbient = false;

function initAmbientAudio() {
  const soundBtn = document.getElementById("ambientSoundBtn");
  if (!soundBtn) return;

  soundBtn.addEventListener("click", () => {
    if (!isPlayingAmbient) {
      startAmbientSound();
      soundBtn.classList.add("active");
      soundBtn.title = "Đang phát tiếng mưa thư giãn (Bấm để tắt)";
      showToast("🌧️ Đang phát âm thanh thư giãn...", "info");
    } else {
      stopAmbientSound();
      soundBtn.classList.remove("active");
      soundBtn.title = "Bật âm thanh thư giãn";
      showToast("🔇 Đã tắt âm thanh", "info");
    }
  });
}

function startAmbientSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Tạo White Noise mô phỏng tiếng mưa
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter để âm thanh trầm ấm như mưa rơi bên cửa sổ
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start();
    noiseNode = whiteNoise;
    isPlayingAmbient = true;
  } catch (err) {
    console.warn("Web Audio không được hỗ trợ hoặc bị chặn:", err);
  }
}

function stopAmbientSound() {
  if (noiseNode) {
    try {
      noiseNode.stop();
      noiseNode.disconnect();
    } catch (e) {}
  }
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch (e) {}
  }
  isPlayingAmbient = false;
}

// 4. Đồng hồ thời gian thực & Quote truyền cảm hứng
function initLiveClockAndQuote() {
  const clockElem = document.getElementById("liveTime");
  const dateElem = document.getElementById("liveDate");

  function updateClock() {
    const now = new Date();
    if (clockElem) {
      clockElem.textContent = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    }
    if (dateElem) {
      dateElem.textContent = now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" });
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// 5. Drawer menu mobile
function initMobileDrawer() {
  const btn = document.querySelector(".st-mobile-btn");
  const drawer = document.querySelector(".st-mobile-drawer");
  const overlay = document.querySelector(".st-drawer-overlay");

  if (btn && drawer && overlay) {
    btn.addEventListener("click", () => {
      drawer.classList.toggle("open");
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
      drawer.classList.remove("open");
      overlay.classList.remove("active");
    });
  }
}

