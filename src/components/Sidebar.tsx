import {
  BookOpen,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  userName?: string;
  onMenuItemClick?: (label: string) => void;
}

const menuItems = [
  { icon: BookOpen, label: "حلقات قرآنية" },
  { icon: History, label: "السجل" },
  { icon: Bell, label: "إشعارات" },
  { icon: Settings, label: "إعدادات" },
];

export function Sidebar({
  collapsed,
  onToggle,
  userName = "أم محمد",
  onMenuItemClick,
}: SidebarProps) {
  const [activeItem, setActiveItem] = useState("حلقات قرآنية");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  const handleMenuClick = (label: string) => {
    setActiveItem(label);
    if (onMenuItemClick) {
      onMenuItemClick(label);
    }
  };

  return (
    <aside
      className={`bg-[#024C3F] text-white transition-all duration-300 flex flex-col ${collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* School Name Header */}
      <div className="p-6 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img
                src="/assets/masjid.svg"
                alt="masjid"
                className="w-10 h-10"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(77%) sepia(80%) saturate(1000%) hue-rotate(350deg) brightness(100%) contrast(100%)",
                }}
              />
            </div>
            <div className="flex-1 text-right">
              <h2 className="text-white mb-0.5">المدرسة القرآنية</h2>
              <p className="text-white/80 text-sm">لمسجد الهدى</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="text-center">
            <img
              src="/assets/masjid.svg"
              alt="masjid"
              className="w-10 h-10 mx-auto"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(77%) sepia(80%) saturate(1000%) hue-rotate(350deg) brightness(100%) contrast(100%)",
              }}
            />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="px-3 py-2">
        <button
          onClick={onToggle}
          className="w-full p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;

            return (
              <li key={item.label}>
                <button
                  onClick={() => handleMenuClick(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? "bg-[#024C3F]/60 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile and Logout */}
      <div className="p-4 border-t border-white/10">
        {!collapsed ? (
          <div>
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src="/assets/muslim boy.svg"
                  alt="user"
                  className="w-10 h-10 rounded-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{userName}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/90"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">تسجيل الخروج</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/assets/muslim boy.svg"
                alt="user"
                className="w-10 h-10 rounded-full object-contain"
              />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
