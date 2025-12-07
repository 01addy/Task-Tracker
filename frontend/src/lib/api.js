// src/lib/api.js
import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./auth";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://task-tracker-3eze.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!err.response) return Promise.reject(err);

    
    if (err.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(err);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return api(originalRequest);
        })
        .catch((e) => Promise.reject(e));
    }

    isRefreshing = true;

    try {
      
      const resp = await axios.post(
        `${API_BASE}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = resp.data.accessToken;

      
      setAccessToken(newAccessToken);
      api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAccessToken();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
