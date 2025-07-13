"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";

export default function Editor() {
  const [code, setCode] = useState("// Paste your code here");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const sendToBackend = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/refactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("Error:", err);
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Editor</h2>

      <CodeMirror
        value={code}
        height="300px"
        extensions={[javascript()]}
        onChange={(value) => setCode(value)}
        theme="light"
      />

      <button
        onClick={sendToBackend}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : "Send to AI"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-white border rounded shadow">
          <h3 className="text-md font-semibold mb-2 text-gray-800">Result:</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
