"use client";

const workflows = ["Refactor", "Explain", "Test"];

export default function WorkflowSelector({ selected, onChange }: { selected: string; onChange: (val: string) => void }) {
  return (
    <div className="mb-2">
      <label className="text-sm font-medium block mb-1">Select Workflow</label>
      <select value={selected} onChange={(e) => onChange(e.target.value)} className="border px-2 py-1 rounded w-full">
        {workflows.map((wf) => (
          <option key={wf} value={wf.toLowerCase()}>
            {wf}
          </option>
        ))}
      </select>
    </div>
  );
}
