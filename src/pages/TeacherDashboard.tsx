import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import {
  CheckCircle,
  XCircle,
  BookOpen,
  RotateCcw,
  FileText,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  Edit2,
  Loader2,
} from "lucide-react";
import { teacherApi } from "../services/teacherApi";
import type { TeacherCourse, Session } from "../services/teacherApi";

// UI Types
interface Cycle {
  id: string;
  year: string;
  name: string;
  sessionsCount: number;
  startDate: string;
  endDate: string;
  status: "completed" | "active";
  courseId: number;
}

interface SessionItem {
  id: string;
  sessionId: number;
  sessionDate: string;
  sessionNumber: number;
  sessionType: "HIFZ" | "REVISION" | "TEST" | "HIFZ_REVISION" | "HIFZ_TEST" | "REVISION_TEST" | "HIFZ_REVISION_TEST";
}

interface StudentSessionRecord {
  id: string;
  studentId: number;
  studentName: string;
  studentAvatar: string;
  sessionType: "HIFZ" | "REVISION" | "TEST" | "HIFZ_REVISION" | "HIFZ_TEST" | "REVISION_TEST" | "HIFZ_REVISION_TEST";
  attendance: boolean;
  almiqdar: string;
  notes: string;
  justification: string;
}

// Convert API Course to UI Cycle
const toCycle = (course: TeacherCourse): Cycle => ({
  id: course.course_id.toString(),
  year: course.season_name?.split(' ')[0] || "",
  name: course.course_name,
  sessionsCount: 0,
  startDate: "",
  endDate: course.is_active ? "مستمرة" : "",
  status: course.is_active ? "active" : "completed",
  courseId: course.course_id,
});

// Convert API Session to UI Session
const toSessionItem = (session: Session): SessionItem => ({
  id: session.session_id.toString(),
  sessionId: session.session_id,
  sessionDate: session.session_day,
  sessionNumber: session.session_num,
  sessionType: session.session_type,
});

