import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronLeft,
  Clock3,
  CircleDashed,
  Check,
  X,
  Mic,
  Pencil,
  Plus,
  Search,
  Settings,
  Users,
  UsersRound,
} from "lucide-react";

type SeasonRegistration = "summer" | "annual" | "closed";
type AddType = "notification" | "competition";

type AdminSection = "settings" | "teachers" | "students" | "khotba";

type OverviewCard = {
  label: string;
  value: string;
  icon: typeof Bell;
  iconBg: string;
  iconFg: string;
  emphasized?: boolean;
};

type KhotbaCategory = "توعوية" | "تعليمية";
type KhotbaRow = {
  id: string;
  title: string;
  speaker: string;
  linkUrl: string;
  category: KhotbaCategory;
  date: string;
};

type StudentCategory = "طالب" | "طالبة";
type EnrollmentRequestRow = {
  id: string;
  date: string;
  studentNameLine1: string;
  studentNameLine2?: string;
  parentName: string;
  age: number;
  parentPhone: string;
  category: StudentCategory;
  halaqaLabel: string;
};

type StudentRow = {
  id: string;
  firstName: string;
  lastName: string;
  parentName: string;
  age: number;
  parentPhone: string;
  category: StudentCategory;
  memorizationHezb: number;
  teacherName: string;
};

type TeacherCategory = "معلم" | "معلمة";
type TeacherStatus = "active" | "inactive";
type TeacherRow = {
  id: string;
  firstName: string;
  lastName: string;
  pin: string;
  phone: string;
  category: TeacherCategory;
  studentsCount: number;
  status: TeacherStatus;
};

