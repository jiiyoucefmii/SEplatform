import type { ReactNode } from "react";
import Navbar from "../components/NavBar";

interface MainLayoutProps {
  children: ReactNode;
  user?: {
    user_id: string;
    first_name: string;
    last_name: string;
    role: "PARENT" | "TEACHER" | "STUDENT";
    phone_num: string;
  };
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar user={user} />}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
