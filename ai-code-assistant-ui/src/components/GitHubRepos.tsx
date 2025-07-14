"use client";

import { useEffect, useState } from "react";

type Repo = {
  name: string;
  html_url: string;
  default_branch: string;
  owner: {
    login: string;
  };
};

export default function GitHubRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/github/repos", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRepos(data.repos || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching repos", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">🗂️ Your Repositories</h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : repos.length === 0 ? (
        <p className="text-sm text-gray-500">No repositories found or not logged in.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1 max-h-40 overflow-auto">
          {repos.map((repo, idx) => (
            <li key={idx}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                {repo.owner.login}/{repo.name}{" "}
                <span className="text-gray-400">({repo.default_branch})</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