// Note: toStudentRecord was removed as unused - student records are now built inline in handleSelectSession

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState("أستاذ");
  const [view, setView] = useState<"cycles" | "sessions" | "details">("cycles");

  // Data states
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [studentRecords, setStudentRecords] = useState<StudentSessionRecord[]>([]);

  // Selection states
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // UI states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [newSessionDate, setNewSessionDate] = useState("");
  const [newSessionNum, setNewSessionNum] = useState(1);
  const [newSessionType, setNewSessionType] = useState<"HIFZ" | "REVISION" | "TEST" | "HIFZ_REVISION" | "HIFZ_TEST" | "REVISION_TEST" | "HIFZ_REVISION_TEST">("HIFZ");

  // Loading states
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typeLabels: Record<string, string> = {
    HIFZ: "حفظ",
    REVISION: "مراجعة",
    TEST: "اختبار",
    HIFZ_REVISION: "حفظ ومراجعة",
    HIFZ_TEST: "حفظ واختبار",
    REVISION_TEST: "مراجعة واختبار",
    HIFZ_REVISION_TEST: "حفظ ومراجعة واختبار",
  };

  const toArabicType = (t: string) => typeLabels[t] ?? t;

  // Get user info from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.first_name || "أستاذ");

        // Redirect if not a teacher
        if (userData.role === 'ADMIN') {
          navigate('/admin');
          return;
        } else if (userData.role === 'PARENT') {
          navigate('/student-dashboard');
          return;
        }
      } catch (e) {
        setUserName("أستاذ");
      }
    } else {
      navigate('/login');
      return;
    }

    // Fetch courses
    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    setError(null);
    try {
      const courses = await teacherApi.getMyCourses();
      const cycleList = courses.map(toCycle);
      setCycles(cycleList);
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
      setError("فشل في تحميل الدورات");
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchSessions = async (courseId: number) => {
    setLoadingSessions(true);
    try {
      const sessionData = await teacherApi.getCourseSessions(courseId);
      setSessions(sessionData.map(toSessionItem));
    } catch (err: any) {
      console.error("Failed to fetch sessions:", err);
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  // fetchStudents logic is now inlined in handleSelectSession for better type safety

  const handleSelectCycle = async (cycleId: string) => {
    setSelectedCycleId(cycleId);
    const cycle = cycles.find(c => c.id === cycleId);
    if (cycle) {
      await fetchSessions(cycle.courseId);
    }
    setView("sessions");
  };

  const handleSelectSession = async (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setLoadingStudents(true);

    const session = sessions.find(s => s.id === sessionId);
    const cycle = cycles.find(c => c.id === selectedCycleId);

    if (session && cycle) {
      try {
        // Fetch both students and session detail (saved attendance)
        const [students, sessionDetail] = await Promise.all([
          teacherApi.getCourseStudents(cycle.courseId),
          teacherApi.getSessionDetail(session.sessionId)
        ]);

        // Create a map of saved attendance by student_id
        // Backend returns 'attendance_records' not 'students'
        const savedAttendance = new Map<number, any>();
        if (sessionDetail.attendance_records) {
          sessionDetail.attendance_records.forEach((s: any) => {
            savedAttendance.set(s.student_id, s);
          });
        }

        // Merge students with saved attendance and evaluation data
        const records = students.map(s => {
          const saved = savedAttendance.get(s.application_id);

          // Extract almiqdar (surah) and notes from hifz_details/revision_details if available
          let almiqdar = "";
          let notes = "";
          if (saved?.hifz_details) {
            almiqdar = saved.hifz_details.surah_from || saved.hifz_details.surah || "";
            notes = saved.hifz_details.remark || "";
          } else if (saved?.revision_details) {
            almiqdar = saved.revision_details.surah_from || saved.revision_details.surah || "";
            notes = saved.revision_details.remark || "";
          }

          return {
            id: s.application_id.toString(),
            studentId: s.application_id,
            studentName: `${s.first_name} ${s.last_name}`,
            studentAvatar: s.gender === 'M' ? "/assets/muslim boy.svg" : "/assets/muslim girl.svg",
            sessionType: session.sessionType as any,
            attendance: saved?.attendance ?? true,  // Backend returns 'attendance' not 'presence'
            almiqdar: almiqdar,
            notes: notes,
            justification: saved?.justification || "",
          };
        });

        setStudentRecords(records);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setStudentRecords([]);
      } finally {
        setLoadingStudents(false);
      }
    }
    setView("details");
  };

  const handleBackToSessions = () => {
    setView("sessions");
    setStudentRecords([]);
  };

  const handleBackToCycles = () => {
    setView("cycles");
    setSelectedCycleId(null);
    setSessions([]);
  };

  const handleRecordChange = (
    id: string,
    field: keyof StudentSessionRecord,
    value: any
  ) => {
    setStudentRecords((records) =>
      records.map((record) =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const handleDeleteRecord = (id: string) => {
    setStudentRecords((records) =>
      records.filter((record) => record.id !== id)
    );
  };

  const handleCreateSession = async () => {
    if (!newSessionDate || !selectedCycleId) return;

    const cycle = cycles.find(c => c.id === selectedCycleId);
    if (!cycle) return;

    setSaving(true);
    try {
      await teacherApi.createSession(cycle.courseId, {
        session_day: newSessionDate,
        session_num: newSessionNum,
        session_type: newSessionType,
      });

      // Refresh sessions
      await fetchSessions(cycle.courseId);
      setShowNewSessionDialog(false);
      setNewSessionDate("");
    } catch (err: any) {
      console.error("Failed to create session:", err);
      setError("فشل في إنشاء الحصة");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedSessionId) return;

    const session = sessions.find(s => s.id === selectedSessionId);
    if (!session) return;

    setSaving(true);
    try {
      // 1. Save attendance data
      const attendanceData = studentRecords.map(record => ({
        student_id: record.studentId,
        presence: record.attendance,
        justification: record.justification,
      }));

      await teacherApi.updateAttendance(session.sessionId, attendanceData);

      // 2. Save Hifz/Revision records for students with almiqdar or notes
      const evalPromises = studentRecords
        .filter(record => record.almiqdar || record.notes)
        .map(record => {
          // Build the evaluation data in the format backend expects
          const evalData: any = {};

          // Determine which type based on session type and add appropriate nested object
          if (record.sessionType.includes('HIFZ')) {
            evalData.hifz = {
              surah_from: record.almiqdar || '',
              remark: record.notes || '',
            };
          }
          if (record.sessionType.includes('REVISION')) {
            evalData.revision = {
              surah_from: record.almiqdar || '',
              remark: record.notes || '',
            };
          }
          if (record.sessionType.includes('TEST')) {
            evalData.test = {
              test_type: 'written',
              mark: 0,
              remark: record.notes || '',
            };
          }

          // Use direct fetch instead of recordEvaluation to send correct format
          const token = localStorage.getItem('auth_token');
          return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/academics/sessions/${session.sessionId}/students/${record.studentId}/evaluate/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(evalData),
          });
        });

      if (evalPromises.length > 0) {
        await Promise.all(evalPromises);
      }

      setEditingId(null);
      setError(null);
    } catch (err: any) {
      console.error("Failed to save:", err);
      setError("فشل في حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId);
  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

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
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="float-left text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            )}

            {/* CYCLES VIEW */}
            {view === "cycles" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-[#024C3F] mb-2 text-[26px] font-bold">
                    الأفواج الدراسية
                  </h1>
                  <p className="text-gray-600">
                    اختر الفوج لعرض الحصص والطلاب
                  </p>
                </div>

                {loadingCourses ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#024C3F]" />
                    <span className="mr-3 text-gray-600">جاري تحميل الأفواج...</span>
                  </div>
                ) : cycles.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center">
                    <p className="text-gray-500">لا توجد أفواج مسندة إليك حالياً</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cycles.map((cycle) => (
                      <div
                        key={cycle.id}
                        onClick={() => handleSelectCycle(cycle.id)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer p-6 border-r-4 border-[#024C3F]"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {cycle.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              الموسم: {cycle.year}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#024C3F]" />
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-sm text-gray-600">عدد الحصص</p>
                            <p className="text-xl font-bold text-[#024C3F]">
                              {cycle.sessionsCount}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${cycle.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {cycle.status === "active" ? "مستمرة" : "مكتملة"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SESSIONS VIEW */}
            {view === "sessions" && selectedCycle && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBackToCycles}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <h1 className="text-[#024C3F] mb-1 text-[26px] font-bold">
                        {selectedCycle.name}
                      </h1>
                      <p className="text-gray-600">
                        اختر الحصة لعرض تفاصيل الطلاب
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNewSessionDialog(true)}
                    className="flex items-center gap-2 bg-[#FEC737] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#FDBF10] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة حصة جديدة
                  </button>
                </div>

                {/* New Session Dialog */}
                {showNewSessionDialog && (
                  <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    dir="rtl"
                  >
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                      <h2 className="text-xl font-bold text-[#024C3F] mb-4">
                        إضافة حصة جديدة
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            تاريخ الحصة
                          </label>
                          <input
                            type="date"
                            value={newSessionDate}
                            onChange={(e) => setNewSessionDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FEC737]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            نوع الحصة
                          </label>
                          <select
                            value={newSessionType}
                            onChange={(e) => setNewSessionType(e.target.value as any)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FEC737]"
                          >
                            <option value="HIFZ">حفظ</option>
                            <option value="REVISION">مراجعة</option>
                            <option value="TEST">اختبار</option>
                            <option value="HIFZ_REVISION">حفظ ومراجعة</option>
                            <option value="HIFZ_TEST">حفظ واختبار</option>
                            <option value="REVISION_TEST">مراجعة واختبار</option>
                            <option value="HIFZ_REVISION_TEST">حفظ ومراجعة واختبار</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            رقم الحصة
                          </label>
                          <input
                            type="number"
                            value={newSessionNum}
                            onChange={(e) => setNewSessionNum(parseInt(e.target.value) || 1)}
                            min={1}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FEC737]"
                          />
                        </div>
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => {
                              setShowNewSessionDialog(false);
                              setNewSessionDate("");
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={handleCreateSession}
                            disabled={!newSessionDate || saving}
                            className="px-4 py-2 bg-[#FEC737] text-gray-900 rounded-lg font-medium hover:bg-[#FDBF10] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? "جاري الإضافة..." : "إضافة"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {loadingSessions ? (
                  <div className="flex items-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-[#024C3F]" />
                    <span className="mr-2 text-gray-500">جاري تحميل الحصص...</span>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center">
                    <p className="text-gray-500">لا توجد حصص مسجلة. أضف حصة جديدة للبدء.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => handleSelectSession(session.id)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer p-6 border-r-4 border-[#FEC737]"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              حصة رقم {session.sessionNumber}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {new Date(session.sessionDate).toLocaleDateString("ar-SA")}
                            </p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#024C3F]" />
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                          {session.sessionType === "HIFZ" && (
                            <BookOpen className="w-4 h-4 text-blue-500" />
                          )}
                          {session.sessionType === "REVISION" && (
                            <RotateCcw className="w-4 h-4 text-green-500" />
                          )}
                          {session.sessionType === "TEST" && (
                            <FileText className="w-4 h-4 text-orange-500" />
                          )}
                          <span className="text-sm font-medium text-gray-700">
                            {toArabicType(session.sessionType)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DETAILS VIEW */}
            {view === "details" && selectedSession && (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <button
                    onClick={handleBackToSessions}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <div>
                    <h1 className="text-[#024C3F] mb-1 text-[26px] font-bold">
                      حصة رقم {selectedSession.sessionNumber}
                    </h1>
                    <p className="text-gray-600">
                      {new Date(selectedSession.sessionDate).toLocaleDateString("ar-SA")}{" "}
                      - {toArabicType(selectedSession.sessionType)}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-[#024C3F] p-6 text-white flex justify-between items-center">
                    <div>
                      <h2 className="mb-1">سجل الطلاب</h2>
                      <p className="text-white/90">
                        إجمالي {studentRecords.length} طالب
                      </p>
                    </div>
                    <button
                      onClick={handleSaveAttendance}
                      disabled={saving}
                      className="flex items-center gap-2 bg-[#FEC737] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#FDBF10] transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "جاري الحفظ..." : "حفظ الحضور"}
                    </button>
                  </div>

                  {loadingStudents ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-[#024C3F]" />
                      <span className="mr-2 text-gray-500">جاري تحميل الطلاب...</span>
                    </div>
                  ) : studentRecords.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      لا يوجد طلاب مسجلين في هذا الفوج
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-4 text-right text-sm text-gray-700">
                              اسم الطالب
                            </th>
                            <th className="px-4 py-4 text-right text-sm text-gray-700">
                              نوع الحصة
                            </th>
                            <th className="px-4 py-4 text-right text-sm text-gray-700">
                              الحضور
                            </th>
                            <th className="px-4 py-4 text-right text-sm text-gray-700">
                              المقدار
                            </th>
                            <th className="px-4 py-4 text-right text-sm text-gray-700">
                              ملاحظات
                            </th>
                            <th className="px-4 py-4 text-right text-sm text-gray-700">
                              سبب الغياب
                            </th>
                            <th className="px-4 py-4 text-right text-sm text-gray-700">
                              الإجراءات
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentRecords.map((record) => (
                            <tr
                              key={record.id}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              {editingId === record.id ? (
                                <>
                                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                                    {record.studentName}
                                  </td>
                                  <td className="px-4 py-4">
                                    <select
                                      value={record.sessionType}
                                      onChange={(e) =>
                                        handleRecordChange(
                                          record.id,
                                          "sessionType",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FEC737]"
                                    >
                                      <option value="HIFZ">حفظ</option>
                                      <option value="REVISION">مراجعة</option>
                                      <option value="TEST">اختبار</option>
                                    </select>
                                  </td>
                                  <td className="px-4 py-4">
                                    <button
                                      onClick={() =>
                                        handleRecordChange(
                                          record.id,
                                          "attendance",
                                          !record.attendance
                                        )
                                      }
                                      className="flex items-center gap-2 w-full justify-center"
                                    >
                                      {record.attendance ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                          <CheckCircle className="w-5 h-5" />
                                          <span>حاضر</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 text-red-600">
                                          <XCircle className="w-5 h-5" />
                                          <span>غياب</span>
                                        </div>
                                      )}
                                    </button>
                                  </td>
                                  <td className="px-4 py-4">
                                    <input
                                      type="text"
                                      value={record.almiqdar}
                                      onChange={(e) =>
                                        handleRecordChange(
                                          record.id,
                                          "almiqdar",
                                          e.target.value
                                        )
                                      }
                                      placeholder="سورة من - إلى"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FEC737]"
                                    />
                                  </td>
                                  <td className="px-4 py-4">
                                    <input
                                      type="text"
                                      value={record.notes}
                                      onChange={(e) =>
                                        handleRecordChange(
                                          record.id,
                                          "notes",
                                          e.target.value
                                        )
                                      }
                                      placeholder="ملاحظات"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FEC737]"
                                    />
                                  </td>
                                  <td className="px-4 py-4">
                                    <input
                                      type="text"
                                      value={record.justification}
                                      onChange={(e) =>
                                        handleRecordChange(
                                          record.id,
                                          "justification",
                                          e.target.value
                                        )
                                      }
                                      placeholder="سبب الغياب"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FEC737]"
                                    />
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                                      >
                                        <Save className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteRecord(record.id)}
                                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-4 py-4 text-sm text-gray-900">
                                    {record.studentName}
                                  </td>
                                  <td className="px-4 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                      {record.sessionType === "HIFZ" && (
                                        <BookOpen className="w-4 h-4 text-blue-500" />
                                      )}
                                      {record.sessionType === "REVISION" && (
                                        <RotateCcw className="w-4 h-4 text-green-500" />
                                      )}
                                      {record.sessionType === "TEST" && (
                                        <FileText className="w-4 h-4 text-orange-500" />
                                      )}
                                      <span className="text-gray-900">
                                        {toArabicType(record.sessionType)}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-sm">
                                    <button
                                      onClick={() =>
                                        handleRecordChange(
                                          record.id,
                                          "attendance",
                                          !record.attendance
                                        )
                                      }
                                    >
                                      {record.attendance ? (
                                        <div className="flex items-center gap-2 text-green-600">
                                          <CheckCircle className="w-5 h-5" />
                                          <span>حاضر</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 text-red-600">
                                          <XCircle className="w-5 h-5" />
                                          <span>غياب</span>
                                        </div>
                                      )}
                                    </button>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-600">
                                    {record.almiqdar || "-"}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-600">
                                    {record.notes || "-"}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-600">
                                    {record.justification || "-"}
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => setEditingId(record.id)}
                                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteRecord(record.id)}
                                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
