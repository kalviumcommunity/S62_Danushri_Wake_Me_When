import axios from "axios";

// Set VITE_API_URL (e.g. in Netlify env vars) to point at your backend domain.
export const BACKEND = import.meta.env.VITE_API_URL
  || (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://s62-danushri-wake-me-when-2-hvmd.onrender.com");

const API = axios.create({
  baseURL: BACKEND,
  withCredentials: true,
  headers: {
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
          ? `${BACKEND}/api/auth`
          : "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default API;