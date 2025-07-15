const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Step 1: Redirect to GitHub login
router.get("/login", (req, res) => {
  const redirect = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`;
  res.redirect(redirect);
});

// Step 2: GitHub sends code to our callback
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.status(401).send("Failed to get token");

    // ✅ Store token securely in HttpOnly cookie
    res.cookie("github_token", accessToken, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.redirect("http://localhost:3000"); // No token in URL
  } catch (err) {
    console.error("GitHub OAuth error", err);
    res.status(500).send("OAuth failed");
  }
});

// GET /auth/github/me - Check if logged in
router.get("/me", (req, res) => {
  const token = req.cookies.github_token;
  if (!token) return res.status(401).json({ error: "Not logged in" });

  res.json({ token });
});

// POST /api/github/commit
router.post("/commit", async (req, res) => {
  const token = req.cookies.github_token;
  const { repo, path, content } = req.body;

  if (!repo || !path || !content || !token) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const [owner, repoName] = repo.split("/");

    // Get default branch
    const branchRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    const baseBranch = branchRes.data.default_branch;

    // Get latest commit SHA
    const refRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/git/ref/heads/${baseBranch}`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    const latestSha = refRes.data.object.sha;

    // Create new branch
    const newBranch = `ai-commit-${Date.now()}`;
    await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/git/refs`,
      {
        ref: `refs/heads/${newBranch}`,
        sha: latestSha,
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    // Create blob
    const blobRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/git/blobs`,
      {
        content: content,
        encoding: "utf-8",
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    // Create tree
    const treeRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees`,
      {
        base_tree: latestSha,
        tree: [
          {
            path,
            mode: "100644",
            type: "blob",
            sha: blobRes.data.sha,
          },
        ],
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    // Create commit
    const commitRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/git/commits`,
      {
        message: "Add AI-generated code",
        tree: treeRes.data.sha,
        parents: [latestSha],
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    // Update branch
    await axios.patch(
      `https://api.github.com/repos/${owner}/${repoName}/git/refs/heads/${newBranch}`,
      {
        sha: commitRes.data.sha,
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    // Create Pull Request
    const prRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/pulls`,
      {
        title: "🤖 AI-generated code update",
        head: newBranch,
        base: baseBranch,
        body: "This PR was automatically created by your AI assistant.",
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    return res.json({
      message: "✅ Pull Request Created!",
      prUrl: prRes.data.html_url,
    });
  } catch (err) {
    console.error("GitHub Commit Error:", err.message);
    return res.status(500).json({ error: "Failed to commit or create PR" });
  }
});

module.exports = router;
