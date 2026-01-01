import { useState } from "react";
import { api } from "../../services/api";
import { Phone, HeartHandshake } from "lucide-react";
import bookCover from "../../assets/Book Cover.jpg";
import quranLogo from "../../assets/quranlogoyellow.svg";
import { useNavigate } from "react-router-dom";

export default function LoginWithPhonePage() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleSubmit = async () => {
        if (!phoneNumber) {
            alert("يرجى إدخال رقم الهاتف");
            return;
        }

        try {
            const response = await api.login(phoneNumber);

            console.log("Login successful:", response);
            localStorage.setItem("user", JSON.stringify(response.user));
            localStorage.setItem("auth_token", response.token); // valid since api.login returns token

            alert("تم تسجيل الدخول بنجاح!");
            if (response.user.role === 'TEACHER') {
                navigate("/teacher");
            } else {
                navigate("/dashboard");
            }
        } catch (error: unknown) {
            console.error("Login failed:", error);
            const msg = error instanceof Error ? error.message : "فشل تسجيل الدخول";
            alert(msg);
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
                            سجل الدخول باستخدام رقم هاتفك
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="flex bg-gray-100 rounded-full p-1 mb-8 max-w-xs mx-auto">
                        <button
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
                                onClick={() => navigate("/login")}
                                className="text-gray-500 text-sm font-medium hover:text-[#FEC737] transition-colors"
                            >
                                أو سجل الدخول باستخدام اسم المستخدم
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
