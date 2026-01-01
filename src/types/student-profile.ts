// Types based on the API documentation
export interface StudentProfileResponse {
    application_id: number;
    first_name: string;
    last_name: string;
    school_year: string;
    age: number;
    status: 'ACTIVE' | 'PENDING' | 'INACTIVE';

    progress_stats: {
        total_sessions: number;
        present_count: number;
        absent_count: number;
        attendance_rate: number;

        exams_count: number;
        last_exam_date: string;

        latest_hifz: string;
        latest_revision: string;
    };

    current_course: {
        course_name: string;
        teacher: {
            full_name: string;
        };
        max_quran_level?: string;
    };

    session_records?: any[];
}
