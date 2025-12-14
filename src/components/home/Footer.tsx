import { motion } from 'motion/react';

export function Footer() {
  return (
    <motion.footer className="bg-[#024C3F] text-white py-12 px-6" initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#FEC737] flex items-center justify-center">
                <div className="w-6 h-6 bg-[#024C3F] rounded-full" />
              </div>
              <h3 className="text-xl font-extrabold">مدرسة الهدى</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">مدرسة قرآنية متخصصة في تحفيظ القرآن الكريم وتعليم أحكام التجويد</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg mb-4 font-semibold">روابط سريعة</h4>
            <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">الرئيسية</a>
            <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">من نحن</a>
            <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">تواصل معنا</a>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg mb-4 font-semibold">الخدمات</h4>
            <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">نظام الإدارة</a>
            <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">الحلقات والإمام</a>
            <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">المسابقات</a>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg mb-4 font-semibold">معلومات التواصل</h4>
            <p className="text-gray-300">الجزائر العاصمة، الجزائر</p>
            <p className="text-gray-300">هاتف: +213 123 456 789</p>
            <p className="text-gray-300">البريد: info@alhuda-school.dz</p>
          </div>
        </div>

        <div className="border-t border-[#FEC737]/30 pt-8 mt-8 text-center">
          <p className="text-gray-300">جميع الحقوق محفوظة — مدرسة الهدى لتحفيظ القرآن الكريم © {new Date().getFullYear()}</p>
        </div>
      </div>
    </motion.footer>
  );
}
