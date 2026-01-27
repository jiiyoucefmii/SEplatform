import type { UserRegistration } from '../types';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function for authenticated requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    // Network error / CORS / server not reachable
    const msg = err?.message || String(err);
    console.error(`Network error while fetching ${url}:`, err);
    throw new Error(`Network error while fetching ${url}: ${msg}`);
  }

  if (!response.ok) {
    // Try to include body text or JSON for better diagnostics
    let bodyText = '';
    try {
      bodyText = await response.text();
    } catch (_) {
      bodyText = response.statusText || `status ${response.status}`;
    }
    throw new Error(`API Error ${response.status} ${response.statusText}: ${bodyText}`);
  }

  // Some endpoints may return no content
  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch (err: any) {
    throw new Error(`Failed to parse JSON from ${url}: ${err?.message || err}`);
  }
};

export const api: any = {
  // ==================== AUTH ====================
  // Login with phone number and password (Parent/Student login)
  login: async (phone_number: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/accounts/login/student/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.non_field_errors?.[0] || 'رقم الهاتف أو كلمة المرور غير صحيحة');
    }

    const data = await response.json();

    // Store tokens - backend returns { user: {...}, tokens: { access, refresh } }
    const accessToken = data.tokens?.access || data.access;
    const refreshToken = data.tokens?.refresh || data.refresh;

    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    return {
      user: data.user,
      token: accessToken,
      refresh: refreshToken
    };
  },

  // Login for teachers (PIN + Password)
  loginTeacher: async (pin_code: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/accounts/login/teacher/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin_code, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.non_field_errors?.[0] || 'الرمز السري أو كلمة المرور غير صحيحة');
    }

    const data = await response.json();

    localStorage.setItem('auth_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));

    return {
      user: data.user,
      token: data.access,
      refresh: data.refresh
    };
  },

  // Register new parent account
  signup: async (userData: UserRegistration) => {
    const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_number: userData.phone_num,
        password: userData.psswd,
        first_name: userData.first_name,
        last_name: userData.last_name,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.phone_number) {
        throw new Error('رقم الهاتف مستخدم بالفعل');
      }
      throw new Error(errorData.detail || 'فشل إنشاء الحساب');
    }

    const data = await response.json();

    // Store tokens after successful registration
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return {
      user: data.user,
      token: data.token
    };
  },

  // Logout - clear all stored data
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Get current user profile
  getMe: async () => {
    return fetchWithAuth('/accounts/me/');
  },

  // Refresh access token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('auth_token', data.access);
    return data.access;
  },

  // Add student application (for authenticated parent)
  addStudent: async (studentData: Record<string, unknown>) => {
    return fetchWithAuth('/accounts/student/add/', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  // ==================== OTP AUTHENTICATION ====================
  // Send OTP to phone number
  sendOtp: async (phone_number: string, purpose: 'LOGIN' | 'SIGNUP') => {
    const response = await fetch(`${API_BASE_URL}/accounts/otp/send/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, purpose }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'فشل إرسال رمز التحقق');
    }

    return response.json();
  },

  // Verify OTP and login
  verifyOtpLogin: async (phone_number: string, otp_code: string) => {
    const response = await fetch(`${API_BASE_URL}/accounts/otp/verify-login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, otp_code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'رمز التحقق غير صحيح أو منتهي الصلاحية');
    }

    const data = await response.json();

    // Store tokens
    localStorage.setItem('auth_token', data.tokens?.access || data.access);
    localStorage.setItem('refresh_token', data.tokens?.refresh || data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));

    return {
      user: data.user,
      token: data.tokens?.access || data.access,
      refresh: data.tokens?.refresh || data.refresh
    };
  },

  // Verify OTP and complete signup
  verifyOtpSignup: async (
    phone_number: string,
    otp_code: string,
    first_name: string,
    last_name: string,
    password: string
  ) => {
    const response = await fetch(`${API_BASE_URL}/accounts/otp/verify-signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number, otp_code, first_name, last_name, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'فشل التحقق من رمز التأكيد');
    }

    const data = await response.json();

    // Store tokens
    localStorage.setItem('auth_token', data.tokens?.access || data.access);
    localStorage.setItem('refresh_token', data.tokens?.refresh || data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));

    return {
      user: data.user,
      token: data.tokens?.access || data.access,
      refresh: data.tokens?.refresh || data.refresh
    };
  },

  //   // ==================== AUTH ====================
  //   login: async (email: string, password: string) => {
  //     const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     if (!response.ok) throw new Error('Login failed');

  //     const data = await response.json();
  //     localStorage.setItem('auth_token', data.token);
  //     return data;
  //   },

  //   logout: () => {
  //     localStorage.removeItem('auth_token');
  //   },

  // ==================== STUDENTS (Parent View) ====================
  // Get all students for the authenticated parent
  getMyStudents: async () => {
    return fetchWithAuth('/academics/students/');
  },

  // Get students for a specific user (by user ID)
  getUserStudents: async (userId: string | number) => {
    return fetchWithAuth(`/academics/users/${userId}/students/`);
  },

  // Get specific student profile by ID
  getStudentProfile: async (studentId: string | number) => {
    return fetchWithAuth(`/academics/students/${studentId}/profile/`);
  },

  // Legacy methods (keeping for compatibility)
  getStudents: async () => {
    return fetchWithAuth('/academics/students/');
  },

  getStudentById: async (studentId: string) => {
    return fetchWithAuth(`/academics/students/${studentId}/profile/`);
  },

  createStudent: async (studentData: Record<string, unknown>) => {
    return fetchWithAuth('/accounts/student/add/', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  updateStudent: async (studentId: string, studentData: Record<string, unknown>) => {
    return fetchWithAuth(`/academics/students/${studentId}/`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  // ==================== COURSES ====================
  getCourses: async (seasonId?: string) => {
    const query = seasonId ? `?season_id=${seasonId}` : '';
    return fetchWithAuth(`/admin/courses/${query}`);
  },

  getCourseById: async (courseId: string) => {
    return fetchWithAuth(`/admin/courses/${courseId}/`);
  },

  getCourseStudents: async (courseId: string | number) => {
    return fetchWithAuth(`/academics/courses/${courseId}/students/`);
  },

  getCourseSessions: async (courseId: string | number) => {
    return fetchWithAuth(`/academics/courses/${courseId}/sessions/`);
  },

  // ==================== SEASONS ====================
  getSeasons: async () => {
    return fetchWithAuth('/admin/seasons/');
  },

  getCurrentSeason: async () => {
    // Get all seasons and find the active one
    const seasons = await fetchWithAuth('/admin/seasons/');
    return seasons?.find?.((s: any) => s.is_active) || seasons?.[0] || null;
  },

  // ==================== ENROLLMENTS ====================
  enrollStudent: async (enrollmentData: {
    student_id: string;
    course_id: string;
    season_id: string;
  }) => {
    return fetchWithAuth('/enrollments', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
  },

  getStudentEnrollments: async (studentId: string) => {
    return fetchWithAuth(`/enrollments/student/${studentId}`);
  },

  // ==================== SESSIONS ====================
  // getCourseSessions moved to COURSES section above with correct URL
  getSessionDetails: async (sessionId: string | number) => {
    return fetchWithAuth(`/academics/sessions/${sessionId}/`);
  },

  getStudentSessionDetails: async (sessionId: string | number, studentId: string | number) => {
    return fetchWithAuth(`/academics/sessions/${sessionId}/students/${studentId}/`);
  },

  // ==================== ATTENDANCE ====================
  markAttendance: async (attendanceData: {
    student_id: string;
    session_id: string;
    presence: boolean;
    justification?: string;
  }) => {
    return fetchWithAuth('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  },

  getStudentAttendance: async (studentId: string, courseId?: string) => {
    const query = courseId ? `?course_id=${courseId}` : '';
    return fetchWithAuth(`/attendance/student/${studentId}${query}`);
  },

  // ==================== HIFZ (MEMORIZATION) ====================
  recordHifz: async (hifzData: {
    session_enroll_id: string;
    hifd_surah_from: string;
    hifd_ayah_from: number;
    hifd_surah_to: string;
    hidf_ayah_to: number;
    hifd_mistakes: number;
    hifd_remark?: string;
  }) => {
    return fetchWithAuth('/hifz', {
      method: 'POST',
      body: JSON.stringify(hifzData),
    });
  },

  getStudentHifz: async (studentId: string) => {
    return fetchWithAuth(`/hifz/student/${studentId}`);
  },

  // ==================== REVISION ====================
  recordRevision: async (revisionData: {
    session_enroll_id: string;
    revision_surah_from: string;
    revision_aya_from: number;
    revision_surah_to: string;
    revision_ayah_to: number;
    revision_mistakes: number;
    revision_ahkam_applying: number;
    revision_remark?: string;
  }) => {
    return fetchWithAuth('/revision', {
      method: 'POST',
      body: JSON.stringify(revisionData),
    });
  },

  getStudentRevisions: async (studentId: string) => {
    return fetchWithAuth(`/revision/student/${studentId}`);
  },

  // ==================== TESTS ====================
  recordTest: async (testData: {
    session_enroll_id: string;
    test_surah_from: string;
    test_ayah_from: number;
    test_surah_to: string;
    test_ayah_to: number;
    test_mistakes: number;
    test_ahkam_applying: number;
    test_remark?: string;
  }) => {
    return fetchWithAuth('/tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  },

  getStudentTests: async (studentId: string) => {
    return fetchWithAuth(`/tests/student/${studentId}`);
  },

  // ==================== NOTIFICATIONS ====================
  getNotifications: async (userId: string) => {
    return fetchWithAuth(`/notifications/user/${userId}`);
  },

  markNotificationRead: async (notifUserId: string) => {
    return fetchWithAuth(`/notifications/${notifUserId}/read`, {
      method: 'PUT',
    });
  },

  // ==================== DASHBOARD (Combined Data) ====================
  getStudentDashboard: async (studentId: string) => {
    return fetchWithAuth(`/dashboard/student/${studentId}`);
  },

  getTeacherDashboard: async (teacherId: string) => {
    return fetchWithAuth(`/dashboard/teacher/${teacherId}`);
  },

  // ==================== LEGACY (for your existing components) ====================
  getUserProgress: async (userId: string) => {
    // This will map to backend data
    const dashboard = await fetchWithAuth(`/dashboard/student/${userId}`);
    return { percentage: dashboard.completion_percentage || 0 };
  },

  getDailyVerse: async () => {
    return fetchWithAuth('/daily-verse');
  },

  // ==================== PUBLIC: KHOTBA ====================
  getKhotbas: async () => {
    return fetchWithAuth('/public/khotba/');
  },

  getKhotbaById: async (id: string) => {
    return fetchWithAuth(`/public/khotba/${id}/`);
  },

  createKhotba: async (data: Record<string, unknown>) => {
    return fetchWithAuth('/public/khotba/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateKhotba: async (id: string, data: Record<string, unknown>) => {
    return fetchWithAuth(`/public/khotba/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteKhotba: async (id: string) => {
    return fetchWithAuth(`/public/khotba/${id}/`, {
      method: 'DELETE',
    });
  },

  getSessions: async (userId: string) => {
    // Map to attendance data
    return fetchWithAuth(`/attendance/student/${userId}`);
  },
};

import {
  mockStudents,
  calculateStudentProgress,
  getMockDashboardSessions,
  mockSeasons
} from '../data/mockData';

// ... keep all the real API functions ...

// At the bottom, UPDATE the legacy functions by attaching them to the exported api object
Object.assign(api, {
  getUserProgress: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const student = mockStudents.find(s => s.user_id === userId);
    if (!student) return { percentage: 0 };
    const percentage = calculateStudentProgress(student.application_id);
    return { percentage };
  },
  getSessions: async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const student = mockStudents.find(s => s.user_id === userId);
    if (!student) return [];
    return getMockDashboardSessions(student.application_id);
  },
  getCurrentSeason: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const today = new Date();
    const within = (dateStr: string, startStr: string, endStr: string) => {
      const d = new Date(dateStr);
      const s = new Date(startStr);
      const e = new Date(endStr);
      return d >= s && d <= e;
    };
    const current = mockSeasons.find(s => within(today.toISOString().slice(0, 10), s.season_start, s.season_end));
    return current || mockSeasons[mockSeasons.length - 1];
  },
  getRegistrationStatus: async () => {
    const season = await api.getCurrentSeason();
    const mode = season.season_type === 'REGULAR' ? 'ANNUAL' : 'SUMMER';
    return { open: true, mode, season };
  },
  submitRegistration: async (data: {
    first_name: string;
    last_name: string;
    birth_date: string;
    birth_place: string;
    gender: 'M' | 'F';
    school_year: string;
    school_name?: string;
    personal_phone?: string;
    has_disease: boolean;
    disease_name?: string;
    quran_level?: number;
  }) => {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${API_BASE_URL}/accounts/student/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || 'فشل في إرسال الطلب');
    }

    const result = await response.json();
    // Backend returns { message, student: {...} } - extract the student object
    const application = result.student || result;
    localStorage.setItem('registration_application', JSON.stringify(application));
    return application;
  },
  getSubmittedApplication: async () => {
    const raw = localStorage.getItem('registration_application');
    return raw ? JSON.parse(raw) : null;
  },
  getKhotba: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const raw = localStorage.getItem('khotba_meta');
    return raw ? JSON.parse(raw) : null;
  }
})

