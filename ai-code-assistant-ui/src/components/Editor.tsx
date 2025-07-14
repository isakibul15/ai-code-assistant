"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { useState, useEffect } from "react";
import LanguageSelector from "./LanguageSelector";
import { Extension } from "@codemirror/state";
import socket from "../lib/socket";

const languageMap: Record<string, () => Extension> = {
  javascript,
  python,
  java,
  cpp,
  go,
  typescript: javascript, // fallback
};

export default function Editor() {
  const [code, setCode] = useState("// Paste your code here");
  const [language, setLanguage] = useState("java");
  const [extensions, setExtensions] = useState<Extension[]>([java()]);

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
  }, []);

  const handleCodeChange = (value: string) => {
    setCode(value);
    socket.emit("code:update", value);
  };

  const sendToBackend = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/refactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      alert("Result:\n" + (data.result || "No response from AI"));
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Error sending to AI: " + error.message);
      } else {
        alert("Unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex-1 p-4">
      <LanguageSelector selected={language} onChange={setLanguage} />
      <CodeMirror
        value={code}
        height="400px"
        extensions={extensions}
        onChange={(value) => handleCodeChange(value)}
        theme="light"
      />
      <button
        onClick={sendToBackend}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send to AI
      </button>
    </div>
  );
}
