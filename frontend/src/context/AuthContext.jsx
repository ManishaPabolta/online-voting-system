import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
} from "../api/authApi";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH CURRENT USER
  // ==========================================

  const fetchUser = useCallback(async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return null;
      }

      const response = await getCurrentUser();

      /*
        Backend response can normally be:

        {
          success: true,
          data: {
            user: {...}
          }
        }

        This also safely handles a direct user response.
      */

      const currentUser =
        response?.data?.user ||
        response?.user ||
        null;

      if (!currentUser) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);

        return null;
      }

      setUser(currentUser);

      // Keep a safe frontend copy.
      localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
      );

      return currentUser;
    } catch (error) {
      console.error(
        "AUTH FETCH ERROR:",
        error
      );

      const status =
        error?.response?.status;

      /*
        Only clear authentication when the
        backend explicitly says the token is
        unauthorized.

        Network/server errors should not
        unnecessarily log the user out.
      */

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }

    return null;
  }, []);

  // ==========================================
  // INITIAL AUTH CHECK
  // ==========================================

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ==========================================
  // LOGIN SUCCESS
  // ==========================================

  const handleLogin = useCallback(
    async (loginResponse) => {
      /*
        Supports common backend response formats:

        response.data.token
        response.token
        response.data.user
        response.user
      */

      const token =
        loginResponse?.data?.token ||
        loginResponse?.token ||
        null;

      const loggedInUser =
        loginResponse?.data?.user ||
        loginResponse?.user ||
        null;

      if (token) {
        localStorage.setItem(
          "token",
          token
        );
      }

      if (loggedInUser) {
        localStorage.setItem(
          "user",
          JSON.stringify(loggedInUser)
        );

        setUser(loggedInUser);
      }

      /*
        If login response does not contain
        user information, fetch it from /me.
      */

      if (token && !loggedInUser) {
        return fetchUser();
      }

      return loggedInUser;
    },
    [fetchUser]
  );

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    /*
      Current backend does not expose
      POST /api/auth/logout, so logout is
      handled locally.
    */

    window.location.replace("/login");
  }, []);

  // ==========================================
  // UPDATE USER
  // ==========================================

  const updateUser = useCallback(
    (updatedUser) => {
      if (!updatedUser) {
        return;
      }

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
    },
    []
  );

  // ==========================================
  // AUTH EXPIRED EVENT
  // ==========================================

  useEffect(() => {
    const handleAuthExpired = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.replace(
          "/login"
        );
      }
    };

    window.addEventListener(
      "auth-expired",
      handleAuthExpired
    );

    return () => {
      window.removeEventListener(
        "auth-expired",
        handleAuthExpired
      );
    };
  }, []);

  // ==========================================
  // DERIVED VALUES
  // ==========================================

  const isAuthenticated =
    Boolean(user);

  const isAdmin =
    user?.role === "admin";

  const isUser =
    user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,

        loading,
        isAuthenticated,
        isAdmin,
        isUser,

        fetchUser,
        handleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// ==========================================
// CUSTOM AUTH HOOK
// ==========================================

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
};