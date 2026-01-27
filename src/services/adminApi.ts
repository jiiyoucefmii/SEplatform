/**
 * Admin API Service
 * 
 * Provides API methods for school admin operations including:
 * - Teacher management
 * - Student applications
 * - Seasons and courses management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function for authenticated admin requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = `API Error ${response.status}`;
        try {
            const errorData = await response.json();
            // Handle DRF validation errors (field-level errors)
            if (typeof errorData === 'object' && !errorData.detail && !errorData.message) {
                const fieldErrors = Object.entries(errorData)
                    .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
                    .join('\n');
                errorMessage = fieldErrors || errorMessage;
            } else {
                errorMessage = errorData.detail || errorData.message || errorData.error || errorMessage;
            }
        } catch {
            errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) return null;
    return response.json();
};

export const adminApi = {
    // ==================== TEACHERS ====================
    getTeachers: async () => {
        return fetchWithAuth('/admin/teachers/');
    },

    getTeacher: async (teacherId: string | number) => {
        return fetchWithAuth(`/admin/teachers/${teacherId}/`);
    },

    createTeacher: async (teacherData: {
        phone_number: string;
        first_name: string;
        last_name: string;
        gender: 'M' | 'F';
        hire_date?: string;
        title_chikh?: string;
    }) => {
        return fetchWithAuth('/admin/teachers/create/', {
            method: 'POST',
            body: JSON.stringify(teacherData),
        });
    },

    updateTeacher: async (teacherId: string | number, teacherData: Record<string, unknown>) => {
        return fetchWithAuth(`/admin/teachers/${teacherId}/`, {
            method: 'PATCH',
            body: JSON.stringify(teacherData),
        });
    },

    deleteTeacher: async (teacherId: string | number) => {
        return fetchWithAuth(`/admin/teachers/${teacherId}/`, {
            method: 'DELETE',
        });
    },

    resetTeacherPIN: async (teacherId: string | number) => {
        return fetchWithAuth(`/admin/teachers/${teacherId}/reset-pin/`, {
            method: 'POST',
        });
    },

    // ==================== STUDENT APPLICATIONS ====================
    getApplications: async (status?: string) => {
        const query = status ? `?status=${status}` : '';
        return fetchWithAuth(`/admin/applications/${query}`);
    },

    getApplication: async (applicationId: string | number) => {
        return fetchWithAuth(`/admin/applications/${applicationId}/`);
    },

    approveApplication: async (applicationId: string | number, courseId: string | number, seasonId: string | number) => {
        return fetchWithAuth(`/admin/applications/${applicationId}/approve/`, {
            method: 'POST',
            body: JSON.stringify({ course_id: courseId, season_id: seasonId }),
        });
    },

    rejectApplication: async (applicationId: string | number, reason?: string) => {
        return fetchWithAuth(`/admin/applications/${applicationId}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'REJECTED', rejection_reason: reason }),
        });
    },

    // ==================== SEASONS ====================
    getSeasons: async () => {
        return fetchWithAuth('/admin/seasons/');
    },

    getSeason: async (seasonId: string | number) => {
        return fetchWithAuth(`/admin/seasons/${seasonId}/`);
    },

    createSeason: async (seasonData: {
        season_type: 'SUMMER' | 'ANNUAL';
        season_start: string;
        season_end: string;
        registration_start_date: string;
        registration_end_date: string;
    }) => {
        return fetchWithAuth('/admin/seasons/', {
            method: 'POST',
            body: JSON.stringify(seasonData),
        });
    },

    updateSeason: async (seasonId: string | number, seasonData: Record<string, unknown>) => {
        return fetchWithAuth(`/admin/seasons/${seasonId}/`, {
            method: 'PATCH',
            body: JSON.stringify(seasonData),
        });
    },

    activateSeason: async (seasonId: string | number) => {
        return fetchWithAuth(`/admin/seasons/${seasonId}/activate/`, {
            method: 'POST',
        });
    },

    deleteSeason: async (seasonId: string | number) => {
        return fetchWithAuth(`/admin/seasons/${seasonId}/`, {
            method: 'DELETE',
        });
    },

    // ==================== COURSES ====================
    getCourses: async (seasonId?: string) => {
        const query = seasonId ? `?season_id=${seasonId}` : '';
        return fetchWithAuth(`/admin/courses/${query}`);
    },

    getCourse: async (courseId: string | number) => {
        return fetchWithAuth(`/admin/courses/${courseId}/`);
    },

    createCourse: async (courseData: {
        course_name: string;
        season: string | number;
        teacher?: string | number;
        min_age: number;
        max_age: number;
        min_Quran_level: string;
        max_quran_level: string;
        max_student_num: number;
    }) => {
        return fetchWithAuth('/admin/courses/', {
            method: 'POST',
            body: JSON.stringify(courseData),
        });
    },

    updateCourse: async (courseId: string | number, courseData: Record<string, unknown>) => {
        return fetchWithAuth(`/admin/courses/${courseId}/`, {
            method: 'PATCH',
            body: JSON.stringify(courseData),
        });
    },

    deleteCourse: async (courseId: string | number) => {
        return fetchWithAuth(`/admin/courses/${courseId}/`, {
            method: 'DELETE',
        });
    },

    assignTeacherToCourse: async (courseId: string | number, teacherId: string | number) => {
        return fetchWithAuth(`/admin/courses/${courseId}/assign-teacher/`, {
            method: 'POST',
            body: JSON.stringify({ teacher_id: teacherId }),
        });
    },

    // ==================== SYSTEM CONFIGURATION ====================
    getSystemConfig: async () => {
        return fetchWithAuth('/admin/system/cycle/');
    },

    updateSystemConfig: async (config: Record<string, unknown>) => {
        return fetchWithAuth('/admin/system/cycle/', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    },
};

export default adminApi;
