export interface Season {
    season_id: number;
    season_type: string;
    season_start: string;
    season_end: string;
    is_active: boolean;
}

export interface Teacher {
    teacher_id: number;
    full_name: string;
}

export interface Course {
    course_id: number;
    course_name: string;
    season: Season;
    teacher: Teacher;
    min_Quran_level: string;
    max_quran_level: string;
}

export interface HifzDetails {
    surah_from: string;
    ayah_from: number;
    surah_to: string;
    ayah_to: number;
    mistakes: string;
    remark: string;
}

export interface TestDetails extends HifzDetails {
    ahkam_applying: string;
}

export interface RevisionDetails extends HifzDetails {
    ahkam_applying: string;
}

export interface SessionRecord {
    student_id: number;
    student_name: string;
    session_date: string;
    session_number: number;
    session_type: 'NORMAL' | 'TEST' | 'HIFZ_REVISION' | string;
    attendance: boolean;
    justification: string;
    test_details?: TestDetails;
    hifz_details?: HifzDetails;
    revision_details?: RevisionDetails;
}

export interface ProgressStats {
    attendance_rate: number;
    latest_hifz: string;
    latest_revision: string;
}

export interface StudentProfile {
    application_id: number;
    first_name: string;
    last_name: string;
    school_year: string;
    school_name: string;
    current_season: Season;
    current_course: Course;
    teacher: Teacher;
    progress_stats: ProgressStats;
    session_records: SessionRecord[];
}

export interface SessionSummary {
    session_id: number;
    session_day: string;
    session_num: number;
    session_type: string;
}

export interface SessionAttendanceRecord {
    student_id: number;
    student_name: string;
    attendance: boolean;
    test_details?: TestDetails | null;
}

export interface SessionDetails {
    session_id: number;
    session_day: string;
    session_num: number;
    session_type: string;
    attendance_records: SessionAttendanceRecord[];
}
