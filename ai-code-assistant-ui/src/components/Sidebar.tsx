export default function Sidebar() {
  const workflows = ["Refactor", "Explain", "Generate Tests"];

  return (
    <aside className="w-64 h-screen bg-white shadow-md border-r p-4">
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
    </aside>
  );
}
