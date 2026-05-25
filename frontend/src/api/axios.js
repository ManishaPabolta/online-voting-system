import axios from "axios";

const API = axios.create({
  baseURL:
    "https://online-voting-system-6i81.onrender.com/api",

  withCredentials: true,
});

export default API;