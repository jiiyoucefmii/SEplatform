import { useState } from "react";
import { ChildrenList } from "../components/ChildrenList";
import { CyclesList } from "../components/CyclesList";
import { SessionsTable } from "../components/SessionsTable";
import {
    mockChildren,
    mockCurrentStudent,
    mockCycles,
    mockSessionsMap as mockSessions,
} from "../data/mockData";

export function QuranicCirclesPage() {
    const [userType, setUserType] = useState<"parent" | "student">("parent");
    const [selectedChildId, setSelectedChildId] = useState<string>(
        mockChildren[0].id
    );
    const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

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
    );
}
