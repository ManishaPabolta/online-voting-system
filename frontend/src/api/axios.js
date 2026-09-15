import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://learning-rbko.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Token invalid/expired
    if (status === 401) {
      const currentPath = window.location.pathname;

      const publicPaths = [
        "/login",
        "/register",
        "/verify-otp",
      ];

      if (!publicPaths.includes(currentPath)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(
          new CustomEvent("auth-expired")
        );
      }
    }

    return Promise.reject(error);
  }
);

export default API;