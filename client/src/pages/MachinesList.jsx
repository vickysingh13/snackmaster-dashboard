import React, { useEffect, useState } from "react";
import { fetchMachines } from "../services/api";
import { getToken } from "../services/auth";
import { Link } from "react-router-dom";

export default function MachinesList() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    fetchMachines(token).then((data) => {
      setMachines(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading machines…</div>;
  if (!machines.length) return <div>No machines found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Vending Machines</h1>
      <ul className="space-y-2">
        {machines.map((m) => (
          <li key={m._id} className="border p-3 rounded">
            <Link to={`/machines/${m._id}`} className="font-semibold">{m.machineCode}</Link>
            <div className="text-sm text-gray-600">{m.location}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}