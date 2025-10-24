import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchMachines = (token) =>
  fetch(`${API}/api/machines`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  }).then((r) => r.json());

export const fetchMachine = (id, token) =>
  fetch(`${API}/api/machines/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  }).then((r) => r.json());

export const fetchProducts = (token) =>
  fetch(`${API}/api/products`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  }).then((r) => r.json());

export const postRefill = (payload, token) =>
  fetch(`${API}/api/refills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  }).then((r) => r.json());

export const createProduct = (payload, token) =>
  fetch(`${API}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  }).then((r) => r.json());

export const login = (credentials) =>
  fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  }).then((r) => r.json());

export default {
  fetchMachines,
  fetchMachine,
  fetchProducts,
  postRefill,
  createProduct,
  login
};