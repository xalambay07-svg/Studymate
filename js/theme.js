/**
 * STUDYMATE - THEME & AMBIENT AUDIO ENGINE (StudyMate VIBES)
 * Hỗ trợ đổi 6 chủ đề thẩm mỹ và phát âm thanh thư giãn học tập
 */

// Helper lấy theme đang lưu
function getActiveThemeName() {
  const raw = localStorage.getItem("studymate_theme") || "default";
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.currentTheme) {
      return parsed.currentTheme;
    }
  } catch(e) {}
  if (raw === "cosmic") return "default";
  if (raw === "sepia") return "warm";
  if (raw === "pastel") return "cream";
  if (raw === "midnight-blue") return "midnight";
  return raw;
}

// 1. Áp dụng Theme đã lưu ngay khi khởi động
(function initTheme() {
  const savedTheme = getActiveThemeName();
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (document.body) document.body.setAttribute("data-theme", savedTheme);
})();

document.addEventListener("DOMContentLoaded", () => {
  const currentTheme = getActiveThemeName();
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (document.body) document.body.setAttribute("data-theme", currentTheme);
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

  // Chuẩn hóa danh sách 6 theme trong dropdown nếu có
  dropdown.innerHTML = `
    <div style="font-size: 0.75rem; color: var(--theme-text-muted); text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 700; letter-spacing: 0.05em;">Chọn 6 Bảng Màu</div>
    <div class="theme-option" data-theme="default"><span class="theme-dot" style="background: #8b5cf6;"></span> TLU Default (Indigo/Cyan)</div>
    <div class="theme-option" data-theme="ocean"><span class="theme-dot" style="background: #06b6d4;"></span> Ocean (Biển Sâu Azure)</div>
    <div class="theme-option" data-theme="warm"><span class="theme-dot" style="background: #f59e0b;"></span> Warm (Hoàng Hôn Amber)</div>
    <div class="theme-option" data-theme="forest"><span class="theme-dot" style="background: #22c55e;"></span> Forest (Rừng Xanh Mint)</div>
    <div class="theme-option" data-theme="cream"><span class="theme-dot" style="background: #ffffff; border: 1px solid #94a3b8;"></span> Cream (Pastel WCAG AAA)</div>
    <div class="theme-option" data-theme="midnight"><span class="theme-dot" style="background: #050811; border: 1px solid #38bdf8;"></span> Midnight (OLED Neon)</div>
  `;

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
  const currentTheme = getActiveThemeName();

  options.forEach(opt => {
    const themeName = opt.getAttribute("data-theme");
    if (themeName === currentTheme) opt.classList.add("active");

    opt.addEventListener("click", () => {
      options.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");

      document.documentElement.setAttribute("data-theme", themeName);
      if (document.body) document.body.setAttribute("data-theme", themeName);
      
      // Lưu cấu trúc JSON chuẩn theo yêu cầu LocalStorage Architect
      const themePayload = {
        currentTheme: themeName,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem("studymate_theme", JSON.stringify(themePayload));

      dropdown.classList.remove("show");
      if (typeof showToast === "function") {
        showToast(`Đã chuyển sang chủ đề ${opt.innerText.trim()}`, "info");
      }
    });
  });
}

// 3. Trình phát âm thanh thư giãn (Thanh công cụ âm nhạc StudyMate Vibes)
// Hỗ trợ Piano thư giãn 30s Loop từ YouTube (https://youtu.be/u_UXX557vb0) & Tiếng mưa tĩnh lặng
let audioCtx = null;
let noiseNode = null;
let gainNode = null;
let pianoAudio = null;
let currentAmbientTrack = null; // 'piano' | 'rain' | 'mix' | null
let ambientVolume = parseFloat(localStorage.getItem("studymate_ambient_vol")) || 0.6;

function getAudioFilePath(fileName) {
  if (window.location.pathname.includes('/pages/')) {
    return '../assets/audio/' + fileName;
  }
  return 'assets/audio/' + fileName;
}

function getPianoAudio() {
  if (!pianoAudio) {
    pianoAudio = new Audio(getAudioFilePath("piano-30s.mp3"));
    pianoAudio.loop = true;
    pianoAudio.volume = ambientVolume;
    pianoAudio.addEventListener("ended", () => {
      if (currentAmbientTrack === "piano" || currentAmbientTrack === "mix") {
        pianoAudio.currentTime = 0;
        pianoAudio.play().catch(e => console.warn("Audio loop notice:", e));
      }
    });
  }
  return pianoAudio;
}

function startRainSynthesis() {
  try {
    if (audioCtx && noiseNode) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(ambientVolume * 0.14, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start();
    noiseNode = whiteNoise;
  } catch (err) {
    console.warn("Web Audio không được hỗ trợ hoặc bị chặn:", err);
  }
}

function stopRainSynthesis() {
  if (noiseNode) {
    try {
      noiseNode.stop();
      noiseNode.disconnect();
    } catch (e) {}
    noiseNode = null;
  }
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch (e) {}
    audioCtx = null;
  }
}

function playAmbientTrack(trackType) {
  // Bấm vào bài đang phát -> Tắt bài đó
  if (currentAmbientTrack === trackType) {
    stopAllAmbientSounds();
    return;
  }

  if (trackType === "piano") {
    stopRainSynthesis();
    const p = getPianoAudio();
    p.volume = ambientVolume;
    p.currentTime = 0;
    p.play().catch(err => console.warn("Cannot autoplay audio:", err));
    currentAmbientTrack = "piano";
    if (typeof showToast === "function") {
      showToast("🎹 Đang phát Piano thư giãn (Lặp lại 30s)...", "info");
    }
  } else if (trackType === "rain") {
    if (pianoAudio) {
      pianoAudio.pause();
    }
    startRainSynthesis();
    currentAmbientTrack = "rain";
    if (typeof showToast === "function") {
      showToast("🌧️ Đang phát tiếng mưa thư giãn...", "info");
    }
  } else if (trackType === "mix") {
    startRainSynthesis();
    const p = getPianoAudio();
    p.volume = ambientVolume;
    p.currentTime = 0;
    p.play().catch(err => console.warn("Cannot autoplay audio:", err));
    currentAmbientTrack = "mix";
    if (typeof showToast === "function") {
      showToast("🎹🌧️ Đang hòa âm Piano + Mưa thư giãn (Deep Study)...", "info");
    }
  }

  updateAmbientUI();
}

function stopAllAmbientSounds() {
  if (pianoAudio) {
    try {
      pianoAudio.pause();
      pianoAudio.currentTime = 0;
    } catch (e) {}
  }
  stopRainSynthesis();
  const wasPlaying = currentAmbientTrack !== null;
  currentAmbientTrack = null;
  updateAmbientUI();
  if (wasPlaying && typeof showToast === "function") {
    showToast("🔇 Đã tắt âm thanh thư giãn", "info");
  }
}

function setAmbientVolume(val) {
  ambientVolume = Math.max(0, Math.min(1, parseFloat(val)));
  localStorage.setItem("studymate_ambient_vol", ambientVolume);
  if (pianoAudio) {
    pianoAudio.volume = ambientVolume;
  }
  if (gainNode && audioCtx) {
    gainNode.gain.setValueAtTime(ambientVolume * 0.14, audioCtx.currentTime);
  }
  const volLabel = document.getElementById("ambientVolLabel");
  if (volLabel) {
    volLabel.textContent = Math.round(ambientVolume * 100) + "%";
  }
}

function updateAmbientUI() {
  const soundBtn = document.getElementById("ambientSoundBtn");
  const panel = document.getElementById("ambientMusicPanel");
  const statusBadge = document.getElementById("ambientStatusBadge");

  // Cập nhật nút điều hướng trên header
  if (soundBtn) {
    if (currentAmbientTrack === "piano") {
      soundBtn.innerHTML = `🎹 <span class="ambient-wave"><span></span><span></span><span></span><span></span></span>`;
      soundBtn.classList.add("playing");
      soundBtn.title = "Đang phát Piano thư giãn (30s lặp lại) - Bấm để mở thanh công cụ";
    } else if (currentAmbientTrack === "rain") {
      soundBtn.innerHTML = `🌧️ <span class="ambient-wave"><span></span><span></span><span></span><span></span></span>`;
      soundBtn.classList.add("playing");
      soundBtn.title = "Đang phát tiếng mưa thư giãn - Bấm để mở thanh công cụ";
    } else if (currentAmbientTrack === "mix") {
      soundBtn.innerHTML = `🎹🌧️ <span class="ambient-wave"><span></span><span></span><span></span><span></span></span>`;
      soundBtn.classList.add("playing");
      soundBtn.title = "Đang hòa âm Piano + Mưa - Bấm để mở thanh công cụ";
    } else {
      soundBtn.innerHTML = `🎵`;
      soundBtn.classList.remove("playing");
      soundBtn.title = "Thanh công cụ âm nhạc thư giãn";
    }
  }

  // Cập nhật huy hiệu trạng thái bên trong panel
  if (statusBadge) {
    if (currentAmbientTrack === "piano") {
      statusBadge.textContent = "🎹 Đang phát Piano (30s Loop)";
      statusBadge.className = "ambient-status-badge active";
    } else if (currentAmbientTrack === "rain") {
      statusBadge.textContent = "🌧️ Đang phát Tiếng Mưa";
      statusBadge.className = "ambient-status-badge active";
    } else if (currentAmbientTrack === "mix") {
      statusBadge.textContent = "🎹🌧️ Piano + Mưa";
      statusBadge.className = "ambient-status-badge active";
    } else {
      statusBadge.textContent = "Đang dừng";
      statusBadge.className = "ambient-status-badge";
    }
  }

  // Cập nhật thẻ các bài hát
  if (panel) {
    const cards = panel.querySelectorAll(".ambient-track-card");
    cards.forEach(card => {
      const track = card.getAttribute("data-track");
      const actionBtn = card.querySelector(".ambient-track-action");
      if (track === currentAmbientTrack) {
        card.classList.add("active");
        if (actionBtn) actionBtn.innerHTML = "⏸ Dừng";
      } else {
        card.classList.remove("active");
        if (actionBtn) actionBtn.innerHTML = "▶ Phát";
      }
    });
  }
}

function initAmbientAudio() {
  const navActions = document.querySelector(".st-nav-actions");
  let soundBtn = document.getElementById("ambientSoundBtn");

  // Nếu trang chưa có nút, tự động bổ sung vào thanh điều hướng
  if (!soundBtn && navActions) {
    soundBtn = document.createElement("button");
    soundBtn.id = "ambientSoundBtn";
    soundBtn.className = "st-btn-icon";
    soundBtn.title = "Thanh công cụ âm nhạc thư giãn";
    soundBtn.innerHTML = "🎵";
    const themePickerBtn = document.getElementById("themePickerBtn");
    if (themePickerBtn) {
      navActions.insertBefore(soundBtn, themePickerBtn);
    } else {
      navActions.appendChild(soundBtn);
    }
  }

  if (!soundBtn) return;

  // Tạo hoặc làm mới Panel Thanh công cụ âm nhạc thư giãn
  let panel = document.getElementById("ambientMusicPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "ambientMusicPanel";
    panel.className = "ambient-music-panel";
    
    // Gắn panel vào container thích hợp
    if (navActions) {
      navActions.appendChild(panel);
    } else {
      document.body.appendChild(panel);
    }
  }

  const volPercent = Math.round(ambientVolume * 100);

  panel.innerHTML = `
    <div class="ambient-panel-header">
      <div class="ambient-panel-title">
        <span>🎵 Âm Nhạc Thư Giãn</span>
      </div>
      <span class="ambient-status-badge" id="ambientStatusBadge">Đang dừng</span>
    </div>

    <div class="ambient-tracks-list">
      <!-- 1. Track Piano 30s Loop từ YouTube -->
      <div class="ambient-track-card" data-track="piano">
        <div class="ambient-track-left">
          <div class="ambient-track-icon">🎹</div>
          <div class="ambient-track-meta">
            <div class="ambient-track-name">
              Piano Thư Giãn <span class="ambient-track-pill">Loop 30s</span>
            </div>
            <div class="ambient-track-sub">Giai điệu nhẹ nhàng từ YouTube • Tự lặp lại</div>
          </div>
        </div>
        <button class="ambient-track-action" type="button">▶ Phát</button>
      </div>

      <!-- 2. Track Tiếng Mưa Rào -->
      <div class="ambient-track-card" data-track="rain">
        <div class="ambient-track-left">
          <div class="ambient-track-icon">🌧️</div>
          <div class="ambient-track-meta">
            <div class="ambient-track-name">
              Tiếng Mưa Bên Cửa Sổ <span class="ambient-track-pill">Êm dịu</span>
            </div>
            <div class="ambient-track-sub">Âm thanh thiên nhiên tĩnh lặng tăng tập trung</div>
          </div>
        </div>
        <button class="ambient-track-action" type="button">▶ Phát</button>
      </div>

      <!-- 3. Hòa âm Piano + Mưa -->
      <div class="ambient-track-card" data-track="mix">
        <div class="ambient-track-left">
          <div class="ambient-track-icon">🎧</div>
          <div class="ambient-track-meta">
            <div class="ambient-track-name">
              Hòa Âm Piano + Mưa <span class="ambient-track-pill">Deep Focus</span>
            </div>
            <div class="ambient-track-sub">Kết hợp tiếng đàn và mưa rơi nền nhẹ</div>
          </div>
        </div>
        <button class="ambient-track-action" type="button">▶ Phát</button>
      </div>
    </div>

    <!-- Hộp điều khiển âm lượng & lặp lại -->
    <div class="ambient-controls-box">
      <div class="ambient-vol-row">
        <span style="font-size: 0.9rem;">🔊</span>
        <input type="range" id="ambientVolSlider" class="ambient-slider" min="0" max="1" step="0.05" value="${ambientVolume}">
        <span id="ambientVolLabel" class="ambient-vol-label">${volPercent}%</span>
      </div>
      <div class="ambient-btn-row">
        <div class="ambient-loop-badge">
          <span>🔁</span> <span>Lặp lại: BẬT (30s)</span>
        </div>
        <button id="ambientStopBtn" class="ambient-stop-btn" type="button">Tắt âm thanh</button>
      </div>
    </div>
  `;

  // Toggle dropdown khi bấm vào nút
  soundBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("show");
  });

  // Đóng khi bấm ra ngoài
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && e.target !== soundBtn) {
      panel.classList.remove("show");
    }
  });

  // Sự kiện chọn track
  const trackCards = panel.querySelectorAll(".ambient-track-card");
  trackCards.forEach(card => {
    card.addEventListener("click", () => {
      const track = card.getAttribute("data-track");
      playAmbientTrack(track);
    });
  });

  // Sự kiện chỉnh âm lượng
  const volSlider = document.getElementById("ambientVolSlider");
  if (volSlider) {
    volSlider.addEventListener("input", (e) => {
      setAmbientVolume(e.target.value);
    });
  }

  // Sự kiện tắt âm thanh
  const stopBtn = document.getElementById("ambientStopBtn");
  if (stopBtn) {
    stopBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      stopAllAmbientSounds();
    });
  }

  updateAmbientUI();
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

