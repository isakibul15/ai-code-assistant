"use client";

import GitHubLogin from "./GitHubLogin";
import GitHubRepos from "./GitHubRepos";

export default function Sidebar() {
  const workflows = ["Refactor", "Explain", "Generate Tests"];

  return (
    <aside className="w-64 h-screen bg-white shadow-md border-r p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Workflows</h2>
        <ul className="space-y-2">
          {workflows.map((flow) => (
            <li key={flow}>
              <button className="w-full text-left px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-md">
                {flow}
              </button>
            </li>
          ))}
        </ul>

        {/* GitHub Auth & Repos */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Account</h3>
          <GitHubLogin />
          <GitHubRepos />
        </div>
      </div>
    </aside>
  );
}
