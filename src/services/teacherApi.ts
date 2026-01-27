/**
 * Teacher API Service
 * 
 * Provides API methods for teacher dashboard functionality.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

// Authenticated fetch wrapper
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || `Request failed: ${response.status}`);
    }

    return response.json();
};

// ==================== TYPES ====================

export interface TeacherCourse {
    course_id: number;
    course_name: string;
    season_id: number;
    season_name: string;
    min_age: number;
    max_age: number;
    min_quran_level: number;
    max_quran_level: number;
    max_student_num: number;
    enrolled_count: number;
    is_active: boolean;
}

export interface CourseStudent {
    application_id: number;
    first_name: string;
    last_name: string;
    gender: 'M' | 'F';
    quran_level?: number;
    avatar?: string;
}

export interface Session {
    session_id: number;
    course_id: number;
    session_day: string;
    session_num: number;
    session_type: 'HIFZ' | 'REVISION' | 'TEST' | 'HIFZ_REVISION' | 'HIFZ_TEST' | 'REVISION_TEST' | 'HIFZ_REVISION_TEST';
    created_at: string;
}

export interface SessionDetail extends Session {
    attendance_records: SessionStudentRecord[];
}

export interface SessionStudentRecord {
    student_id: number;
    student_name: string;
    avatar?: string;
    presence: boolean;
    justification: string;
    hifz?: HifzRecord | null;
    revision?: RevisionRecord | null;
    test?: TestRecord | null;
}

export interface HifzRecord {
    surah: string;
    start_ayah: number;
    end_ayah: number;
    grade: string;
    notes: string;
}

export interface RevisionRecord {
    surah: string;
    start_ayah: number;
    end_ayah: number;
    grade: string;
    notes: string;
}

export interface TestRecord {
    test_type: string;
    score: number;
    notes: string;
}

// ==================== API METHODS ====================

export const teacherApi = {
    // ==================== COURSE ENDPOINTS ====================

    /**
     * Get all courses assigned to the authenticated teacher
     * GET /academics/teacher/courses/
     */
    getMyCourses: async (): Promise<TeacherCourse[]> => {
        const data = await fetchWithAuth('/academics/teacher/courses/');
        return Array.isArray(data) ? data : data.results || [];
    },

    /**
     * Get all students enrolled in a specific course
     * GET /academics/courses/{courseId}/students/
     */
    getCourseStudents: async (courseId: number): Promise<CourseStudent[]> => {
        const data = await fetchWithAuth(`/academics/courses/${courseId}/students/`);
        return Array.isArray(data) ? data : data.results || [];
    },

    // ==================== SESSION ENDPOINTS ====================

    /**
     * Get all sessions for a course
     * GET /academics/courses/{courseId}/sessions/
     */
    getCourseSessions: async (courseId: number): Promise<Session[]> => {
        const data = await fetchWithAuth(`/academics/courses/${courseId}/sessions/`);
        return Array.isArray(data) ? data : data.results || [];
    },

    /**
     * Create a new session for a course
     * POST /academics/courses/{courseId}/sessions/
     */
    createSession: async (courseId: number, data: {
        session_day: string;
        session_num: number;
        session_type: 'HIFZ' | 'REVISION' | 'TEST' | 'HIFZ_REVISION' | 'HIFZ_TEST' | 'REVISION_TEST' | 'HIFZ_REVISION_TEST';
    }): Promise<Session> => {
        return fetchWithAuth(`/academics/courses/${courseId}/sessions/`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get session details including student attendance
     * GET /academics/sessions/{sessionId}/
     */
    getSessionDetail: async (sessionId: number): Promise<SessionDetail> => {
        return fetchWithAuth(`/academics/sessions/${sessionId}/`);
    },

    /**
     * Update session details
     * PATCH /academics/sessions/{sessionId}/
     */
    updateSession: async (sessionId: number, data: Partial<Session>): Promise<Session> => {
        return fetchWithAuth(`/academics/sessions/${sessionId}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    // ==================== ATTENDANCE ENDPOINTS ====================

    /**
     * Update attendance for a session (bulk update)
     * POST /academics/sessions/{sessionId}/attendance/
     */
    updateAttendance: async (sessionId: number, attendanceData: {
        student_id: number;
        presence: boolean;
        justification?: string;
    }[]): Promise<any> => {
        return fetchWithAuth(`/academics/sessions/${sessionId}/attendance/`, {
            method: 'PATCH',
            body: JSON.stringify({ attendance: attendanceData }),
        });
    },

    // ==================== EVALUATION ENDPOINTS ====================

    /**
     * Get student's detailed record for a specific session
     * GET /academics/sessions/{sessionId}/students/{studentId}/
     */
    getStudentSessionDetail: async (sessionId: number, studentId: number): Promise<SessionStudentRecord> => {
        return fetchWithAuth(`/academics/sessions/${sessionId}/students/${studentId}/`);
    },

    /**
     * Record evaluation for a student in a session
     * POST /academics/sessions/{sessionId}/students/{studentId}/evaluate/
     */
    recordEvaluation: async (
        sessionId: number,
        studentId: number,
        evaluationData: {
            evaluation_type: 'HIFZ' | 'REVISION' | 'TEST';
            surah?: string;
            start_ayah?: number;
            end_ayah?: number;
            grade?: string;
            notes?: string;
            test_type?: string;
            score?: number;
        }
    ): Promise<any> => {
        return fetchWithAuth(`/academics/sessions/${sessionId}/students/${studentId}/evaluate/`, {
            method: 'POST',
            body: JSON.stringify(evaluationData),
        });
    },

    /**
     * Record Hifz evaluation
     */
    recordHifz: async (sessionId: number, studentId: number, data: HifzRecord) => {
        return teacherApi.recordEvaluation(sessionId, studentId, {
            evaluation_type: 'HIFZ',
            ...data,
        });
    },

    /**
     * Record Revision evaluation
     */
    recordRevision: async (sessionId: number, studentId: number, data: RevisionRecord) => {
        return teacherApi.recordEvaluation(sessionId, studentId, {
            evaluation_type: 'REVISION',
            ...data,
        });
    },

    /**
     * Record Test evaluation
     */
    recordTest: async (sessionId: number, studentId: number, data: TestRecord) => {
        return teacherApi.recordEvaluation(sessionId, studentId, {
            evaluation_type: 'TEST',
            ...data,
        });
    },
};

export default teacherApi;
