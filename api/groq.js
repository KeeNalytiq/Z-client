// Serverless proxy for the Groq API (OpenAI-compatible chat completions).
//
// Free tier: no card required, generous daily request/token limits on
// models like llama-3.3-70b-versatile. Good for plain text generation
// (no web search) — the actual key never reaches the browser.
//
// Deploy target: Vercel (Node.js serverless function). Same shape as
// api/anthropic.js — port the same logic if you move hosts.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GROQ_API_KEY is not configured on the server." });
    return;
  }

  const body = { model: "openai/gpt-oss-120b", ...(req.body || {}) };
  if (body.model === "llama-3.3-70b-versatile") body.model = "openai/gpt-oss-120b";

  try {
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: "Failed to reach Groq API.", detail: String(err) });
  }
}
