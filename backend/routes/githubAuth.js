const express = require("express");
const axios = require("axios");
require("dotenv").config();
const router = express.Router();

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

    // Store token temporarily (or use cookie/session)
    res.redirect(`http://localhost:3000?token=${accessToken}`);
  } catch (err) {
    console.error("GitHub OAuth error", err);
    res.status(500).send("OAuth failed");
  }
});

module.exports = router;
