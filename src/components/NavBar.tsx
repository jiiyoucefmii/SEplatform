import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    role: "PARENT" | "TEACHER" | "STUDENT";
    phone_num: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      PARENT: "ولي أمر",
      TEACHER: "معلم",
      STUDENT: "طالب",
      ADMIN: "مدير",
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3" dir="rtl">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📖</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                المدرسة القرآنية لمسجد الهدى
              </h1>
              <p className="text-xs text-gray-500">
                منصة إدارة الحلقات القرآنية
              </p>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              dir="rtl"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleLabel(user.role)}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.first_name?.charAt(0) || "م"}
              </div>
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />

                {/* Menu */}
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-20">
                  <div className="px-4 py-3 border-b" dir="rtl">
                    <p className="text-sm font-medium text-gray-800">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{user.phone_num}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/dashboard");
                    }}
                    className="w-full px-4 py-2 text-right hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                    dir="rtl"
                  >
                    <span>🏠</span>
                    <span>الصفحة الرئيسية</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Navigate to profile (future feature)
                    }}
                    className="w-full px-4 py-2 text-right hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                    dir="rtl"
                  >
                    <span>👤</span>
                    <span>الملف الشخصي</span>
                  </button>

                  {user.role === "PARENT" && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        // Navigate to children management (future feature)
                      }}
                      className="w-full px-4 py-2 text-right hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                      dir="rtl"
                    >
                      <span>👨‍👩‍👧‍👦</span>
                      <span>إدارة الأبناء</span>
                    </button>
                  )}

                  {user.role === "TEACHER" && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        // Navigate to students management (future feature)
                      }}
                      className="w-full px-4 py-2 text-right hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
                      dir="rtl"
                    >
                      <span>📚</span>
                      <span>طلابي</span>
                    </button>
                  )}

                  <div className="border-t my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-right hover:bg-red-50 text-sm text-red-600 flex items-center gap-2 font-medium"
                    dir="rtl"
                  >
                    <span>🚪</span>
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
