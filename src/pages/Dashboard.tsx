import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import ProgressCircle from "../components/ProgressCircle";
import DailyVerseCard from "../components/DailyVerse";
import SessionCard from "../components/SessionCard";
import { api } from "../services/api";
import type { Session, User } from "../types";

export default function DashboardPage() {
  const [progress, setProgress] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    // Mock login
    if (!localStorage.getItem("user")) {
      const mockUser = {
        user_id: "1",
        first_name: "محمد",
        last_name: "أحمد",
        psswd: "pass",
        phone_num: "0123456789",
        role: "PARENT" as const,
      };
      localStorage.setItem("user", JSON.stringify(mockUser));
    }

    const loadData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }

        // Mock data for testing layout
        setProgress(75);
        setSessions([
          {
            id: "1",
            date: "2024-01-15",
            savedVerses: 5,
            reviewedVerses: 10,
            surah: "البقرة",
            juz: "الأول",
            evaluation: "ممتاز",
            status: "present",
          },
          {
            id: "2",
            date: "2024-01-16",
            savedVerses: 3,
            reviewedVerses: 8,
            surah: "آل عمران",
            juz: "الثاني",
            evaluation: "جيد جداً",
            status: "present",
          },
          {
            id: "3",
            date: "2024-01-17",
            savedVerses: 0,
            reviewedVerses: 0,
            surah: "",
            juz: "",
            evaluation: "",
            status: "absent",
          },
        ]);

        // API calls - ready for when backend is available
        // const userId = userStr ? JSON.parse(userStr).user_id : "1";
        // const progressData = await api.getUserProgress(userId);
        // const verseData = await api.getDailyVerse();
        // const sessionsData = await api.getSessions(userId);
        // setProgress(progressData.percentage);
        // setSessions(sessionsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <MainLayout user={user}>
      <div className="min-h-screen bg-cover bg-center bg-fixed flex justify-center items-start p-6">
        <div className="bg-white w-full max-w-6xl rounded-lg p-6 shadow-md">
          <div
            className="bg-white rounded-lg shadow p-6 mb-6 flex items-center justify-between"
            dir="rtl"
          >
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl">
                م
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold">
                  {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
                </h2>
                <p className="text-sm text-gray-600">حلقة المعلم أحمد</p>
              </div>
            </div>

            {/* Progress Circle */}
            <ProgressCircle percentage={progress} />
          </div>

          {/* Daily Verse */}
          <div className="mb-6">
            <DailyVerseCard />
          </div>

          {/* Sessions List */}
          <div className="w-full p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4" dir="rtl">
              سجل الحصص
            </h3>
            <div className="space-y-4">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
