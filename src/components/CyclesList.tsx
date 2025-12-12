import type { Cycle } from "../App";
import { Calendar, BookOpen, CheckCircle } from "lucide-react";

interface CyclesListProps {
  cycles: Cycle[];
  selectedCycleId: string | null;
  onSelectCycle: (id: string) => void;
  childName: string;
}

export function CyclesList({
  cycles,
  selectedCycleId,
  onSelectCycle,
  childName,
}: CyclesListProps) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[#024C3F]">الدورات القرآنية للطالب: {childName}</h2>
        <p className="text-sm text-gray-500 mt-1">
          اختر دورة لعرض تفاصيل الحصص
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cycles.map((cycle) => {
          const isSelected = cycle.id === selectedCycleId;

          return (
            <button
              key={cycle.id}
              onClick={() => onSelectCycle(cycle.id)}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-right ${
                isSelected ? "shadow-md" : ""
              }`}
              style={isSelected ? { border: "1.5px solid #FEC737" } : undefined}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    cycle.status === "active" ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <BookOpen
                    className={`w-6 h-6 ${
                      cycle.status === "active"
                        ? "text-[#024C3F]"
                        : "text-gray-600"
                    }`}
                  />
                </div>

                {cycle.status === "completed" && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>

              <h3 className="text-gray-800 mb-2">{cycle.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                العام الهجري {cycle.year}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">عدد الحصص:</span>
                  <span className="text-gray-800">{cycle.sessionsCount}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">تاريخ البدء:</span>
                  <span className="text-gray-800">{cycle.startDate}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">تاريخ الانتهاء:</span>
                  <span
                    className={`${
                      cycle.status === "active"
                        ? "text-green-600"
                        : "text-gray-800"
                    }`}
                  >
                    {cycle.endDate}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    cycle.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {cycle.status === "active" ? "دورة نشطة" : "دورة مكتملة"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
