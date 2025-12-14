import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { Khotba } from '@/types';
import { motion } from 'motion/react';

export function PublicKhotbaList() {
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
        setError(err.message || 'خطأ في جلب البيانات');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false };
  }, []);

  if (loading) return <div className="py-8 text-center">جاري التحميل...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!khotbas || khotbas.length === 0) return <div className="py-8 text-center text-gray-500">لا توجد خطب حالياً</div>;

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h3 className="text-2xl text-[#024C3F] mb-6 font-extrabold" initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>خطب مجانية</motion.h3>

        <div className="grid md:grid-cols-2 gap-6">
          {khotbas.map((k) => (
            <motion.article key={k.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
              initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
            >
              <h4 className="text-xl text-[#024C3F] font-bold mb-2">{k.title}</h4>
              {k.summary ? <p className="text-gray-600 mb-4">{k.summary}</p> : null}
              <div className="flex items-center gap-3 justify-between">
                <small className="text-sm text-gray-500">{k.date ? new Date(k.date).toLocaleDateString() : ''}</small>
                <a href={`#/khotba/${k.id}`} className="text-sm text-[#024C3F] hover:text-[#FEC737]">اقرأ المزيد</a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
