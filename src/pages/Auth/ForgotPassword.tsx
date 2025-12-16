import { useState } from "react";
import { Phone, HeartHandshake } from "lucide-react";
import bookCover from "../../assets/Book Cover.jpg";
import phoneDw from "../../assets/phonedw.svg";

import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleSubmit = () => {
        if (!phoneNumber) {
            alert("يرجى إدخال رقم الهاتف");
            return;
        }
        // Simulate sending code
        console.log("Sending recovery code to:", phoneNumber);
        // alert("تم إرسال كود التأكيد إلى رقم هاتفك (محاكاة)");
        navigate("/verify-otp", { state: { phoneNumber } });
    };

    return (
        <div className="flex h-screen bg-white font-sans overflow-hidden">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 relative z-10 overflow-y-auto h-full">
                <div className="w-full max-w-md my-auto">
                    {/* Header */}
                    <div className="text-center mb-8 relative">
                        <div className="flex items-center justify-center gap-4 mb-2">

                            <h1 className="text-right text-6xl font-bold text-[#062A1E] font-readex leading-tight">
                                نسيت كلمة<br />المرور؟
                            </h1>
                            <div >
                                <img src={phoneDw} alt="Forgot Password Icon" className="w-[100px] h-[100px]" />
                            </div>
                        </div>
                        <p className="text-gray-600 mt-6 text-xl font-medium px-4">
                            لا تقلق، يمكننا مساعدتك على استعادة حسابك بسهولة.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6" dir="rtl">
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
                                    placeholder="أدخل رقم هاتفك"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all placeholder:text-gray-400 text-right bg-white pl-10"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transform scale-x-[-1]">
                                    <Phone className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Signup Link */}
                        <div className="text-right">
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-[#024C3F] font-bold hover:underline text-sm"
                            >
                                ليس لديك حساب؟ أنشئ حساباً
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-[#FEC737] hover:bg-[#FDBF10] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-lg"
                        >
                            إرسال كود التأكيد
                        </button>

                        {/* Back to Login Link */}
                        <div className="text-center mt-2">
                            <button
                                onClick={() => navigate("/login")}
                                className="text-gray-500 hover:text-gray-700 font-medium hover:underline text-sm"
                            >
                                العودة لتسجيل الدخول
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-16 text-center space-y-3">
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
