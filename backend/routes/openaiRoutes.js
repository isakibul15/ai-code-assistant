const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/refactor", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a senior software engineer who refactors code to improve readability, performance, and structure.",
        },
        {
          role: "user",
          content: `Please refactor the following code:\n\n${code}`,
        },
      ],
      temperature: 0.3,
    });

    const result = chatResponse.choices[0]?.message?.content || "No response";

    res.json({ result });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Failed to refactor code using AI" });
  }
});

module.exports = router;
