import { useState, useEffect } from 'react';
import { CourseCard } from '../components/history/CourseCard';
import { historyApi } from '../services/historyApi';
import type { SessionSummary, SessionDetails, Course } from '../types/history';
import { ArrowRight, Calendar, ClipboardList, User } from 'lucide-react';

type ViewState = 'COURSE_LIST' | 'COURSE_SESSIONS' | 'SESSION_DETAILS';

interface HistoryPageProps {
    onBack: () => void;
}

export default function HistoryPage({ onBack }: HistoryPageProps) {
    const [view, setView] = useState<ViewState>('COURSE_LIST');
    const [, setActiveCourseId] = useState<number | null>(null);
    const [, setActiveSessionId] = useState<number | null>(null);

    // Data States
    const [courses, setCourses] = useState<Course[]>([]);
    const [sessions, setSessions] = useState<SessionSummary[]>([]);
    const [sessionDetail, setSessionDetail] = useState<SessionDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initial Load - Fetch Teacher Courses
    useEffect(() => {
        const fetchCourses = async () => {
            setCoursesLoading(true);
            try {
                // TODO: Replace with actual API call when endpoint /academics/teachers/{id}/courses/ is ready
                // const data = await historyApi.getTeacherCourses(2);
                // setCourses(data);

                // Falling back to mock data for development/demo
                const mockTeacherCourses: Course[] = [
                    {
                        course_id: 1,
                        course_name: "Juzu' Amma Class",
                        season: {
                            season_id: 1,
                            season_type: "ANNUAL",
                            season_start: "2025-12-30",
                            season_end: "2026-10-26",
                            is_active: true
                        },
                        teacher: {
                            teacher_id: 2,
                            full_name: "Ahmed Mansour"
                        },
                        min_Quran_level: "None",
                        max_quran_level: "Juzu' Amma"
                    }
                ];

                // Simulating network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                setCourses(mockTeacherCourses);

            } catch (err: any) {
                console.error("Failed to fetch courses", err);
                setError("فشل في تحميل الحلقات: " + err.message);
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Handlers
    const handleCourseClick = async (courseId: number) => {
        setActiveCourseId(courseId);
        setLoading(true);
        setError(null);
        try {
            const data = await historyApi.getCourseSessions(courseId);
            setSessions(data);
            setView('COURSE_SESSIONS');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionClick = async (sessionId: number) => {
        setActiveSessionId(sessionId);
        setLoading(true);
        setError(null);
        try {
            const data = await historyApi.getSessionDetails(sessionId);
            setSessionDetail(data);
            setView('SESSION_DETAILS');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        if (view === 'SESSION_DETAILS') {
            setView('COURSE_SESSIONS');
        } else if (view === 'COURSE_SESSIONS') {
            setView('COURSE_LIST');
            setActiveCourseId(null);
        } else {
            onBack();
        }
    };

    // Render Functions
    const renderCourseList = () => (
        <>
            <header className="mb-10">
                <div className="flex justify-between items-start">
                    <button onClick={onBack} className="flex items-center gap-2 text-[#617D8A] hover:text-[#1a5f5f] transition-colors">
                        <ArrowRight className="w-5 h-5 rotate-180" />
                        <span>رجوع</span>
                    </button>
                    <div className="text-right">
                        <h1
                            className="text-[#1a5f5f] mb-3"
                            dir="rtl"
                            style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1.3' }}
                        >
                            سجل الحلقات القرآنية
                        </h1>
                        <p
                            className="text-[#617D8A]"
                            dir="rtl"
                            style={{ fontSize: '16px', fontWeight: '400' }}
                        >
                            نرحب الاطلاع لعرض جميع الحلقات القرآنية والجلسات الدراسية
                        </p>
                    </div>
                </div>
            </header>

            <div className="mb-8">
                <h2
                    className="text-[#1a5f5f] mb-3 text-right"
                    dir="rtl"
                    style={{ fontSize: '20px', fontWeight: '600' }}
                >
                    التفاصيل
                </h2>
                <div className="w-full h-[1px] bg-[#e0e0e0] mb-8"></div>

                {/* Course Cards Grid */}
                {coursesLoading ? (
                    <div className="text-center py-10" dir="rtl">جاري تحميل الحلقات...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8" dir="rtl">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <div key={course.course_id} onClick={() => handleCourseClick(course.course_id)}>
                                    <CourseCard course={course} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 py-10" dir="rtl">
                                لا توجد حلقات متاحة لهذا المعلم (أو فشل الاتصال بالخادم).
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );

    const renderSessionsList = () => (
        <div className="animate-fade-in" dir="rtl">
            <button onClick={goBack} className="flex items-center gap-2 text-[#617D8A] mb-6 hover:text-[#1a5f5f] transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>العودة للحلقات</span>
            </button>

            <h2 className="text-2xl font-bold text-[#1a5f5f] mb-6">جلسات الحلقة</h2>

            {loading ? (
                <div className="text-center py-10">جاري التحميل...</div>
            ) : (
                <div className="space-y-4">
                    {sessions.length > 0 ? sessions.map((session) => (
                        <div
                            key={session.session_id}
                            onClick={() => handleSessionClick(session.session_id)}
                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all flex justify-between items-center"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#e0f2f1] flex items-center justify-center text-[#1a5f5f]">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">جلسة رقم {session.session_num}</h3>
                                    <p className="text-sm text-gray-500">{session.session_day}</p>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
                                {session.session_type}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-gray-500 py-10">لا توجد جلسات مسجلة لهذه الحلقة.</div>
                    )}
                </div>
            )}
        </div>
    );

    const renderSessionDetails = () => (
        <div className="animate-fade-in" dir="rtl">
            <button onClick={goBack} className="flex items-center gap-2 text-[#617D8A] mb-6 hover:text-[#1a5f5f] transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>العودة للجلسات</span>
            </button>

            {sessionDetail && (
                <>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                        <h2 className="text-2xl font-bold text-[#1a5f5f] mb-2">تفاصيل الجلسة {sessionDetail.session_num}</h2>
                        <div className="flex gap-6 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{sessionDetail.session_day}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5" />
                                <span>{sessionDetail.session_type}</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#1a5f5f] mb-4">سجل الحضور ({sessionDetail.attendance_records.length})</h3>
                    <div className="grid gap-4">
                        {sessionDetail.attendance_records.map((record) => (
                            <div key={record.student_id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <span className="font-bold text-gray-800">{record.student_name}</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${record.attendance ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {record.attendance ? 'حاضر' : 'غائب'}
                                    </span>
                                </div>

                                {record.test_details && (
                                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mt-2">
                                        <p><strong>التسميع:</strong> من {record.test_details.surah_from} ({record.test_details.ayah_from}) إلى {record.test_details.surah_to} ({record.test_details.ayah_to})</p>
                                        {record.test_details.mistakes && <p className="text-red-500 mt-1"><strong>الأخطاء:</strong> {record.test_details.mistakes}</p>}
                                        <p className="mt-1 text-[#1a5f5f]"><strong>ملاحظات:</strong> {record.test_details.remark}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Main Content */}
            <div className="p-8 lg:px-12 lg:py-10 h-screen overflow-y-auto">
                <div className="max-w-[1200px] mx-auto">
                    {error && (
                        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg border border-red-100" dir="rtl">
                            حدث خطأ: {error}
                        </div>
                    )}

                    {view === 'COURSE_LIST' && renderCourseList()}
                    {view === 'COURSE_SESSIONS' && renderSessionsList()}
                    {view === 'SESSION_DETAILS' && renderSessionDetails()}
                </div>
            </div>
        </div>
    );
}
