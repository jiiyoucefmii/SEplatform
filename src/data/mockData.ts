import type {
  Student,
  Teacher,
  Course,
  Season,
  SessionDB,
  Enrollment,
  Hifz,
  Revision,
  Test,
  SessionEnrollment,
  User,
  Child,
  Cycle,
  SessionRecord
} from '../types';


export const mockUsers: User[] = [
  {
    user_id: '1',
    first_name: 'أحمد',
    last_name: 'محمود',
    psswd: 'hashed_password_123', // In real app, this is hashed
    phone_num: '0555123456',
    role: 'PARENT'
  },
  {
    user_id: '2',
    first_name: 'فاطمة',
    last_name: 'علي',
    psswd: 'hashed_password_456',
    phone_num: '0555789012',
    role: 'PARENT'
  },
  {
    user_id: '3',
    first_name: 'يوسف',
    last_name: 'العلي',
    psswd: 'hashed_password_789',
    phone_num: '0555345678',
    role: 'TEACHER'
  }
];

// Mock Students
export const mockStudents: Student[] = [
  {
    application_id: 'STU001',
    student_first_name: 'محمد',
    student_last_name: 'أحمد',
    birth_date: '2010-05-15',
    birth_place: 'الجزائر',
    school_year: 'MIDDLE',
    school_name: 'مدرسة النور',
    phone: '0555123456',
    relation_guardian: 'أب',
    has_disease: false,
    disease_name: undefined,
    user_id: '1',
    course_id: 'CRS001'
  },
  {
    application_id: 'STU002',
    student_first_name: 'فاطمة',
    student_last_name: 'أحمد',
    birth_date: '2012-08-20',
    birth_place: 'الجزائر',
    school_year: 'PRIMARY',
    school_name: 'مدرسة النور',
    phone: '0555123456',
    relation_guardian: 'أب',
    has_disease: false,
    disease_name: undefined,
    user_id: '1',
    course_id: 'CRS001'
  }
];

// Mock Teachers
export const mockTeachers: Teacher[] = [
  {
    teacher_id: 'TCH001',
    secret_code: 'hashed_secret',
    hire_date: '2020-09-01',
    gender: 'MALE',
    date_of_birth: '1985-03-10',
    first_name: 'عدنان',
    last_name: 'العلي'
  },
  {
    teacher_id: 'TCH002',
    secret_code: 'hashed_secret',
    hire_date: '2021-09-01',
    gender: 'FEMALE',
    date_of_birth: '1990-07-22',
    first_name: 'خديجة',
    last_name: 'بن علي'
  }
];

// Mock Seasons
export const mockSeasons: Season[] = [
  {
    season_id: 'SZN001',
    season_type: 'REGULAR',
    season_start: '2024-09-01',
    season_end: '2025-06-30',
    registration_start_date: '2024-08-01',
    registration_end_date: '2024-08-31'
  },
  {
    season_id: 'SZN002',
    season_type: 'SUMMER',
    season_start: '2024-07-01',
    season_end: '2024-08-31',
    registration_start_date: '2024-06-01',
    registration_end_date: '2024-06-30'
  }
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    course_id: 'CRS001',
    season_id: 'SZN001',
    teacher_id: 'TCH001',
    course_name: 'حفظ القرآن الكريم - المستوى المتقدم',
    max_age: 15,
    min_age: 10,
    min_quran_level: 5,
    max_quran_level: 30,
    max_student_num: 20
  },
  {
    course_id: 'CRS002',
    season_id: 'SZN001',
    teacher_id: 'TCH002',
    course_name: 'حفظ القرآن الكريم - المستوى المبتدئ',
    max_age: 12,
    min_age: 7,
    min_quran_level: 1,
    max_quran_level: 5,
    max_student_num: 15
  }
];

// Mock Sessions
export const mockSessions: SessionDB[] = [
  {
    session_id: 'SESS001',
    session_day: '2024-01-15',
    session_num: 1,
    nums_type: 'morning',
    course_id: 'CRS001'
  },
  {
    session_id: 'SESS002',
    session_day: '2024-01-16',
    session_num: 2,
    nums_type: 'morning',
    course_id: 'CRS001'
  },
  {
    session_id: 'SESS003',
    session_day: '2024-01-17',
    session_num: 3,
    nums_type: 'morning',
    course_id: 'CRS001'
  }
];

// Mock Enrollments
export const mockEnrollments: Enrollment[] = [
  {
    enroll_id: 'ENR001',
    student_id: 'STU001',
    course_id: 'CRS001',
    season_id: 'SZN001',
    enrollment_date: '2024-08-15',
    status: 'ACTIVE'
  },
  {
    enroll_id: 'ENR002',
    student_id: 'STU002',
    course_id: 'CRS002',
    season_id: 'SZN001',
    enrollment_date: '2024-08-16',
    status: 'ACTIVE'
  }
];

// Mock Session Enrollments (Attendance)
export const mockSessionEnrollments: SessionEnrollment[] = [
  {
    id: 'SENR001',
    student_id: 'STU001',
    session_id: 'SESS001',
    presence: true,
    justification: undefined
  },
  {
    id: 'SENR002',
    student_id: 'STU001',
    session_id: 'SESS002',
    presence: true,
    justification: undefined
  },
  {
    id: 'SENR003',
    student_id: 'STU001',
    session_id: 'SESS003',
    presence: false,
    justification: 'مرض'
  }
];

