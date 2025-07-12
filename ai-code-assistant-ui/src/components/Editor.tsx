"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";

export default function Editor() {
  const [code, setCode] = useState("// Paste your code here");

  return (
    <div className="flex-1 p-4">
      <CodeMirror
        value={code}
        height="400px"
        extensions={[javascript()]}
        onChange={(value) => setCode(value)}
        theme="light"
      />
    </div>
  );
}
