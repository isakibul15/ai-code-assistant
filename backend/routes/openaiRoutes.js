const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/refactor", async (req, res) => {
  const { code, language } = req.body;
  console.log("✅ Received:", { code, language });

  if (!code || !language) {
    return res.status(400).json({ error: "Missing code or language" });
  }

  try {
    const systemMsg = `You are a senior ${language} developer.`;
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: `Analyze this ${language} code for syntax and logic errors:\n\n${code}` }
      ],
      temperature: 0.0,
    });

    const issues = analysis.choices[0]?.message?.content;

    const refactor = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: `Here are issues:\n${issues}\nRefactor the code accordingly:` },
        { role: "user", content: `Original:\n\n${code}` }
      ],
      temperature: 0.3,
    });

    const result = refactor.choices[0]?.message?.content;
    return res.json({ result });

  } catch (error) {
    console.error("💥 GPT error:", error);
    return res.status(500).json({ error: "GPT processing failed." });
  }
});


module.exports = router;