// Mock Hifz Records
export const mockHifzRecords: Hifz[] = [
  {
    hifz_session_id: 'HIFZ001',
    hifd_surah_from: 'البقرة',
    hifd_ayah_from: 1,
    hifd_surah_to: 'البقرة',
    hidf_ayah_to: 5,
    hifd_mistakes: 2,
    hifd_remark: 'جيد، واصل',
    session_enroll_id: 'SENR001'
  },
  {
    hifz_session_id: 'HIFZ002',
    hifd_surah_from: 'البقرة',
    hifd_ayah_from: 6,
    hifd_surah_to: 'البقرة',
    hidf_ayah_to: 10,
    hifd_mistakes: 1,
    hifd_remark: 'ممتاز',
    session_enroll_id: 'SENR002'
  }
];

// Mock Revision Records
export const mockRevisionRecords: Revision[] = [
  {
    revision_id: 'REV001',
    revision_surah_from: 'الفاتحة',
    revision_aya_from: 1,
    revision_surah_to: 'الفاتحة',
    revision_ayah_to: 7,
    revision_mistakes: 0,
    revision_ahkam_applying: 9,
    revision_remark: 'ممتاز',
    session_enroll_id: 'SENR001'
  },
  {
    revision_id: 'REV002',
    revision_surah_from: 'البقرة',
    revision_aya_from: 1,
    revision_surah_to: 'البقرة',
    revision_ayah_to: 5,
    revision_mistakes: 1,
    revision_ahkam_applying: 8,
    revision_remark: 'جيد جداً',
    session_enroll_id: 'SENR002'
  }
];

// Mock Test Records
export const mockTestRecords: Test[] = [
  {
    test_id: 'TEST001',
    test_surah_from: 'الفاتحة',
    test_ayah_from: 1,
    test_surah_to: 'البقرة',
    test_ayah_to: 10,
    test_mistakes: 3,
    test_ahkam_applying: 8,
    test_remark: 'جيد، حسن أداءك في الأحكام',
    session_enroll_id: 'SENR003'
  }
];



// Helper function to calculate student progress
export const calculateStudentProgress = (studentId: string): number => {
  const hifzRecords = mockHifzRecords.filter(h =>
    mockSessionEnrollments.find(se =>
      se.id === h.session_enroll_id && se.student_id === studentId
    )
  );

  // Simple calculation: each hifz record = ~2% progress
  const progress = Math.min(hifzRecords.length * 2, 100);
  return progress;
};

// Combined session data for dashboard display
export interface DashboardSession {
  id: string;
  date: string;
  savedVerses: number;
  reviewedVerses: number;
  surah: string;
  juz: string;
  rating: number;
  status: 'passed' | 'failed';
}

export const getMockDashboardSessions = (studentId: string): DashboardSession[] => {
  return mockSessionEnrollments
    .filter(se => se.student_id === studentId)
    .map((se) => {
      const session = mockSessions.find(s => s.session_id === se.session_id);
      const hifz = mockHifzRecords.find(h => h.session_enroll_id === se.id);
      const revision = mockRevisionRecords.find(r => r.session_enroll_id === se.id);

      return {
        id: se.id,
        date: session?.session_day || '2024-01-15',
        savedVerses: hifz ? 1 : 0,
        reviewedVerses: revision ? 2 : 0,
        surah: hifz ? `${hifz.hifd_surah_from} - الآية ${hifz.hifd_ayah_from}` : 'لا يوجد',
        juz: revision ? `الأجزاء: ${revision.revision_aya_from}-${revision.revision_ayah_to}` : 'لا يوجد',
        rating: hifz ? (10 - hifz.hifd_mistakes) : 7,
        status: se.presence ? 'passed' : 'failed'
      };
    });
};



export const validTeacherSecretCodes = [
  'TEACHER2024',
  'HUDA123',
  'QURAN456',
  'MASJID789'
];

// UI Specific Mocks
export const mockChildren: Child[] = mockStudents.map((s, i) => ({
  id: s.application_id, // Using application_id as ID
  name: s.student_first_name + ' ' + s.student_last_name,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.student_first_name}`,
  memorizationLevel: '5 أجزاء' // generic for now
}));

export const mockCurrentStudent: Child = mockChildren[0];

export const mockCycles: Cycle[] = mockCourses.map(c => ({
  id: c.course_id,
  name: c.course_name,
  year: '1445',
  sessionsCount: 30,
  startDate: '2023-09-01',
  endDate: '2024-06-01',
  status: 'active',
  progress: 45,
  totalSurahs: 10,
  completedSurahs: 4,
  section: 'قسم الحفظ'
}));

export const mockSessionsMap: Record<string, SessionRecord[]> = {
  'CRS001': [
    {
      session_number: 1,
      session_date: '2023-09-01',
      session_type: 'HIFZ',
      attendance: true,
      hifz_details: 'سورة البقرة 1-10',
      revision_details: 'سورة الفاتحة',
    },
    {
      session_number: 2,
      session_date: '2023-09-08',
      session_type: 'HIFZ',
      attendance: true,
      hifz_details: 'سورة البقرة 11-20',
      revision_details: 'سورة البقرة 1-10',
    },
    {
      session_number: 3,
      session_date: '2023-09-15',
      session_type: 'TEST',
      attendance: false,
      justification: 'مرض'
    }
  ],
  'CRS002': []
};
