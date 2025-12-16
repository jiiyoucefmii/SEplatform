import { useEffect, useState } from "react";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { api } from "../services/api";

type Mode = "ANNUAL" | "SUMMER";
interface SubmittedApplication {
  application_id: string;
  status: string;
  season_type: string;
  first_name: string;
  last_name: string;
  phone: string;
  dob: string;
  address: string;
}

export default function RegistrationPage() {
  const [mode, setMode] = useState<Mode>("ANNUAL");
  const [open, setOpen] = useState(false);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  const [submittedApp, setSubmittedApp] = useState<SubmittedApplication | null>(null);

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
    const app = await api.submitRegistration({
      first_name,
      last_name,
      phone,
      dob,
      address,
    });
    setSubmittedApp(app);
  };

  const printApplication = () => {
    if (!submittedApp) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `
      <html dir="rtl">
        <head>
          <meta charset="utf-8" />
          <title>استمارة التسجيل</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; }
            .box { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
            .row { display: grid; grid-template-columns: 160px 1fr; margin-bottom: 8px; }
            .label { color: #555; }
            .value { font-weight: 600; }
            h1 { font-size: 20px; margin-bottom: 12px; }
            h2 { font-size: 14px; margin-top: 16px; margin-bottom: 8px; color: #666; }
            .footer { margin-top: 24px; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>استمارة التسجيل ${mode === "ANNUAL" ? "الدورة السنوية" : "الدورة الصيفية"}</h1>
            <div class="row"><div class="label">رقم الطلب</div><div class="value">${submittedApp.application_id}</div></div>
            <div class="row"><div class="label">الاسم</div><div class="value">${submittedApp.first_name}</div></div>
            <div class="row"><div class="label">اللقب</div><div class="value">${submittedApp.last_name}</div></div>
            <div class="row"><div class="label">رقم الهاتف</div><div class="value">${submittedApp.phone}</div></div>
            <div class="row"><div class="label">تاريخ الميلاد</div><div class="value">${submittedApp.dob}</div></div>
            <div class="row"><div class="label">العنوان</div><div class="value">${submittedApp.address}</div></div>
            <h2>توقيع ولي الأمر</h2>
            <div class="footer">
              <div>التاريخ: __________</div>
              <div>التوقيع: __________</div>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="bg-white border rounded-xl p-6" dir="rtl">
          <h1 className="text-2xl font-bold text-gray-900">
            التسجيل {mode === "ANNUAL" ? "للدورة السنوية" : "للدورة الصيفية"}
          </h1>
          {!open && (
            <p className="mt-2 text-sm text-red-600">
              التسجيل غير مفتوح حالياً
            </p>
          )}

          {!submittedApp && (
            <div className="mt-6 space-y-4">
              <Input type="text" placeholder="الاسم" value={first_name} onChange={setFirstName} dir="rtl" />
              <Input type="text" placeholder="اللقب" value={last_name} onChange={setLastName} dir="rtl" />
              <Input type="tel" placeholder="رقم الهاتف" value={phone} onChange={setPhone} dir="rtl" />
              <label htmlFor="dob" className="sr-only">تاريخ الميلاد</label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
              />
              <Input type="text" placeholder="العنوان" value={address} onChange={setAddress} dir="rtl" />
              <Button className="w-full" onClick={submit} disabled={!open || !first_name || !last_name || !phone || !dob || !address}>
                تأكيد الطلب
              </Button>
            </div>
          )}

          {submittedApp && (
            <div className="mt-6">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800" dir="rtl">
                تم إنشاء حساب بصفة انتظار. رقم الطلب: {submittedApp.application_id}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button onClick={printApplication}>
                  طباعة PDF
                </Button>
                <Link to="/">
                  <Button variant="secondary" className="w-full">خروج</Button>
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-4" dir="rtl">
            <a href="/" className="text-sm text-gray-600 hover:underline">الصفحة الرئيسية</a>
            <a href="/signup" className="text-sm text-primary hover:underline">إنشاء حساب</a>
            <a href="/login" className="text-sm text-primary hover:underline">تسجيل الدخول</a>
          </div>
        </div>
      </div>
    </div>
  );
}
