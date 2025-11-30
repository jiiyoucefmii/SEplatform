import { useState } from "react";
import Input from "../components/Input";
import { api } from "../services/api";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"PARENT" | "TEACHER" | "STUDENT">("PARENT");
  const [secretCode, setSecretCode] = useState(""); // For teachers only

  const handleSubmit = async () => {
    // Validation
    if (!firstName || !lastName || !phoneNum || !password) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    if (role === "TEACHER" && !secretCode) {
      alert("يرجى إدخال الرمز السري للمعلم");
      return;
    }

    if (password !== confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }

    if (password.length < 6) {
      alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    try {
      const response = await api.signup({
        first_name: firstName,
        last_name: lastName,
        psswd: password,
        phone_num: phoneNum,
        role,
        secret_code: role === "TEACHER" ? secretCode : undefined,
      });

      console.log("Signup successful:", response);
      localStorage.setItem("user", JSON.stringify(response.user));

      alert("تم إنشاء الحساب بنجاح!");
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Signup failed:", error);
      alert(error.message || "فشل إنشاء الحساب. حاول مرة أخرى.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2" dir="rtl">
            المدرسة القرآنية لمسجد الهدى
          </h1>
          <p className="text-gray-600 text-sm" dir="rtl">
            منصة إدارة الحلقات القرآنية
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2" dir="rtl">
          إنشاء حساب جديد
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6" dir="rtl">
          أنشئ حساباً للوصول إلى المنصة
        </p>

        <div className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-sm text-gray-700 mb-2 text-right"
                dir="rtl"
              >
                الاسم
              </label>
              <Input
                type="text"
                placeholder="محمد"
                value={firstName}
                onChange={setFirstName}
                dir="rtl"
              />
            </div>
            <div>
              <label
                className="block text-sm text-gray-700 mb-2 text-right"
                dir="rtl"
              >
                اللقب
              </label>
              <Input
                type="text"
                placeholder="أحمد"
                value={lastName}
                onChange={setLastName}
                dir="rtl"
              />
            </div>
          </div>

          {/* Phone */}
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

          {/* Role Selection - 3 Options */}
          <div>
            <label
              className="block text-sm text-gray-700 mb-2 text-right"
              dir="rtl"
            >
              نوع الحساب
            </label>
            <div className="grid grid-cols-3 gap-2" dir="rtl">
              <button
                type="button"
                onClick={() => setRole("PARENT")}
                className={`py-2 px-2 rounded-lg border-2 transition text-sm ${
                  role === "PARENT"
                    ? "border-primary bg-green-50 text-primary font-medium"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                ولي أمر
              </button>
              <button
                type="button"
                onClick={() => setRole("TEACHER")}
                className={`py-2 px-2 rounded-lg border-2 transition text-sm ${
                  role === "TEACHER"
                    ? "border-primary bg-green-50 text-primary font-medium"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                معلم
              </button>
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`py-2 px-2 rounded-lg border-2 transition text-sm ${
                  role === "STUDENT"
                    ? "border-primary bg-green-50 text-primary font-medium"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                طالب
              </button>
            </div>
          </div>

          {/* Teacher Secret Code - Only shown for teachers */}
          {role === "TEACHER" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label
                className="block text-sm text-gray-700 mb-2 text-right font-medium"
                dir="rtl"
              >
                الرمز السري للمعلم *
              </label>
              <Input
                type="text"
                placeholder="أدخل الرمز السري المقدم من الإدارة"
                value={secretCode}
                onChange={setSecretCode}
                dir="rtl"
              />
              <p className="text-xs text-gray-600 mt-2 text-right" dir="rtl">
                يجب الحصول على الرمز السري من إدارة المدرسة
              </p>
            </div>
          )}

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label
              className="block text-sm text-gray-700 mb-2 text-right"
              dir="rtl"
            >
              تأكيد كلمة المرور
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-green-700 text-white 
                       py-3 rounded-lg font-medium transition mt-2"
          >
            إنشاء حساب
          </button>

          <p className="text-center text-sm text-gray-600" dir="rtl">
            لديك حساب بالفعل؟{" "}
            <a
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              تسجيل الدخول
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
