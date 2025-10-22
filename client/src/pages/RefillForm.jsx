import React, { useState } from "react";
import { createRefill } from "../services/api";

export default function RefillForm({ machineId }) {
  const [items, setItems] = useState([{ product: "", quantityAdded: 0 }]);
  const submit = async () => {
    await createRefill({ machine: machineId, refilledBy: "tech1", items });
    alert("Refill submitted");
  };
  return (
    <div>
      <h2>Refill</h2>
      {/* simple form UI TODO */}
      <button onClick={submit}>Submit</button>
    </div>
  );
}