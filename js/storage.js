/**
 * STUDYMATE - STORAGE SERVICE & TLU MOCK DATA
 * Lead Database Architect Module
 * Quản lý tập trung 5 khóa LocalStorage, Schema JSON và dữ liệu mẫu Đại học Thủy Lợi (TLU)
 */

// 1. Enum định danh 5 Khóa LocalStorage
const STORAGE_KEYS = Object.freeze({
  USER: 'studymate_user',
  SUBJECTS: 'studymate_subjects',
  SCHEDULE: 'studymate_schedule',
  TASKS: 'studymate_tasks',
  THEME: 'studymate_theme'
});

// 2. Bộ Dữ Liệu Mẫu Chuẩn Ngữ Cảnh Đại Học Thủy Lợi (TLU - Ảnh 2 sinhvien1.tlu.edu.vn)
const TLU_MOCK_DATA = Object.freeze({
  // Bảng 1: studymate_user (Đồng bộ với sinhvien1.tlu.edu.vn)
  [STORAGE_KEYS.USER]: {
    id: "usr_tlu_2026_01",
    studentId: "2251172468",
    fullName: "Nguyễn Gia Huy",
    email: "huy.ng2251172468@e.tlu.edu.vn",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=TLUStudentHuy",
    department: "Khoa Công nghệ Thông tin - Lớp 64CNTT3",
    role: "student", // 'student' | 'admin' | 'guest'
    createdAt: "2026-09-01T08:00:00.000Z"
  },

  // Bảng 2: studymate_subjects (Đúng 5 môn học trong TKB ảnh 2)
  [STORAGE_KEYS.SUBJECTS]: [
    {
      id: "CSE201",
      code: "CSE201",
      name: "Lập trình hướng đối tượng",
      credits: 3,
      teacher: "Khoa CNTT - ĐH Thủy Lợi",
      room: "205-B5 / 211-B5",
      colorHex: "#2563EB",
      attendanceScore: 9.0,
      midtermScore: 8.5
    },
    {
      id: "CSE122",
      code: "CSE122",
      name: "Phát triển ứng dụng web cơ bản",
      credits: 3,
      teacher: "Khoa CNTT - ĐH Thủy Lợi",
      room: "205-B5 / 211-B5",
      colorHex: "#8B5CF6",
      attendanceScore: 9.5,
      midtermScore: 9.0
    },
    {
      id: "CSE220",
      code: "CSE220",
      name: "Cơ sở dữ liệu",
      credits: 3,
      teacher: "Khoa CNTT - ĐH Thủy Lợi",
      room: "401-C5 / 310-B5",
      colorHex: "#059669",
      attendanceScore: 8.5,
      midtermScore: 8.0
    },
    {
      id: "CSE301",
      code: "CSE301",
      name: "Hệ điều hành",
      credits: 3,
      teacher: "Khoa CNTT - ĐH Thủy Lợi",
      room: "309-B5",
      colorHex: "#D97706",
      attendanceScore: 8.0,
      midtermScore: 7.5
    },
    {
      id: "CSE302",
      code: "CSE302",
      name: "Mạng máy tính",
      credits: 3,
      teacher: "Khoa CNTT - ĐH Thủy Lợi",
      room: "309-B5",
      colorHex: "#DB2777",
      attendanceScore: 9.0,
      midtermScore: 8.0
    }
  ],

  // Bảng 3: studymate_schedule (Chính xác 11 ca học trong TKB ảnh 2 sinhvien1.tlu.edu.vn)
  [STORAGE_KEYS.SCHEDULE]: [
    {
      id: "sch_01",
      subjectId: "CSE201",
      subjectCode: "CSE201",
      subjectName: "Lập trình hướng đối tượng",
      dayOfWeek: 2, // Thứ Hai
      day: "Thứ Hai",
      startPeriod: 1, // Tiết 1-3 (07:00 - 09:40)
      totalPeriods: 3,
      room: "205-B5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_02",
      subjectId: "CSE122",
      subjectCode: "CSE122",
      subjectName: "Phát triển ứng dụng web cơ bản",
      dayOfWeek: 2, // Thứ Hai
      day: "Thứ Hai",
      startPeriod: 4, // Tiết 4-6 (09:45 - 12:25)
      totalPeriods: 3,
      room: "205-B5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_03",
      subjectId: "CSE201",
      subjectCode: "CSE201",
      subjectName: "Lập trình hướng đối tượng",
      dayOfWeek: 3, // Thứ Ba
      day: "Thứ Ba",
      startPeriod: 1, // Tiết 1-2 (07:00 - 08:45)
      totalPeriods: 2,
      room: "211-B5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_04",
      subjectId: "CSE122",
      subjectCode: "CSE122",
      subjectName: "Phát triển ứng dụng web cơ bản",
      dayOfWeek: 3, // Thứ Ba
      day: "Thứ Ba",
      startPeriod: 3, // Tiết 3-4 (08:50 - 10:35)
      totalPeriods: 2,
      room: "211-B5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_05",
      subjectId: "CSE220",
      subjectCode: "CSE220",
      subjectName: "Cơ sở dữ liệu",
      dayOfWeek: 3, // Thứ Ba
      day: "Thứ Ba",
      startPeriod: 7, // Tiết 7-9 (12:55 - 15:35)
      totalPeriods: 3,
      room: "401-C5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_06",
      subjectId: "CSE220",
      subjectCode: "CSE220",
      subjectName: "Cơ sở dữ liệu",
      dayOfWeek: 4, // Thứ Tư
      day: "Thứ Tư",
      startPeriod: 4, // Tiết 4-5 (09:45 - 11:30)
      totalPeriods: 2,
      room: "310-B5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_07",
      subjectId: "CSE301",
      subjectCode: "CSE301",
      subjectName: "Hệ điều hành",
      dayOfWeek: 5, // Thứ Năm
      day: "Thứ Năm",
      startPeriod: 1, // Tiết 1-3 (07:00 - 09:40)
      totalPeriods: 3,
      room: "309-B5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_08",
      subjectId: "CSE302",
      subjectCode: "CSE302",
      subjectName: "Mạng máy tính",
      dayOfWeek: 5, // Thứ Năm
      day: "Thứ Năm",
      startPeriod: 4, // Tiết 4-6 (09:45 - 12:25)
      totalPeriods: 3,
      room: "309-B5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_09",
      subjectId: "CSE201",
      subjectCode: "CSE201",
      subjectName: "Lập trình hướng đối tượng",
      dayOfWeek: 6, // Thứ Sáu
      day: "Thứ Sáu",
      startPeriod: 1, // Tiết 1-2 (07:00 - 08:45)
      totalPeriods: 2,
      room: "211-B5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_10",
      subjectId: "CSE122",
      subjectCode: "CSE122",
      subjectName: "Phát triển ứng dụng web cơ bản",
      dayOfWeek: 6, // Thứ Sáu
      day: "Thứ Sáu",
      startPeriod: 3, // Tiết 3-4 (08:50 - 10:35)
      totalPeriods: 2,
      room: "211-B5",
      campus: "Cơ sở Tây Sơn"
    },
    {
      id: "sch_11",
      subjectId: "CSE220",
      subjectCode: "CSE220",
      subjectName: "Cơ sở dữ liệu",
      dayOfWeek: 7, // Thứ Bảy
      day: "Thứ Bảy",
      startPeriod: 4, // Tiết 4-5 (09:45 - 11:30)
      totalPeriods: 2,
      room: "310-B5",
      campus: "Cơ sở Tây Sơn"
    }
  ],

  // Bảng 4: studymate_tasks (Nhiệm vụ & Deadline theo 5 môn TLU)
  [STORAGE_KEYS.TASKS]: [
    {
      id: "tsk_01",
      subjectId: "CSE122",
      title: "Báo cáo Đề cương BTL: Thiết kế Database & LocalStorage",
      deadlineDate: "2026-09-20T23:59:00",
      priority: "high", // 'high' | 'medium' | 'low'
      completed: false,
      status: "pending",
      notes: "Hoàn thiện Schema JSON 5 bảng, viết StorageService và kiểm thử ma trận TKB 12 tiết.",
      progressPercent: 65
    },
    {
      id: "tsk_02",
      subjectId: "CSE220",
      title: "Bài tập lớn: Vẽ sơ đồ ERD & Lược đồ quan hệ Bán hàng",
      deadlineDate: "2026-09-25T17:00:00",
      priority: "high",
      completed: false,
      status: "pending",
      notes: "Nộp file PDF qua cổng Google Classroom của bộ môn CSDL.",
      progressPercent: 30
    },
    {
      id: "tsk_03",
      subjectId: "CSE201",
      title: "Thực hành OOP: Đa hình & Kế thừa trong C++/Java",
      deadlineDate: "2026-09-18T07:00:00",
      priority: "medium",
      completed: true,
      status: "completed",
      notes: "Làm bài tập lab nộp tại phòng máy 205-B5.",
      progressPercent: 100
    },
    {
      id: "tsk_04",
      subjectId: "CSE301",
      title: "Mô phỏng thuật toán lập lịch CPU (Round Robin, FCFS)",
      deadlineDate: "2026-09-28T23:59:00",
      priority: "medium",
      completed: false,
      status: "pending",
      notes: "Cài đặt thuật toán mô phỏng lập lịch tiến trình môn Hệ điều hành.",
      progressPercent: 20
    },
    {
      id: "tsk_05",
      subjectId: "CSE302",
      title: "Cấu hình định tuyến tĩnh và chia mạng con IPv4",
      deadlineDate: "2026-10-02T12:00:00",
      priority: "low",
      completed: false,
      status: "pending",
      notes: "Bài tập thực hành mạng máy tính phòng 309-B5.",
      progressPercent: 0
    }
  ],

  // Bảng 5: studymate_theme
  [STORAGE_KEYS.THEME]: {
    currentTheme: "default", // 'default' | 'ocean' | 'warm' | 'forest' | 'cream' | 'midnight'
    updatedAt: "2026-09-13T23:20:00.000Z"
  }
});

