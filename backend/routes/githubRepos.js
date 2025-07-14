// backend/routes/githubRepos.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/repos", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No GitHub token provided" });

  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    const repos = response.data.map(repo => ({
      name: repo.name,
      owner: repo.owner.login,
      default_branch: repo.default_branch,
      private: repo.private,
      html_url: repo.html_url,
    }));

    res.json({ repos });

  } catch (error) {
    console.error("Failed to fetch repos", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
});

module.exports = router;
