import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api } from '@/services/api';
import type { Khotba } from '@/types';

export function ImamHalaqatSection() {
  const [khotbas, setKhotbas] = useState<Khotba[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await api.getKhotbas();
        if (!mounted) return;
        setKhotbas(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'خطأ في جلب الخطب');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false };
  }, []);

  return (
    <section id="halaqat" className="py-20 px-6 bg-white relative overflow-hidden" style={{ scrollMarginTop: 72 }}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2 className="text-4xl lg:text-5xl text-[#024C3F] mb-4 font-extrabold">خطب الإمام</h2>
          <p className="text-xl text-gray-600">استمع إلى آخر الخطب المجانية من الإمام</p>
        </motion.div>

        {loading && <div className="py-8 text-center">جاري التحميل...</div>}
        {error && <div className="py-8 text-center text-red-500">{error}</div>}

        {!loading && !error && (!khotbas || khotbas.length === 0) && (
          <div className="py-8 text-center text-gray-500">لا توجد خطب حالياً</div>
        )}

        {!loading && khotbas && khotbas.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {khotbas.map((k, index) => (
              <motion.article key={k.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-6 space-y-3">
                  <h3 className="text-xl text-[#024C3F] font-extrabold">{k.title}</h3>
                  {k.summary ? <p className="text-base text-gray-700">{k.summary}</p> : null}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{k.date ? new Date(k.date).toLocaleDateString() : ''}</span>
                    <a href={`#/khotba/${k.id}`} className="text-sm text-[#024C3F] hover:text-[#FEC737]">اقرأ المزيد</a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div className="text-center" initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <button className="px-10 py-4 bg-[#FEC737] text-[#024C3F] rounded-xl shadow-lg hover:shadow-xl transition-all text-lg font-extrabold">
            عرض جميع الخطب
          </button>
        </motion.div>
      </div>
    </section>
  );
}
