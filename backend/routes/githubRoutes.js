const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/repos", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const ghRes = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    res.json({ repos: ghRes.data });
  } catch (err) {
    console.error("GitHub repo fetch failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch GitHub repos" });
  }
});

module.exports = router;
