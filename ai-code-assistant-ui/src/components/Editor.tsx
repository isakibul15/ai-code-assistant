"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { useState, useEffect } from "react";
import LanguageSelector from "./LanguageSelector";
import WorkflowSelector from "./WorkflowSelector";
import { Extension } from "@codemirror/state";
import socket from "../lib/socket";


const LOCAL_HISTORY_KEY = "ai-code-history";

const languageMap: Record<string, () => Extension> = {
  javascript,
  python,
  java,
  cpp,
  go,
  typescript: javascript, // fallback
};

export default function Editor({
  code,
  setCode,
}: {
  code: string;
  setCode: (val: string) => void;
}) {
  const [language, setLanguage] = useState("java");
  const [workflow, setWorkflow] = useState("refactor");
  const [extensions, setExtensions] = useState<Extension[]>([java()]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const selected = languageMap[language];
    if (selected) setExtensions([selected()]);
  }, [language]);

  useEffect(() => {
    socket.connect();
    socket.on("code:update", (newCode: string) => {
      setCode(newCode);
    });
    return () => {
      socket.disconnect();
    };
  }, [setCode]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    socket.emit("code:update", value);
  };

  const [isLoading, setIsLoading] = useState(false);

  const sendToBackend = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8080/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, type: workflow }),
      });

      const data = await res.json();
      alert("Result:\n" + (data.result || "No response from AI"));
    } catch (error) {
      console.error("Error sending to AI:", error);
      alert("Error sending to AI");
    } finally {
      setIsLoading(false);
    }
  };



  const saveSnapshot = () => {
    const updatedHistory = [code, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(updatedHistory));
    alert("✅ Version saved to local history.");
  };

  const restoreVersion = (index: number) => {
    setCode(history[index]);
    alert("⏪ Restored version " + (index + 1));
  };

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_HISTORY_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  return (
    <div className="flex-1 p-4">
      <LanguageSelector selected={language} onChange={setLanguage} />
      <CodeMirror
        value={code}
        height="400px"
        extensions={extensions}
        onChange={handleCodeChange}
        theme="light"
      />
      <WorkflowSelector selected={workflow} onChange={setWorkflow} />

      <div className="mt-4 flex space-x-2">
        <button
          onClick={sendToBackend}
          disabled={isLoading}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Processing..." : "Send to AI"}
        </button>
        <button
          onClick={saveSnapshot}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Version
        </button>
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">📜 Version History</h3>
          <ul className="list-disc list-inside space-y-1">
            {history.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => restoreVersion(idx)}
                  className="text-sm text-blue-700 hover:underline"
                >
                  Restore Version {idx + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
