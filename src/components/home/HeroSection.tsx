import { Link } from 'react-router-dom';
import { Button } from '../button';
import { motion } from 'motion/react';
import type { User } from '@/types';

type Props = {
  user: User | null;
};

export function HeroSection({ user }: Props) {
  return (
    <section id="home" className="relative w-screen left-0 right-0 min-h-screen flex items-center p-0 overflow-hidden bg-gradient-to-b from-[#023B33] to-[#012e28]" style={{ scrollMarginTop: 72 }}>

      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
      >
        <div
          aria-hidden
          className="w-screen h-full"
          style={{
            /* Use mask-based pattern: show a subtle, slightly lighter tint where the
               SVG pattern is, and repeat it ~3 times across the width */
            backgroundColor: 'rgba(255,255,255,0.06)',
            WebkitMaskImage: "url('/assets/pattern.svg')",
            maskImage: "url('/assets/pattern.svg')",
            WebkitMaskRepeat: 'repeat',
            maskRepeat: 'repeat',
            WebkitMaskSize: '33% auto',
            maskSize: '33% auto',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none z-[5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 }}
      >
        <div className="w-full h-full bg-black/10" aria-hidden />
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-8 text-center text-white">
        <motion.div className="space-y-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        >
          <div className="inline-block px-6 py-2 bg-[#FEC737]/20 text-[#FFFFF] rounded-full border border-[#FEC737]/40 font-semibold">
            تسجيلات بداية السنة
          </div>

          <h1 className="text-5xl lg:text-6xl leading-tight font-extrabold drop-shadow-lg">
            نظام إدارة شامل لمدرسة الهدى لتحفيظ القرآن الكريم
          </h1>

          <p className="text-xl text-gray-100 leading-relaxed drop-shadow-sm">إدارة حديثة وسهلة للحلقات، الطلاب، الأساتذة والأنشطة.</p>

          <div className="mt-4 flex justify-center items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register">
                <Button className="px-8 py-4 bg-alhuda text-white hover:bg-[#01382f]">سجل الآن</Button>
              </Link>
            </motion.div>
            <motion.button whileHover={{ scale: 1.03 }} className="px-6 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10">اكتشف المزيد</motion.button>
          </div>

          {user ? <div className="text-sm text-gray-100 drop-shadow-sm">مرحباً {user.first_name} {user.last_name}</div> : null}
        </motion.div>
      </div>
    </section>
  );
}
