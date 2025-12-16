import type { Child } from "../types";
import { BookOpen } from "lucide-react";

interface ChildrenListProps {
  children: Child[];
  selectedChildId: string;
  onSelectChild: (id: string) => void;
}

export function ChildrenList({
  children,
  selectedChildId,
  onSelectChild,
}: ChildrenListProps) {
  return (
    <div>
      <h2 className="mb-4 text-gray-700">الأبناء</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child) => {
          const isSelected = child.id === selectedChildId;

          return (
            <button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-right ${isSelected ? "shadow-md" : ""
                }`}
              style={isSelected ? { border: "1.5px solid #FEC737" } : undefined}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 bg-white overflow-hidden">
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="w-16 h-16 rounded-full object-contain"
                  />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-gray-800 mb-1">{child.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>مستوى الحفظ: {child.memorizationLevel}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
