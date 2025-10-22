import React, { useEffect, useState } from "react";
import { getMachines } from "../services/api";

export default function Machines() {
  const [machines, setMachines] = useState([]);
  useEffect(() => {
    getMachines().then(r => setMachines(r.data)).catch(console.error);
  }, []);
  return (
    <div>
      <h1>Vending machines</h1>
      <ul>
        {machines.map(m => <li key={m._id}>{m.machineCode} — {m.location}</li>)}
      </ul>
    </div>
  );
}