import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import Loader from "./Loader";

const AdminRoute = ({ children }) => {
  const {
    user,
    loading,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  const location = useLocation();

  // ==========================================
  // AUTH LOADING
  // ==========================================

  if (loading) {
    return <Loader />;
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ==========================================
  // NOT ADMIN
  // ==========================================

  if (!isAdmin || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.4,
          }}
          className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/[0.04] backdrop-blur-xl p-8 text-center shadow-2xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <ShieldAlert
              size={32}
              className="text-red-400"
            />
          </div>

          <h1 className="text-2xl font-bold">
            Access Denied
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            You do not have permission to access
            the administrator area.
          </p>

          <button
            type="button"
            onClick={() =>
              window.history.back()
            }
            className="mt-6 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;