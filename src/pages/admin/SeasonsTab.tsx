import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";

interface Season {
    season_id: number;
    season_type: 'SUMMER' | 'ANNUAL';
    season_start: string;
    season_end: string;
    registration_start_date: string;
    registration_end_date: string;
    is_active: boolean;
}

interface SeasonFormData {
    season_type: 'SUMMER' | 'ANNUAL';
    season_start: string;
    season_end: string;
    registration_start_date: string;
    registration_end_date: string;
}

const initialFormData: SeasonFormData = {
    season_type: 'ANNUAL',
    season_start: '',
    season_end: '',
    registration_start_date: '',
    registration_end_date: '',
};

export default function SeasonsTab() {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
    const [formData, setFormData] = useState<SeasonFormData>(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSeasons();
    }, []);

    const fetchSeasons = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getSeasons();
            setSeasons(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error("Failed to fetch seasons:", err);
            setError("فشل تحميل قائمة المواسم");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setSelectedSeason(null);
        setFormData(initialFormData);
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenEdit = (season: Season) => {
        setSelectedSeason(season);
        setFormData({
            season_type: season.season_type,
            season_start: season.season_start,
            season_end: season.season_end,
            registration_start_date: season.registration_start_date,
            registration_end_date: season.registration_end_date,
        });
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenDelete = (season: Season) => {
        setSelectedSeason(season);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.season_start || !formData.season_end) {
            setError("يرجى ملء تواريخ الموسم");
            return;
        }

        if (!formData.registration_start_date || !formData.registration_end_date) {
            setError("يرجى ملء تواريخ التسجيل");
            return;
        }

        // Client-side date validation
        if (new Date(formData.season_end) <= new Date(formData.season_start)) {
            setError("تاريخ نهاية الموسم يجب أن يكون بعد تاريخ البداية");
            return;
        }

        if (new Date(formData.registration_end_date) <= new Date(formData.registration_start_date)) {
            setError("تاريخ نهاية التسجيل يجب أن يكون بعد تاريخ البداية");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            console.log('Sending season data:', formData); // Debug log
            if (selectedSeason) {
                await adminApi.updateSeason(selectedSeason.season_id, formData as any);
            } else {
                await adminApi.createSeason(formData);
            }
            setIsModalOpen(false);
            fetchSeasons();
        } catch (err: any) {
            console.error('Season API error:', err); // Debug log
            setError(err.message || "حدث خطأ أثناء الحفظ");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedSeason) return;

        setSubmitting(true);
        try {
            await adminApi.deleteSeason(selectedSeason.season_id);
            setIsDeleteOpen(false);
            fetchSeasons();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء الحذف");
        } finally {
            setSubmitting(false);
        }
    };

    const handleActivate = async (season: Season) => {
        try {
            await adminApi.activateSeason(season.season_id);
            fetchSeasons();
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء التفعيل");
        }
    };

    const columns = [
        {
            key: 'season_type',
            header: 'نوع الموسم',
            render: (s: Season) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.season_type === 'SUMMER' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {s.season_type === 'SUMMER' ? 'صيفي' : 'عادي'}
                </span>
            ),
        },
        {
            key: 'dates',
            header: 'فترة الموسم',
            render: (s: Season) => (
                <span className="text-sm">
                    {s.season_start} - {s.season_end}
                </span>
            ),
        },
        {
            key: 'registration',
            header: 'فترة التسجيل',
            render: (s: Season) => (
                <span className="text-sm text-gray-500">
                    {s.registration_start_date} - {s.registration_end_date}
                </span>
            ),
        },
        {
            key: 'is_active',
            header: 'الحالة',
            render: (s: Season) => (
                <span className={`flex items-center gap-1 ${s.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                    {s.is_active ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            <span>مفعّل</span>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-4 h-4" />
                            <span>غير مفعّل</span>
                        </>
                    )}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'الإجراءات',
            render: (s: Season) => (
                <div className="flex items-center gap-2">
                    {!s.is_active && (
                        <button
                            onClick={() => handleActivate(s)}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                            تفعيل
                        </button>
                    )}
                    <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleOpenDelete(s)}
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
                <h2 className="text-xl font-bold">إدارة المواسم</h2>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-[#024C3F] text-white px-4 py-2 rounded-lg hover:bg-[#036B57] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    موسم جديد
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
                    data={seasons}
                    loading={loading}
                    emptyMessage="لا توجد مواسم مسجلة"
                    keyExtractor={(s) => s.season_id}
                />
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedSeason ? "تعديل موسم" : "إضافة موسم جديد"}
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
                            نوع الموسم *
                        </label>
                        <select
                            value={formData.season_type}
                            onChange={(e) => setFormData({ ...formData, season_type: e.target.value as 'SUMMER' | 'ANNUAL' })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                        >
                            <option value="ANNUAL">موسم عادي</option>
                            <option value="SUMMER">موسم صيفي</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                بداية الموسم *
                            </label>
                            <input
                                type="date"
                                value={formData.season_start}
                                onChange={(e) => setFormData({ ...formData, season_start: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                نهاية الموسم *
                            </label>
                            <input
                                type="date"
                                value={formData.season_end}
                                onChange={(e) => setFormData({ ...formData, season_end: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                بداية التسجيل
                            </label>
                            <input
                                type="date"
                                value={formData.registration_start_date}
                                onChange={(e) => setFormData({ ...formData, registration_start_date: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                نهاية التسجيل
                            </label>
                            <input
                                type="date"
                                value={formData.registration_end_date}
                                onChange={(e) => setFormData({ ...formData, registration_end_date: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#024C3F] focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                isLoading={submitting}
                title="حذف الموسم"
                message="هل أنت متأكد من حذف هذا الموسم؟ سيتم حذف جميع البيانات المرتبطة به."
                confirmText="حذف"
            />
        </div>
    );
}
