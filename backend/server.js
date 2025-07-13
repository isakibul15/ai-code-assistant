const express = require("express");
const cors = require("cors");

const app = express();

// ✅ 1. CORS middleware must come first
app.use(cors());

// ✅ 2. Then JSON body parser
app.use(express.json());

// ✅ 3. Define your endpoint
app.post("/api/refactor", (req, res) => {
  const { code } = req.body;
  console.log("Received:", code);
  if (!code) return res.status(400).json({ error: "No code" });
  res.json({ result: `Refactored version:\n\n${code}` });
});

// ✅ 4. Start server
app.listen(8080, () => console.log("Server running on http://localhost:8080"));
