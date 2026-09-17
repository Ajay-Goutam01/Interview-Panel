import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import DashboardPage from "../features/auth/pages/DashboardPage";
import ResumePage from "../features/resume/pages/ResumePage";
import ResumeAnalysisPage from "../features/resume/pages/ResumeAnalysisPage";
import CreateInterviewPage from "../features/interview/pages/CreateInterviewPage";
import InterviewPage from "../features/interview/pages/InterviewPage";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/resume" element={<ResumePage />} />

        <Route path="/resume/:id/analysis" element={<ResumeAnalysisPage />} />

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/interview/create" element={<CreateInterviewPage />} />
        <Route path="/interview/:id" element={<InterviewPage />} />
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>

              <p className="mt-2 text-gray-500">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
