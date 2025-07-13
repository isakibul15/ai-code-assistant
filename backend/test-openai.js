require("dotenv").config();
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    console.log("⚡ Sending test prompt to GPT-3.5...");
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Fix this code: `System.out.println(3;`" },
      ],
    });
    console.log("✅ GPT-3.5 responded:", res.choices[0].message.content);
  } catch (e) {
    console.error("❌ GPT error:", e.message);
  }
}

test();
