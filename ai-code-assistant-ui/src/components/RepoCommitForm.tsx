"use client";

import { useState } from "react";

type Props = {
  code: string;
};

export default function RepoCommitForm({ code }: Props) {
  const [repo, setRepo] = useState("");
  const [path, setPath] = useState("ai-output.txt"); // File to commit
  const [loading, setLoading] = useState(false);

  const submitPR = async () => {
    if (!repo || !path) {
      alert("Please enter repository and file path.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/github/commit", {
        method: "POST",
        credentials: "include", // Important: include cookies!
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo,
          path,
          content: code,
        }),
      });

      const data = await res.json();
      if (data.prUrl) {
        alert("✅ Pull Request Created!\n" + data.prUrl);
        window.open(data.prUrl, "_blank");
      } else {
        alert("❌ Failed to create PR: " + data.error);
      }
    } catch (err) {
      console.error("PR error", err);
      alert("Something went wrong while creating PR.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold mb-2">📤 Commit to GitHub</h4>
      <input
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        placeholder="username/repo"
        className="w-full mb-2 border px-2 py-1 rounded text-sm"
      />
      <input
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="path/to/file.txt"
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
