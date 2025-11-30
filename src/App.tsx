import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import DashboardPage from "./pages/StudentDashboard";
import SignUpPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";

function App() {
  return (
    <BrowserRouter>
     <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/register" element={<RegistrationPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignUpPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/teacher" element={<TeacherDashboard />} />
  <Route path="*" element={<HomePage />} />
</Routes>

    </BrowserRouter>
  );
}

export default App;
