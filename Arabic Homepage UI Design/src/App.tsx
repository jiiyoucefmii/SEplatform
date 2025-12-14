import { motion } from 'motion/react';
import { Users, Calendar, FileText, BookOpen, Trophy, Bell, Award, BookMarked } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Readex Pro', sans-serif" }}>
      {/* Google Fonts Import */}
      <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 bg-white shadow-md z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Right Side: Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#024C3F] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-[#FEC737]" />
            </div>
            <h1 className="text-2xl text-[#024C3F]" style={{ fontWeight: 700 }}>
              مدرسة الهدى لتحفيظ القرآن الكريم
            </h1>
          </div>

          {/* Center: Menu Items */}
          <div className="hidden lg:flex items-center gap-8 text-[#024C3F]">
            <a href="#" className="hover:text-[#FEC737] transition-colors">الرئيسية</a>
            <a href="#" className="hover:text-[#FEC737] transition-colors">من نحن</a>
            <a href="#" className="hover:text-[#FEC737] transition-colors">نظام الإدارة</a>
            <a href="#" className="hover:text-[#FEC737] transition-colors">الحلقات والإمام</a>
            <a href="#" className="hover:text-[#FEC737] transition-colors">المسابقات والإعلانات</a>
            <a href="#" className="hover:text-[#FEC737] transition-colors">تواصل معنا</a>
          </div>

          {/* Left Side: Buttons */}
          <div className="flex items-center gap-3">
            <button className="px-6 py-2 border-2 border-[#024C3F] text-[#024C3F] rounded-lg hover:bg-[#024C3F] hover:text-white transition-all">
              تسجيل الدخول
            </button>
            <button className="px-6 py-2 bg-[#FEC737] text-[#024C3F] rounded-lg hover:bg-[#d4a72e] transition-all" style={{ fontWeight: 600 }}>
              سجّل الآن
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1603522456939-a52d4adda873?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJc2xhbWljJTIwZ2VvbWV0cmljJTIwcGF0dGVybnxlbnwxfHx8fDE3NjUzNTU1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Right Side: Text Content */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="space-y-8"
          >
            <div className="inline-block px-6 py-2 bg-[#FEC737]/10 text-[#024C3F] rounded-full border border-[#FEC737]" style={{ fontWeight: 600 }}>
              تسجيلات بداية السنة
            </div>
            
            <h1 className="text-5xl lg:text-6xl text-[#024C3F] leading-tight" style={{ fontWeight: 700 }}>
              نظام إدارة شامل لمدرسة الهدى لتحفيظ القرآن الكريم
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              إدارة حديثة وسهلة للحلقات، الطلاب، الأساتذة والأنشطة.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-[#FEC737] text-[#024C3F] rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl"
              style={{ fontWeight: 700 }}
            >
              سجّل الآن
            </motion.button>

            <div className="flex items-center gap-12 pt-8">
              <div className="text-center">
                <div className="text-4xl text-[#024C3F]" style={{ fontWeight: 700 }}>500+</div>
                <div className="text-gray-600 mt-1">طالب وطالبة</div>
              </div>
              <div className="text-center">
                <div className="text-4xl text-[#024C3F]" style={{ fontWeight: 700 }}>25+</div>
                <div className="text-gray-600 mt-1">حلقة قرآنية</div>
              </div>
              <div className="text-center">
                <div className="text-4xl text-[#024C3F]" style={{ fontWeight: 700 }}>15+</div>
                <div className="text-gray-600 mt-1">أستاذ ومعلّم</div>
              </div>
            </div>
          </motion.div>

          {/* Left Side: Illustration */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FEC737]/20 to-[#024C3F]/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1762059904093-c76f6f591b45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3NxdWUlMjBxdXJhbiUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjUzNjE3NzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Islamic Education"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 relative">
        {/* Decorative Pattern */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FEC737] to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-[#024C3F] mb-4" style={{ fontWeight: 700 }}>
              مميزات النظام
            </h2>
            <p className="text-xl text-gray-600">نظام شامل ومتكامل لإدارة جميع جوانب المدرسة القرآنية</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'إدارة الطلاب', desc: 'متابعة شاملة لجميع الطلاب ومستوياتهم' },
              { icon: BookMarked, title: 'إدارة الحلقات', desc: 'تنظيم الحلقات والأنشطة بسهولة' },
              { icon: Calendar, title: 'الجداول والاختبارات', desc: 'جدولة ذكية ومتابعة الاختبارات' },
              { icon: FileText, title: 'التقارير والإشعارات', desc: 'تقارير تفصيلية وإشعارات فورية' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FEC737] to-[#d4a72e] flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-[#024C3F]" />
                </div>
                <h3 className="text-2xl text-[#024C3F] mb-3" style={{ fontWeight: 700 }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Imam Halaqat Section */}
      <section className="py-20 px-6 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <img 
            src="https://images.unsplash.com/photo-1758696642918-68bfea092855?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJc2xhbWljJTIwcGF0dGVybiUyMGdvbGR8ZW58MXx8fHwxNzY1MzYxNzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-[#024C3F] mb-4" style={{ fontWeight: 700 }}>
              الحلقات الخاصة بالإمام
            </h2>
            <p className="text-xl text-gray-600">متابعة مستمرة لحلقات الإمام وأنشطته</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { day: 'الأحد', surah: 'سورة البقرة', students: 25, time: '08:00 صباحاً' },
              { day: 'الثلاثاء', surah: 'جزء عم', students: 30, time: '09:00 صباحاً' },
              { day: 'الخميس', surah: 'سورة آل عمران', students: 28, time: '08:30 صباحاً' },
              { day: 'السبت', surah: 'سورة الكهف', students: 32, time: '10:00 صباحاً' },
              { day: 'الاثنين', surah: 'جزء تبارك', students: 26, time: '08:00 صباحاً' },
              { day: 'الأربعاء', surah: 'سورة يس', students: 29, time: '09:30 صباحاً' }
            ].map((halaqa, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-[#024C3F] to-[#036454] flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[#FEC737]" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-2xl text-[#024C3F]" style={{ fontWeight: 700 }}>
                    حلقة يوم {halaqa.day}
                  </h3>
                  <p className="text-lg text-gray-700">{halaqa.surah}</p>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {halaqa.students} طالب
                    </span>
                    <span>{halaqa.time}</span>
                  </div>
                  <button className="w-full mt-4 px-6 py-3 bg-[#FEC737] text-[#024C3F] rounded-lg hover:bg-[#d4a72e] transition-colors" style={{ fontWeight: 600 }}>
                    عرض الحلقة
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <button className="px-10 py-4 bg-[#FEC737] text-[#024C3F] rounded-xl shadow-lg hover:shadow-xl transition-all text-lg" style={{ fontWeight: 700 }}>
              عرض جميع الحلقات
            </button>
          </motion.div>
        </div>
      </section>

      {/* Competitions & Announcements Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#024C3F] to-transparent"></div>
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl text-[#024C3F] mb-4" style={{ fontWeight: 700 }}>
              المسابقات والإعلانات
            </h2>
            <p className="text-xl text-gray-600">آخر الأخبار والمسابقات القرآنية</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Competitions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-[#FEC737]" />
                <h3 className="text-3xl text-[#024C3F]" style={{ fontWeight: 700 }}>المسابقات</h3>
              </div>
              
              {[
                { title: 'مسابقة حفظ جزء عم', desc: 'مسابقة شهرية لحفظ جزء عم كاملاً مع جوائز قيمة', date: '15 يناير 2025', prize: 'جوائز مالية' },
                { title: 'مسابقة التجويد والترتيل', desc: 'مسابقة في أحكام التجويد وحسن الترتيل', date: '22 يناير 2025', prize: 'شهادات تقدير' },
                { title: 'مسابقة القرآن الكريم الكبرى', desc: 'مسابقة سنوية على مستوى المدرسة', date: '5 فبراير 2025', prize: 'رحلة عمرة' }
              ].map((competition, index) => (
                <motion.div
                  key={index}
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FEC737]/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-[#024C3F]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl text-[#024C3F] mb-2" style={{ fontWeight: 700 }}>
                        {competition.title}
                      </h4>
                      <p className="text-gray-600 mb-3">{competition.desc}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#FEC737]" style={{ fontWeight: 600 }}>{competition.prize}</span>
                        <span className="text-gray-500">{competition.date}</span>
                      </div>
                      <button className="mt-4 px-5 py-2 border border-[#024C3F] text-[#024C3F] rounded-lg hover:bg-[#024C3F] hover:text-white transition-all">
                        المزيد
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Announcements */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-8 h-8 text-[#FEC737]" />
                <h3 className="text-3xl text-[#024C3F]" style={{ fontWeight: 700 }}>الإعلانات</h3>
              </div>
              
              {[
                { title: 'بدء التسجيل للعام الجديد', desc: 'يسر مدرسة الهدى أن تعلن عن بدء التسجيل للعام الدراسي الجديد', date: '10 ديسمبر 2024' },
                { title: 'تعطيل الدراسة', desc: 'تعلن إدارة المدرسة عن تعطيل الدراسة يوم الجمعة القادم', date: '8 ديسمبر 2024' },
                { title: 'احتفال ختم القرآن الكريم', desc: 'دعوة عامة لحضور احتفال ختم الطلاب للقرآن الكريم', date: '5 ديسمبر 2024' },
                { title: 'جدول الاختبارات الشهرية', desc: 'تم نشر جدول الاختبارات الشهرية على الموقع', date: '3 ديسمبر 2024' }
              ].map((announcement, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#024C3F]/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-6 h-6 text-[#024C3F]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl text-[#024C3F] mb-2" style={{ fontWeight: 700 }}>
                        {announcement.title}
                      </h4>
                      <p className="text-gray-600 mb-3">{announcement.desc}</p>
                      <div className="flex items-center justify-between">
                        <button className="px-5 py-2 border border-[#024C3F] text-[#024C3F] rounded-lg hover:bg-[#024C3F] hover:text-white transition-all">
                          المزيد
                        </button>
                        <span className="text-sm text-gray-500">{announcement.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-[#024C3F] text-white py-12 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* School Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FEC737] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#024C3F]" />
                </div>
                <h3 className="text-xl" style={{ fontWeight: 700 }}>مدرسة الهدى</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                مدرسة قرآنية متخصصة في تحفيظ القرآن الكريم وتعليم أحكام التجويد
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-lg mb-4" style={{ fontWeight: 700 }}>روابط سريعة</h4>
              <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">الرئيسية</a>
              <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">من نحن</a>
              <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">تواصل معنا</a>
              <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">سياسة الخصوصية</a>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <h4 className="text-lg mb-4" style={{ fontWeight: 700 }}>الخدمات</h4>
              <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">نظام الإدارة</a>
              <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">الحلقات والإمام</a>
              <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">المسابقات</a>
              <a href="#" className="block text-gray-300 hover:text-[#FEC737] transition-colors">الإعلانات</a>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-lg mb-4" style={{ fontWeight: 700 }}>معلومات التواصل</h4>
              <p className="text-gray-300">الجزائر العاصمة، الجزائر</p>
              <p className="text-gray-300">هاتف: +213 123 456 789</p>
              <p className="text-gray-300">البريد: info@alhuda-school.dz</p>
            </div>
          </div>

          <div className="border-t border-[#FEC737]/30 pt-8 mt-8 text-center">
            <p className="text-gray-300">
              جميع الحقوق محفوظة — مدرسة الهدى لتحفيظ القرآن الكريم © 2024
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
