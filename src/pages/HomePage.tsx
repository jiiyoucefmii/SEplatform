import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DailyVerseCard from "../components/DailyVerse";
import { Button } from "../components/button";
import { api } from "../services/api";
import pattern from "../assets/arabic_pattern.jpg";
import type { User } from "../types";

type KhotbaMeta = { title?: string; pdf_url?: string; audio_url?: string; date?: string };
export default function HomePage() {
  const [khotba, setKhotba] = useState<KhotbaMeta | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [mode, setMode] = useState<"ANNUAL" | "SUMMER">("ANNUAL");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (api as any).getKhotba().then(setKhotba).catch(() => setKhotba(null));
    (api as any).getRegistrationStatus().then((res: { open: boolean; mode: string }) => {
      setRegistrationOpen(res.open);
      setMode(res.mode === "ANNUAL" ? "ANNUAL" : "SUMMER");
    });
    const u = localStorage.getItem("user");
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${pattern})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white/80">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center" dir="rtl">
              <h1 className="text-3xl font-extrabold text-gray-900">
                المدرسة القرآنية لمسجد الهدى
              </h1>
              <p className="mt-3 text-gray-600">
                منصة الوصول إلى الموارد العامة والتسجيل الإلكتروني
              </p>
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4" dir="rtl">
                  تنزيل خطبة الأسبوع
                </h2>
                <div className="flex flex-wrap gap-3" dir="rtl">
                  <Button
                    onClick={() => khotba?.pdf_url && window.open(khotba.pdf_url, "_blank")}
                    disabled={!khotba?.pdf_url}
                  >
                    تنزيل PDF
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => khotba?.audio_url && window.open(khotba.audio_url, "_blank")}
                    disabled={!khotba?.audio_url}
                  >
                    استماع للصوت
                  </Button>
                  <div className="text-sm text-gray-500">
                    {khotba?.title ? khotba.title : "لا توجد خطبة متاحة حالياً"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4" dir="rtl">
                    التسجيل العام في المنصة
                  </h2>
                  {!user ? (
                    <div className="grid grid-cols-2 gap-3" dir="rtl">
                      <Link to="/signup">
                        <Button className="w-full">إنشاء حساب</Button>
                      </Link>
                      <Link to="/login">
                        <Button variant="secondary" className="w-full">تسجيل الدخول</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3" dir="rtl">
                      <div className="text-sm text-gray-700">
                        مرحباً {user.first_name} {user.last_name} ({user.role === "PARENT" ? "ولي أمر" : user.role === "TEACHER" ? "معلم" : "طالب"})
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link to={user.role === "TEACHER" ? "/teacher" : "/dashboard"}>
                          <Button className="w-full">الانتقال إلى واجهتك</Button>
                        </Link>
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("auth_token");
                            setUser(null);
                          }}
                        >
                          تسجيل الخروج
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2" dir="rtl">
                    التسجيل في حلقة
                  </h2>
                  <p className="text-sm text-gray-600 mb-4" dir="rtl">
                    وضع التسجيل: {mode === "ANNUAL" ? "الدورة السنوية" : "الدورة الصيفية"}
                  </p>
                  {registrationOpen ? (
                    <Link to="/register">
                      <Button className="w-full">التسجيل الآن</Button>
                    </Link>
                  ) : (
                    <Button className="w-full" disabled>
                      التسجيل مغلق حالياً
                    </Button>
                  )}
                </div>
              </div>
            </div>

          <div className="mt-10">
            <DailyVerseCard />
          </div>
        </div>
      </div>
    </section>
  </div>
  );
}
