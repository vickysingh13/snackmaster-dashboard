import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((r) => r.json())
      .then((d) => setMsg(`✅ Backend: ${d.status} @ ${new Date(d.time).toLocaleTimeString()}`))
      .catch(() => setMsg("❌ Cannot reach backend"));
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-4">Frontend ↔ Backend Connection Test</h1>
      <p className="text-lg">{msg}</p>
    </div>
  );
}

export default App;
