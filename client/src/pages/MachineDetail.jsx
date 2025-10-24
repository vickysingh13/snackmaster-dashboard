import React, { useEffect, useState } from "react";
import { fetchMachine } from "../services/api";
import { getToken } from "../services/auth";
import RefillForm from "./RefillForm";
import { useParams } from "react-router-dom";

export default function MachineDetail() {
  const { id } = useParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRefill, setShowRefill] = useState(false);

  useEffect(() => {
    const token = getToken();
    fetchMachine(id, token).then((data) => {
      setMachine(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (!machine) return <div>Machine not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-2">{machine.machineCode} — {machine.location}</h1>
      <button onClick={() => setShowRefill((s) => !s)} className="mb-4 px-3 py-1 bg-blue-600 text-white rounded">
        {showRefill ? "Hide Refill" : "Refill"}
      </button>

      {showRefill && <RefillForm machineId={machine._id} onDone={() => {
        // reload machine after refill
        const token = getToken();
        fetchMachine(id, token).then(setMachine);
        setShowRefill(false);
      }} />}

      <table className="w-full table-auto mt-4 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Slot</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-right">Quantity</th>
            <th className="p-2 text-right">Capacity</th>
          </tr>
        </thead>
        <tbody>
          {(machine.stock || []).map((s, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{s.slot ?? idx + 1}</td>
              <td className="p-2">{s.productName || s.product || "—"}</td>
              <td className="p-2 text-right">{s.quantity}</td>
              <td className="p-2 text-right">{s.capacity ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}