"use client";

import GitHubLogin from "./GitHubLogin";
import GitHubRepos from "./GitHubRepos";
import RepoCommitForm from "./RepoCommitForm";

export default function Sidebar({ code }: { code: string }) {
  const workflows = ["Refactor", "Explain", "Generate Tests"];

  return (
    <aside className="w-72 h-screen bg-white shadow-xl border-r p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Workflows</h2>
        <ul className="space-y-3">
          {workflows.map((flow) => (
            <li key={flow}>
              <button className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-gray-800 font-medium shadow-sm transition">
                {flow}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">GitHub</h3>
          <GitHubLogin />
          <GitHubRepos />
          <RepoCommitForm code={code} />
        </div>
      </div>
    </aside>
  );
}
