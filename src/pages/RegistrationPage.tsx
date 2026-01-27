import { useEffect, useState, useMemo } from "react";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { api } from "../services/api";

type Mode = "ANNUAL" | "SUMMER";
type Gender = "M" | "F";

interface ParentUser {
  id?: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
}

interface SubmittedApplication {
  application_id: string;
  status: string;
  season_type: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  birth_place: string;
  gender: string;
  school_year: string;
  school_name: string;
  personal_phone: string;
  has_disease: boolean;
  disease_name: string;
  quran_level: number;
}

const schoolYearOptions = [
  "السنة الأولى ابتدائي",
  "السنة الثانية ابتدائي",
  "السنة الثالثة ابتدائي",
  "السنة الرابعة ابتدائي",
  "السنة الخامسة ابتدائي",
  "السنة الأولى متوسط",
  "السنة الثانية متوسط",
  "السنة الثالثة متوسط",
  "السنة الرابعة متوسط",
  "السنة الأولى ثانوي",
  "السنة الثانية ثانوي",
  "السنة الثالثة ثانوي",
];

// Quran level options (Hizb count)
const quranLevelOptions = Array.from({ length: 61 }, (_, i) => ({
  value: i,
  label: i === 0 ? "لا يحفظ" : `${i} حزب`,
}));

