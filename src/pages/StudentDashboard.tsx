import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChildrenList } from "../components/ChildrenList";
import { CyclesList } from "../components/CyclesList";
import { SessionsTable } from "../components/SessionsTable";

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

export interface SessionRecord {
  session_id?: number; // optional until backend provides it; use session_number as key otherwise
  session_date: string;
  session_number: number;
  session_type: string; // e.g., HIFZ, REVISION, TEST
  attendance: boolean;
  justification: string;
  hifz_details: string | null;
  revision_details: string | null;
  test_details: string | null;
}

const mockChildren: Child[] = [
  {
    id: "1",
    name: "أحمد محمد",
    avatar: "/assets/muslim boy.svg",
    memorizationLevel: "حافظ 5 أجزاء",
  },
  {
    id: "2",
    name: "فاطمة محمد",
    avatar: "/assets/muslim girl.svg",
    memorizationLevel: "حافظة 3 أجزاء",
  },
  {
    id: "3",
    name: "عمر محمد",
    avatar: "/assets/muslim boy.svg",
    memorizationLevel: "حافظ جزء عم",
  },
];

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
  {
    id: "4",
    year: "1443",
    name: "الدورة القرآنية 1443",
    sessionsCount: 110,
    startDate: "1443/02/10",
    endDate: "1443/12/20",
    status: "completed",
  },
];

const mockSessions: Record<string, SessionRecord[]> = {
  "1": [
    {
      session_id: 3,
      session_date: "2025-01-03",
      session_number: 3,
      session_type: "REVISION",
      attendance: true,
      justification: "",
      hifz_details: null,
      revision_details: "مراجعة جزء عم كامل",
      test_details: null,
    },
    {
      session_id: 2,
      session_date: "2025-01-02",
      session_number: 2,
      session_type: "HIFZ",
      attendance: true,
      justification: "",
      hifz_details: "سورة الملك: الآيات 6-10",
      revision_details: null,
      test_details: null,
    },
    {
      session_id: 1,
      session_date: "2025-01-01",
      session_number: 1,
      session_type: "HIFZ",
      attendance: true,
      justification: "",
      hifz_details: "سورة الملك: الآيات 1-5",
      revision_details: null,
      test_details: null,
    },
  ],
  "2": [
    {
      session_id: 4,
      session_date: "2024-12-30",
      session_number: 1,
      session_type: "REVISION",
      attendance: false,
      justification: "ظرف عائلي طارئ",
      hifz_details: null,
      revision_details: null,
      test_details: null,
    },
  ],
};

// Mock current student (for student view)
const mockCurrentStudent: Child = {
  id: "student-1",
  name: "أحمد محمد",
  avatar: "/assets/muslim boy.svg",
  memorizationLevel: "حافظ 5 أجزاء",
};

export default function StudentDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userType, setUserType] = useState<"parent" | "student">("parent");
  const [selectedChildId, setSelectedChildId] = useState<string>(
    mockChildren[0].id
  );
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [userName, setUserName] = useState("أم محمد");

  useEffect(() => {
    // Get user name from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.first_name || "أم محمد");
      } catch (e) {
        setUserName("أم محمد");
      }
    }
  }, []);

  // Determine which child's data to show
  const activeChild =
    userType === "student"
      ? mockCurrentStudent
      : mockChildren.find((child) => child.id === selectedChildId);

  const selectedChild = activeChild;
  const selectedCycle = selectedCycleId
    ? mockCycles.find((cycle) => cycle.id === selectedCycleId)
    : null;
  const sessions = selectedCycleId ? mockSessions[selectedCycleId] || [] : [];

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
            <div className="mb-6">
              <h1 className="text-[#024C3F] mb-2 text-[26px] font-bold">
                الحلقات القرآنية
              </h1>
              <p className="text-gray-600">
                عرض تفصيلي لجميع الدورات القرآنية والحصص الدراسية
              </p>
              {/* User type toggle for testing */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setUserType("parent")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    userType === "parent"
                      ? "bg-[#024C3F] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  ولي أمر
                </button>
                <button
                  onClick={() => setUserType("student")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    userType === "student"
                      ? "bg-[#024C3F] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  طالب
                </button>
              </div>
            </div>

            {userType === "parent" && (
              <ChildrenList
                children={mockChildren}
                selectedChildId={selectedChildId}
                onSelectChild={(id) => {
                  setSelectedChildId(id);
                  setSelectedCycleId(null);
                }}
              />
            )}

            {selectedChild && (
              <div className="mt-6">
                <CyclesList
                  cycles={mockCycles}
                  selectedCycleId={selectedCycleId}
                  onSelectCycle={setSelectedCycleId}
                  childName={selectedChild.name}
                />
              </div>
            )}

            {selectedCycle && (
              <div className="mt-6">
                <SessionsTable cycle={selectedCycle} sessions={sessions} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
