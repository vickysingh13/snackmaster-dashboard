// src/App.jsx
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [tests, setTests] = useState([]);
  const [input, setInput] = useState("");

  // Fetch all test documents
  const fetchTests = async () => {
    const res = await fetch(`${API}/api/test`);
    const data = await res.json();
    setTests(data);
  };

  // Create new test document
  const addTest = async () => {
    if (!input) return;
    await fetch(`${API}/api/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    setInput("");
    fetchTests(); // Refresh list
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Documents</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter test text"
        className="border p-2 mr-2"
      />
      <button onClick={addTest} className="bg-blue-600 text-white p-2">Add Test</button>

      <ul className="mt-4">
        {tests.map((t) => (
          <li key={t._id}>
            {t.text} (ID: {t._id})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
