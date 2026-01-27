import type { StudentProfileResponse } from '../types/student-profile';

// API Configuration - Using Vite proxy to bypass CORS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export type { StudentProfileResponse };

// Helper function to parse Hifz string (e.g., "Hifz: Al-Nisa:95")
export function parseHifzString(hifzString: string): {
    surahName: string;
    ayahNumber: number;
} | null {
    if (!hifzString) return null;

    // Extract the part after "Hifz: " or "Revision: "
    const match = hifzString.match(/(?:Hifz|Revision):\s*(.+):(\d+)/);
    if (!match) return null;

    return {
        surahName: match[1].trim(),
        ayahNumber: parseInt(match[2], 10)
    };
}

// Helper function to translate status to Arabic
export function translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
        'ACTIVE': 'نشط',
        'PENDING': 'قيد الانتظار',
        'INACTIVE': 'غير نشط'
    };
    return statusMap[status] || status;
}

// Helper function to format date in Arabic
export function formatDateArabic(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;

    // Format as DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// API Service
export class StudentProfileAPI {
    /**
     * Fetch student profile data
     * @param studentId - The student's ID
     * @returns Promise with student profile data
     */
    static async getStudentProfile(studentId: number): Promise<StudentProfileResponse> {
        try {
            // MOCK IMPLEMENTATION - Return static data to bypass backend
            console.log('Returning mock data for student:', studentId);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const mockData: StudentProfileResponse = {
                application_id: studentId,
                first_name: "أحمد",
                last_name: "محمد",
                school_year: "المستوى الثالث",
                age: 12,
                status: "ACTIVE",
                progress_stats: {
                    total_sessions: 45,
                    present_count: 42,
                    absent_count: 3,
                    attendance_rate: 93.3,
                    exams_count: 5,
                    last_exam_date: "2024-12-15T10:00:00Z",
                    latest_hifz: "Hifz: سورة الملك:15",
                    latest_revision: "Revision: سورة النبأ:20"
                },
                current_course: {
                    course_name: "حلقة التحفيظ المكثف",
                    teacher: {
                        full_name: "الشيخ عبد الله"
                    },
                    max_quran_level: "جزء تبارك"
                },
                session_records: []
            };

            return mockData;

            /*
            const url = `${API_BASE_URL}/academics/students/${studentId}/profile/`;
            console.log('Fetching from:', url);

            const response = await fetch(url);
            
            // ... original fetch logic ...
            */
        } catch (error) {
            console.error('Error fetching student profile:', error);
            throw error;
        }
    }
}
