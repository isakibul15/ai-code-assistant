"use client";

import { useState } from "react";

type Props = {
  code: string;
};

export default function RepoCommitForm({ code }: Props) {
  const [repo, setRepo] = useState("");
  const [path, setPath] = useState("ai-output.txt");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submitPR = async () => {
    setErrorMsg("");

    if (!repo.trim() || !path.trim()) {
      setErrorMsg("⚠️ Repository and file path are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/github/commit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo, path, content: code }),
      });

      const data = await res.json();
      if (data.prUrl) {
        alert("✅ Pull Request Created!\n" + data.prUrl);
        window.open(data.prUrl, "_blank");
      } else {
        setErrorMsg("❌ Failed to create PR: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("PR error", err);
      setErrorMsg("Something went wrong while creating the PR.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
      <h4 className="text-md font-semibold mb-3">📤 Commit to GitHub</h4>

      {errorMsg && (
        <div className="mb-2 text-sm text-red-600 font-medium">{errorMsg}</div>
      )}

      <input
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        placeholder="username/repo"
        className="w-full mb-2 border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <input
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="path/to/file.txt"
        className="w-full mb-3 border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      <button
        onClick={submitPR}
        disabled={loading}
        className={`w-full bg-purple-600 text-white px-4 py-2 rounded-md transition hover:bg-purple-700 ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Creating PR..." : "Create Pull Request"}
      </button>
    </div>
  );
}
