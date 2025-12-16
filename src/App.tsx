import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/Login";
import LoginWithPhonePage from "./pages/Auth/LoginWithPhone";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import VerifyOtpPage from "./pages/Auth/VerifyOtp";
import ResetPasswordPage from "./pages/Auth/ResetPassword";
import TeacherDashboard from "./pages/TeacherDashboard";
import DashboardPage from "./pages/StudentDashboard";
import SignUpPage from "./pages/Auth/Signup";
import SignUpStep2 from "./pages/Auth/SignupStep2";
import SignUpStep3 from "./pages/Auth/SignupStep3";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-phone" element={<LoginWithPhonePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup-step-2" element={<SignUpStep2 />} />
        <Route path="/signup-step-3" element={<SignUpStep3 />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
