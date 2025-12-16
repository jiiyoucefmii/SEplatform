import { useState, useEffect } from "react";
import { HeartHandshake, Phone } from "lucide-react";
import bookCover from "../../assets/Book Cover.jpg";
import quranLogo from "../../assets/quranlogoyellow.svg";
import { useNavigate, useLocation } from "react-router-dom";

export default function SignupStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");

  // Get state passed from previous step
  const { username, password } = location.state || {};

  useEffect(() => {
    if (!username || !password) {
      // Redirect back if accessed directly without state
      navigate("/signup");
    }
  }, [username, password, navigate]);

  const handleSubmit = () => {
    if (!phoneNumber) {
      alert("يرجى إدخال رقم الهاتف");
      return;
    }
    // Simple length check for example (adjust as per requirements)
    if (phoneNumber.length < 10) {
      alert("رقم الهاتف يجب أن يكون صحيحاً");
      return;
    }

    navigate("/signup-step-3", { state: { username, password, phoneNumber } });
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
              أدخل رقم هاتفك للتواصل
            </p>
          </div>

          {/* Progress Indicator (Optional but nice) */}
          <div className="flex justify-center mb-6 gap-2">
            <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
            <div className="h-2 w-8 bg-[#FEC737] rounded-full"></div>
            <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
          </div>

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
                  placeholder="05xxxxxxxx"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => navigate("/signup")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-lg transition-all text-lg"
              >
                السابق
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#FEC737] hover:bg-[#FDBF10] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-lg"
              >
                التالي
              </button>
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
