import type { StudentProfile, SessionSummary, SessionDetails, Course } from '../types/history';

const BASE_URL = 'http://localhost:8000';

export const historyApi = {
    /**
     * Fetches the complete academic dashboard for a student.
     * @param studentId The ID of the student
     */
    getStudentProfile: async (studentId: string | number): Promise<StudentProfile> => {
        const response = await fetch(`${BASE_URL}/academics/students/${studentId}/profile/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch student profile: ${response.statusText}`);
        }
        return response.json();
    },

    /**
     * Fetches the list of sessions for a course.
     * @param courseId The ID of the course
     */
    getCourseSessions: async (courseId: string | number): Promise<SessionSummary[]> => {
        const response = await fetch(`${BASE_URL}/academics/courses/${courseId}/sessions/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch course sessions: ${response.statusText}`);
        }
        return response.json();
    },

    /**
     * Fetches full details for a specific session.
     * @param sessionId The ID of the session
     */
    getSessionDetails: async (sessionId: string | number): Promise<SessionDetails> => {
        const response = await fetch(`${BASE_URL}/academics/sessions/${sessionId}/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch session details: ${response.statusText}`);
        }
        return response.json();
    },

    /**
     * Fetches the list of courses for a specific teacher.
     * @param teacherId The ID of the teacher
     */
    getTeacherCourses: async (teacherId: string | number): Promise<Course[]> => {
        const response = await fetch(`${BASE_URL}/academics/teachers/${teacherId}/courses/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch teacher courses: ${response.statusText}`);
        }
        return response.json();
    }
};
