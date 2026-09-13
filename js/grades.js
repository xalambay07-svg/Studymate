/**
 * STUDYMATE - GRADE & GPA CALCULATOR MODULE (CHUẨN ĐẠI HỌC THỦY LỢI)
 * Quản lý điểm môn học, quy đổi thang điểm 10 sang thang chữ & thang 4 chuẩn TLU
 * Công cụ giả lập điểm thi kết thúc học phần cần thiết (Goal Simulator)
 */

// 1. Bảng quy đổi chuẩn đào tạo tín chỉ Đại học Thủy Lợi (TLU)
const TLU_GRADE_SCALE = [
  { min: 8.5, max: 10.0, letter: "A",  gpa4: 4.0, rank: "Giỏi / Xuất sắc", color: "#10b981" },
  { min: 8.0, max: 8.49, letter: "B+", gpa4: 3.5, rank: "Khá giỏi",          color: "#3b82f6" },
  { min: 7.0, max: 7.99, letter: "B",  gpa4: 3.0, rank: "Khá",               color: "#6366f1" },
  { min: 6.5, max: 6.99, letter: "C+", gpa4: 2.5, rank: "Trung bình khá",     color: "#f59e0b" },
  { min: 5.5, max: 6.49, letter: "C",  gpa4: 2.0, rank: "Trung bình",        color: "#d97706" },
  { min: 5.0, max: 5.49, letter: "D+", gpa4: 1.5, rank: "Trung bình yếu",     color: "#f97316" },
  { min: 4.0, max: 4.99, letter: "D",  gpa4: 1.0, rank: "Đạt yêu cầu",       color: "#ef4444" },
  { min: 0.0, max: 3.99, letter: "F",  gpa4: 0.0, rank: "Không đạt (Học lại)",color: "#991b1b" }
];

/**
 * Quy đổi điểm hệ 10 sang hệ chữ và hệ 4
 * @param {number} score10 
 */
function convertScoreToTLUGrade(score10) {
  const score = Math.max(0, Math.min(10, parseFloat(score10) || 0));
  for (const grade of TLU_GRADE_SCALE) {
    if (score >= grade.min && score <= grade.max) {
      return {
        score10: score,
        letter: grade.letter,
        gpa4: grade.gpa4,
        rank: grade.rank,
        color: grade.color
      };
    }
  }
  return { score10: score, letter: "F", gpa4: 0.0, rank: "Không đạt", color: "#991b1b" };
}

/**
 * Tính điểm học phần tổng kết theo trọng số chuẩn TLU (10% - 40% - 50%)
 * @param {number} attendance Điểm chuyên cần (hệ số 0.1)
 * @param {number} midterm Điểm quá trình / bài tập lớn (hệ số 0.4)
 * @param {number} finalExam Điểm thi kết thúc học phần (hệ số 0.5)
 */
function calculateSubjectTotal(attendance, midterm, finalExam) {
  const att = parseFloat(attendance) || 0;
  const mid = parseFloat(midterm) || 0;
  const fin = parseFloat(finalExam) || 0;

  const total10 = Math.round((att * 0.1 + mid * 0.4 + fin * 0.5) * 10) / 10;
  return convertScoreToTLUGrade(total10);
}

/**
 * GOAL SIMULATOR: Tính điểm thi cuối kỳ tối thiểu cần đạt để đạt mục tiêu
 * @param {number} attendance Điểm chuyên cần hiện có
 * @param {number} midterm Điểm giữa kỳ / BTL hiện có
 * @param {string} targetLetter Điểm mục tiêu ('A', 'B+', 'B', 'C+', 'C', 'D')
 */
