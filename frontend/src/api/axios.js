import axios from "axios";

const API = axios.create({
 baseURL: "https://online-voting-system-6i81.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
   withCredentials: true,
});

 


API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default API;