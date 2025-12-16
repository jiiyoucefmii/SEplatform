import { useState } from "react";

import { Eye, EyeOff, HeartHandshake } from "lucide-react";
import bookCover from "../../assets/Book Cover.jpg";
import quranLogo from "../../assets/quranlogoyellow.svg";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (!username || !password) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    if (password.length < 6) {
      alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }


    if (password !== confirmPassword) {
      alert("كلمتان المرور غير متطابقتان");
      return;
    }
    if (confirmPassword.length < 6) {
      alert("تأكيد كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    navigate("/signup-step-2", { state: { username, password } });
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
                إنشاء حساب<br />جديد
              </h1>
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
              className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all"
            >
              تسجيل الدخول
            </button>
            <button
              className="flex-1 py-2 text-sm font-bold text-white bg-[#FEC737] rounded-full shadow-sm transition-all"
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
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 text-right block">
                تأكيد كلمة المرور :
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أدخل كلمة مرور قوية مرة أخرى"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#FEC737] hover:bg-[#FDBF10] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-lg mt-4"
            >
              التالي
            </button>
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
