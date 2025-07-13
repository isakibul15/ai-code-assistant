"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";
import LanguageSelector from "./LanguageSelector";

export default function Editor() {
  const [code, setCode] = useState("// Paste your code here");
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("java");

  const sendToBackend = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/refactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setResult(data.result || "Something went wrong.");
    } catch (err) {
      setResult("❌ Failed to connect to backend.");
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-4">
      <LanguageSelector selected={language} onChange={setLanguage} />
      <CodeMirror
        value={code}
        height="400px"
        extensions={[javascript()]} // (Optional: Change dynamically based on language)
        onChange={(value) => setCode(value)}
        theme="light"
      />
      <button
        onClick={sendToBackend}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send to AI
      </button>
      <div className="mt-4">
        <h3 className="font-semibold">Result:</h3>
        <pre className="bg-gray-100 p-2 rounded">{result}</pre>
      </div>
    </div>
  );
}
