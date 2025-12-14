import { motion } from 'motion/react';

export function CompetitionsSection() {
  return (
    <section id="competitions" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white relative" style={{ scrollMarginTop: 72 }}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl lg:text-5xl text-[#024C3F] mb-4 font-extrabold">المسابقات والإعلانات</h2>
          <p className="text-xl text-gray-600">آخر الأخبار والمسابقات القرآنية</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div className="space-y-6" initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#FEC737] rounded-full" />
              <h3 className="text-3xl text-[#024C3F] font-extrabold">المسابقات</h3>
            </div>
            {[
              { title: 'مسابقة حفظ جزء عم', desc: 'مسابقة شهرية لحفظ جزء عم كاملاً مع جوائز قيمة', date: '15 يناير 2025', prize: 'جوائز مالية' },
              { title: 'مسابقة التجويد والترتيل', desc: 'مسابقة في أحكام التجويد وحسن الترتيل', date: '22 يناير 2025', prize: 'شهادات تقدير' }
            ].map((competition, index) => (
              <motion.div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FEC737]/20 flex items-center justify-center flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xl text-[#024C3F] mb-2 font-extrabold">{competition.title}</h4>
                    <p className="text-gray-600 mb-3">{competition.desc}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#FEC737] font-semibold">{competition.prize}</span>
                      <span className="text-gray-500">{competition.date}</span>
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} className="mt-4 px-5 py-2 border border-[#024C3F] text-[#024C3F] rounded-lg hover:bg-[#024C3F] hover:text-white transition-all">المزيد</motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="space-y-6" initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#FEC737] rounded-full" />
              <h3 className="text-3xl text-[#024C3F] font-extrabold">الإعلانات</h3>
            </div>
            {[
              { title: 'بدء التسجيل للعام الجديد', desc: 'يسر مدرسة الهدى أن تعلن عن بدء التسجيل للعام الدراسي الجديد', date: '10 ديسمبر 2024' },
              { title: 'تعطيل الدراسة', desc: 'تعلن إدارة المدرسة عن تعطيل الدراسة يوم الجمعة القادم', date: '8 ديسمبر 2024' }
            ].map((announcement, index) => (
              <motion.div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#024C3F]/10 flex items-center justify-center flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xl text-[#024C3F] mb-2 font-extrabold">{announcement.title}</h4>
                    <p className="text-gray-600 mb-3">{announcement.desc}</p>
                    <div className="flex items-center justify-between">
                      <motion.button whileHover={{ scale: 1.03 }} className="px-5 py-2 border border-[#024C3F] text-[#024C3F] rounded-lg hover:bg-[#024C3F] hover:text-white transition-all">المزيد</motion.button>
                      <span className="text-sm text-gray-500">{announcement.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
