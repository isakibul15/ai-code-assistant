"use client";

import { useState } from "react";

type Props = {
  code: string;
};

export default function RepoCommitForm({ code }: Props) {
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [message, setMessage] = useState("AI updated code");
  const [loading, setLoading] = useState(false);

  const submitPR = async () => {
    const token = localStorage.getItem("github_token");
    if (!token) return alert("🔒 Please login with GitHub first.");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/github/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, token, repo, branch, message }),
      });

      const data = await res.json();
      if (data.prUrl) {
        alert("✅ PR Created!\n" + data.prUrl);
        window.open(data.prUrl, "_blank");
      } else {
        alert("❌ Failed to create PR");
      }
    } catch (err) {
      console.error("PR error", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold mb-1">📤 Commit to GitHub</h4>
      <input
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        placeholder="username/repo"
        className="w-full mb-2 border px-2 py-1 rounded text-sm"
      />
      <input
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        placeholder="branch (default: main)"
        className="w-full mb-2 border px-2 py-1 rounded text-sm"
      />
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Commit message"
        className="w-full mb-2 border px-2 py-1 rounded text-sm"
      />
      <button
        onClick={submitPR}
        className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        disabled={loading}
      >
        {loading ? "Creating PR..." : "Create Pull Request"}
      </button>
    </div>
  );
}
