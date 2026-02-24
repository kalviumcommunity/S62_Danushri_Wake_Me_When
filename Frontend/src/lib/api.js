

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

// On 401 with reauth flag → bounce back to Google login
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && err.response?.data?.reauth) {
      window.location.href = "http://localhost:5000/api/auth";
    }
    return Promise.reject(err);
  }
);

export default API;
