const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/refactor", async (req, res) => {
  const { code } = req.body;
  console.log("✅ Received:", code);

  if (!code) {
    console.log("❌ No code — sent 400");
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    console.log("🔍 GPT Step 1: Analyzing issues...");
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a senior Java developer." },
        { role: "user", content: `Analyze this code for errors:\n\n${code}` },
      ],
      temperature: 0.0,
    });
    console.log("✅ GPT Step 1 complete");

    const issues = analysis.choices[0]?.message?.content;

    console.log("🔍 GPT Step 2: Refactoring...");
    const refactor = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a senior Java developer." },
        { role: "user", content: `Here are issues:\n${issues}\nRefactor the code accordingly.` },
        { role: "user", content: `Original code:\n\n${code}` }
      ],
      temperature: 0.3,
    });
    console.log("✅ GPT Step 2 complete");

    const result = refactor.choices[0]?.message?.content;
    console.log("🎯 Final Refactored Result:\n", result);

    return res.json({ result });

  } catch (error) {
    console.error("💥 GPT API Error:", error);
    return res.status(500).json({ error: "GPT process failed. Please try again later." });
  }
});

module.exports = router;
