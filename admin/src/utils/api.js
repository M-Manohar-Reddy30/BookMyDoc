// src/utils/api.js
import axios from "axios";
const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const api = axios.create({ baseURL: BASE, withCredentials: false });

api.interceptors.request.use((config) => {
  const aToken = localStorage.getItem("aToken");
  const dToken = localStorage.getItem("dToken");
  if (aToken) config.headers.Authorization = `Bearer ${aToken}`;
  else if (dToken) config.headers.Authorization = `Bearer ${dToken}`;
  return config;
}, (err) => Promise.reject(err));

export default api;
