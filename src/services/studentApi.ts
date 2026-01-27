/**
 * Student/Parent API Service
 * 
 * Provides API methods for parent and student dashboard functionality.
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

export interface Student {
    application_id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    gender: 'M' | 'F';
    school_year: string;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
    quran_level?: number;
}

export interface StudentProfile extends Student {
    birth_place: string;
    school_name: string;
    personal_phone: string;
    has_disease: boolean;
    disease_name: string;
    enrollments?: Enrollment[];
    // Fields from StudentAcademicProfileSerializer
    current_season?: {
        season_id: number;
        season_type: 'SUMMER' | 'ANNUAL';
        season_start: string;
        season_end: string;
        is_active: boolean;
    };
    current_course?: {
        course_id: number;
        course_name: string;
        min_Quran_level?: string;
        max_quran_level?: string;
    };
    teacher?: {
        teacher_id: number;
        full_name: string;
    };
    progress_stats?: {
        attendance_rate: number;
        latest_hifz: string | null;
        latest_revision: string | null;
    };
    session_records?: any[];
}

export interface Enrollment {
    enrollment_id: number;
    season_id: number;
    season_name: string;
    course_id: number;
    course_name: string;
    teacher_name: string;
    enrollment_date: string;
    status: string;
}

export interface Season {
    season_id: number;
    season_type: 'SUMMER' | 'REGULAR';
    season_start: string;
    season_end: string;
    is_active: boolean;
}

export interface SessionRecord {
    session_id: number;
    session_date: string;
    session_number: number;
    session_type: 'HIFZ' | 'REVISION' | 'TEST' | 'HIFZ_REVISION';
    attendance: boolean;
    justification: string;
    hifz_details?: {
        surah: string;
        start_ayah: number;
        end_ayah: number;
        grade: string;
        notes: string;
    } | null;
    revision_details?: {
        surah: string;
        start_ayah: number;
        end_ayah: number;
        grade: string;
        notes: string;
    } | null;
    test_details?: {
        test_type: string;
        score: number;
        notes: string;
    } | null;
}

export const studentApi = {
    // ==================== STUDENT/PARENT ENDPOINTS ====================

    /**
     * Get all students for the authenticated parent
     * GET /academics/students/
     */
    getMyStudents: async (): Promise<Student[]> => {
        const data = await fetchWithAuth('/academics/students/');
        return Array.isArray(data) ? data : data.results || [];
    },

    /**
     * Get students for a specific user by user ID
     * GET /academics/users/{userId}/students/
     */
    getUserStudents: async (userId: number): Promise<Student[]> => {
        const data = await fetchWithAuth(`/academics/users/${userId}/students/`);
        return Array.isArray(data) ? data : data.results || [];
    },

    /**
     * Get detailed profile for a specific student
     * GET /academics/students/{studentId}/profile/
     */
    getStudentProfile: async (studentId: number): Promise<StudentProfile> => {
        return fetchWithAuth(`/academics/students/${studentId}/profile/`);
    },

    /**
     * Get all available seasons
     * GET /admin/seasons/
     */
    getSeasons: async (): Promise<Season[]> => {
        const data = await fetchWithAuth('/admin/seasons/');
        return Array.isArray(data) ? data : data.results || [];
    },

    /**
     * Get session records for a student in a specific enrollment/season
     * This fetches the student's attendance and evaluation records
     */
    getStudentSessions: async (studentId: number, seasonId?: number): Promise<SessionRecord[]> => {
        const query = seasonId ? `?season_id=${seasonId}` : '';
        const data = await fetchWithAuth(`/academics/students/${studentId}/sessions/${query}`);
        return Array.isArray(data) ? data : data.results || [];
    },

    // ==================== APPLICATION ENDPOINTS ====================

    /**
     * Submit a new student application (for parents)
     * POST /accounts/student/add/
     */
    submitStudentApplication: async (applicationData: {
        first_name: string;
        last_name: string;
        birth_date: string;
        birth_place: string;
        gender: 'M' | 'F';
        school_year: string;
        school_name?: string;
        personal_phone?: string;
        has_disease?: boolean;
        disease_name?: string;
    }) => {
        return fetchWithAuth('/accounts/student/add/', {
            method: 'POST',
            body: JSON.stringify(applicationData),
        });
    },

    /**
     * Get applications for the authenticated parent
     */
    getMyApplications: async (): Promise<Student[]> => {
        const data = await fetchWithAuth('/accounts/my-applications/');
        return Array.isArray(data) ? data : data.results || [];
    },
};

export default studentApi;
