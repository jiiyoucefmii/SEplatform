import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';


export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between" style={{ height: 56 }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#024C3F] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#FEC737]" />
          </div>
          <h1 className="text-lg text-[#024C3F] font-semibold">مدرسة الهدى</h1>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-[#024C3F] text-sm">
          <a href="#home" className="hover:text-[#FEC737] transition-colors">الرئيسية</a>
          <a href="#about" className="hover:text-[#FEC737] transition-colors">من نحن</a>
          <a href="#system" className="hover:text-[#FEC737] transition-colors">نظام الإدارة</a>
          <a href="#halaqat" className="hover:text-[#FEC737] transition-colors">الحلقات</a>
          <a href="#competitions" className="hover:text-[#FEC737] transition-colors">المسابقات</a>
        </div>


        <div className="flex items-center gap-2">
          <Link to="/login" className="px-4 py-1.5 border-2 border-[#024C3F] text-[#024C3F] rounded-md hover:bg-[#024C3F] hover:text-white transition-all text-sm">تسجيل الدخول</Link>
          <Link to="/signup" className="px-4 py-1.5 bg-[#FEC737] text-[#024C3F] rounded-md hover:bg-[#d4a72e] transition-all text-sm font-semibold">سجّل الآن</Link>
        </div>
      </div>
    </motion.nav>
  );
}
