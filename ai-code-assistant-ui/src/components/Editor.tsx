"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default function Editor() {
  const [code, setCode] = useState("// Paste your code here");
  const [language, setLanguage] = useState("Java");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendToBackend = async () => {
    setLoading(true);
    setResult("");
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/refactor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
        console.error("❌ Backend error:", error);
        setError("Failed to connect to backend.");  
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option>Java</option>
          <option>Python</option>
          <option>JavaScript</option>
          <option>C++</option>
        </select>
      </div>

      <CodeMirror
        value={code}
        height="300px"
        extensions={[javascript()]} // Optional: You can swap by lang later
        onChange={(value) => setCode(value)}
        theme="light"
      />

      <button
        onClick={sendToBackend}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Sending to AI..." : "Send to AI"}
      </button>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Result:</h2>
        {loading && <p className="text-gray-500">Processing...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <pre className="whitespace-pre-wrap">{result}</pre>}
      </div>
    </div>
  );
}
