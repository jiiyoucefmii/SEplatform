import type { Session } from "../types";

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  const isPresent = session.status === "present";

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition">
      <div className="grid grid-cols-4 gap-4 items-center" dir="rtl">
        {/* Date */}
        <div className="text-center">
          <p className="text-xs text-gray-500">التاريخ</p>
          <p className="font-medium text-sm">{session.date}</p>
          <span
            className={`inline-block mt-1 text-xs ${
              isPresent ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPresent ? "حاضر" : "غائب"}
          </span>
        </div>

        {/* New Memorization */}
        <div>
          <p className="text-xs text-gray-500">الحفظ الجديد</p>
          <p className="text-sm">
            الصفحات: {isPresent ? session.savedVerses : ""}
          </p>
          <p className="text-xs text-gray-600">
            {isPresent ? session.surah : ""}
          </p>
        </div>

        {/* Review */}
        <div>
          <p className="text-xs text-gray-500">المراجعة</p>
          <p className="text-sm">
            الصفحات: {isPresent ? session.reviewedVerses : ""}
          </p>
          <p className="text-xs text-gray-600">
            {isPresent ? session.juz : ""}
          </p>
        </div>

        {/* Rating */}
        <div className="text-center">
          <p className="text-xs text-gray-500">التقييم</p>
          <p
            className={`text-xl font-bold ${
              isPresent ? "text-green-600" : "text-gray-400"
            }`}
          >
            {isPresent ? session.evaluation : ""}
          </p>
          {isPresent && <p className="text-xs">ممتاز واصل</p>}
        </div>
      </div>
    </div>
  );
}
