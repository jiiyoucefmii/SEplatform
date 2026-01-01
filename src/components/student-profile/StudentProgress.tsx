import { ArrowLeft, User, Calendar, TrendingUp, CheckSquare, Loader2, AlertCircle } from "lucide-react";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { parseHifzString, translateStatus, formatDateArabic } from "../../services/studentProfileApi";

interface StudentProgressProps {
    studentId: number;
    onBack: () => void;
}

export function StudentProgress({ studentId, onBack }: StudentProgressProps) {
    const { data, loading, error, refetch } = useStudentProfile(studentId);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#0a5f5c] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">جاري تحميل بيانات الطالب...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl text-gray-800 mb-2">حدث خطأ</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button
                        onClick={refetch}
                        className="px-6 py-2 bg-[#0a5f5c] text-white rounded-lg hover:bg-[#084948] transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    // No data state
    if (!data) {
        return (
            <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg">لا توجد بيانات للطالب</p>
                </div>
            </div>
        );
    }

    // Parse Hifz data
    const hifzData = parseHifzString(data.progress_stats.latest_hifz);
    const fullName = `${data.first_name} ${data.last_name}`;
    const statusArabic = translateStatus(data.status);
    const statusColor = data.status === 'ACTIVE' ? 'text-green-600' :
        data.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600';

    // Calculate completion percentage (this is a simple example, adjust based on your needs)
    // You might want to calculate this based on total Quran verses or surahs
    const completionPercentage = 54; // Placeholder - implement your calculation logic

    return (
        <div className="min-h-screen bg-[#faf8f3]">
            {/* Top Bar */}
            <div className="bg-[#0a5f5c] px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <h1 className="text-xl text-white">{fullName}</h1>
                        <p className="text-teal-200 text-sm">{data.school_year}</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-[#0a5f5c]" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#084948] rounded-lg transition-colors"
                    >
                        <span>رجوع</span>
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                {/* Page Title */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl text-gray-800 mb-2">ملف الطالب</h2>
                    <p className="text-gray-600">عرض شامل لتقدم الطالب وإحصائياته الدراسية</p>
                </div>

                {/* Section Title */}
                <div className="text-right mb-6">
                    <h3 className="text-xl text-gray-800">التفاصيل</h3>
                    <div className="w-full h-px bg-gray-300 mt-2"></div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Student Info Card */}
                    <div className="bg-white rounded-xl border-2 border-[#f4d89f] p-6">
                        <div className="flex justify-end mb-4">
                            <User className="w-8 h-8 text-[#f4d89f]" />
                        </div>
                        <h3 className="text-[#0a5f5c] text-lg mb-4 text-right">المعلومات الأساسية</h3>
                        <div className="space-y-3 text-right">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">الاسم :</span>
                                <span className="text-gray-900">{fullName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">المستوى :</span>
                                <span className="text-gray-900">{data.school_year}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">العمر :</span>
                                <span className="text-gray-900">{data.age} سنة</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">الحالة :</span>
                                <span className={statusColor}>{statusArabic}</span>
                            </div>
                        </div>
                    </div>

                    {/* Current Progress Card */}
                    <div className="bg-white rounded-xl border-2 border-[#f4d89f] p-6">
                        <div className="flex justify-end mb-4">
                            <TrendingUp className="w-8 h-8 text-[#f4d89f]" />
                        </div>
                        <h3 className="text-[#0a5f5c] text-lg mb-4 text-right">التقدم الحالي</h3>
                        <div className="space-y-3 text-right">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">السورة الحالية :</span>
                                <span className="text-gray-900">
                                    {hifzData ? `سورة ${hifzData.surahName}` : 'غير متوفر'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">الآية الحالية :</span>
                                <span className="text-gray-900">
                                    {hifzData ? `${hifzData.ayahNumber}` : 'غير متوفر'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">السور المكتملة :</span>
                                <span className="text-gray-900">-</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">نسبة الإنجاز :</span>
                                <span className="text-gray-900">{completionPercentage}%</span>
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#0a5f5c] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Sessions Stats Card */}
                    <div className="bg-white rounded-xl border-2 border-[#f4d89f] p-6">
                        <div className="flex justify-end mb-4">
                            <Calendar className="w-8 h-8 text-[#f4d89f]" />
                        </div>
                        <h3 className="text-[#0a5f5c] text-lg mb-4 text-right">إحصائيات الحصص</h3>
                        <div className="space-y-3 text-right">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">إجمالي الحصص :</span>
                                <span className="text-gray-900">{data.progress_stats.total_sessions}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">الحصص الحاضرة :</span>
                                <span className="text-gray-900">{data.progress_stats.present_count}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">الحصص الغائبة :</span>
                                <span className="text-gray-900">{data.progress_stats.absent_count}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">نسبة الحضور :</span>
                                <span className="text-gray-900">{data.progress_stats.attendance_rate.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Tests Card */}
                    <div className="bg-white rounded-xl border-2 border-[#f4d89f] p-6">
                        <div className="flex justify-end mb-4">
                            <CheckSquare className="w-8 h-8 text-[#f4d89f]" />
                        </div>
                        <h3 className="text-[#0a5f5c] text-lg mb-4 text-right">الاختبارات</h3>
                        <div className="space-y-3 text-right">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">عدد الاختبارات :</span>
                                <span className="text-gray-900">{data.progress_stats.exams_count}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">التاريخ :</span>
                                <span className="text-gray-900">
                                    آخر اختبار: {formatDateArabic(data.progress_stats.last_exam_date)}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
