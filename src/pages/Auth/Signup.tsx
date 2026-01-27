import { useState } from "react";
import { Eye, EyeOff, HeartHandshake, ArrowRight } from "lucide-react";
import bookCover from "../../assets/Book Cover.jpg";
import quranLogo from "../../assets/quranlogoyellow.svg";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

type SignupStep = 'info' | 'otp';

export default function SignupPage() {
  const navigate = useNavigate();

  // Form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [step, setStep] = useState<SignupStep>('info');
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  // Step 1: Validate and send OTP
  const handleSendOtp = async () => {
    // Validate fields
    if (!firstName || !lastName || !phoneNumber || !password || !confirmPassword) {
      setErrorMessage("يرجى ملء جميع الحقول");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.sendOtp(phoneNumber, 'SIGNUP');

      // In development, show the debug OTP
      if (response.debug_otp) {
        setDebugOtp(response.debug_otp);
      }

      setStep('otp');
    } catch (error: unknown) {
      console.error("Send OTP failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "فشل إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setErrorMessage("يرجى إدخال رمز التحقق المكون من 6 أرقام");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await api.verifyOtpSignup(phoneNumber, otpCode, firstName, lastName, password);

      // Registration successful, navigate to dashboard
      navigate("/student-dashboard");

    } catch (error: unknown) {
      console.error("Verify OTP failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "رمز التحقق غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('info');
    setOtpCode("");
    setErrorMessage("");
    setDebugOtp(null);
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 relative z-10 overflow-y-auto h-full">
        <div className="w-full max-w-md my-auto">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="flex items-center justify-center gap-4 mb-2">
              <h1 className="text-right text-5xl font-bold text-[#062A1E] font-readex">
                إنشاء حساب<br />جديد
              </h1>
              <div>
                <img src={quranLogo} alt="Logo" className="w-87 h-82" />
              </div>
            </div>
            <p className="text-gray-600 mt-4 text-xl font-medium">
              {step === 'info'
                ? "أدخل معلوماتك الأساسية للانضمام إلى منصتنا"
                : "أدخل رمز التحقق المرسل إلى هاتفك"
              }
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
          <div className="space-y-4" dir="rtl">
            {step === 'info' ? (
              <>
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 text-right block">
                    الاسم الأول :
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="أدخل اسمك الأول"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 text-right block">
                    اسم العائلة :
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="أدخل اسم العائلة"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 text-right block">
                    رقم الهاتف :
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="مثال: 0555123456"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white"
                    dir="ltr"
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
                      placeholder="8 أحرف على الأقل"
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
                      placeholder="أعد إدخال كلمة المرور"
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
              </>
            ) : (
              <>
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#024C3F] transition-colors mb-4"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>تعديل البيانات</span>
                </button>

                {/* Phone Display */}
                <div className="bg-gray-50 p-3 rounded-lg text-center mb-4">
                  <span className="text-gray-600">تم إرسال رمز التحقق إلى: </span>
                  <span className="font-bold text-[#024C3F]" dir="ltr">{phoneNumber}</span>
                </div>

                {/* Debug OTP Display (Development Only) */}
                {debugOtp && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-center mb-4">
                    <span className="text-yellow-700 text-sm">رمز التحقق (للتطوير فقط): </span>
                    <span className="font-bold text-yellow-800 text-lg" dir="ltr">{debugOtp}</span>
                  </div>
                )}

                {/* OTP Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 text-right block">
                    رمز التحقق :
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="أدخل الرمز المكون من 6 أرقام"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-center bg-white text-2xl tracking-widest"
                    maxLength={6}
                    dir="ltr"
                  />
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="text-sm text-[#024C3F] hover:text-[#FEC737] transition-colors"
                  >
                    إعادة إرسال رمز التحقق
                  </button>
                </div>
              </>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-right">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={step === 'info' ? handleSendOtp : handleVerifyOtp}
              disabled={isLoading}
              className="w-full bg-[#FEC737] hover:bg-[#FDBF10] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "جارٍ المعالجة..."
                : step === 'info'
                  ? "إرسال رمز التحقق"
                  : "تأكيد وإنشاء الحساب"
              }
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-3">
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
