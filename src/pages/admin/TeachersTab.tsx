import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, KeyRound } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";

interface Teacher {
    user: number;
    pin_code: string;
    hire_date: string;
    gender: string;
    title_chikh: string;
    phone_number?: string;
    first_name?: string;
    last_name?: string;
    user_details?: {
        first_name: string;
        last_name: string;
        phone_number: string;
    };
}

interface TeacherFormData {
    phone_number: string;
    first_name: string;
    last_name: string;
    password: string;
    gender: 'M' | 'F';
    hire_date: string;
    title_chikh: string;
}

const initialFormData: TeacherFormData = {
    phone_number: '',
    first_name: '',
    last_name: '',
    password: '',
    gender: 'M',
    hire_date: new Date().toISOString().split('T')[0],
    title_chikh: '',
};

export default function TeachersTab() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isResetPINOpen, setIsResetPINOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [formData, setFormData] = useState<TeacherFormData>(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getTeachers();
            setTeachers(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error("Failed to fetch teachers:", err);
            setError("فشل تحميل قائمة المعلمين");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setSelectedTeacher(null);
        setFormData(initialFormData);
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenEdit = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setFormData({
            first_name: teacher.user_details?.first_name || teacher.first_name || '',
            last_name: teacher.user_details?.last_name || teacher.last_name || '',
            phone_number: teacher.user_details?.phone_number || teacher.phone_number || '',
            password: '',  // Not needed for edit
            gender: teacher.gender === 'M' ? 'M' : 'F',
            hire_date: teacher.hire_date || '',
            title_chikh: teacher.title_chikh || '',
        });
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenDelete = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsDeleteOpen(true);
    };

    const handleOpenResetPIN = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsResetPINOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.first_name || !formData.last_name) {
            setError("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        if (!selectedTeacher && !formData.phone_number) {
            setError("رقم الهاتف مطلوب للمعلم الجديد");
            return;
        }

        if (!selectedTeacher && (!formData.password || formData.password.length < 6)) {
            setError("كلمة المرور مطلوبة (6 أحرف على الأقل)");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            if (selectedTeacher) {
                await adminApi.updateTeacher(selectedTeacher.user, {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    gender: formData.gender,
                    hire_date: formData.hire_date,
                    title_chikh: formData.title_chikh,
                });
            } else {
                const result = await adminApi.createTeacher({
                    phone_number: formData.phone_number,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    password: formData.password,
                    gender: formData.gender,
                    hire_date: formData.hire_date,
                    title_chikh: formData.title_chikh,
                } as any);

                // Show PIN to admin after successful creation
                if (result.plain_pin) {
                    alert(`تم إنشاء المعلم بنجاح!\n\nالرمز السري (PIN): ${result.plain_pin}\n\nيرجى إعطاء هذا الرمز للمعلم بشكل آمن.`);
                }
            }
            setIsModalOpen(false);
            fetchTeachers();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء الحفظ");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedTeacher) return;

        setSubmitting(true);
        try {
            await adminApi.deleteTeacher(selectedTeacher.user);
            setIsDeleteOpen(false);
            fetchTeachers();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء الحذف");
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPIN = async () => {
        if (!selectedTeacher) return;

        setSubmitting(true);
        try {
            const result = await adminApi.resetTeacherPIN(selectedTeacher.user);
            alert(`تم إعادة تعيين الرمز السري: ${result.new_pin || result.plain_pin || 'تم بنجاح'}`);
            setIsResetPINOpen(false);
            fetchTeachers();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء إعادة تعيين الرمز");
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            key: 'name',
            header: 'الاسم',
            render: (t: Teacher) => (
                <span className="font-medium">
                    {t.user_details?.first_name || t.first_name} {t.user_details?.last_name || t.last_name}
                </span>
            ),
        },
        {
            key: 'pin_code',
            header: 'الرمز السري',
            render: (t: Teacher) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">{t.pin_code}</code>
            ),
        },
        {
            key: 'gender',
            header: 'الجنس',
            render: (t: Teacher) => t.gender === 'M' ? 'ذكر' : 'أنثى',
        },
        {
            key: 'hire_date',
            header: 'تاريخ التعيين',
        },
        {
            key: 'actions',
            header: 'الإجراءات',
            render: (t: Teacher) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleOpenResetPIN(t)}
                        className="p-1.5 text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="إعادة تعيين الرمز"
                    >
                        <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleOpenDelete(t)}
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
                <h2 className="text-xl font-bold">إدارة المعلمين</h2>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-[#024C3F] text-white px-4 py-2 rounded-lg hover:bg-[#036B57] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    إضافة معلم
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
                    data={teachers}
                    loading={loading}
                    emptyMessage="لا يوجد معلمون مسجلون"
                    keyExtractor={(t) => t.user}
                />
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedTeacher ? "تعديل معلم" : "إضافة معلم جديد"}
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
                    {/* Phone Number - Only for new teachers */}
                    {!selectedTeacher && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                رقم الهاتف *
                            </label>
                            <input
                                type="tel"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                placeholder="05XXXXXXXX"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Password - Only for new teachers */}
                    {!selectedTeacher && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                كلمة المرور *
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="6 أحرف على الأقل"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الاسم الأول *
                            </label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                اسم العائلة *
                            </label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الجنس *
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            >
                                <option value="M">ذكر</option>
                                <option value="F">أنثى</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                تاريخ التعيين
                            </label>
                            <input
                                type="date"
                                value={formData.hire_date}
                                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            اللقب
                        </label>
                        <input
                            type="text"
                            value={formData.title_chikh}
                            onChange={(e) => setFormData({ ...formData, title_chikh: e.target.value })}
                            placeholder="مثال: الشيخ"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                isLoading={submitting}
                title="حذف المعلم"
                message={`هل أنت متأكد من حذف المعلم "${selectedTeacher?.user_details?.first_name || selectedTeacher?.first_name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmText="حذف"
            />

            {/* Reset PIN Confirmation */}
            <ConfirmDialog
                isOpen={isResetPINOpen}
                onClose={() => setIsResetPINOpen(false)}
                onConfirm={handleResetPIN}
                isLoading={submitting}
                title="إعادة تعيين الرمز السري"
                message="سيتم إنشاء رمز سري جديد للمعلم. هل تريد المتابعة؟"
                confirmText="إعادة تعيين"
                variant="warning"
            />
        </div>
    );
}
