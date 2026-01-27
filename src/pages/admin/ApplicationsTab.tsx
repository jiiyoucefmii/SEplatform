import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Filter } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";

interface Application {
    application_id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    birth_place: string;
    gender: string;
    school_year: string;
    school_name: string;
    personal_phone: string;
    has_disease: boolean;
    disease_name: string;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
    parent_user: number;
    parent_name?: string;
}

interface Course {
    course_id: number;
    course_name: string;
    season: number;
}

interface Season {
    season_id: number;
    season_type: string;
    is_active: boolean;
}

export default function ApplicationsTab() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('PENDING');
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number>(0);
    const [selectedSeasonId, setSelectedSeasonId] = useState<number>(0);
    const [rejectReason, setRejectReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
        fetchCourses();
        fetchSeasons();
    }, [statusFilter]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getApplications(statusFilter !== 'ALL' ? statusFilter : undefined);
            setApplications(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
            setError("فشل تحميل الطلبات");
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const data = await adminApi.getCourses();
            setCourses(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        }
    };

    const fetchSeasons = async () => {
        try {
            const data = await adminApi.getSeasons();
            const seasonList = Array.isArray(data) ? data : data.results || [];
            setSeasons(seasonList);
            // Auto-select active season
            const activeSeason = seasonList.find((s: Season) => s.is_active);
            if (activeSeason) {
                setSelectedSeasonId(activeSeason.season_id);
            }
        } catch (err) {
            console.error("Failed to fetch seasons:", err);
        }
    };

    const handleView = (app: Application) => {
        setSelectedApp(app);
        setIsViewOpen(true);
    };

    const handleOpenApprove = (app: Application) => {
        setSelectedApp(app);
        setSelectedCourseId(0);
        // Auto-select active season
        const activeSeason = seasons.find(s => s.is_active);
        if (activeSeason) {
            setSelectedSeasonId(activeSeason.season_id);
        }
        setIsApproveOpen(true);
        setError(null);
    };

    const handleOpenReject = (app: Application) => {
        setSelectedApp(app);
        setRejectReason('');
        setIsRejectOpen(true);
        setError(null);
    };

    const handleApprove = async () => {
        if (!selectedApp || !selectedCourseId || !selectedSeasonId) {
            setError("يرجى اختيار الفوج والموسم");
            return;
        }

        setSubmitting(true);
        try {
            await adminApi.approveApplication(selectedApp.application_id, selectedCourseId, selectedSeasonId);
            setIsApproveOpen(false);
            fetchApplications();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء القبول");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedApp) return;

        setSubmitting(true);
        try {
            await adminApi.rejectApplication(selectedApp.application_id, rejectReason);
            setIsRejectOpen(false);
            fetchApplications();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء الرفض");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'PENDING': 'bg-yellow-100 text-yellow-700',
            'ACTIVE': 'bg-green-100 text-green-700',
            'REJECTED': 'bg-red-100 text-red-700',
            'SUSPENDED': 'bg-gray-100 text-gray-700',
        };
        const labels: Record<string, string> = {
            'PENDING': 'قيد الانتظار',
            'ACTIVE': 'مقبول',
            'REJECTED': 'مرفوض',
            'SUSPENDED': 'معلق',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const calculateAge = (birthDate: string) => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const columns = [
        {
            key: 'name',
            header: 'اسم الطالب',
            render: (a: Application) => (
                <span className="font-medium">{a.first_name} {a.last_name}</span>
            ),
        },
        {
            key: 'age',
            header: 'العمر',
            render: (a: Application) => `${calculateAge(a.birth_date)} سنة`,
        },
        {
            key: 'gender',
            header: 'الجنس',
            render: (a: Application) => a.gender === 'M' ? 'ذكر' : 'أنثى',
        },
        {
            key: 'school_year',
            header: 'السنة الدراسية',
        },
        {
            key: 'status',
            header: 'الحالة',
            render: (a: Application) => getStatusBadge(a.status),
        },
        {
            key: 'actions',
            header: 'الإجراءات',
            render: (a: Application) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleView(a)}
                        className="p-1.5 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    {a.status === 'PENDING' && (
                        <>
                            <button
                                onClick={() => handleOpenApprove(a)}
                                className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                                title="قبول"
                            >
                                <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleOpenReject(a)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="رفض"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">طلبات التسجيل</h2>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#024C3F]"
                    >
                        <option value="PENDING">قيد الانتظار</option>
                        <option value="ACTIVE">مقبول</option>
                        <option value="REJECTED">مرفوض</option>
                        <option value="ALL">الكل</option>
                    </select>
                </div>
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
                    data={applications}
                    loading={loading}
                    emptyMessage="لا توجد طلبات"
                    keyExtractor={(a) => a.application_id}
                />
            </div>

            {/* View Details Modal */}
            <Modal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title="تفاصيل طلب التسجيل"
                size="lg"
            >
                {selectedApp && (
                    <div className="space-y-4" dir="rtl">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">الاسم الكامل</p>
                                <p className="font-medium">{selectedApp.first_name} {selectedApp.last_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                                <p className="font-medium">{selectedApp.birth_date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">مكان الميلاد</p>
                                <p className="font-medium">{selectedApp.birth_place}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">الجنس</p>
                                <p className="font-medium">{selectedApp.gender === 'M' ? 'ذكر' : 'أنثى'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">السنة الدراسية</p>
                                <p className="font-medium">{selectedApp.school_year}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">المدرسة</p>
                                <p className="font-medium">{selectedApp.school_name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">هاتف الطالب</p>
                                <p className="font-medium">{selectedApp.personal_phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">الحالة</p>
                                {getStatusBadge(selectedApp.status)}
                            </div>
                        </div>

                        {selectedApp.has_disease && (
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <p className="text-sm text-yellow-700 font-medium">ملاحظة صحية:</p>
                                <p className="text-sm text-yellow-600">{selectedApp.disease_name}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Approve Modal */}
            <Modal
                isOpen={isApproveOpen}
                onClose={() => setIsApproveOpen(false)}
                title="قبول الطلب"
                size="sm"
                footer={
                    <>
                        <button
                            onClick={() => setIsApproveOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleApprove}
                            disabled={submitting || !selectedCourseId || !selectedSeasonId}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                            {submitting ? "جارٍ القبول..." : "قبول"}
                        </button>
                    </>
                }
            >
                <div dir="rtl" className="space-y-4">
                    <p className="text-sm text-gray-600">
                        سيتم قبول طلب <span className="font-medium">{selectedApp?.first_name} {selectedApp?.last_name}</span>
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الموسم *
                        </label>
                        <select
                            value={selectedSeasonId}
                            onChange={(e) => setSelectedSeasonId(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value={0}>اختر الموسم</option>
                            {seasons.map((s) => (
                                <option key={s.season_id} value={s.season_id}>
                                    {s.season_type === 'SUMMER' ? 'صيفي' : 'عادي'} {s.is_active && '(مفعّل)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الفوج *
                        </label>
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value={0}>اختر الفوج</option>
                            {courses
                                .filter((c) => !selectedSeasonId || c.season === selectedSeasonId)
                                .map((c) => (
                                    <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
                                ))}
                        </select>
                    </div>
                </div>
            </Modal>

            {/* Reject Confirmation */}
            <Modal
                isOpen={isRejectOpen}
                onClose={() => setIsRejectOpen(false)}
                title="رفض الطلب"
                size="sm"
                footer={
                    <>
                        <button
                            onClick={() => setIsRejectOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={submitting}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                            {submitting ? "جارٍ الرفض..." : "رفض"}
                        </button>
                    </>
                }
            >
                <div dir="rtl">
                    <p className="text-sm text-gray-600 mb-4">
                        سيتم رفض طلب <span className="font-medium">{selectedApp?.first_name} {selectedApp?.last_name}</span>
                    </p>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        سبب الرفض (اختياري)
                    </label>
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={3}
                        placeholder="أدخل سبب الرفض..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>
            </Modal>
        </div>
    );
}