function simulateRequiredFinalScore(attendance, midterm, targetLetter = "B") {
  const att = parseFloat(attendance) || 0;
  const mid = parseFloat(midterm) || 0;

  const targetGrade = TLU_GRADE_SCALE.find(g => g.letter === targetLetter) || TLU_GRADE_SCALE[2]; // Default B (7.0)
  const targetMin = targetGrade.min;

  // Công thức: targetMin = att * 0.1 + mid * 0.4 + finalExam * 0.5
  // => finalExam = (targetMin - att * 0.1 - mid * 0.4) / 0.5
  const required = (targetMin - (att * 0.1 + mid * 0.4)) / 0.5;
  const roundedRequired = Math.round(required * 10) / 10;

  let status = "achievable";
  let message = `Bạn cần đạt tối thiểu **${roundedRequired} điểm** trong bài thi kết thúc học phần.`;

  if (roundedRequired > 10.0) {
    status = "impossible";
    message = `Không thể đạt điểm ${targetLetter} vì điểm quá trình chưa đủ cao (cần thi ${roundedRequired} điểm, vượt trần 10.0). Bạn nên hạ mục tiêu xuống mức thấp hơn.`;
  } else if (roundedRequired <= 3.0) {
    status = "easy";
    message = `Điểm quá trình rất tốt! Bạn chỉ cần đạt từ 3.0 - 4.0 điểm thi là chắc chắn đạt điểm ${targetLetter} (lưu ý tránh điểm liệt dưới 3.0 theo quy chế TLU).`;
  }

  return {
    targetLetter,
    targetMin,
    requiredFinalScore: roundedRequired,
    status,
    message
  };
}

