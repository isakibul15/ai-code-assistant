const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { token, code, repo, branch, message } = req.body;
  const [owner, repoName] = repo.split("/");

  try {
    // Step 1: Get latest commit SHA on the branch
    const branchRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/git/ref/heads/${branch}`,
      { headers: { Authorization: `token ${token}` } }
    );
    const latestCommitSha = branchRes.data.object.sha;

    // Step 2: Get tree SHA of latest commit
    const commitRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/git/commits/${latestCommitSha}`,
      { headers: { Authorization: `token ${token}` } }
    );
    const baseTreeSha = commitRes.data.tree.sha;

    // Step 3: Create new blob (code content)
    const blobRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/git/blobs`,
      { content: code, encoding: "utf-8" },
      { headers: { Authorization: `token ${token}` } }
    );

    // Step 4: Create new tree with that blob
    const treeRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees`,
      {
        base_tree: baseTreeSha,
        tree: [
          {
            path: "AIGeneratedFile.java", // or .js/.py
            mode: "100644",
            type: "blob",
            sha: blobRes.data.sha,
          },
        ],
      },
      { headers: { Authorization: `token ${token}` } }
    );

    // Step 5: Create new commit
    const commitData = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/git/commits`,
      {
        message,
        tree: treeRes.data.sha,
        parents: [latestCommitSha],
      },
      { headers: { Authorization: `token ${token}` } }
    );

    // Step 6: Create new branch for PR
    const newBranchName = `ai-update-${Date.now()}`;
    await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/git/refs`,
      {
        ref: `refs/heads/${newBranchName}`,
        sha: commitData.data.sha,
      },
      { headers: { Authorization: `token ${token}` } }
    );

    // Step 7: Create Pull Request
    const prRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repoName}/pulls`,
      {
        title: "🤖 AI Code Update",
        head: newBranchName,
        base: branch,
        body: "Auto-generated PR using AI Assistant",
      },
      { headers: { Authorization: `token ${token}` } }
    );

    return res.json({ prUrl: prRes.data.html_url });
  } catch (error) {
    console.error("PR creation failed", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to create PR" });
  }
});

module.exports = router;
