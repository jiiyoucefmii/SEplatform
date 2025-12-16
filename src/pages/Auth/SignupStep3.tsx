import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { HeartHandshake } from "lucide-react";
import bookCover from "../../assets/Book Cover.jpg";
import quranLogo from "../../assets/quranlogoyellow.svg";
import { useNavigate, useLocation } from "react-router-dom";

export default function SignupStep3() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get state passed from previous steps
    const { username, password, phoneNumber } = location.state || {};

    const [otp, setOtp] = useState(["", "", "", ""]);

    useEffect(() => {
        if (!username || !password || !phoneNumber) {
            // Redirect back if accessed directly without state
            navigate("/HomePage");
        }
    }, [username, password, phoneNumber, navigate]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Handle backspace to go to previous input
        if (e.key === 'Backspace' && otp[index] === "" && index > 0) {
            const prevSibling = (e.currentTarget.previousSibling as HTMLInputElement);
            if (prevSibling) {
                prevSibling.focus();
            }
        }
    };


    const handleSubmit = async () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 4) {
            alert("يرجى إدخال رمز التحقق كاملاً");
            return;
        }

        // Here you would typically verify the OTP with an API endpoint
        // For now, we will assume it's valid and proceed with the final signup call

        try {
            const response = await api.signup({
                first_name: username,
                last_name: "المستخدم", // Default last name
                psswd: password,
                phone_num: phoneNumber,
                role: "STUDENT",
            });

            console.log("Signup successful:", response);
            localStorage.setItem("user", JSON.stringify(response.user));

            alert("تم إنشاء الحساب بنجاح!");
            navigate("/HomePage");
        } catch (error: unknown) {
            console.error("Signup failed:", error);
            const msg = error instanceof Error ? error.message : "فشل إنشاء الحساب";
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
                                إنشاء حساب<br />جديد
                            </h1>
                            <div >
                                <img src={quranLogo} alt="Logo" className="w-87 h-82" />
                            </div>
                        </div>
                        <p className="text-gray-600 mt-4 text-xl font-medium">
                            أدخل رمز التحقق المرسل إلى هاتفك
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex justify-center mb-6 gap-2">
                        <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
                        <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
                        <div className="h-2 w-8 bg-[#FEC737] rounded-full"></div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-8" dir="rtl">
                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-4" dir="ltr">
                            {otp.map((data, index) => (
                                <input
                                    className="w-14 h-14 text-center text-2xl font-bold border rounded-lg focus:border-[#FEC737] focus:ring-1 focus:ring-[#FEC737] outline-none transition-all"
                                    type="text"
                                    name="otp"
                                    maxLength={1}
                                    key={index}
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onFocus={e => e.target.select()}
                                />
                            ))}
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            لم يصلك الرمز؟ <button className="text-[#FEC737] font-bold hover:underline">إعادة إرسال</button>
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => navigate("/signup-step-2", { state: { username, password } })}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-lg transition-all text-lg"
                            >
                                السابق
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-[#FEC737] hover:bg-[#FDBF10] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-lg"
                            >
                                إنشاء الحساب
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
