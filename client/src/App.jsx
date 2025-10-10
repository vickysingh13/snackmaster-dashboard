import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/api/status")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error connecting to backend"));
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 text-2xl font-semibold text-blue-600">
      {message}
    </div>
  );
}

export default App;
