import React, { useEffect, useState } from "react";
import { fetchProducts, postRefill } from "../services/api";
import { getToken } from "../services/auth";

export default function RefillForm({ machineId, onDone }) {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ product: "", quantityAdded: 1 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    fetchProducts(token).then((data) => setProducts(Array.isArray(data) ? data : []));
  }, []);

  const addRow = () => setItems((s) => [...s, { product: "", quantityAdded: 1 }]);
  const updateItem = (i, key, val) => {
    setItems((s) => s.map((it, idx) => idx === i ? { ...it, [key]: val } : it));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = getToken();
    const payload = { machine: machineId, items: items.filter(it => it.product && +it.quantityAdded > 0) };
    try {
      await postRefill(payload, token);
      setLoading(false);
      if (onDone) onDone();
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Refill failed");
    }
  };

  return (
    <form onSubmit={submit} className="border p-3 mb-4">
      <h3 className="font-semibold mb-2">Refill</h3>
      {items.map((it, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <select className="flex-1" value={it.product} onChange={(e) => updateItem(idx, "product", e.target.value)}>
            <option value="">Select product</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input type="number" className="w-24" min="1" value={it.quantityAdded} onChange={(e) => updateItem(idx, "quantityAdded", e.target.value)} />
        </div>
      ))}
      <div className="flex gap-2">
        <button type="button" onClick={addRow} className="px-3 py-1 bg-gray-200 rounded">+ Item</button>
        <button type="submit" disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded">{loading ? "Submitting..." : "Submit"}</button>
      </div>
    </form>
  );
}