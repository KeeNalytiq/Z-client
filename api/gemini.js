// Serverless proxy for the Gemini API (generateContent), used only for the
// Jr SME lookup, which needs live web search grounding.
//
// Free tier: an AI Studio key gives free requests plus a free daily/monthly
// allowance of Google Search grounding queries (well above what a support
// team will use) before any billing kicks in. The key never reaches the
// browser — the React app POSTs { model, contents, tools } here and this
// function attaches the key and forwards it.
//
// Deploy target: Vercel (Node.js serverless function). Same shape as
// api/anthropic.js — port the same logic if you move hosts.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
    return;
  }

  const { model = "gemini-3.6-flash", ...body } = req.body || {};

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: "Failed to reach Gemini API.", detail: String(err) });
  }
}
