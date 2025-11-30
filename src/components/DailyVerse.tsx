import { useState, useEffect } from "react";
import { quranVerses } from "../data/QuranVerses";
import type { DailyVerse } from "../types";
export default function DailyVerseCard() {
  const [verse, setVerse] = useState<DailyVerse>({
    arabic: "جاري التحميل...",
    reference: "",
  });

  const fetchRandomVerse = () => {
    const randomIndex = Math.floor(Math.random() * quranVerses.length);
    setVerse(quranVerses[randomIndex]);
  };

  useEffect(() => {
    fetchRandomVerse(); // fetch one verse on mount

    // Refresh every minute (60,000 ms)
    const interval = setInterval(fetchRandomVerse, 60000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div
      className="rounded-lg p-6 bg-gradient-to-br "
      style={{
        backgroundImage: "linear-gradient(to bottom right, #C0F3D8, #F1E6BE)",
      }}
    >
      <p
        className="text-center text-lg leading-loose mb-2 font-quran"
        dir="rtl"
      >
        {verse.arabic}
      </p>
      <p className="text-center text-sm text-gray-500" dir="rtl">
        {verse.reference}
      </p>
    </div>
  );
}
