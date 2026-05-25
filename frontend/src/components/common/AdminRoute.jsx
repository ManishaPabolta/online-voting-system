import {
  Navigate,
} from "react-router-dom";

const AdminRoute = ({
  children,
}) => {

  const token =
    localStorage.getItem(
      "token"
    );

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  // NOT LOGGED IN
  if (!token) {
    return (
      <Navigate to="/login" />
    );
  }

  // NOT ADMIN
  if (
    user?.role !== "admin"
  ) {
    return (
      <Navigate to="/dashboard" />
    );
  }

  return children;
};

export default AdminRoute;