import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export function ImamHalaqatSection() {
  return (
    <section id="halaqat" className="py-20 px-6 bg-white relative overflow-hidden" style={{ scrollMarginTop: 72 }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1758696642918-68bfea092855?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJc2xhbWljJTIwcGF0dGVybiUyMGdvbGR8ZW58MXx8fHwxNzY1MzYxNzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div className="text-center mb-16" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl lg:text-5xl text-[#024C3F] mb-4 font-extrabold">الحلقات الخاصة بالإمام</h2>
          <p className="text-xl text-gray-600">متابعة مستمرة لحلقات الإمام وأنشطته</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            { day: 'الأحد', surah: 'سورة البقرة', students: 25, time: '08:00 صباحاً' },
            { day: 'الثلاثاء', surah: 'جزء عم', students: 30, time: '09:00 صباحاً' },
            { day: 'الخميس', surah: 'سورة آل عمران', students: 28, time: '08:30 صباحاً' },
          ].map((halaqa, index) => (
            <motion.div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="h-28 bg-gradient-to-br from-[#024C3F] to-[#036454] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#FEC737] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-xl text-[#024C3F] font-extrabold">حلقة يوم {halaqa.day}</h3>
                <p className="text-base text-gray-700">{halaqa.surah}</p>
                <div className="flex items-center justify-between text-gray-600 text-sm">
                  <span className="flex items-center gap-2">{halaqa.students} طالب</span>
                  <span>{halaqa.time}</span>
                </div>
                <button className="w-full mt-3 px-4 py-2 bg-[#FEC737] text-[#024C3F] rounded-md hover:bg-[#d4a72e] transition-colors font-semibold text-sm">
                  عرض الحلقة
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center" initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <button className="px-10 py-4 bg-[#FEC737] text-[#024C3F] rounded-xl shadow-lg hover:shadow-xl transition-all text-lg font-extrabold">
            عرض جميع الحلقات
          </button>
        </motion.div>
      </div>
    </section>
  );
}
