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
    console.log("🔍 Before GPT Step 1");
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a senior Java developer." },
        { role: "user", content: `Analyze this code for errors:\n\n${code}` },
      ],
      temperature: 0.0,
    });
    console.log("✅ Completed GPT Step 1");
    
    console.log("🔍 Before GPT Step 2");
    const refactor = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a senior Java developer." },
        { role: "user", content: `Here are issues:\n${analysis.choices[0]?.message?.content}\nRefactor code:` },
        { role: "user", content: `Original:\n${code}` }
      ],
      temperature: 0.3,
    });
    console.log("✅ Completed GPT Step 2");

    const result = refactor.choices[0]?.message?.content;
    console.log("🎯 Final result:", result);
    return res.json({ result });

  } catch (e) {
    console.error("💥 Error during GPT calls:", e);
    return res.status(500).json({ error: "GPT process error" });
  }
});

module.exports = router;
