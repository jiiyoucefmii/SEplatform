import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/Login";
import LoginWithPhonePage from "./pages/Auth/LoginWithPhone";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import VerifyOtpPage from "./pages/Auth/VerifyOtp";
import ResetPasswordPage from "./pages/Auth/ResetPassword";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SignUpPage from "./pages/Auth/Signup";
import SignUpStep2 from "./pages/Auth/SignupStep2";
import SignUpStep3 from "./pages/Auth/SignupStep3";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* Auth Routes (public only - redirect if logged in) */}
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        } />
        <Route path="/login-phone" element={
          <PublicOnlyRoute>
            <LoginWithPhonePage />
          </PublicOnlyRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicOnlyRoute>
            <ForgotPasswordPage />
          </PublicOnlyRoute>
        } />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={
          <PublicOnlyRoute>
            <SignUpPage />
          </PublicOnlyRoute>
        } />
        <Route path="/signup-step-2" element={<SignUpStep2 />} />
        <Route path="/signup-step-3" element={<SignUpStep3 />} />

        {/* Protected Dashboards */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student-dashboard" element={
          <ProtectedRoute requiredRole={["PARENT", "STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher-dashboard" element={
          <ProtectedRoute requiredRole="TEACHER">
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        {/* Legacy routes (redirect to new paths) */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole={["PARENT", "STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher" element={
          <ProtectedRoute requiredRole="TEACHER">
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
