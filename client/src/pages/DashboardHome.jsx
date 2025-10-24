import React, { useEffect, useState } from "react";
import { fetchMachines } from "../services/api";
import { getToken } from "../services/auth";

export default function DashboardHome() {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const token = getToken();
    fetchMachines(token).then((data) => setMachines(Array.isArray(data) ? data : []));
  }, []);

  const totalMachines = machines.length;
  const lowStockCount = machines.reduce((acc, m) => {
    (m.stock || []).forEach(s => { if (s.quantity <= (s.capacity || 3)) acc++; });
    return acc;
  }, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">Total machines: <strong>{totalMachines}</strong></div>
        <div className="p-4 border rounded">Low stock items: <strong>{lowStockCount}</strong></div>
      </div>
    </div>
  );
}