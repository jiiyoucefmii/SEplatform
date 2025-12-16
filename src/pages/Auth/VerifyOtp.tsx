import { useState, useEffect } from "react";
import { HeartHandshake } from "lucide-react";
import bookCover from "../../assets/Book Cover.jpg";

import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { phoneNumber } = location.state || { phoneNumber: "05xxxxxxxx" }; // Default for preview if no state

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(60); // 60 seconds countdown

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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

    const handleVerify = () => {
        // Logic to verify OTP
        const code = otp.join("");
        if (code.length < 4) {
            alert("الرجاء إدخال الرمز كاملاً");
            return;
        }
        console.log("Verifying code:", code);
        // alert("تم التحقق بنجاح! ننتقل الآن لصفحة تغيير كلمة المرور (محاكاة)");
        // navigate("/reset-password", { state: { phoneNumber, code } }); // Next step would be reset password
        navigate("/reset-password", { state: { phoneNumber } });
    };

    const handleResend = () => {
        if (timer === 0) {
            console.log("Resending code...");
            alert("تم إعادة إرسال الرمز");
            setTimer(60);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex h-screen bg-white font-sans overflow-hidden">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 relative z-10 overflow-y-auto h-full">
                <div className="w-full max-w-md my-auto">
                    {/* Header */}
                    <div className="text-center mb-10 relative">
                        <h1 className="text-center text-5xl font-bold text-[#062A1E] font-readex mb-6">
                            تأكيد رمز التحقق
                        </h1>
                        <p className="text-gray-600 text-lg font-medium" dir="rtl">
                            لقد أرسلنا لك كود التحقق إلى رقمك <span dir="ltr">{phoneNumber}</span>
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-8">
                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-4" dir="ltr">
                            {otp.map((data, index) => (
                                <input
                                    className="w-16 h-16 text-center text-3xl font-bold border-2 border-[#FEC737] rounded-lg focus:ring-2 focus:ring-[#FEC737] outline-none transition-all"
                                    type="text"
                                    maxLength={1}
                                    key={index}
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    onFocus={e => e.target.select()}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerify}
                            className="w-full bg-[#FEC737] hover:bg-[#FDBF10] text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-lg"
                        >
                            تأكيد الكود
                        </button>

                        {/* Resend Section */}
                        <div className="text-center space-y-4">
                            <p className="text-black font-bold text-sm">
                                يمكنك إعادة إرسال الكود خلال {timer > 0 ? formatTime(timer) : "الآن"}
                            </p>
                            <button
                                onClick={handleResend}
                                disabled={timer > 0}
                                className={`w-full bg-[#FEC737] text-white font-bold py-3.5 rounded-lg shadow-md transition-all text-lg ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FDBF10] hover:shadow-lg'}`}
                            >
                                إعادة إرسال الكود
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
