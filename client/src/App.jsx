import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import MachinesList from "./pages/MachinesList";
import MachineDetail from "./pages/MachineDetail";
import ProductsAdmin from "./pages/ProductsAdmin";
import DashboardHome from "./pages/DashboardHome";
import { login } from "./services/api";
import { setToken, clearToken, getToken } from "./services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (res && res.token) {
      setToken(res.token);
      navigate("/");
    } else {
      alert(res?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={submit} className="p-4">
      <h2>Login</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default function App() {
  const token = getToken();

  return (
    <BrowserRouter>
      <div className="p-3 border-b flex justify-between">
        <div>
          <Link to="/" className="mr-4">Dashboard</Link>
          <Link to="/machines" className="mr-4">Machines</Link>
          <Link to="/products" className="mr-4">Products</Link>
        </div>
        <div>
          {token ? <button onClick={() => { clearToken(); window.location.reload(); }}>Logout</button> : <Link to="/login">Login</Link>}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/machines" element={<MachinesList />} />
        <Route path="/machines/:id" element={<MachineDetail />} />
        <Route path="/products" element={<ProductsAdmin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
