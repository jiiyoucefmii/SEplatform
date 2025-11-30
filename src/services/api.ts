import type { User, UserRegistration } from '../types';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function for authenticated requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

export const api = {
// Login with phone number (matches your schema)
  login: async (phone_num: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.phone_num === phone_num);
    
    if (!user) {
      throw new Error('رقم الهاتف أو كلمة المرور غير صحيحة');
    }
    
    // In real app, backend validates hashed password
    // For mock, accept any password
    
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('auth_token', token);
    
    return {
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_num: user.phone_num,
        role: user.role
      },
      token
    };
  },

  signup: async (userData: UserRegistration) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if phone number already exists
    const existingUser = mockUsers.find(u => u.phone_num === userData.phone_num);
    if (existingUser) {
      throw new Error('رقم الهاتف مستخدم بالفعل');
    }
    
    // Validate teacher secret code
    if (userData.role === 'TEACHER') {
      if (!userData.secret_code) {
        throw new Error('الرمز السري مطلوب للمعلمين');
      }
      
      // Mock validation - in real app, backend validates against database
      const validSecretCodes = ['TEACHER2024', 'HUDA123', 'QURAN456'];
      if (!validSecretCodes.includes(userData.secret_code)) {
        throw new Error('الرمز السري غير صحيح. يرجى التواصل مع الإدارة');
      }
    }
    
    const newUser: User = {
      user_id: 'USER' + Date.now(),
      first_name: userData.first_name,
      last_name: userData.last_name,
      psswd: 'hashed_' + userData.psswd,
      phone_num: userData.phone_num,
      role: userData.role
    };
    
    // If teacher, also create teacher record (in real app, backend does this)
    if (userData.role === 'TEACHER') {
      // This would create a record in the Teacher table
      console.log('Creating teacher record with secret_code:', userData.secret_code);
    }
    
    const token = 'mock-jwt-token-' + Date.now();
    localStorage.setItem('auth_token', token);
    
    return {
      user: newUser,
      token
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

  // ==================== STUDENTS ====================
  getStudents: async () => {
    return fetchWithAuth('/students');
  },

  getStudentById: async (studentId: string) => {
    return fetchWithAuth(`/students/${studentId}`);
  },

  createStudent: async (studentData: any) => {
    return fetchWithAuth('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },

  updateStudent: async (studentId: string, studentData: any) => {
    return fetchWithAuth(`/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  // ==================== COURSES ====================
  getCourses: async (seasonId?: string) => {
    const query = seasonId ? `?season_id=${seasonId}` : '';
    return fetchWithAuth(`/courses${query}`);
  },

  getCourseById: async (courseId: string) => {
    return fetchWithAuth(`/courses/${courseId}`);
  },

  // ==================== SEASONS ====================
  getSeasons: async () => {
    return fetchWithAuth('/seasons');
  },

  getCurrentSeason: async () => {
    return fetchWithAuth('/seasons/current');
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
  getCourseSessions: async (courseId: string) => {
    return fetchWithAuth(`/sessions/course/${courseId}`);
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

  getSessions: async (userId: string) => {
    // Map to attendance data
    return fetchWithAuth(`/attendance/student/${userId}`);
  },
};

import { 
  mockUsers,
  mockStudents,
  calculateStudentProgress,
  getMockDashboardSessions
} from '../data/mockData';

// ... keep all the real API functions ...

// At the bottom, UPDATE the legacy functions by attaching them to the exported api object
Object.assign(api, {
  // ==================== LEGACY (for your existing components) ====================
  getUserProgress: async (userId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find student by user_id
    const student = mockStudents.find(s => s.user_id === userId);
    if (!student) return { percentage: 0 };
    
    const percentage = calculateStudentProgress(student.application_id);
    return { percentage };
  },

  getSessions: async (userId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find student by user_id
    const student = mockStudents.find(s => s.user_id === userId);
    if (!student) return [];
    
    return getMockDashboardSessions(student.application_id);
  },
})

