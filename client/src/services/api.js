import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
  headers: { "Content-Type": "application/json" }
});

export const getMachines = () => api.get("/machines");
export const getMachine = (id) => api.get(`/machines/${id}`);
export const createRefill = (payload) => api.post("/refills", payload);

export default api;