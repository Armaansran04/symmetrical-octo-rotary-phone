import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/curate", async (req, res) => {
  const topic = String(req.body?.topic || "").trim();
  const category = String(req.body?.category || "All").trim();

  if (topic.length < 2 || topic.length > 200) {
    return res.status(400).json({ error: "Enter a topic between 2 and 200 characters." });
  }

  // Safe demo mode: the website still works without an API key.
  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      mode: "demo",
      topic,
      summary: `Demo results for “${topic}”. Add an OpenAI API key to .env to generate a fresh AI-curated response.`,
      items: [
        { title: `Beginner's guide to ${topic}`, type: category === "All" ? "Education" : category, summary: `Start with the core ideas, important terms, and a simple overview of ${topic}.`, why: "A useful starting point for learning the topic.", url: "" },
        { title: `${topic}: key concepts to understand`, type: category === "All" ? "Technology" : category, summary: `Review the main concepts, common applications, and questions people ask about ${topic}.`, why: "Helps organize your next steps.", url: "" },
        { title: `Practical uses of ${topic}`, type: category === "All" ? "Business" : category, summary: `Explore real-world examples and think about how ${topic} can be applied in practice.`, why: "Connects theory to practical examples.", url: "" }
      ]
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: `You are CurateAI, a careful content curator for students. Return valid JSON only, no markdown, in this shape:
{"summary":"2 short sentences","items":[{"title":"short title","type":"Education or Technology or Business or Entertainment or Science","summary":"2 concise sentences","why":"one sentence explaining why it is useful","url":""}]}
Provide 5 useful learning-resource ideas for the user's topic. Do not invent specific article URLs or claim you have verified live sources. Leave url as an empty string unless you are certain of a stable, relevant official URL. Keep content clear and beginner-friendly.`,
      input: `Topic: ${topic}\nPreferred category: ${category}\nCreate a curated set of learning resources and explain why each is useful.`
    });

    let parsed;
    try {
      const raw = response.output_text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      parsed = JSON.parse(raw);
    } catch {
      return res.status(502).json({ error: "The AI returned an unexpected format. Please try again." });
    }

    const items = Array.isArray(parsed.items) ? parsed.items.slice(0, 8).map((item) => ({
      title: String(item.title || "Untitled resource").slice(0, 140),
      type: ["Education", "Technology", "Business", "Entertainment", "Science"].includes(item.type) ? item.type : "Education",
      summary: String(item.summary || "").slice(0, 600),
      why: String(item.why || "").slice(0, 240),
      url: typeof item.url === "string" && /^https:\/\/\S+$/i.test(item.url) ? item.url : ""
    })) : [];

    res.json({
      mode: "ai",
      topic,
      summary: String(parsed.summary || "Here is your curated content.").slice(0, 500),
      items
    });
  } catch (error) {
    console.error("Curation error:", error.message);
    res.status(500).json({ error: "AI curation failed. Check your API key, model access, and API billing, then try again." });
  }
});

app.listen(PORT, () => {
  console.log(`CurateAI is running at http://localhost:${PORT}`);
});
