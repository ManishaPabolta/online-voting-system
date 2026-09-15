import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOTP from "../pages/VerifyOTP";
import Elections from "../pages/Elections";
import ElectionDetails from "../pages/ElectionDetails";
import FAQ from "../pages/FAQ";
import NotFound from "../pages/NotFound";

// ==========================================
// PROTECTED USER PAGES
// ==========================================

import VotePage from "../pages/VotePage";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import Notifications from "../pages/Notifications";
import Support from "../pages/Support";
import Feedback from "../pages/Feedback";

// ==========================================
// ADMIN PAGES
// ==========================================

import Admin from "../pages/Admin";
import Reports from "../pages/Reports";

// ==========================================
// ROUTE GUARDS
// ==========================================

import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminRoute from "../components/common/AdminRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================================
            PUBLIC ROUTES
        ================================================== */}

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        {/* Elections */}
        <Route
          path="/elections"
          element={<Elections />}
        />

        {/* Election Details */}
        <Route
          path="/elections/:id"
          element={<ElectionDetails />}
        />

        {/* FAQ */}
        <Route
          path="/faq"
          element={<FAQ />}
        />

        {/* ==================================================
            PROTECTED USER ROUTES
        ================================================== */}

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Vote - Generic */}
        <Route
          path="/vote"
          element={
            <ProtectedRoute>
              <VotePage />
            </ProtectedRoute>
          }
        />

        {/* Vote - Specific Election */}
        <Route
          path="/vote/:electionId"
          element={
            <ProtectedRoute>
              <VotePage />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Support */}
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />

        {/* Feedback */}
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN ROUTES
        ================================================== */}

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* Admin Reports */}
        <Route
          path="/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />

        {/* ==================================================
            404 - PAGE NOT FOUND
        ================================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;