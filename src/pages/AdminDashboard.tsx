import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Calendar,
    BookOpen,
    LogOut,
    ClipboardList,
    LayoutDashboard
} from "lucide-react";
import { adminApi } from "../services/adminApi";
import TeachersTab from "./admin/TeachersTab";
import SeasonsTab from "./admin/SeasonsTab";
import CoursesTab from "./admin/CoursesTab";
import ApplicationsTab from "./admin/ApplicationsTab";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    role: string;
}

interface Stats {
    teachers: number;
    applications: number;
    seasons: number;
    courses: number;
}

type TabType = 'overview' | 'teachers' | 'applications' | 'seasons' | 'courses';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<Stats>({ teachers: 0, applications: 0, seasons: 0, courses: 0 });
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            // Check if user is admin
            if (parsed.role !== 'ADMIN') {
                navigate('/student-dashboard');
                return;
            }
        } else {
            navigate('/login');
            return;
        }

        // Fetch stats
        fetchStats();
    }, [navigate]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [teachers, applications, seasons, courses] = await Promise.all([
                adminApi.getTeachers().catch(() => []),
                adminApi.getApplications('PENDING').catch(() => []),
                adminApi.getSeasons().catch(() => []),
                adminApi.getCourses().catch(() => []),
            ]);

            const getLength = (data: any) => {
                if (Array.isArray(data)) return data.length;
                if (data?.results) return data.results.length;
                return 0;
            };

            setStats({
                teachers: getLength(teachers),
                applications: getLength(applications),
                seasons: getLength(seasons),
                courses: getLength(courses),
            });
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const StatCard = ({ title, value, icon: Icon, color, onClick }: {
        title: string;
        value: number;
        icon: any;
        color: string;
        onClick?: () => void;
    }) => (
        <button
            onClick={onClick}
            className={`bg-white rounded-xl shadow-md p-6 border-r-4 ${color} w-full text-right hover:shadow-lg transition-shadow`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-3xl font-bold mt-1">{loading ? '...' : value}</p>
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
                    <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
                </div>
            </div>
        </button>
    );

    const tabs = [
        { id: 'overview' as TabType, label: 'نظرة عامة', icon: LayoutDashboard },
        { id: 'teachers' as TabType, label: 'المعلمين', icon: Users },
        { id: 'applications' as TabType, label: 'الطلبات', icon: ClipboardList },
        { id: 'seasons' as TabType, label: 'المواسم', icon: Calendar },
        { id: 'courses' as TabType, label: 'الأفواج', icon: BookOpen },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'teachers':
                return <TeachersTab />;
            case 'seasons':
                return <SeasonsTab />;
            case 'courses':
                return <CoursesTab />;
            case 'applications':
                return <ApplicationsTab />;
            case 'overview':
            default:
                return (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="المعلمين"
                                value={stats.teachers}
                                icon={Users}
                                color="border-blue-500"
                                onClick={() => setActiveTab('teachers')}
                            />
                            <StatCard
                                title="طلبات قيد الانتظار"
                                value={stats.applications}
                                icon={ClipboardList}
                                color="border-yellow-500"
                                onClick={() => setActiveTab('applications')}
                            />
                            <StatCard
                                title="المواسم"
                                value={stats.seasons}
                                icon={Calendar}
                                color="border-green-500"
                                onClick={() => setActiveTab('seasons')}
                            />
                            <StatCard
                                title="الأفواج"
                                value={stats.courses}
                                icon={BookOpen}
                                color="border-purple-500"
                                onClick={() => setActiveTab('courses')}
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">إجراءات سريعة</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setActiveTab('teachers')}
                                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-right"
                                >
                                    <Users className="w-8 h-8 text-blue-500" />
                                    <div>
                                        <p className="font-medium">إدارة المعلمين</p>
                                        <p className="text-sm text-gray-500">إضافة أو تعديل المعلمين</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('applications')}
                                    className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-right"
                                >
                                    <ClipboardList className="w-8 h-8 text-yellow-500" />
                                    <div>
                                        <p className="font-medium">مراجعة الطلبات</p>
                                        <p className="text-sm text-gray-500">قبول أو رفض الطلبات</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('courses')}
                                    className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-right"
                                >
                                    <BookOpen className="w-8 h-8 text-purple-500" />
                                    <div>
                                        <p className="font-medium">إدارة الأفواج</p>
                                        <p className="text-sm text-gray-500">إنشاء وتعديل الأفواج</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Header */}
            <header className="bg-[#024C3F] text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">لوحة تحكم المدير</h1>
                            <span className="bg-[#FEC737] text-[#024C3F] px-3 py-1 rounded-full text-sm font-medium">
                                إدارة
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm">
                                مرحباً، {user?.first_name} {user?.last_name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-[#024C3F] text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                {renderTabContent()}
            </div>
        </div>
    );
}
