"use client";

import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem("github_token", token);
      alert("✅ Logged in with GitHub");
      // Optionally remove the token from URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  return <div>
    <div className="flex h-screen">
      <Sidebar />
      <Editor />
    </div>
  </div>;
}
