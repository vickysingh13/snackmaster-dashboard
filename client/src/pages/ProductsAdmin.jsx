import React, { useEffect, useState } from "react";
import { fetchProducts, createProduct } from "../services/api";
import { getToken } from "../services/auth";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: 0, quantity: 0, category: "", machineId: "" });

  useEffect(() => {
    const token = getToken();
    fetchProducts(token).then((data) => setProducts(Array.isArray(data) ? data : []));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const token = getToken();
    await createProduct(form, token);
    // reload products
    const data = await fetchProducts(token);
    setProducts(Array.isArray(data) ? data : []);
    setForm({ name: "", price: 0, quantity: 0, category: "", machineId: "" });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Products (Admin)</h1>
      <form onSubmit={submit} className="mb-4">
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <button type="submit">Add</button>
      </form>

      <ul>
        {products.map(p => <li key={p._id}>{p.name} — {p.quantity}</li>)}
      </ul>
    </div>
  );
}