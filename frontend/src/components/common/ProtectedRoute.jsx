import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  // ==========================================
  // AUTHENTICATION INITIALIZATION
  // ==========================================

  if (loading) {
    return <Loader />;
  }

  // ==========================================
  // TOKEN EXISTS BUT USER IS NOT AVAILABLE
  // ==========================================

  const token = localStorage.getItem("token");

  /*
    If there is no token and no authenticated user,
    the user is definitely not logged in.
  */

  if (!token && !isAuthenticated) {
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
  // USER NOT AUTHENTICATED
  // ==========================================

  if (!isAuthenticated || !user) {
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
  // AUTHENTICATED USER
  // ==========================================

  return children;
};

export default ProtectedRoute;