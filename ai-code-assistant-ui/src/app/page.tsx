"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";

export default function Home() {
  const [code, setCode] = useState("// Paste your code here");

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem("github_token", token);
      alert("✅ Logged in with GitHub");
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar code={code} />
      <Editor code={code} setCode={setCode} />
    </div>
  );
}
