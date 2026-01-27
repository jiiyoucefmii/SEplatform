import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";

interface Course {
    course_id: number;
    course_name: string;
    min_age: number;
    max_age: number;
    min_Quran_level: string;
    max_quran_level: string;
    max_student_num: number;
    season: number;
    teacher: number | null;
    teacher_name?: string;
    season_name?: string;
    enrolled_count?: number;
}

interface Teacher {
    user: number;
    first_name?: string;
    last_name?: string;
    user_details?: {
        first_name: string;
        last_name: string;
    };
}

interface Season {
    season_id: number;
    season_type: string;
    is_active: boolean;
}

interface CourseFormData {
    course_name: string;
    min_age: number;
    max_age: number;
    min_Quran_level: string;
    max_quran_level: string;
    max_student_num: number;
    season: number;
}

const initialFormData: CourseFormData = {
    course_name: '',
    min_age: 6,
    max_age: 12,
    min_Quran_level: '0',
    max_quran_level: '30',
    max_student_num: 25,
    season: 0,
};

export default function CoursesTab() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number>(0);
    const [formData, setFormData] = useState<CourseFormData>(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [coursesData, teachersData, seasonsData] = await Promise.all([
                adminApi.getCourses(),
                adminApi.getTeachers(),
                adminApi.getSeasons(),
            ]);
            setCourses(Array.isArray(coursesData) ? coursesData : coursesData.results || []);
            setTeachers(Array.isArray(teachersData) ? teachersData : teachersData.results || []);
            setSeasons(Array.isArray(seasonsData) ? seasonsData : seasonsData.results || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("فشل تحميل البيانات");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setSelectedCourse(null);
        const activeSeason = seasons.find(s => s.is_active);
        setFormData({
            ...initialFormData,
            season: activeSeason?.season_id || 0,
        });
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenEdit = (course: Course) => {
        setSelectedCourse(course);
        setFormData({
            course_name: course.course_name,
            min_age: course.min_age,
            max_age: course.max_age,
            min_Quran_level: course.min_Quran_level,
            max_quran_level: course.max_quran_level,
            max_student_num: course.max_student_num,
            season: course.season,
        });
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenDelete = (course: Course) => {
        setSelectedCourse(course);
        setIsDeleteOpen(true);
    };

    const handleOpenAssign = (course: Course) => {
        setSelectedCourse(course);
        setSelectedTeacherId(course.teacher || 0);
        setIsAssignOpen(true);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!formData.course_name || !formData.season) {
            setError("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            if (selectedCourse) {
                await adminApi.updateCourse(selectedCourse.course_id, formData as any);
            } else {
                await adminApi.createCourse({
                    course_name: formData.course_name,
                    season: formData.season,
                    min_age: formData.min_age,
                    max_age: formData.max_age,
                    min_Quran_level: formData.min_Quran_level,
                    max_quran_level: formData.max_quran_level,
                    max_student_num: formData.max_student_num,
                });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء الحفظ");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCourse) return;

        setSubmitting(true);
        try {
            await adminApi.deleteCourse(selectedCourse.course_id);
            setIsDeleteOpen(false);
            fetchData();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء الحذف");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAssignTeacher = async () => {
        if (!selectedCourse) return;

        setSubmitting(true);
        try {
            await adminApi.assignTeacherToCourse(selectedCourse.course_id, selectedTeacherId);
            setIsAssignOpen(false);
            fetchData();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء التعيين");
        } finally {
            setSubmitting(false);
        }
    };

    const getTeacherName = (teacher: Teacher) => {
        return `${teacher.user_details?.first_name || teacher.first_name} ${teacher.user_details?.last_name || teacher.last_name}`;
    };

    const columns = [
        {
            key: 'course_name',
            header: 'اسم الفوج',
            render: (c: Course) => <span className="font-medium">{c.course_name}</span>,
        },
        {
            key: 'age_range',
            header: 'الفئة العمرية',
            render: (c: Course) => `${c.min_age} - ${c.max_age} سنة`,
        },
        {
            key: 'quran_level',
            header: 'مستوى الحفظ',
            render: (c: Course) => `${c.min_Quran_level} - ${c.max_quran_level} جزء`,
        },
        {
            key: 'teacher',
            header: 'المعلم',
            render: (c: Course) => c.teacher_name || (
                <span className="text-gray-400 italic">غير معين</span>
            ),
        },
        {
            key: 'max_student_num',
            header: 'الطلاب',
            render: (c: Course) => `${c.enrolled_count || 0} / ${c.max_student_num}`,
        },
        {
            key: 'actions',
            header: 'الإجراءات',
            render: (c: Course) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleOpenAssign(c)}
                        className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        title="تعيين معلم"
                    >
                        <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleOpenDelete(c)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">إدارة الأفواج</h2>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-[#024C3F] text-white px-4 py-2 rounded-lg hover:bg-[#036B57] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    فوج جديد
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="p-4">
                <DataTable
                    columns={columns}
                    data={courses}
                    loading={loading}
                    emptyMessage="لا توجد أفواج مسجلة"
                    keyExtractor={(c) => c.course_id}
                />
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedCourse ? "تعديل فوج" : "إضافة فوج جديد"}
                footer={
                    <>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-4 py-2 bg-[#024C3F] text-white rounded-lg hover:bg-[#036B57] disabled:opacity-50"
                        >
                            {submitting ? "جارٍ الحفظ..." : "حفظ"}
                        </button>
                    </>
                }
            >
                <div className="space-y-4" dir="rtl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            اسم الفوج *
                        </label>
                        <input
                            type="text"
                            value={formData.course_name}
                            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                            placeholder="مثال: فوج الفاتحة"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            الموسم *
                        </label>
                        <select
                            value={formData.season}
                            onChange={(e) => setFormData({ ...formData, season: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                        >
                            <option value={0}>اختر الموسم</option>
                            {seasons.map((s) => (
                                <option key={s.season_id} value={s.season_id}>
                                    {s.season_type === 'SUMMER' ? 'صيفي' : 'عادي'} {s.is_active && '(مفعّل)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                العمر من
                            </label>
                            <input
                                type="number"
                                value={formData.min_age}
                                onChange={(e) => setFormData({ ...formData, min_age: parseInt(e.target.value) })}
                                min={4}
                                max={50}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                العمر إلى
                            </label>
                            <input
                                type="number"
                                value={formData.max_age}
                                onChange={(e) => setFormData({ ...formData, max_age: parseInt(e.target.value) })}
                                min={4}
                                max={50}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                مستوى الحفظ من (جزء)
                            </label>
                            <input
                                type="number"
                                value={formData.min_Quran_level}
                                onChange={(e) => setFormData({ ...formData, min_Quran_level: e.target.value })}
                                min={0}
                                max={30}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                مستوى الحفظ إلى (جزء)
                            </label>
                            <input
                                type="number"
                                value={formData.max_quran_level}
                                onChange={(e) => setFormData({ ...formData, max_quran_level: e.target.value })}
                                min={0}
                                max={30}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            الحد الأقصى للطلاب
                        </label>
                        <input
                            type="number"
                            value={formData.max_student_num}
                            onChange={(e) => setFormData({ ...formData, max_student_num: parseInt(e.target.value) })}
                            min={1}
                            max={100}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                        />
                    </div>
                </div>
            </Modal>

            {/* Assign Teacher Modal */}
            <Modal
                isOpen={isAssignOpen}
                onClose={() => setIsAssignOpen(false)}
                title="تعيين معلم للفوج"
                size="sm"
                footer={
                    <>
                        <button
                            onClick={() => setIsAssignOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleAssignTeacher}
                            disabled={submitting}
                            className="px-4 py-2 bg-[#024C3F] text-white rounded-lg hover:bg-[#036B57] disabled:opacity-50"
                        >
                            {submitting ? "جارٍ التعيين..." : "تعيين"}
                        </button>
                    </>
                }
            >
                <div dir="rtl">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        اختر المعلم
                    </label>
                    <select
                        value={selectedTeacherId}
                        onChange={(e) => setSelectedTeacherId(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                    >
                        <option value={0}>بدون معلم</option>
                        {teachers.map((t) => (
                            <option key={t.user} value={t.user}>
                                {getTeacherName(t)}
                            </option>
                        ))}
                    </select>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                isLoading={submitting}
                title="حذف الفوج"
                message={`هل أنت متأكد من حذف الفوج "${selectedCourse?.course_name}"؟`}
                confirmText="حذف"
            />
        </div>
    );
}
