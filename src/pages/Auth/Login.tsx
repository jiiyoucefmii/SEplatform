import { useState } from "react";
import { HeartHandshake, Phone, Lock, Loader2 } from "lucide-react";
import bookCover from "../../assets/Book Cover.jpg";
import quranLogo from "../../assets/quranlogoyellow.svg";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.login(phoneNumber, password);
      console.log("Login successful:", result);

      // Redirect based on user role
      const userRole = result.user?.role;
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else if (userRole === 'TEACHER') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
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
              <h1 className="text-right text-5xl lg:text-6xl font-bold text-[#062A1E] font-readex">
                تسجيل الدخول
              </h1>
              <div>
                <img src={quranLogo} alt="Logo" className="w-24 h-24 lg:w-28 lg:h-28" />
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-xl font-medium">
              أهلاً بك في المدرسة القرآنية
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5" dir="rtl">
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 text-right block">
                رقم الهاتف :
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="05xxxxxxxx"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 text-right block">
                كلمة المرور :
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#024C3F] hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#FEC737] hover:bg-[#FDBF10] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <span>تسجيل الدخول</span>
              )}
            </button>

            {/* Signup Link */}
            <div className="text-center pt-4">
              <span className="text-gray-600">ليس لديك حساب؟ </span>
              <button
                onClick={() => navigate("/Signup")}
                className="text-[#024C3F] font-bold hover:underline"
              >
                إنشاء حساب جديد
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center space-y-3">
            <p className="text-[#024C3F] font-medium text-lg">
              نسأل الله أن يبارك في علمك
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