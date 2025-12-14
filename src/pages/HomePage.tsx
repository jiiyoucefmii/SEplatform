import { useMemo } from 'react';
import type { User } from '../types';
import { Navigation } from '../components/home/Navigation';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { ImamHalaqatSection } from '../components/home/ImamHalaqatSection';
import { CompetitionsSection } from '../components/home/CompetitionsSection';
import { Footer } from '../components/home/Footer';

export default function HomePage() {
  const user = useMemo<User | null>(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "'Readex Pro', sans-serif" }}>
      {/* Google Fonts Import (kept inline to preserve Arabic design) */}
      <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <Navigation />

      <main className="relative z-10">
        <HeroSection user={user} />
        <FeaturesSection />
        <ImamHalaqatSection />
        <CompetitionsSection />
      </main>

      <Footer />
    </div>
  );
}
