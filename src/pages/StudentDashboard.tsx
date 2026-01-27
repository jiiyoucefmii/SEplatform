import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { ChildrenList } from "../components/ChildrenList";
import { CyclesList } from "../components/CyclesList";
import { SessionsTable } from "../components/SessionsTable";
import { studentApi } from "../services/studentApi";
import type { Student, SessionRecord } from "../services/studentApi";
import { Plus, Loader2 } from "lucide-react";

// Converted types for UI components
export interface Child {
  id: string;
  name: string;
  avatar: string;
  memorizationLevel: string;
}

export interface Cycle {
  id: string;
  year: string;
  name: string;
  sessionsCount: number;
  startDate: string;
  endDate: string;
  status: "completed" | "active";
}

export interface UISessionRecord {
  session_id?: number;
  session_date: string;
  session_number: number;
  session_type: string;
  attendance: boolean;
  justification: string;
  hifz_details: string | null;
  revision_details: string | null;
  test_details: string | null;
}

// Convert API Student to UI Child
const toChild = (student: Student): Child => ({
  id: student.application_id.toString(),
  name: `${student.first_name} ${student.last_name}`,
  avatar: student.gender === 'M' ? "/assets/muslim boy.svg" : "/assets/muslim girl.svg",
  memorizationLevel: student.quran_level ? `حافظ ${student.quran_level} أجزاء` : "مبتدئ",
});

// Note: toCycle was removed - season to cycle conversion is now inlined in fetchCycles

