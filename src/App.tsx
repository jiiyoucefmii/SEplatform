import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import DashboardPage from "./pages/StudentDashboard";
import SignUpPage from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
     <Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignUpPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/teacher" element={<TeacherDashboard />} />  {/* ✅ add route */}
  <Route path="/" element={<Navigate to="/teacher" replace />} />  {/* ✅ redirect */}
</Routes>

    </BrowserRouter>
  );
}

export default App;
