import axios from "axios";

const API = axios.create({
  baseURL:
    "https://online-voting-system-6i81.onrender.com/api",
  withCredentials: true,
});

// 👇 ADD THIS
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;