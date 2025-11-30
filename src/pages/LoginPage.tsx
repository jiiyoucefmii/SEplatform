import { useState } from "react";
import Input from "../components/Input";
import { api } from "../services/api";

export default function LoginPage() {
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!phoneNum || !password) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    try {
      const response = await api.login(phoneNum, password);
      console.log("Login successful:", response);

      localStorage.setItem("user", JSON.stringify(response.user));

      alert("تم تسجيل الدخول بنجاح!");
      window.location.href = "/";
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const msg = error instanceof Error ? error.message : "فشل تسجيل الدخول. تحقق من رقم الهاتف وكلمة المرور.";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2" dir="rtl">
            المدرسة القرآنية لمسجد الهدى
          </h1>
          <p className="text-gray-600 text-sm" dir="rtl">
            منصة إدارة الحلقات القرآنية
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2" dir="rtl">
          تسجيل الدخول
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6" dir="rtl">
          أدخل بياناتك للوصول إلى حسابك
        </p>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm text-gray-700 mb-2 text-right"
              dir="rtl"
            >
              رقم الهاتف
            </label>
            <Input
              type="tel"
              placeholder="0555123456"
              value={phoneNum}
              onChange={setPhoneNum}
              dir="rtl"
            />
          </div>

          <div>
            <label
              className="block text-sm text-gray-700 mb-2 text-right"
              dir="rtl"
            >
              كلمة المرور
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
            />
          </div>

          <div className="text-right">
            <a
              href="#"
              className="text-sm text-primary hover:underline"
              dir="rtl"
            >
              نسيت كلمة المرور؟
            </a>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-green-700 text-white 
                       py-3 rounded-lg font-medium transition"
          >
            تسجيل الدخول
          </button>

          <p className="text-center text-sm text-gray-600" dir="rtl">
            ليس لديك حساب؟{" "}
            <a
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              إنشاء حساب جديد
            </a>
          </p>
          <div className="mt-3 flex items-center justify-center gap-4" dir="rtl">
            <a href="/" className="text-sm text-gray-600 hover:underline">الصفحة الرئيسية</a>
            <a href="/register" className="text-sm text-primary hover:underline">التسجيل في حلقة</a>
          </div>
        </div>
      </div>
    </div>
  );
}
