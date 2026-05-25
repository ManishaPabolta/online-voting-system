import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOTP from "../pages/VerifyOTP";
import Elections from "../pages/Elections";
import ElectionDetails from "../pages/ElectionDetails";
import VotePage from "../pages/VotePage";
import Profile from "../pages/Profile";
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin";
import Notifications from "../pages/Notifications";
import Support from "../pages/Support";
import Feedback from "../pages/Feedback";
import FAQ from "../pages/FAQ";
import Reports from "../pages/Reports";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminRoute from "../components/common/AdminRoute";

const AppRoutes = () => {
  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* AUTH */}

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

        {/* ELECTIONS */}

        <Route
          path="/elections"
          element={<Elections />}
        />

        <Route
          path="/elections/:id"
          element={
            <ProtectedRoute>

              <ElectionDetails />

            </ProtectedRoute>
          }
        />

        {/* VOTING */}

        <Route
          path="/vote"
          element={
            <ProtectedRoute>

              <VotePage />

            </ProtectedRoute>
          }
        />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>

              <Profile />

            </ProtectedRoute>
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>
          }
        />

        {/* NOTIFICATIONS */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>

              <Notifications />

            </ProtectedRoute>
          }
        />

        {/* SUPPORT */}

        <Route
          path="/support"
          element={
            <ProtectedRoute>

              <Support />

            </ProtectedRoute>
          }
        />

        {/* FEEDBACK */}

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>

              <Feedback />

            </ProtectedRoute>
          }
        />

        {/* FAQ */}

        <Route
          path="/faq"
          element={<FAQ />}
        />

        {/* REPORTS */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute>

              <Reports />

            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <AdminRoute>

              <Admin />

            </AdminRoute>
          }
        />

        {/* 404 PAGE */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;