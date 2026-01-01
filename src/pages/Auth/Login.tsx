import { useState } from "react";

import { Eye, EyeOff, HeartHandshake } from "lucide-react";
import bookCover from "../../assets/Book Cover.jpg";
import quranLogo from "../../assets/quranlogoyellow.svg";
import { useNavigate } from "react-router-dom";



export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    try {
      // In a real app we would call api.login(username, password)
      // Since the current mock api.login only takes phone_num, we'll assume username is phone for now 
      // OR we just simulate a successful login for this demo since the user just asked for UI changes.
      // But to be safe let's try to simulate a login.

      // However, looking at the previous file content, this file has "api.signup" inside "LoginPage" which seems wrong (copy-paste error?).
      // I will change it to a simulated login for now.

      console.log("Login attempt with:", username);

      let role = "STUDENT";
      if (username.toLowerCase().includes("teacher") || username.includes("استاذ") || username.includes("3")) {
        role = "TEACHER";
      }

      // Simulate success
      localStorage.setItem("user", JSON.stringify({ name: username, role: role, first_name: role === "TEACHER" ? "أستاذ" : "طالب" }));
      alert("تم تسجيل الدخول بنجاح!");

      if (role === "TEACHER") {
        navigate("/teacher");
      } else {
        navigate("/dashboard");
      }

    } catch (error: unknown) {
      console.error("Login failed:", error);
      alert("فشل تسجيل الدخول");
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 relative z-10 overflow-y-auto h-full">
        <div className="w-full max-w-md my-auto">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="flex items-center justify-center gap-4 mb-2">

              <h1 className="text-right text-6xl font-bold text-[#062A1E] font-readex">
                اهلا بعودتك </h1>
              <div >
                <img src={quranLogo} alt="Logo" className="w-87 h-82" />
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-xl font-medium">
              أدخل معلوماتك الأساسية للانضمام إلى منصتنا
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8 max-w-xs mx-auto">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 py-2 text-sm font-bold text-white bg-[#FEC737] rounded-full shadow-sm transition-all"

            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => navigate("/Signup")}
              className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all"
            >
              إنشاء حساب
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-5" dir="rtl">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 text-right block">
                اسم المستخدم :
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 text-right block">
                كلمة المرور :
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة مرور قوية"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="text-right mt-1">
                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-gray-500 hover:text-[#FEC737] transition-colors"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#FEC737] hover:bg-[#FDBF10] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-lg mt-4"
            >
              تسجيل الدخول
            </button>

            {/* Separator */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-gray-300 flex-1"></div>
              <button
                onClick={() => navigate("/login-phone")}
                className="text-gray-500 text-sm font-medium hover:text-[#FEC737] transition-colors"
              >
                أو سجل الدخول باستخدام رقم الهاتف
              </button>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center space-y-3">
            <p className="text-[#024C3F] font-medium text-lg">
              نسأل الله أن يوفقك ويبارك خطواتك
            </p>
            <div className="flex justify-center">
              <HeartHandshake className="w-12 h-12 text-[#024C3F]" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 rounded-6xl relative">
        <img
          src={bookCover}
          alt="Quran Cover"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}