// 3. StorageService Utility Class
class StorageService {
  /**
   * Đọc dữ liệu từ LocalStorage với cơ chế an toàn try-catch và fallback
   * @param {string} key 
   * @param {any} defaultValue 
   * @returns {any}
   */
  static get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) {
        return defaultValue;
      }
      return JSON.parse(raw);
    } catch (err) {
      console.error(`[StorageService] Lỗi khi đọc key "${key}":`, err);
      return defaultValue;
    }
  }

  /**
   * Ghi dữ liệu vào LocalStorage an toàn
   * @param {string} key 
   * @param {any} data 
   * @returns {boolean}
   */
  static set(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      if (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        alert('Cảnh báo: Bộ nhớ trình duyệt LocalStorage đã đầy. Vui lòng dọn dẹp bớt dữ liệu!');
      }
      console.error(`[StorageService] Lỗi khi ghi key "${key}":`, err);
      return false;
    }
  }

  /**
   * Xóa một khóa cụ thể
   * @param {string} key 
   * @returns {boolean}
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`[StorageService] Lỗi khi xóa key "${key}":`, err);
      return false;
    }
  }

  /**
   * Khởi tạo dữ liệu mẫu nếu chưa có dữ liệu
   * @param {boolean} forceReset 
   */
  static initMockData(forceReset = false) {
    Object.keys(STORAGE_KEYS).forEach(k => {
      const storageKey = STORAGE_KEYS[k];
      const existing = this.get(storageKey);
      if (forceReset || existing === null || existing === undefined) {
        this.set(storageKey, TLU_MOCK_DATA[storageKey]);
      }
    });

    // Nếu theme chưa set dạng string trực tiếp, đồng bộ cho theme switcher
    const themeObj = this.get(STORAGE_KEYS.THEME, { currentTheme: 'default' });
    const themeName = typeof themeObj === 'string' ? themeObj : (themeObj.currentTheme || 'default');
    document.documentElement.setAttribute('data-theme', themeName);
    if (document.body) document.body.setAttribute('data-theme', themeName);
  }

  /**
   * Xóa toàn bộ dữ liệu StudyMate
   */
  static clearAllStudyMateData() {
    Object.values(STORAGE_KEYS).forEach(k => this.remove(k));
    console.warn('[StorageService] Đã dọn dẹp toàn bộ dữ liệu StudyMate.');
  }

  /**
   * Đổi Role người dùng (Guest | Student | Mock Admin)
   * @param {'guest'|'student'|'admin'} role 
   */
  static setRole(role) {
    let user = this.get(STORAGE_KEYS.USER, TLU_MOCK_DATA[STORAGE_KEYS.USER]);
    if (!user) user = { ...TLU_MOCK_DATA[STORAGE_KEYS.USER] };
    
    if (role === 'guest') {
      user.role = 'guest';
      user.fullName = 'Khách vãng lai (Guest)';
      user.studentId = 'GUEST_TLU';
      user.department = 'Đang trải nghiệm bản dùng thử';
    } else if (role === 'admin') {
      user.role = 'admin';
      user.fullName = 'Quản trị viên Học vụ (Mock Admin)';
      user.studentId = 'ADMIN_TLU_01';
      user.department = 'Phòng Đào tạo - ĐH Thủy Lợi';
    } else {
      user.role = 'student';
      user.fullName = 'Nguyễn Hoàng Nam';
      user.studentId = '2251172468';
      user.department = 'Khoa Công nghệ Thông tin - Lớp 64CNTT3';
    }

    this.set(STORAGE_KEYS.USER, user);
    return user;
  }
}

// Gắn toàn cục vào window để các script không dùng ES module import vẫn gọi trực tiếp được
if (typeof window !== 'undefined') {
  window.STORAGE_KEYS = STORAGE_KEYS;
  window.TLU_MOCK_DATA = TLU_MOCK_DATA;
  window.StorageService = StorageService;
}
