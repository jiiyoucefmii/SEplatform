import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import HistoryPage from "./HistoryPage";
import { StudentProgress } from "../components/student-profile/StudentProgress";
import {
  CheckCircle,
  XCircle,
  BookOpen,
  RotateCcw,
  FileText,
  CalendarClock,
  ChevronRight,
  Plus,
  Trash2,
  Save,
  Edit2,
  MoreVertical,
} from "lucide-react";

interface Cycle {
  id: string;
  year: string;
  name: string;
  sessionsCount: number;
  startDate: string;
  endDate: string;
  status: "completed" | "active";
}

interface SessionItem {
  id: string;
  sessionDate: string;
  sessionNumber: number;
  sessionType: "HIFZ" | "REVISION" | "TEST";
}

interface StudentSessionRecord {
  id: string;
  studentName: string;
  studentAvatar: string;
  sessionType: "HIFZ" | "REVISION" | "TEST";
  attendance: boolean;
  almiqdar: string; // from surah ayah to surah ayah
  notes: string; // molahadat
  justification: string; // absence reason
}

const mockCycles: Cycle[] = [
  {
    id: "1",
    year: "1446",
    name: "الدورة القرآنية 1446",
    sessionsCount: 45,
    startDate: "1446/01/01",
    endDate: "مستمرة",
    status: "active",
  },
  {
    id: "2",
    year: "1445",
    name: "الدورة القرآنية 1445",
    sessionsCount: 120,
    startDate: "1445/01/15",
    endDate: "1445/12/28",
    status: "completed",
  },
  {
    id: "3",
    year: "1444",
    name: "الدورة القرآنية 1444",
    sessionsCount: 115,
    startDate: "1444/02/01",
    endDate: "1444/12/25",
    status: "completed",
  },
];

const mockSessions: Record<string, SessionItem[]> = {
  "1": [
    {
      id: "s-1",
      sessionDate: "2025-01-03",
      sessionNumber: 15,
      sessionType: "REVISION",
    },
    {
      id: "s-2",
      sessionDate: "2025-01-02",
      sessionNumber: 14,
      sessionType: "HIFZ",
    },
    {
      id: "s-3",
      sessionDate: "2025-01-01",
      sessionNumber: 13,
      sessionType: "TEST",
    },
  ],
  "2": [
    {
      id: "s-4",
      sessionDate: "2024-12-30",
      sessionNumber: 120,
      sessionType: "REVISION",
    },
  ],
};

const mockStudentRecords: Record<string, StudentSessionRecord[]> = {
  "s-1": [
    {
      id: "ssr-1",
      studentName: "أحمد محمد",
      studentAvatar: "/assets/muslim boy.svg",
      sessionType: "REVISION",
      attendance: true,
      almiqdar: "سورة الملك",
      notes: "مراجعة ممتازة",
      justification: "",
    },
    {
      id: "ssr-2",
      studentName: "فاطمة محمد",
      studentAvatar: "/assets/muslim girl.svg",
      sessionType: "REVISION",
      attendance: true,
      almiqdar: "سورة الطارق: 1-10",
      notes: "تقدم جيد",
      justification: "",
    },
    {
      id: "ssr-3",
      studentName: "عمر محمد",
      studentAvatar: "/assets/muslim boy.svg",
      sessionType: "REVISION",
      attendance: false,
      almiqdar: "",
      notes: "",
      justification: "ظرف عائلي طارئ",
    },
  ],
  "s-2": [
    {
      id: "ssr-4",
      studentName: "أحمد محمد",
      studentAvatar: "/assets/muslim boy.svg",
      sessionType: "HIFZ",
      attendance: true,
      almiqdar: "سورة الملك: 1-5",
      notes: "حفظ واضح",
      justification: "",
    },
    {
      id: "ssr-5",
      studentName: "فاطمة محمد",
      studentAvatar: "/assets/muslim girl.svg",
      sessionType: "HIFZ",
      attendance: true,
      almiqdar: "سورة النبأ: 1-3",
      notes: "يحتاج تركيز أكثر",
      justification: "",
    },
  ],
};

