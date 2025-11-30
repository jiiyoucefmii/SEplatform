
export interface Session {
  id: string;
  date: string;
  savedVerses: number;
  reviewedVerses: number;
  surah: string;
  juz: string;
evaluation: string;
  status: 'present' | 'absent';
}

export interface DailyVerse {
  arabic: string;
  reference?: string;
}

export interface Student {
  application_id: string;
  student_first_name: string;
  student_last_name: string;
  birth_date: string;
  birth_place: string;
  school_year: 'PRIMARY' | 'MIDDLE' | 'HIGH' | 'UNIVERSITY';
  school_name: string;
  phone: string;
  relation_guardian: string;
  has_disease: boolean;
  disease_name?: string;
  user_id: string;
  course_id?: string;
}

export interface Teacher {
  teacher_id: string;
  secret_code: string;
  hire_date: string;
  gender: 'MALE' | 'FEMALE';
  date_of_birth: string;
  first_name?: string;
  last_name?: string;
}

export interface Course {
  course_id: string;
  season_id: string;
  teacher_id: string;
  course_name: string;
  max_age: number;
  min_age: number;
  min_quran_level: number;
  max_quran_level: number;
  max_student_num: number;
}

export interface Season {
  season_id: string;
  season_type: 'SUMMER' | 'REGULAR';
  season_start: string;
  season_end: string;
  registration_start_date: string;
  registration_end_date: string;
}

export interface SessionEnrollment {
  id: string;
  student_id: string;
  session_id: string;
  presence: boolean;
  justification?: string;
}

export interface Hifz {
  hifz_session_id: string;
  hifd_surah_from: string;
  hifd_ayah_from: number;
  hifd_surah_to: string;
  hidf_ayah_to: number;
  hifd_mistakes: number;
  hifd_remark?: string;
  session_enroll_id: string;
}

export interface Revision {
  revision_id: string;
  revision_surah_from: string;
  revision_aya_from: number;
  revision_surah_to: string;
  revision_ayah_to: number;
  revision_mistakes: number;
  revision_ahkam_applying: number;
  revision_remark?: string;
  session_enroll_id: string;
}

export interface Test {
  test_id: string;
  test_surah_from: string;
  test_ayah_from: number;
  test_surah_to: string;
  test_ayah_to: number;
  test_mistakes: number;
  test_ahkam_applying: number;
  test_remark?: string;
  session_enroll_id: string;
}

export interface Enrollment {
  enroll_id: string;
  student_id: string;
  course_id: string;
  season_id: string;
  enrollment_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
}

// Update your existing Session interface to match DB:
export interface SessionDB {
  session_id: string;
  session_day: string;
  session_num: number;
  nums_type: string;
  course_id: string;
}
// Exact match to your User table
export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  psswd: string;
  phone_num: string;
  role: 'PARENT' | 'TEACHER' | 'STUDENT';
}

// Registration is the same as User (before ID is generated)
// User Registration with optional secret_code for teachers
export interface UserRegistration {
  first_name: string;
  last_name: string;
  psswd: string;
  phone_num: string;
  role: 'PARENT' | 'TEACHER' | 'STUDENT' ;
  secret_code?: string; // Only for TEACHER role
}