// Convert API SessionRecord to UI format
const toUISession = (session: SessionRecord): UISessionRecord => ({
  session_id: session.session_id,
  session_date: session.session_date,
  session_number: session.session_number,
  session_type: session.session_type,
  attendance: session.attendance,
  justification: session.justification || "",
  hifz_details: session.hifz_details
    ? `${session.hifz_details.surah}: الآيات ${session.hifz_details.start_ayah}-${session.hifz_details.end_ayah}`
    : null,
  revision_details: session.revision_details
    ? `${session.revision_details.surah}: الآيات ${session.revision_details.start_ayah}-${session.revision_details.end_ayah}`
    : null,
  test_details: session.test_details
    ? `${session.test_details.test_type}: ${session.test_details.score}%`
    : null,
});

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userType, setUserType] = useState<"parent" | "student">("parent");
  const [userName, setUserName] = useState("ولي الأمر");
  const [_userId, setUserId] = useState<number | null>(null);

  // Data states
  const [children, setChildren] = useState<Child[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [sessions, setSessions] = useState<UISessionRecord[]>([]);

  // Selection states
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

  // Loading states
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingCycles, setLoadingCycles] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user info and role from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.first_name || "ولي الأمر");
        setUserId(userData.id);

        // Check user role
        if (userData.role === 'STUDENT') {
          setUserType('student');
        } else if (userData.role === 'ADMIN') {
          navigate('/admin');
          return;
        } else if (userData.role === 'TEACHER') {
          navigate('/teacher-dashboard');
          return;
        }
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    } else {
      navigate('/login');
      return;
    }

    // Fetch students
    fetchStudents();
  }, [navigate]);

  // Fetch cycles when child is selected
  useEffect(() => {
    if (selectedChildId) {
      fetchCycles();
    }
  }, [selectedChildId]);

  // Fetch sessions when cycle is selected
  useEffect(() => {
    if (selectedChildId && selectedCycleId) {
      fetchSessions();
    }
  }, [selectedChildId, selectedCycleId]);

  const fetchStudents = async () => {
    setLoadingChildren(true);
    setError(null);
    try {
      const students = await studentApi.getMyStudents();
      const childList = students.map(toChild);
      setChildren(childList);

      // Auto-select first child if available
      if (childList.length > 0) {
        setSelectedChildId(childList[0].id);
      }
    } catch (err: any) {
      console.error("Failed to fetch students:", err);
      setError("فشل في تحميل قائمة الطلاب");
    } finally {
      setLoadingChildren(false);
    }
  };

  const fetchCycles = async () => {
    if (!selectedChildId) return;

    setLoadingCycles(true);
    try {
      // Get student profile which includes enrollment info and session records
      const profile = await studentApi.getStudentProfile(parseInt(selectedChildId));

      // If student has current enrollment, create a cycle from it
      if (profile.current_season && profile.current_course) {
        const sessionRecords = profile.session_records || [];

        const cycle: Cycle = {
          id: profile.current_season.season_id.toString(),
          year: profile.current_season.season_start?.split('-')[0] || "",
          name: profile.current_course.course_name || `الدورة ${profile.current_season.season_type === 'SUMMER' ? 'الصيفية' : 'السنوية'}`,
          sessionsCount: sessionRecords.length,
          startDate: profile.current_season.season_start || "",
          endDate: profile.current_season.season_end || "مستمرة",
          status: profile.current_season.is_active ? "active" : "completed",
        };
        setCycles([cycle]);

        // Auto-select the cycle and set sessions directly
        setSelectedCycleId(cycle.id);

        // Convert and set sessions
        const uiSessions: UISessionRecord[] = sessionRecords.map((s: any) => ({
          session_id: s.session_id,
          session_date: s.session_date || "",
          session_number: s.session_number || 0,
          session_type: s.session_type || "",
          attendance: s.attendance ?? false,
          justification: s.justification || "",
          hifz_details: s.hifz_details
            ? `${s.hifz_details.surah_from}: الآيات ${s.hifz_details.ayah_from}-${s.hifz_details.ayah_to}`
            : null,
          revision_details: s.revision_details
            ? `${s.revision_details.surah_from}: الآيات ${s.revision_details.ayah_from}-${s.revision_details.ayah_to}`
            : null,
          test_details: s.test_details
            ? `اختبار: ${s.test_details.score || 0}%`
            : null,
        }));
        setSessions(uiSessions);
      } else {
        setCycles([]);
        setSessions([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch cycles:", err);
      setCycles([]);
    } finally {
      setLoadingCycles(false);
    }
  };

  const fetchSessions = async () => {
    if (!selectedChildId || !selectedCycleId) return;

    setLoadingSessions(true);
    try {
      const sessionData = await studentApi.getStudentSessions(
        parseInt(selectedChildId),
        parseInt(selectedCycleId)
      );
      setSessions(sessionData.map(toUISession));
    } catch (err: any) {
      console.error("Failed to fetch sessions:", err);
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleSelectChild = (id: string) => {
    setSelectedChildId(id);
    setSelectedCycleId(null);
    setSessions([]);
  };

  const selectedChild = children.find((child) => child.id === selectedChildId);
  const selectedCycle = selectedCycleId
    ? cycles.find((cycle) => cycle.id === selectedCycleId)
    : null;

  return (
    <div className="flex h-screen bg-[#eef0ef]" dir="rtl">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userName={userName}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-[#024C3F] mb-2 text-[26px] font-bold">
                الحلقات القرآنية
              </h1>
              <p className="text-gray-600">
                عرض تفصيلي لجميع الدورات القرآنية والحصص الدراسية
              </p>

              {/* User type toggle for testing - CAN BE REMOVED IN PRODUCTION */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setUserType("parent")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${userType === "parent"
                    ? "bg-[#024C3F] text-white"
                    : "bg-gray-200 text-gray-700"
                    }`}
                >
                  ولي أمر
                </button>
                <button
                  onClick={() => setUserType("student")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${userType === "student"
                    ? "bg-[#024C3F] text-white"
                    : "bg-gray-200 text-gray-700"
                    }`}
                >
                  طالب
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loadingChildren && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#024C3F]" />
                <span className="mr-3 text-gray-600">جاري تحميل البيانات...</span>
              </div>
            )}

            {/* No Students State */}
            {!loadingChildren && children.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500 mb-4">لا يوجد طلاب مسجلين حالياً</p>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-2 bg-[#024C3F] text-white px-6 py-3 rounded-lg hover:bg-[#036B57] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  تسجيل طالب جديد
                </button>
              </div>
            )}

            {/* Children List (for parents) */}
            {!loadingChildren && children.length > 0 && userType === "parent" && (
              <ChildrenList
                children={children}
                selectedChildId={selectedChildId}
                onSelectChild={handleSelectChild}
              />
            )}

            {/* Cycles List */}
            {selectedChild && (
              <div className="mt-6">
                {loadingCycles ? (
                  <div className="flex items-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-[#024C3F]" />
                    <span className="mr-2 text-gray-500">جاري تحميل الدورات...</span>
                  </div>
                ) : (
                  <CyclesList
                    cycles={cycles}
                    selectedCycleId={selectedCycleId}
                    onSelectCycle={setSelectedCycleId}
                    childName={selectedChild.name}
                  />
                )}
              </div>
            )}

            {/* Sessions Table */}
            {selectedCycle && (
              <div className="mt-6">
                {loadingSessions ? (
                  <div className="flex items-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-[#024C3F]" />
                    <span className="mr-2 text-gray-500">جاري تحميل الحصص...</span>
                  </div>
                ) : (
                  <SessionsTable cycle={selectedCycle} sessions={sessions} />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
