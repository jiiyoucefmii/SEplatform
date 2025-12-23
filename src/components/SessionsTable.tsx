import type { Cycle, SessionRecord } from "@/types/dashboard";
import {
  CheckCircle,
  XCircle,
  BookOpen,
  RotateCcw,
  FileText,
  CalendarClock,
} from "lucide-react";

interface SessionsTableProps {
  cycle: Cycle;
  sessions: SessionRecord[];
}

export function SessionsTable({ cycle, sessions }: SessionsTableProps) {
  const typeLabels: Record<string, string> = {
    HIFZ: "حفظ",
    REVISION: "مراجعة",
    TEST: "اختبار",
    EXAM: "اختبار",
    REVIEW: "مراجعة",
  };
  const toArabicType = (t: string) => typeLabels[t] ?? t;
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-[#024C3F] p-6 text-white">
        <h2 className="mb-2">{cycle.name}</h2>
        <p className="text-white/90">
          سجل الحصص الدراسية - إجمالي {sessions.length} حصة
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-right text-sm text-gray-700">
                رقم الحصة
              </th>
              <th className="px-6 py-4 text-right text-sm text-gray-700">
                التاريخ
              </th>
              <th className="px-6 py-4 text-right text-sm text-gray-700">
                نوع الحصة
              </th>
              <th className="px-6 py-4 text-right text-sm text-gray-700">
                الحضور
              </th>
              <th className="px-6 py-4 text-right text-sm text-gray-700">
                ملاحظات الحفظ
              </th>
              <th className="px-6 py-4 text-right text-sm text-gray-700">
                ملاحظات المراجعة
              </th>
              <th className="px-6 py-4 text-right text-sm text-gray-700">
                ملاحظات الاختبار
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr
                key={session.session_id ?? session.session_number}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-gray-800">
                    {session.session_number}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-800">
                      {session.session_date}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                    {toArabicType(session.session_type)}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {session.attendance ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700">حاضر</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-red-700">غائب</span>
                      </div>
                      {session.justification && (
                        <div className="text-sm text-gray-600 mr-7">
                          <span className="text-gray-500">السبب:</span>{" "}
                          {session.justification}
                        </div>
                      )}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4">
                  {session.hifz_details ? (
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-[#024C3F] mt-1 flex-shrink-0" />
                      <p className="text-gray-800">{session.hifz_details}</p>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {session.revision_details ? (
                    <div className="flex items-start gap-2">
                      <RotateCcw className="w-4 h-4 text-[#f4c542] mt-1 flex-shrink-0" />
                      <p className="text-gray-800">
                        {session.revision_details}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {session.test_details ? (
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <p className="text-gray-800">{session.test_details}</p>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">لا توجد حصص مسجلة لهذه الدورة</p>
        </div>
      )}
    </div>
  );
}
