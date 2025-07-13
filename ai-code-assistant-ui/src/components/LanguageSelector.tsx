"use client";

const languages = [
  { label: "Java", value: "java" },
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Go", value: "go" },
  { label: "C#", value: "csharp" },
  { label: "TypeScript", value: "typescript" },
];

export default function LanguageSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (lang: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Language
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