// Khởi tạo Modal Tra cứu & Tính điểm GPA
function openGradeCalculatorModal() {
  let modal = document.getElementById("gradeCalculatorModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "gradeCalculatorModal";
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.background = "rgba(0,0,0,0.7)";
    modal.style.backdropFilter = "blur(10px)";
    modal.style.zIndex = "10001";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.padding = "20px";

    modal.innerHTML = `
      <div class="st-card" style="width: 100%; max-width: 540px; background: rgba(15, 23, 42, 0.96); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 24px 48px rgba(0,0,0,0.7); padding: 1.5rem; border-radius: 18px; color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin: 0; color: var(--theme-primary);">
              🎯 Máy Tính Điểm & Giả Lập Thi (Chuẩn TLU)
            </h3>
            <p style="font-size: 0.775rem; color: #94a3b8; margin: 2px 0 0 0;">Quy đổi hệ 10 ➔ Hệ Chữ (A, B, C...) & Thang Điểm 4</p>
          </div>
          <button type="button" onclick="closeGradeCalculatorModal()" style="background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer;">✕</button>
        </div>

        <!-- Inputs -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem;">
          <div style="font-size: 0.8rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.75rem;">Nhập điểm thành phần học phần:</div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <label style="display: block; font-size: 0.725rem; color: #94a3b8; margin-bottom: 4px;">Chuyên cần (10%)</label>
              <input type="number" id="calcAttScore" min="0" max="10" step="0.5" value="9.0" oninput="runLiveGradeCalculation()" class="form-control" style="background: #1e293b; color: #fff; border: 1px solid rgba(255,255,255,0.2); width: 100%; padding: 0.45rem; border-radius: 6px;">
            </div>
            <div>
              <label style="display: block; font-size: 0.725rem; color: #94a3b8; margin-bottom: 4px;">Giữa kỳ / BTL (40%)</label>
              <input type="number" id="calcMidScore" min="0" max="10" step="0.5" value="8.0" oninput="runLiveGradeCalculation()" class="form-control" style="background: #1e293b; color: #fff; border: 1px solid rgba(255,255,255,0.2); width: 100%; padding: 0.45rem; border-radius: 6px;">
            </div>
            <div>
              <label style="display: block; font-size: 0.725rem; color: #94a3b8; margin-bottom: 4px;">Thi dự kiến (50%)</label>
              <input type="number" id="calcFinScore" min="0" max="10" step="0.5" value="8.5" oninput="runLiveGradeCalculation()" class="form-control" style="background: #1e293b; color: #fff; border: 1px solid rgba(255,255,255,0.2); width: 100%; padding: 0.45rem; border-radius: 6px;">
            </div>
          </div>
        </div>

        <!-- Results Card -->
        <div id="calcGradeResultBox" style="background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.3); border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-around; text-align: center;">
          <div>
            <div style="font-size: 0.75rem; color: #94a3b8;">Điểm Tổng Kết Hệ 10</div>
            <div id="resScore10" style="font-size: 1.4rem; font-weight: 800; color: #60a5fa;">8.4</div>
          </div>
          <div style="width: 1px; height: 35px; background: rgba(255,255,255,0.1);"></div>
          <div>
            <div style="font-size: 0.75rem; color: #94a3b8;">Điểm Chữ TLU</div>
            <div id="resScoreLetter" style="font-size: 1.4rem; font-weight: 800; color: #34d399;">B+</div>
          </div>
          <div style="width: 1px; height: 35px; background: rgba(255,255,255,0.1);"></div>
          <div>
            <div style="font-size: 0.75rem; color: #94a3b8;">Hệ 4 (GPA)</div>
            <div id="resScoreGpa" style="font-size: 1.4rem; font-weight: 800; color: #a78bfa;">3.5</div>
          </div>
        </div>

        <!-- Goal Simulator -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #fbbf24;">⚡ Dự Phóng Điểm Thi Cần Thiết (Goal):</span>
            <select id="simTargetLetter" onchange="runLiveGradeCalculation()" style="background: #1e293b; color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">
              <option value="A">Mục tiêu: Điểm A (≥ 8.5)</option>
              <option value="B+" selected>Mục tiêu: Điểm B+ (≥ 8.0)</option>
              <option value="B">Mục tiêu: Điểm B (≥ 7.0)</option>
              <option value="C+">Mục tiêu: Điểm C+ (≥ 6.5)</option>
              <option value="C">Mục tiêu: Điểm C (≥ 5.5)</option>
            </select>
          </div>
          <p id="simResultMsg" style="font-size: 0.825rem; color: #e2e8f0; line-height: 1.5; margin: 0;">
            Bạn cần đạt tối thiểu <strong>8.0 điểm</strong> trong bài thi kết thúc học phần.
          </p>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1.25rem;">
          <button type="button" onclick="closeGradeCalculatorModal()" style="padding: 0.5rem 1.25rem; border-radius: 8px; border: none; background: #2563eb; color: #fff; font-weight: 700; cursor: pointer;">
            Đã Hiểu
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  modal.style.display = "flex";
  runLiveGradeCalculation();
}

function closeGradeCalculatorModal() {
  const modal = document.getElementById("gradeCalculatorModal");
  if (modal) modal.style.display = "none";
}

// Chạy tính toán trực tiếp
function runLiveGradeCalculation() {
  const att = parseFloat(document.getElementById("calcAttScore")?.value) || 0;
  const mid = parseFloat(document.getElementById("calcMidScore")?.value) || 0;
  const fin = parseFloat(document.getElementById("calcFinScore")?.value) || 0;
  const target = document.getElementById("simTargetLetter")?.value || "B+";

  const total = calculateSubjectTotal(att, mid, fin);

  const resScore10 = document.getElementById("resScore10");
  const resScoreLetter = document.getElementById("resScoreLetter");
  const resScoreGpa = document.getElementById("resScoreGpa");
  const simResultMsg = document.getElementById("simResultMsg");

  if (resScore10) resScore10.textContent = total.score10;
  if (resScoreLetter) {
    resScoreLetter.textContent = total.letter;
    resScoreLetter.style.color = total.color;
  }
  if (resScoreGpa) resScoreGpa.textContent = total.gpa4.toFixed(1);

  if (simResultMsg) {
    const sim = simulateRequiredFinalScore(att, mid, target);
    simResultMsg.innerHTML = sim.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}

// Gắn toàn cục
if (typeof window !== "undefined") {
  window.openGradeCalculatorModal = openGradeCalculatorModal;
  window.closeGradeCalculatorModal = closeGradeCalculatorModal;
  window.runLiveGradeCalculation = runLiveGradeCalculation;
  window.calculateSubjectTotal = calculateSubjectTotal;
  window.simulateRequiredFinalScore = simulateRequiredFinalScore;
  window.convertScoreToTLUGrade = convertScoreToTLUGrade;
}
