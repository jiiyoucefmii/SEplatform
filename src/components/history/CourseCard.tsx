import { BookOpen, Check, Clock } from 'lucide-react';
import type { Course } from '../../types/history';

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const isOngoing = course.season?.is_active ?? true;

    // Mapping backend data to UI
    const title = course.course_name;
    const hijriYear = course.season?.season_end?.split('-')[0] ?? '1446'; // Fallback logic
    const type = course.season?.season_type === 'ANNUAL' ? 'سنوية' : 'فصلية';
    const startDate = course.season?.season_start ?? '---';

    // Check if teacher is defined before accessing full_name
    const teacherName = course.teacher?.full_name ?? 'غير محدد';

    return (
        <div
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${isOngoing
                ? 'border-2 border-[#d4a574]'
                : 'border-[1.5px] border-[#c8e6c9]'
                }`}
        >
            {/* Icon in top right */}
            <div className="flex justify-end mb-5">
                <div className="w-12 h-12 rounded-full bg-[#fef9f0] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#d4a574]" />
                </div>
            </div>

            {/* Course Title */}
            <div className="text-right mb-5">
                <h3
                    className="text-[#1a5f5f]"
                    dir="rtl"
                    style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.4' }}
                >
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mt-1" dir="rtl">المعلم: {teacherName}</p>
            </div>

            {/* Details List */}
            <div className="space-y-3 mb-6" dir="rtl">
                {/* Year */}
                <div className="flex justify-between items-center">
                    <span
                        className="text-[#2c3e50]"
                        style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'monospace' }}
                    >
                        {hijriYear}
                    </span>
                    <span
                        className="text-[#617D8A]"
                        style={{ fontSize: '14px', fontWeight: '400' }}
                    >
                        : السنة
                    </span>
                </div>

                {/* Course Type */}
                <div className="flex justify-between items-center">
                    <span
                        className="text-[#2c3e50]"
                        style={{ fontSize: '14px', fontWeight: '500' }}
                    >
                        {type}
                    </span>
                    <span
                        className="text-[#617D8A]"
                        style={{ fontSize: '14px', fontWeight: '400' }}
                    >
                        : نوع الدورة
                    </span>
                </div>

                {/* Start Date */}
                <div className="flex justify-between items-center">
                    <span
                        className="text-[#2c3e50]"
                        style={{ fontSize: '13px', fontWeight: '500', fontFamily: 'monospace' }}
                    >
                        {startDate}
                    </span>
                    <span
                        className="text-[#617D8A]"
                        style={{ fontSize: '14px', fontWeight: '400' }}
                    >
                        : تاريخ البدء
                    </span>
                </div>
            </div>

            {/* Status Button */}
            <button
                className={`w-full h-11 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${isOngoing
                    ? 'bg-[#d4a574] text-white border-2 border-[#d4a574] hover:bg-[#c89563]'
                    : 'bg-[#e8f5e9] text-[#2e7d32] border-[1.5px] border-[#c8e6c9] hover:bg-[#d4edd6]'
                    }`}
                dir="rtl"
                style={{ fontSize: '16px', fontWeight: '500' }}
            >
                {isOngoing ? (
                    <>
                        <Clock className="w-4 h-4" />
                        <span>مستمرة</span>
                    </>
                ) : (
                    <>
                        <Check className="w-4 h-4" />
                        <span>مكتملة</span>
                    </>
                )}
            </button>
        </div>
    );
}
