const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

const handleResponse = async (res) => {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const err = new Error((data && data.message) || res.statusText || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const fetchMachines = (token) =>
  fetch(`${API}/api/machines`, {
    headers: { ...authHeader(token) },
  }).then(handleResponse);

export const fetchMachine = (id, token) =>
  fetch(`${API}/api/machines/${id}`, {
    headers: { ...authHeader(token) },
  }).then(handleResponse);

export const fetchProducts = (token) =>
  fetch(`${API}/api/products`, {
    headers: { ...authHeader(token) },
  }).then(handleResponse);

export const postRefill = (payload, token) =>
  fetch(`${API}/api/refills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const createProduct = (payload, token) =>
  fetch(`${API}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const login = (credentials) =>
  fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).then(handleResponse);

export default {
  fetchMachines,
  fetchMachine,
  fetchProducts,
  postRefill,
  createProduct,
  login,
};