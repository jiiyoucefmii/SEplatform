import { motion } from 'motion/react';
import { Users, BookOpen, Calendar, FileText } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    { icon: Users, title: 'إدارة الطلاب', desc: 'متابعة شاملة لجميع الطلاب ومستوياتهم' },
    { icon: BookOpen, title: 'إدارة الحلقات', desc: 'تنظيم الحلقات والأنشطة بسهولة' },
    { icon: Calendar, title: 'الجداول والاختبارات', desc: 'جدولة ذكية ومتابعة الاختبارات' },
    { icon: FileText, title: 'التقارير والإشعارات', desc: 'تقارير تفصيلية وإشعارات فورية' }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 relative" style={{ scrollMarginTop: 72 }}>
      <div id="about" />
      <div id="system" />
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl lg:text-5xl text-[#024C3F] mb-4" style={{ fontWeight: 700 }}>مميزات النظام</h2>
          <p className="text-xl text-gray-600">نظام شامل ومتكامل لإدارة جميع جوانب المدرسة القرآنية</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div key={index} className="bg-white rounded-2xl p-8 shadow-lg transition-all cursor-pointer"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FEC737] to-[#d4a72e] flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl text-[#024C3F] mb-3" style={{ fontWeight: 700 }}>{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