export default function TeacherDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState("أستاذ");
  const [view, setView] = useState<"cycles" | "sessions" | "details" | "history" | "student-profile">("cycles");
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [studentRecords, setStudentRecords] = useState<StudentSessionRecord[]>(
    []
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [newSessionDate, setNewSessionDate] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.first_name || "أستاذ");
      } catch (e) {
        setUserName("أستاذ");
      }
    }
  }, []);

  const typeLabels: Record<string, string> = {
    HIFZ: "حفظ",
    REVISION: "مراجعة",
    TEST: "اختبار",
  };

  const toArabicType = (t: string) => typeLabels[t] ?? t;

  const handleSelectCycle = (cycleId: string) => {
    setSelectedCycleId(cycleId);
    setView("sessions");
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setStudentRecords(mockStudentRecords[sessionId] || []);
    setView("details");
  };

  const handleBackToSessions = () => {
    setView("sessions");
  };

  const handleBackToCycles = () => {
    setView("cycles");
    setSelectedCycleId(null);
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

  const handleAddNewRecord = () => {
    const newRecord: StudentSessionRecord = {
      id: `ssr-${Date.now()}`,
      studentName: "",
      studentAvatar: "",
      sessionType: "HIFZ",
      attendance: true,
      almiqdar: "",
      notes: "",
      justification: "",
    };
    setStudentRecords([...studentRecords, newRecord]);
    setEditingId(newRecord.id);
  };

  const handleDeleteRecord = (id: string) => {
    setStudentRecords((records) =>
      records.filter((record) => record.id !== id)
    );
  };

  const handleCreateSession = () => {
    if (!newSessionDate || !selectedCycleId) return;

    const currentSessions = mockSessions[selectedCycleId] || [];
    const newSessionNumber = currentSessions.length + 1;

    const newSession: SessionItem = {
      id: `s-${Date.now()}`,
      sessionDate: newSessionDate,
      sessionNumber: newSessionNumber,
      sessionType: "HIFZ",
    };

    // Add to mock sessions (in real app, this would be an API call)
    if (!mockSessions[selectedCycleId]) {
      mockSessions[selectedCycleId] = [];
    }
    mockSessions[selectedCycleId].push(newSession);

    setShowNewSessionDialog(false);
    setNewSessionDate("");
  };

  const handleMenuItemClick = (label: string) => {
    if (label === "السجل") {
      setView("history");
    } else if (label === "حلقات قرآنية") {
      setView("cycles");
    }
  };

  const handleStudentClick = (studentId: number) => {
    setSelectedStudentId(studentId);
    setView("student-profile");
  };

  const handleBackToDashboard = () => {
    setView("cycles");
    setSelectedStudentId(null);
  };

  const selectedCycle = mockCycles.find((c) => c.id === selectedCycleId);
  const selectedSession = selectedCycleId
    ? mockSessions[selectedCycleId]?.find((s) => s.id === selectedSessionId)
    : null;

  return (
    <div className="flex h-screen bg-[#eef0ef]" dir="rtl">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userName={userName}
        onMenuItemClick={handleMenuItemClick}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto p-6">
            {/* CYCLES VIEW */}
            {view === "cycles" && (
              <div>
                <div className="mb-6">
                  <h1 className="text-[#024C3F] mb-2 text-[26px] font-bold">
                    الدورات القرآنية
                  </h1>
                  <p className="text-gray-600">
                    اختر الدورة لعرض الحصص والطلاب
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCycles.map((cycle) => (
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
                            السنة: {cycle.year}
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
                            disabled={!newSessionDate}
                            className="px-4 py-2 bg-[#FEC737] text-gray-900 rounded-lg font-medium hover:bg-[#FDBF10] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            إضافة
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(selectedCycleId ? mockSessions[selectedCycleId] : []).map(
                    (session) => (
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
                              {new Date(session.sessionDate).toLocaleDateString(
                                "ar-SA"
                              )}
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
                    )
                  )}
                </div>
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
                      {new Date(selectedSession.sessionDate).toLocaleDateString(
                        "ar-SA"
                      )}{" "}
                      - {toArabicType(selectedSession.sessionType)}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-[#024C3F] p-6 text-white">
                    <div>
                      <h2 className="mb-1">سجل الطلاب</h2>
                      <p className="text-white/90">
                        إجمالي {studentRecords.length} طالب
                      </p>
                    </div>
                  </div>

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
                                  {record.studentName || "-"}
                                </td>
                                <td className="px-4 py-4">
                                  <select
                                    value={record.sessionType}
                                    onChange={(e) =>
                                      handleRecordChange(
                                        record.id,
                                        "sessionType",
                                        e.target.value as
                                        | "HIFZ"
                                        | "REVISION"
                                        | "TEST"
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
                                      onClick={() =>
                                        handleDeleteRecord(record.id)
                                      }
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
                                  <button
                                    onClick={() => handleStudentClick(1)}
                                    className="text-[#024C3F] hover:underline font-medium"
                                  >
                                    {record.studentName || "-"}
                                  </button>
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
                                      onClick={() =>
                                        handleDeleteRecord(record.id)
                                      }
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
                </div>
              </div>
            )}

            {/* HISTORY VIEW */}
            {view === "history" && (
              <HistoryPage onBack={handleBackToDashboard} />
            )}

            {/* STUDENT PROFILE VIEW */}
            {view === "student-profile" && selectedStudentId && (
              <StudentProgress
                studentId={selectedStudentId}
                onBack={handleBackToDashboard}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
