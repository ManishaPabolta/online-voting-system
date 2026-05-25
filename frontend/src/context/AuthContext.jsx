import {
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

import { getCurrentUser } from "../api/authApi";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // 🔥 FETCH CURRENT USER
  const fetchUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await getCurrentUser();

      // ⚠️ backend response safe handling
      setUser(response?.data?.user || null);
    } catch (error) {
      console.log("AUTH ERROR:", error);

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔴 LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// 🔥 CUSTOM HOOK (VERY IMPORTANT)
export const useAuth = () => useContext(AuthContext);