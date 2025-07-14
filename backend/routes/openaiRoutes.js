const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/workflow", async (req, res) => {
  const { code, type } = req.body;

  if (!code || !type) {
    return res.status(400).json({ error: "Missing code or workflow type" });
  }

  const prompts = {
    refactor: `Refactor the following code:\n\n${code}`,
    explain: `Explain what this code does:\n\n${code}`,
    test: `Write unit tests for this code:\n\n${code}`,
  };

  const prompt = prompts[type.toLowerCase()];
  if (!prompt) {
    return res.status(400).json({ error: "Unsupported workflow type" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a senior software engineer." },
        { role: "user", content: prompt },
      ],
    });

    const result = completion.choices[0]?.message?.content;
    res.json({ result });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI API failed" });
  }
});

module.exports = router;
