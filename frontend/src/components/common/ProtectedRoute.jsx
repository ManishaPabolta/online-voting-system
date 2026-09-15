import {
  Navigate,
  useLocation,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Loader from "./Loader";

const ProtectedRoute = ({
  children,
}) => {
  const {
    loading,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  // ==========================================
  // AUTH CHECK LOADING
  // ==========================================

  if (loading) {
    return <Loader />;
  }

  // ==========================================
  // NOT AUTHENTICATED
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

  return children;
};

export default ProtectedRoute;