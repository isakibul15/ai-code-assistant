// components/RepoCommitForm.tsx
"use client";

import { useEffect, useState } from "react";

type Repo = {
  name: string;
  full_name: string;
  default_branch: string;
  owner: { login: string };
};

export default function RepoCommitForm({ code }: { code: string }) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [filePath, setFilePath] = useState("ai-code-output.txt");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) return;

    fetch("http://localhost:8080/api/github/repos", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        setRepos(data.repos || []);
      });
  }, []);

  const handleCommit = async () => {
    const token = localStorage.getItem("github_token");
    if (!token || !selectedRepo) return alert("Missing token or repo");

    setLoading(true);
    const res = await fetch("http://localhost:8080/api/github/commit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        repo: selectedRepo,
        path: filePath,
        content: code,
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (result.url) {
      alert("✅ Committed! " + result.url);
    } else {
      alert("❌ Commit failed.");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-2">📤 Commit AI Output to GitHub</h3>

      <select
        value={selectedRepo}
        onChange={(e) => setSelectedRepo(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-2"
      >
        <option value="">Select a repository</option>
        {repos.map((repo) => (
          <option key={repo.full_name} value={repo.full_name}>
            {repo.full_name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
        placeholder="Path to save file (e.g. src/AIHelper.js)"
        className="border px-3 py-2 rounded w-full mb-2"
      />

      <button
        onClick={handleCommit}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        disabled={loading}
      >
        {loading ? "Committing..." : "Commit to GitHub"}
      </button>
    </div>
  );
}