export default function RegistrationPage() {
  const [mode, setMode] = useState<Mode>("ANNUAL");
  const [open, setOpen] = useState(false);

  // Get parent user from localStorage
  const parentUser = useMemo<ParentUser | null>(() => {
    try {
      const s = localStorage.getItem('user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }, []);

  const isLoggedIn = !!localStorage.getItem('auth_token') && !!parentUser;

  // Student form fields
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [birth_date, setBirthDate] = useState("");
  const [birth_place, setBirthPlace] = useState("");
  const [gender, setGender] = useState<Gender>("M");
  const [school_year, setSchoolYear] = useState("");
  const [school_name, setSchoolName] = useState("");
  const [personal_phone, setPersonalPhone] = useState("");
  const [has_disease, setHasDisease] = useState(false);
  const [disease_name, setDiseaseName] = useState("");
  const [quran_level, setQuranLevel] = useState(0);

  const [submittedApp, setSubmittedApp] = useState<SubmittedApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await api.getRegistrationStatus();
        setOpen(res.open);
        setMode(res.mode === "ANNUAL" ? "ANNUAL" : "SUMMER");
        const app = await api.getSubmittedApplication();
        if (app) setSubmittedApp(app);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStatus();
  }, []);

  const submit = async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setError("يجب تسجيل الدخول أولاً لإضافة طالب");
      return;
    }

    // Validation
    if (!first_name || !last_name || !birth_date || !birth_place || !school_year) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const app = await api.submitRegistration({
        first_name,
        last_name,
        birth_date,
        birth_place,
        gender,
        school_year,
        school_name,
        personal_phone,
        has_disease,
        disease_name: has_disease ? disease_name : "",
        quran_level,
      });
      setSubmittedApp(app);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "فشل في إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  const printApplication = () => {
    if (!submittedApp) return;
    const w = window.open("", "_blank");
    if (!w) return;

    const genderLabel = submittedApp.gender === "M" ? "ذكر" : "أنثى";
    const hasDiseaseLabel = submittedApp.has_disease ? "نعم" : "لا";
    const quranLevelLabel = submittedApp.quran_level === 0 ? "لا يحفظ" : `${submittedApp.quran_level} حزب`;

    const html = `
      <html dir="rtl">
        <head>
          <meta charset="utf-8" />
          <title>استمارة التسجيل</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #024C3F; padding-bottom: 16px; }
            .header h1 { color: #024C3F; margin: 0; font-size: 24px; }
            .header p { color: #666; margin: 8px 0 0; }
            .box { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
            .section-title { font-weight: bold; color: #024C3F; font-size: 16px; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
            .row { display: grid; grid-template-columns: 140px 1fr; margin-bottom: 10px; gap: 12px; }
            .label { color: #555; font-weight: 500; }
            .value { font-weight: 600; color: #333; }
            .footer { margin-top: 32px; display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 16px; }
            .signature-box { text-align: center; }
            .signature-line { border-bottom: 1px solid #333; width: 150px; margin: 8px auto 4px; }
            .app-id { background: #f5f5f5; padding: 8px 16px; border-radius: 4px; display: inline-block; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>استمارة التسجيل - ${mode === "ANNUAL" ? "الدورة السنوية" : "الدورة الصيفية"}</h1>
            <p>المدرسة القرآنية</p>
          </div>
          
          <div class="app-id">رقم الطلب: <strong>${submittedApp.application_id}</strong></div>
          
          <div class="box">
            <div class="section-title">معلومات ولي الأمر</div>
            <div class="row"><div class="label">الاسم الكامل</div><div class="value">${parentUser?.first_name || ''} ${parentUser?.last_name || ''}</div></div>
            <div class="row"><div class="label">رقم الهاتف</div><div class="value">${parentUser?.phone_number || '-'}</div></div>
          </div>
          
          <div class="box">
            <div class="section-title">معلومات الطالب</div>
            <div class="row"><div class="label">الاسم</div><div class="value">${submittedApp.first_name}</div></div>
            <div class="row"><div class="label">اللقب</div><div class="value">${submittedApp.last_name}</div></div>
            <div class="row"><div class="label">تاريخ الميلاد</div><div class="value">${submittedApp.birth_date}</div></div>
            <div class="row"><div class="label">مكان الميلاد</div><div class="value">${submittedApp.birth_place}</div></div>
            <div class="row"><div class="label">الجنس</div><div class="value">${genderLabel}</div></div>
          </div>
          
          <div class="box">
            <div class="section-title">المعلومات الدراسية</div>
            <div class="row"><div class="label">المستوى الدراسي</div><div class="value">${submittedApp.school_year}</div></div>
            <div class="row"><div class="label">اسم المدرسة</div><div class="value">${submittedApp.school_name || "-"}</div></div>
          </div>
          
          <div class="box">
            <div class="section-title">مستوى الحفظ</div>
            <div class="row"><div class="label">عدد الأحزاب المحفوظة</div><div class="value">${quranLevelLabel}</div></div>
          </div>
          
          <div class="box">
            <div class="section-title">معلومات التواصل</div>
            <div class="row"><div class="label">هاتف الطالب</div><div class="value">${submittedApp.personal_phone || "-"}</div></div>
          </div>
          
          <div class="box">
            <div class="section-title">المعلومات الصحية</div>
            <div class="row"><div class="label">هل يعاني من مرض؟</div><div class="value">${hasDiseaseLabel}</div></div>
            ${submittedApp.has_disease ? `<div class="row"><div class="label">تفاصيل المرض</div><div class="value">${submittedApp.disease_name}</div></div>` : ""}
          </div>
          
          <div class="footer">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع ولي الأمر</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>التاريخ</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>ختم الإدارة</div>
            </div>
          </div>
          
          <script>window.print();</script>
        </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#024C3F] text-gray-700";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const readOnlyClass = "w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white border rounded-xl p-6 shadow-sm" dir="rtl">
          <h1 className="text-2xl font-bold text-gray-900">
            التسجيل {mode === "ANNUAL" ? "للدورة السنوية" : "للدورة الصيفية"}
          </h1>

          {!open && (
            <p className="mt-2 text-sm text-red-600">
              التسجيل غير مفتوح حالياً
            </p>
          )}

          {!isLoggedIn && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <p className="font-semibold">يجب تسجيل الدخول أولاً</p>
              <p className="text-sm mt-1">لإضافة طالب، يرجى <Link to="/login" className="text-[#024C3F] font-bold hover:underline">تسجيل الدخول</Link> أو <Link to="/signup" className="text-[#024C3F] font-bold hover:underline">إنشاء حساب جديد</Link></p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {!submittedApp && isLoggedIn && (
            <div className="mt-6 space-y-6">
              {/* Parent Information Section (Read-only) */}
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-[#024C3F] border-b pb-2">معلومات ولي الأمر</h2>
                <p className="text-sm text-gray-500">هذه المعلومات مأخوذة من حسابك</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>الاسم الكامل</label>
                    <input
                      type="text"
                      value={`${parentUser?.first_name || ''} ${parentUser?.last_name || ''}`}
                      readOnly
                      className={readOnlyClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>رقم هاتف ولي الأمر</label>
                    <input
                      type="text"
                      value={parentUser?.phone_number || ''}
                      readOnly
                      className={readOnlyClass}
                    />
                  </div>
                </div>
              </div>

              {/* Student Personal Information Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#024C3F] border-b pb-2">معلومات الطالب</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>اسم الطالب *</label>
                    <Input type="text" placeholder="اسم الطالب" value={first_name} onChange={setFirstName} dir="rtl" />
                  </div>
                  <div>
                    <label className={labelClass}>لقب الطالب *</label>
                    <Input type="text" placeholder="لقب الطالب" value={last_name} onChange={setLastName} dir="rtl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>تاريخ الميلاد *</label>
                    <input
                      type="date"
                      value={birth_date}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>مكان الميلاد *</label>
                    <Input type="text" placeholder="مكان الميلاد" value={birth_place} onChange={setBirthPlace} dir="rtl" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>الجنس *</label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        checked={gender === "M"}
                        onChange={() => setGender("M")}
                        className="w-4 h-4 text-[#024C3F]"
                      />
                      <span>ذكر</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        checked={gender === "F"}
                        onChange={() => setGender("F")}
                        className="w-4 h-4 text-[#024C3F]"
                      />
                      <span>أنثى</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#024C3F] border-b pb-2">المعلومات الدراسية</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>المستوى الدراسي *</label>
                    <select
                      value={school_year}
                      onChange={(e) => setSchoolYear(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">اختر المستوى</option>
                      {schoolYearOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>اسم المدرسة</label>
                    <Input type="text" placeholder="اسم المدرسة" value={school_name} onChange={setSchoolName} dir="rtl" />
                  </div>
                </div>
              </div>

              {/* Quran Level Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#024C3F] border-b pb-2">مستوى الحفظ</h2>

                <div>
                  <label className={labelClass}>عدد الأحزاب المحفوظة من القرآن الكريم</label>
                  <select
                    value={quran_level}
                    onChange={(e) => setQuranLevel(Number(e.target.value))}
                    className={inputClass}
                  >
                    {quranLevelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">اختر عدد الأحزاب التي يحفظها الطالب (من 0 إلى 60 حزب)</p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#024C3F] border-b pb-2">معلومات التواصل</h2>

                <div>
                  <label className={labelClass}>هاتف الطالب الشخصي (اختياري)</label>
                  <Input type="tel" placeholder="رقم هاتف الطالب (إن وجد)" value={personal_phone} onChange={setPersonalPhone} dir="rtl" />
                </div>
              </div>

              {/* Medical Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[#024C3F] border-b pb-2">المعلومات الصحية</h2>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={has_disease}
                      onChange={(e) => setHasDisease(e.target.checked)}
                      className="w-5 h-5 rounded text-[#024C3F]"
                    />
                    <span className="text-gray-700">هل يعاني الطالب من مرض أو حالة صحية خاصة؟</span>
                  </label>
                </div>

                {has_disease && (
                  <div>
                    <label className={labelClass}>تفاصيل الحالة الصحية</label>
                    <textarea
                      value={disease_name}
                      onChange={(e) => setDiseaseName(e.target.value)}
                      placeholder="يرجى ذكر تفاصيل الحالة الصحية..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                onClick={submit}
                disabled={!open || loading || !first_name || !last_name || !birth_date || !birth_place || !school_year}
              >
                {loading ? "جاري الإرسال..." : "تأكيد الطلب"}
              </Button>
            </div>
          )}

          {submittedApp && (
            <div className="mt-6">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800" dir="rtl">
                <p className="font-semibold">تم إرسال طلب التسجيل بنجاح!</p>
                <p className="mt-1">رقم الطلب: <strong>{submittedApp.application_id}</strong></p>
                <p className="mt-1 text-sm">سيتم مراجعة طلبك من قبل الإدارة وإعلامك بالنتيجة.</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button onClick={printApplication}>
                  طباعة الاستمارة
                </Button>
                <Link to="/">
                  <Button variant="secondary" className="w-full">الصفحة الرئيسية</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Show links only if not logged in */}
          {!isLoggedIn && (
            <div className="mt-6 flex items-center justify-center gap-4" dir="rtl">
              <a href="/" className="text-sm text-gray-600 hover:underline">الصفحة الرئيسية</a>
              <a href="/signup" className="text-sm text-[#024C3F] hover:underline">إنشاء حساب</a>
              <a href="/login" className="text-sm text-[#024C3F] hover:underline">تسجيل الدخول</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