function KhotbaListView() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | KhotbaCategory>(
    "all",
  );

  const [showAddRow, setShowAddRow] = useState(false);
  const [rows, setRows] = useState<KhotbaRow[]>(() => [
    {
      id: "1",
      title: "حقيقة الإسلام",
      speaker: "الإمام",
      linkUrl: "#",
      category: "توعوية",
      date: "2025/12/08",
    },
    {
      id: "2",
      title: "الغنائية",
      speaker: "الإمام",
      linkUrl: "#",
      category: "توعوية",
      date: "2025/12/08",
    },
  ]);

  const [draft, setDraft] = useState<Omit<KhotbaRow, "id">>({
    title: "",
    speaker: "الإمام",
    linkUrl: "",
    category: "توعوية",
    date: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Omit<KhotbaRow, "id">>({
    title: "",
    speaker: "الإمام",
    linkUrl: "",
    category: "توعوية",
    date: "",
  });

  const filtered = useMemo(() => {
    const q = search.trim();
    return rows.filter((r) => {
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        r.title.includes(q) ||
        r.speaker.includes(q) ||
        r.category.includes(q) ||
        r.date.includes(q)
      );
    });
  }, [rows, search, categoryFilter]);

  const submitAdd = () => {
    if (!draft.title.trim()) return;
    if (!draft.date.trim()) return;
    setRows((prev) => [
      ...prev,
      {
        id: `k-${Date.now()}`,
        ...draft,
        linkUrl: draft.linkUrl.trim() ? draft.linkUrl.trim() : "#",
      },
    ]);
    setDraft({
      title: "",
      speaker: "الإمام",
      linkUrl: "",
      category: "توعوية",
      date: "",
    });
    setShowAddRow(false);
  };

  const startEdit = (row: KhotbaRow) => {
    setShowAddRow(false);
    setEditingId(row.id);
    setEditDraft({
      title: row.title,
      speaker: row.speaker,
      linkUrl: row.linkUrl,
      category: row.category,
      date: row.date,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!editDraft.title.trim()) return;
    if (!editDraft.date.trim()) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === editingId
          ? {
              ...r,
              ...editDraft,
              linkUrl: editDraft.linkUrl.trim() ? editDraft.linkUrl.trim() : "#",
            }
          : r,
      ),
    );
    setEditingId(null);
  };

  return (
    <div className="max-w-[1220px] mx-auto px-10 py-8">
      <div className="text-right">
        <h1 className="text-alhuda text-2xl font-bold">قائمة الخطب</h1>
        <div className="mt-2 text-slate-600 font-medium">
          العدد الإجمالي : {rows.length}
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200">
          {/* Top bar */}
          <div className="bg-alhuda px-5 py-3 flex items-center justify-between gap-4" dir="rtl">
            <button
              type="button"
              aria-label="إضافة"
              onClick={() => setShowAddRow(true)}
              className="w-10 h-10 rounded-full bg-alhudaYellow grid place-items-center shrink-0"
            >
              <Plus className="w-5 h-5 text-alhuda" />
            </button>

            <div className="flex items-center gap-4 flex-1 justify-center">
              <div className="text-white font-semibold">اختيار حسب :</div>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as "all" | KhotbaCategory)
                  }
                  aria-label="التصنيف"
                  title="التصنيف"
                  className="h-10 rounded-xl bg-white/10 text-white pl-10 pr-10 appearance-none outline-none border border-white/20"
                >
                  <option value="all">التصنيف</option>
                  <option value="توعوية">توعوية</option>
                  <option value="تعليمية">تعليمية</option>
                </select>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/90 text-sm">
                  ▾
                </span>
              </div>
            </div>

            <div className="relative w-[260px] max-w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث ...."
                className="w-full h-10 rounded-xl bg-white px-10 pr-10 text-right outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto" dir="rtl">
            <table className="w-full text-right">
              <thead className="bg-slate-100 text-alhuda">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">العنوان</th>
                  <th className="px-6 py-4 font-semibold">الملقي</th>
                  <th className="px-6 py-4 font-semibold">الرابط</th>
                  <th className="px-6 py-4 font-semibold">التصنيف</th>
                  <th className="px-6 py-4 font-semibold">التاريخ</th>
                  <th className="px-6 py-4 font-semibold">تعديل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    {editingId === row.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            value={editDraft.title}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, title: e.target.value }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="العنوان"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={editDraft.speaker}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, speaker: e.target.value }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="الملقي"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={editDraft.linkUrl}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, linkUrl: e.target.value }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="الرابط"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editDraft.category}
                            onChange={(e) =>
                              setEditDraft((d) => ({
                                ...d,
                                category: e.target.value as KhotbaCategory,
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="التصنيف"
                          >
                            <option value="توعوية">توعوية</option>
                            <option value="تعليمية">تعليمية</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={editDraft.date}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, date: e.target.value }))
                            }
                            placeholder="YYYY/MM/DD"
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                            aria-label="التاريخ"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="حفظ"
                              onClick={saveEdit}
                              className="w-10 h-10 rounded-full bg-emerald-100 grid place-items-center"
                            >
                              <Check className="w-5 h-5 text-emerald-600" />
                            </button>
                            <button
                              type="button"
                              aria-label="إلغاء"
                              onClick={cancelEdit}
                              className="w-10 h-10 rounded-full bg-slate-100 grid place-items-center"
                            >
                              <X className="w-5 h-5 text-slate-500" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.title}
                        </td>
                        <td className="px-6 py-4 text-slate-700">{row.speaker}</td>
                        <td className="px-6 py-4">
                          <a
                            href={row.linkUrl || "#"}
                            className="text-alhuda font-semibold underline underline-offset-4"
                          >
                            رابط
                          </a>
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-semibold">
                          {row.category}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.date}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            aria-label="تعديل"
                            onClick={() => startEdit(row)}
                            className="w-9 h-9 rounded-lg grid place-items-center hover:bg-slate-100"
                          >
                            <Pencil className="w-4 h-4 text-alhuda" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {showAddRow && (
                  <tr className="bg-white">
                    <td className="px-6 py-4">
                      <input
                        value={draft.title}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, title: e.target.value }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="العنوان"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={draft.speaker}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, speaker: e.target.value }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="الملقي"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={draft.linkUrl}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, linkUrl: e.target.value }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="الرابط"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={draft.category}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            category: e.target.value as KhotbaCategory,
                          }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="التصنيف"
                      >
                        <option value="توعوية">توعوية</option>
                        <option value="تعليمية">تعليمية</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={draft.date}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, date: e.target.value }))
                        }
                        placeholder="YYYY/MM/DD"
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                        aria-label="التاريخ"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="حفظ"
                          onClick={submitAdd}
                          className="w-10 h-10 rounded-full bg-emerald-100 grid place-items-center"
                        >
                          <Check className="w-5 h-5 text-emerald-600" />
                        </button>
                        <button
                          type="button"
                          aria-label="إلغاء"
                          onClick={() => setShowAddRow(false)}
                          className="w-10 h-10 rounded-full bg-slate-100 grid place-items-center"
                        >
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {filtered.length === 0 && !showAddRow && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      لا توجد نتائج
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsView() {
  const [tab, setTab] = useState<"enrollment" | "students">("enrollment");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | StudentCategory>(
    "all",
  );

  const [requests, setRequests] = useState<EnrollmentRequestRow[]>(() => [
    {
      id: "r1",
      date: "18/12/2025",
      studentNameLine1: "محمد",
      studentNameLine2: "المحمود",
      parentName: "محمود",
      age: 15,
      parentPhone: "0657834114",
      category: "طالب",
      halaqaLabel: "المعلم",
    },
    {
      id: "r2",
      date: "15/11/2025",
      studentNameLine1: "محمد",
      studentNameLine2: "المحمود",
      parentName: "مروة",
      age: 15,
      parentPhone: "0657834214",
      category: "طالبة",
      halaqaLabel: "المعلم",
    },
  ]);

  const [students, setStudents] = useState<StudentRow[]>(() => [
    {
      id: "s1",
      firstName: "محمد",
      lastName: "محمود",
      parentName: "محمود",
      age: 15,
      parentPhone: "0657834114",
      category: "طالب",
      memorizationHezb: 50,
      teacherName: "أحمد",
    },
    {
      id: "s2",
      firstName: "مرام",
      lastName: "محمد",
      parentName: "مروة",
      age: 15,
      parentPhone: "0657834214",
      category: "طالبة",
      memorizationHezb: 20,
      teacherName: "مريم",
    },
  ]);

  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentEditDraft, setStudentEditDraft] = useState<Omit<StudentRow, "id">>(
    {
      firstName: "",
      lastName: "",
      parentName: "",
      age: 0,
      parentPhone: "",
      category: "طالب",
      memorizationHezb: 0,
      teacherName: "",
    },
  );

  const filteredRequests = useMemo(() => {
    const q = search.trim();
    return requests.filter((r) => {
      if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        r.date.includes(q) ||
        r.studentNameLine1.includes(q) ||
        (r.studentNameLine2?.includes(q) ?? false) ||
        r.parentName.includes(q) ||
        r.parentPhone.includes(q) ||
        r.category.includes(q)
      );
    });
  }, [requests, search, categoryFilter]);

  const filteredStudents = useMemo(() => {
    const q = search.trim();
    return students.filter((s) => {
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        s.firstName.includes(q) ||
        s.lastName.includes(q) ||
        s.parentName.includes(q) ||
        s.parentPhone.includes(q) ||
        String(s.age).includes(q) ||
        String(s.memorizationHezb).includes(q) ||
        s.teacherName.includes(q)
      );
    });
  }, [students, search, categoryFilter]);

  const totalCount = tab === "enrollment" ? requests.length : 472;
  const title = tab === "enrollment" ? "قائمة طلبات الإلتحاق" : "قائمة الطلبة";

  const acceptRequest = (req: EnrollmentRequestRow) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    setStudents((prev) => [
      {
        id: `s-${req.id}`,
        firstName: req.studentNameLine1,
        lastName: req.studentNameLine2 ?? "",
        parentName: req.parentName,
        age: req.age,
        parentPhone: req.parentPhone,
        category: req.category,
        memorizationHezb: 0,
        teacherName: "أحمد",
      },
      ...prev,
    ]);
  };

  const startEditStudent = (row: StudentRow) => {
    setEditingStudentId(row.id);
    setStudentEditDraft({
      firstName: row.firstName,
      lastName: row.lastName,
      parentName: row.parentName,
      age: row.age,
      parentPhone: row.parentPhone,
      category: row.category,
      memorizationHezb: row.memorizationHezb,
      teacherName: row.teacherName,
    });
  };

  const cancelEditStudent = () => {
    setEditingStudentId(null);
  };

  const saveEditStudent = () => {
    if (!editingStudentId) return;
    if (!studentEditDraft.firstName.trim() || !studentEditDraft.lastName.trim()) {
      return;
    }
    setStudents((prev) =>
      prev.map((s) =>
        s.id === editingStudentId
          ? {
              ...s,
              ...studentEditDraft,
              age: Number(studentEditDraft.age) || 0,
              memorizationHezb: Number(studentEditDraft.memorizationHezb) || 0,
            }
          : s,
      ),
    );
    setEditingStudentId(null);
  };

  return (
    <div className="max-w-[1220px] mx-auto px-10 py-8">
      {/* Top tabs */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-1 flex items-center gap-1 shadow-sm">
          <button
            type="button"
            onClick={() => setTab("students")}
            className={cn(
              "min-w-32 h-10 rounded-xl font-semibold",
              tab === "students"
                ? "bg-alhudaYellow text-alhuda"
                : "text-alhuda/70",
            )}
          >
            الطلبة
          </button>
          <button
            type="button"
            onClick={() => setTab("enrollment")}
            className={cn(
              "min-w-32 h-10 rounded-xl font-semibold",
              tab === "enrollment"
                ? "bg-alhudaYellow text-alhuda"
                : "text-alhuda/70",
            )}
          >
            الإلتحاق
          </button>
        </div>
      </div>

      <div className="mt-8 text-right">
        <h1 className="text-alhuda text-2xl font-bold">{title}</h1>
        <div className="mt-2 text-slate-600 font-medium">
          العدد الإجمالي للطلبة : {totalCount}
        </div>
      </div>

      <div className="mt-8 rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200">
        {/* Top bar */}
        <div className="bg-alhuda px-5 py-3 flex items-center justify-between gap-4" dir="rtl">
          <div className="w-10 h-10" />

          <div className="flex items-center gap-4 flex-1 justify-center">
            <div className="text-white font-semibold">اختيار حسب :</div>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as "all" | StudentCategory)
                }
                aria-label="الفئة"
                title="الفئة"
                className="h-10 rounded-xl bg-white/10 text-white pl-10 pr-10 appearance-none outline-none border border-white/20"
              >
                <option value="all">الفئة</option>
                <option value="طالب">طالب</option>
                <option value="طالبة">طالبة</option>
              </select>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/90 text-sm">
                ▾
              </span>
            </div>
          </div>

          <div className="relative w-[260px] max-w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث ...."
              className="w-full h-10 rounded-xl bg-white px-10 pr-10 text-right outline-none"
            />
          </div>
        </div>

        {/* Table */}
        {tab === "enrollment" ? (
          <div className="overflow-x-auto" dir="rtl">
            <table className="w-full text-right">
              <thead className="bg-slate-100 text-alhuda">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">التاريخ</th>
                  <th className="px-6 py-4 font-semibold">الإسم</th>
                  <th className="px-6 py-4 font-semibold">اسم الولي</th>
                  <th className="px-6 py-4 font-semibold">العمر</th>
                  <th className="px-6 py-4 font-semibold">رقم الولي</th>
                  <th className="px-6 py-4 font-semibold">الفئة</th>
                  <th className="px-6 py-4 font-semibold">الحلقة</th>
                  <th className="px-6 py-4 font-semibold">الحالة</th>
                  <th className="px-6 py-4 font-semibold">قبول</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRequests.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-700 font-semibold">
                      {row.date}
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">
                      <div className="leading-tight">
                        <div>{row.studentNameLine1}</div>
                        {row.studentNameLine2 && <div>{row.studentNameLine2}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">
                      {row.parentName}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">
                      {row.age}
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">
                      {row.parentPhone}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">
                      {row.category}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        className="h-9 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold inline-flex items-center gap-2"
                      >
                        <span>{row.halaqaLabel}</span>
                        <span className="text-slate-500">▾</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 grid place-items-center">
                        <CircleDashed className="w-5 h-5 text-alhudaYellow" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => acceptRequest(row)}
                        aria-label="قبول"
                        className="w-10 h-10 rounded-full bg-emerald-100 grid place-items-center"
                      >
                        <Check className="w-5 h-5 text-emerald-600" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      لا توجد نتائج
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto" dir="rtl">
            <table className="w-full text-right">
              <thead className="bg-slate-100 text-alhuda">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">الإسم</th>
                  <th className="px-6 py-4 font-semibold">اللقب</th>
                  <th className="px-6 py-4 font-semibold">اسم الولي</th>
                  <th className="px-6 py-4 font-semibold">العمر</th>
                  <th className="px-6 py-4 font-semibold">رقم الولي</th>
                  <th className="px-6 py-4 font-semibold">الفئة</th>
                  <th className="px-6 py-4 font-semibold">الحفظ (حزب)</th>
                  <th className="px-6 py-4 font-semibold">المعلم</th>
                  <th className="px-6 py-4 font-semibold">تعديل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    {editingStudentId === row.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            value={studentEditDraft.firstName}
                            onChange={(e) =>
                              setStudentEditDraft((d) => ({
                                ...d,
                                firstName: e.target.value,
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="الإسم"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={studentEditDraft.lastName}
                            onChange={(e) =>
                              setStudentEditDraft((d) => ({
                                ...d,
                                lastName: e.target.value,
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="اللقب"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={studentEditDraft.parentName}
                            onChange={(e) =>
                              setStudentEditDraft((d) => ({
                                ...d,
                                parentName: e.target.value,
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="اسم الولي"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={String(studentEditDraft.age)}
                            onChange={(e) =>
                              setStudentEditDraft((d) => ({
                                ...d,
                                age: Number(e.target.value || 0),
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                            aria-label="العمر"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={studentEditDraft.parentPhone}
                            onChange={(e) =>
                              setStudentEditDraft((d) => ({
                                ...d,
                                parentPhone: e.target.value,
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                            aria-label="رقم الولي"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={studentEditDraft.category}
                            onChange={(e) =>
                              setStudentEditDraft((d) => ({
                                ...d,
                                category: e.target.value as StudentCategory,
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="الفئة"
                          >
                            <option value="طالب">طالب</option>
                            <option value="طالبة">طالبة</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={String(studentEditDraft.memorizationHezb)}
                            onChange={(e) =>
                              setStudentEditDraft((d) => ({
                                ...d,
                                memorizationHezb: Number(e.target.value || 0),
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                            aria-label="الحفظ (حزب)"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={studentEditDraft.teacherName}
                            onChange={(e) =>
                              setStudentEditDraft((d) => ({
                                ...d,
                                teacherName: e.target.value,
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="المعلم"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="حفظ"
                              onClick={saveEditStudent}
                              className="w-10 h-10 rounded-full bg-emerald-100 grid place-items-center"
                            >
                              <Check className="w-5 h-5 text-emerald-600" />
                            </button>
                            <button
                              type="button"
                              aria-label="إلغاء"
                              onClick={cancelEditStudent}
                              className="w-10 h-10 rounded-full bg-slate-100 grid place-items-center"
                            >
                              <X className="w-5 h-5 text-slate-500" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.firstName}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.lastName}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-semibold">
                          {row.parentName}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-semibold">
                          {row.age}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.parentPhone}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-semibold">
                          {row.category}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.memorizationHezb}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.teacherName}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            aria-label="تعديل"
                            onClick={() => startEditStudent(row)}
                            className="w-9 h-9 rounded-lg grid place-items-center hover:bg-slate-100"
                          >
                            <Pencil className="w-4 h-4 text-alhudaYellow" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      لا توجد نتائج
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TeachersView() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | TeacherCategory
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | TeacherStatus
  >("all");

  const [showAddRow, setShowAddRow] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Omit<TeacherRow, "id">>({
    firstName: "",
    lastName: "",
    pin: "",
    phone: "",
    category: "معلم",
    studentsCount: 0,
    status: "active",
  });

  const [teachers, setTeachers] = useState<TeacherRow[]>(() => [
    {
      id: "t1",
      firstName: "أحمد",
      lastName: "أحمد",
      pin: "4484",
      phone: "0657834114",
      category: "معلم",
      studentsCount: 50,
      status: "inactive",
    },
    {
      id: "t2",
      firstName: "مريم",
      lastName: "مريم",
      pin: "5555",
      phone: "0657834214",
      category: "معلمة",
      studentsCount: 20,
      status: "active",
    },
  ]);

  const [draft, setDraft] = useState<Omit<TeacherRow, "id">>({
    firstName: "",
    lastName: "",
    pin: "",
    phone: "",
    category: "معلم",
    studentsCount: 0,
    status: "active",
  });

  const filtered = useMemo(() => {
    const q = search.trim();
    return teachers.filter((t) => {
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.firstName.includes(q) ||
        t.lastName.includes(q) ||
        t.pin.includes(q) ||
        t.phone.includes(q) ||
        String(t.studentsCount).includes(q)
      );
    });
  }, [teachers, search, categoryFilter, statusFilter]);

  const submitAdd = () => {
    if (!draft.firstName.trim() || !draft.lastName.trim()) return;
    if (!draft.pin.trim() || !draft.phone.trim()) return;

    setTeachers((prev) => [
      {
        id: `t-${Date.now()}`,
        ...draft,
        studentsCount: Number.isFinite(draft.studentsCount)
          ? draft.studentsCount
          : 0,
      },
      ...prev,
    ]);
    setDraft({
      firstName: "",
      lastName: "",
      pin: "",
      phone: "",
      category: "معلم",
      studentsCount: 0,
      status: "active",
    });
    setShowAddRow(false);
  };

  const startEdit = (row: TeacherRow) => {
    setShowAddRow(false);
    setEditingId(row.id);
    setEditDraft({
      firstName: row.firstName,
      lastName: row.lastName,
      pin: row.pin,
      phone: row.phone,
      category: row.category,
      studentsCount: row.studentsCount,
      status: row.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!editDraft.firstName.trim() || !editDraft.lastName.trim()) return;
    if (!editDraft.pin.trim() || !editDraft.phone.trim()) return;

    setTeachers((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? {
              ...t,
              ...editDraft,
              studentsCount: Number(editDraft.studentsCount) || 0,
            }
          : t,
      ),
    );
    setEditingId(null);
  };

  return (
    <div className="max-w-[1220px] mx-auto px-10 py-8">
      <div className="text-right">
        <h1 className="text-alhuda text-2xl font-bold">قائمة المعلمين</h1>
        <div className="mt-2 text-slate-600 font-medium">
          العدد الإجمالي : {teachers.length}
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200">
          {/* Top bar */}
          <div className="bg-alhuda px-5 py-3 flex items-center justify-between gap-4" dir="rtl">
            <button
              type="button"
              aria-label="إضافة"
              onClick={() => setShowAddRow(true)}
              className="w-10 h-10 rounded-full bg-alhudaYellow grid place-items-center shrink-0"
            >
              <Plus className="w-5 h-5 text-alhuda" />
            </button>

            <div className="flex items-center gap-4 flex-1 justify-center flex-wrap">
              <div className="text-white font-semibold">اختيار حسب :</div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "all" | TeacherStatus)
                  }
                  aria-label="الحالة"
                  title="الحالة"
                  className="h-10 rounded-xl bg-white/10 text-white pl-10 pr-10 appearance-none outline-none border border-white/20"
                >
                  <option value="all">الحالة</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/90 text-sm">
                  ▾
                </span>
              </div>

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as "all" | TeacherCategory)
                  }
                  aria-label="الفئة"
                  title="الفئة"
                  className="h-10 rounded-xl bg-white/10 text-white pl-10 pr-10 appearance-none outline-none border border-white/20"
                >
                  <option value="all">الفئة</option>
                  <option value="معلم">معلم</option>
                  <option value="معلمة">معلمة</option>
                </select>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/90 text-sm">
                  ▾
                </span>
              </div>
            </div>

            <div className="relative w-[260px] max-w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث ...."
                className="w-full h-10 rounded-xl bg-white px-10 pr-10 text-right outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto" dir="rtl">
            <table className="w-full text-right">
              <thead className="bg-slate-100 text-alhuda">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">الإسم</th>
                  <th className="px-6 py-4 font-semibold">اللقب</th>
                  <th className="px-6 py-4 font-semibold">الرقم السري</th>
                  <th className="px-6 py-4 font-semibold">رقم الهاتف</th>
                  <th className="px-6 py-4 font-semibold">الفئة</th>
                  <th className="px-6 py-4 font-semibold">عدد الطلاب</th>
                  <th className="px-6 py-4 font-semibold">الحالة</th>
                  <th className="px-6 py-4 font-semibold">تعديل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    {editingId === row.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            value={editDraft.firstName}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, firstName: e.target.value }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="الإسم"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={editDraft.lastName}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, lastName: e.target.value }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="اللقب"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={editDraft.pin}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, pin: e.target.value }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                            aria-label="الرقم السري"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={editDraft.phone}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, phone: e.target.value }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                            aria-label="رقم الهاتف"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editDraft.category}
                            onChange={(e) =>
                              setEditDraft((d) => ({
                                ...d,
                                category: e.target.value as TeacherCategory,
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="الفئة"
                          >
                            <option value="معلم">معلم</option>
                            <option value="معلمة">معلمة</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            value={String(editDraft.studentsCount)}
                            onChange={(e) =>
                              setEditDraft((d) => ({
                                ...d,
                                studentsCount: Number(e.target.value || 0),
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                            aria-label="عدد الطلاب"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editDraft.status}
                            onChange={(e) =>
                              setEditDraft((d) => ({
                                ...d,
                                status: e.target.value as TeacherStatus,
                              }))
                            }
                            className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                            aria-label="الحالة"
                          >
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="حفظ"
                              onClick={saveEdit}
                              className="w-10 h-10 rounded-full bg-emerald-100 grid place-items-center"
                            >
                              <Check className="w-5 h-5 text-emerald-600" />
                            </button>
                            <button
                              type="button"
                              aria-label="إلغاء"
                              onClick={cancelEdit}
                              className="w-10 h-10 rounded-full bg-slate-100 grid place-items-center"
                            >
                              <X className="w-5 h-5 text-slate-500" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.firstName}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.lastName}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.pin}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.phone}
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-semibold">
                          {row.category}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-semibold">
                          {row.studentsCount}
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-full bg-white grid place-items-center">
                            {row.status === "active" ? (
                              <Check className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <X className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            aria-label="تعديل"
                            onClick={() => startEdit(row)}
                            className="w-9 h-9 rounded-lg grid place-items-center hover:bg-slate-100"
                          >
                            <Pencil className="w-4 h-4 text-alhuda" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {showAddRow && (
                  <tr className="bg-white">
                    <td className="px-6 py-4">
                      <input
                        value={draft.firstName}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, firstName: e.target.value }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="الإسم"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={draft.lastName}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, lastName: e.target.value }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="اللقب"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={draft.pin}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, pin: e.target.value }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                        aria-label="الرقم السري"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={draft.phone}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, phone: e.target.value }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                        aria-label="رقم الهاتف"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={draft.category}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            category: e.target.value as TeacherCategory,
                          }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="الفئة"
                      >
                        <option value="معلم">معلم</option>
                        <option value="معلمة">معلمة</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        value={String(draft.studentsCount)}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            studentsCount: Number(e.target.value || 0),
                          }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none text-center"
                        aria-label="عدد الطلاب"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={draft.status}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            status: e.target.value as TeacherStatus,
                          }))
                        }
                        className="w-full h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="الحالة"
                      >
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="حفظ"
                          onClick={submitAdd}
                          className="w-10 h-10 rounded-full bg-emerald-100 grid place-items-center"
                        >
                          <Check className="w-5 h-5 text-emerald-600" />
                        </button>
                        <button
                          type="button"
                          aria-label="إلغاء"
                          onClick={() => setShowAddRow(false)}
                          className="w-10 h-10 rounded-full bg-slate-100 grid place-items-center"
                        >
                          <X className="w-5 h-5 text-slate-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {filtered.length === 0 && !showAddRow && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      لا توجد نتائج
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>("settings");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [seasonRegistration, setSeasonRegistration] = useState<SeasonRegistration>(
    "closed",
  );
  const [pinLength, setPinLength] = useState<number>(4);
  const [addType, setAddType] = useState<AddType>("notification");

  const overviewCards: OverviewCard[] = useMemo(
    () => [
        {
          label: "عدد المعلمين",
          value: "20",
          icon: UsersRound,
          iconBg: "bg-alhuda/15",
          iconFg: "text-alhuda",
        },
        {
          label: "عدد الطلاب",
          value: "480",
          icon: Users,
          iconBg: "bg-alhuda/15",
          iconFg: "text-alhuda",
        },
        {
          label: "الطلبات المعلقة",
          value: "20",
          icon: Bell,
          iconBg: "bg-alhudaYellow/50",
          iconFg: "text-alhuda",
          emphasized: true,
        },
        {
          label: "الحلقات النشطة",
          value: "20",
          icon: BookOpen,
          iconBg: "bg-alhuda/15",
          iconFg: "text-alhuda",
        },
        {
          label: "الموسم الحالي",
          value: "1447",
          icon: Clock3,
          iconBg: "bg-alhuda/15",
          iconFg: "text-alhuda",
        },
      ],
    [],
  );

  return (
    <div className="min-h-screen bg-slate-100" dir="rtl">
      <div className="flex min-h-screen flex-row" dir="ltr">
        {/* Main */}
        <main className="flex-1 min-w-0" dir="rtl">
          {activeSection === "khotba" ? (
            <KhotbaListView />
          ) : activeSection === "students" ? (
            <StudentsView />
          ) : activeSection === "teachers" ? (
            <TeachersView />
          ) : (
            <div className="max-w-[1220px] mx-auto px-10 py-8">
              <h1 className="text-center text-alhuda text-2xl font-bold">
                نظرة عامة على النظام
              </h1>

              {/* Overview cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {overviewCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.label}
                      className={cn(
                        "bg-white rounded-2xl px-6 py-5 shadow-sm",
                        "flex items-center justify-between",
                        card.emphasized && "shadow",
                      )}
                    >
                      <div className="text-right">
                        <div className="text-sm text-slate-600 font-medium">
                          {card.label}
                        </div>
                        <div className="text-2xl font-bold text-alhuda mt-1">
                          {card.value}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl grid place-items-center",
                          card.iconBg,
                        )}
                      >
                        <Icon className={cn("w-6 h-6", card.iconFg)} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Settings */}
              <h2 className="mt-10 text-right text-alhuda text-xl font-bold">
                الإعدادات العامة
              </h2>

              <div className="mt-6 max-w-[920px] mx-auto space-y-6">
                {/* Season registrations */}
                <section className="bg-white rounded-2xl shadow-sm px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-alhuda font-semibold">
                      تسجيلات الموسم :
                    </div>

                    <div className="bg-slate-100 rounded-2xl p-1 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSeasonRegistration("summer")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-semibold",
                          seasonRegistration === "summer"
                            ? "bg-alhudaYellow text-alhuda"
                            : "text-alhuda/70 hover:bg-white/70",
                        )}
                      >
                        الصيفية
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeasonRegistration("annual")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-semibold",
                          seasonRegistration === "annual"
                            ? "bg-alhudaYellow text-alhuda"
                            : "text-alhuda/70 hover:bg-white/70",
                        )}
                      >
                        السنوية
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeasonRegistration("closed")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-semibold",
                          seasonRegistration === "closed"
                            ? "bg-alhudaYellow text-alhuda"
                            : "text-alhuda/70 hover:bg-white/70",
                        )}
                      >
                        مغلق
                      </button>
                    </div>
                  </div>
                </section>

                {/* Pin length */}
                <section className="bg-white rounded-2xl shadow-sm px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-alhuda font-semibold">
                      طول الرقم السري :
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPinLength((v) => Math.max(1, v - 1))}
                        className="w-8 h-8 rounded-lg bg-alhuda/70 text-white grid place-items-center"
                        aria-label="نقص"
                      >
                        <span className="text-lg leading-none">-</span>
                      </button>

                      <div className="min-w-12 h-9 rounded-lg border border-alhuda/30 bg-white grid place-items-center text-alhuda font-semibold">
                        {pinLength}
                      </div>

                      <button
                        type="button"
                        onClick={() => setPinLength((v) => Math.min(12, v + 1))}
                        className="w-8 h-8 rounded-lg bg-alhuda/70 text-white grid place-items-center"
                        aria-label="زيادة"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Notifications */}
              <h2 className="mt-10 text-right text-alhuda text-xl font-bold">
                الإشعارات و المسابقات
              </h2>

              <div className="mt-6 max-w-[920px] mx-auto">
                <section className="bg-white rounded-2xl shadow-sm px-8 py-7">
                  <div className="flex items-center justify-between gap-6 flex-wrap">
                    <div className="text-alhuda font-semibold">نوع الإضافة :</div>

                    <div className="bg-slate-100 rounded-2xl p-1 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setAddType("competition")}
                        className={cn(
                          "px-5 py-2 rounded-xl text-sm font-semibold",
                          addType === "competition"
                            ? "bg-alhudaYellow text-alhuda"
                            : "text-alhuda/70 hover:bg-white/70",
                        )}
                      >
                        مسابقة
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddType("notification")}
                        className={cn(
                          "px-5 py-2 rounded-xl text-sm font-semibold",
                          addType === "notification"
                            ? "bg-alhudaYellow text-alhuda"
                            : "text-alhuda/70 hover:bg-white/70",
                        )}
                      >
                        إشعار
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4">
                      <label className="w-24 text-alhuda font-semibold">
                        العنوان :
                      </label>
                      <input
                        className="flex-1 h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="العنوان"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="w-24 text-alhuda font-semibold">
                        المحتوى :
                      </label>
                      <input
                        className="flex-1 h-10 rounded-xl bg-slate-100 px-4 outline-none"
                        aria-label="المحتوى"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      className="h-10 px-10 rounded-xl bg-alhuda text-white font-semibold"
                    >
                      إضافة
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>

        {/* Sidebar (Right) */}
        <aside
          className={cn(
            "shrink-0 flex-none bg-alhuda text-white flex flex-col",
            sidebarCollapsed
              ? "w-[64px] min-w-[64px] max-w-[64px]"
              : "w-[320px] min-w-[320px] max-w-[320px]",
          )}
          dir="rtl"
        >
          <div className={cn("px-6 pt-6", sidebarCollapsed && "hidden")}>
            <div className="flex items-center gap-3">
              <img
                src="/assets/masjid.svg"
                alt="masjid"
                className="w-11 h-11 masjid-gold-filter"
              />
              <div className="text-right leading-tight">
                <div className="text-base font-semibold">المدرسة القرآنية</div>
                <div className="text-sm text-white/80">لمسجد الهدى</div>
                <div className="text-xs text-white/70">إدارة الإدارة</div>
              </div>
            </div>
          </div>

          <div className={cn("px-6 mt-4", sidebarCollapsed && "hidden")}>
            <div className="h-px bg-white/20" />
          </div>

          <div className={cn("px-6 py-3", sidebarCollapsed && "px-2")}>
            <button
              type="button"
              aria-label="رجوع"
              onClick={() => setSidebarCollapsed((v) => !v)}
              className={cn(
                "w-10 h-10 rounded-lg grid place-items-center hover:bg-white/10 transition-colors",
                sidebarCollapsed && "mx-auto",
              )}
            >
              <ChevronLeft
                className={cn("w-5 h-5", sidebarCollapsed ? "" : "rotate-180")}
              />
            </button>
          </div>

          <nav
            className={cn(
              "px-4 pt-2 pb-6 flex-1",
              sidebarCollapsed && "hidden",
            )}
          >
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveSection("settings")}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 flex items-center justify-between",
                    activeSection === "settings"
                      ? "bg-slate-100 text-alhuda"
                      : "text-white/90 hover:bg-white/10 transition-colors",
                  )}
                >
                  <span className="font-semibold">إعدادات النظام</span>
                  <span
                    className={cn(
                      "w-9 h-9 rounded-lg grid place-items-center",
                      activeSection === "settings" ? "bg-white" : "bg-white/10",
                    )}
                  >
                    <Settings
                      className={cn(
                        "w-5 h-5",
                        activeSection === "settings" ? "text-alhuda" : "text-white",
                      )}
                    />
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveSection("teachers")}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 flex items-center justify-between transition-colors",
                    activeSection === "teachers"
                      ? "bg-slate-100 text-alhuda"
                      : "text-white/90 hover:bg-white/10",
                  )}
                >
                  <span className="font-semibold">المعلمون</span>
                  <span
                    className={cn(
                      "w-9 h-9 rounded-lg grid place-items-center",
                      activeSection === "teachers" ? "bg-white" : "bg-white/10",
                    )}
                  >
                    <UsersRound
                      className={cn(
                        "w-5 h-5",
                        activeSection === "teachers" ? "text-alhuda" : "text-white",
                      )}
                    />
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveSection("students")}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 flex items-center justify-between transition-colors",
                    activeSection === "students"
                      ? "bg-slate-100 text-alhuda"
                      : "text-white/90 hover:bg-white/10",
                  )}
                >
                  <span className="font-semibold">الطلبة</span>
                  <span
                    className={cn(
                      "w-9 h-9 rounded-lg grid place-items-center",
                      activeSection === "students" ? "bg-white" : "bg-white/10",
                    )}
                  >
                    <Users
                      className={cn(
                        "w-5 h-5",
                        activeSection === "students" ? "text-alhuda" : "text-white",
                      )}
                    />
                  </span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveSection("khotba")}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 flex items-center justify-between transition-colors",
                    activeSection === "khotba"
                      ? "bg-slate-100 text-alhuda"
                      : "text-white/90 hover:bg-white/10",
                  )}
                >
                  <span className="font-semibold">الخطب</span>
                  <span
                    className={cn(
                      "w-9 h-9 rounded-lg grid place-items-center",
                      activeSection === "khotba" ? "bg-white" : "bg-white/10",
                    )}
                  >
                    <Mic
                      className={cn(
                        "w-5 h-5",
                        activeSection === "khotba" ? "text-alhuda" : "text-white",
                      )}
                    />
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
