import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    // Force fresh responses — prevents 304 "Not Modified" returning empty bodies
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
  },
});

// On 401 → bounce back to login
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const url = window.location.pathname;
      if (!url.includes("/login") && !url.includes("/signup")) {
        window.location.href = err.response?.data?.reauth
          ? "http://localhost:5000/api/auth"
          : "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default API;