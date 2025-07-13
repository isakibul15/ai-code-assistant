const express = require("express");
const router = express.Router();

router.post("/refactor", async (req, res) => {
  const { code } = req.body;

  console.log("Received code:", code);

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Dummy response
  const fakeResponse = `Refactored version of:\n\n${code}`;
  res.json({ result: fakeResponse });
});

module.exports = router;
