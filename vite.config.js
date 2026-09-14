import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function localApiPlugin() {
  return {
    name: "local-api-handler",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        const env = loadEnv("development", process.cwd(), "");
        let body = "";
        req.on("data", chunk => { body += chunk; });
        req.on("end", async () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            if (req.url.startsWith("/api/gemini")) {
              const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "GEMINI_API_KEY is not configured on the server." }));
                return;
              }
              const { model = "gemini-3.6-flash", ...rest } = parsedBody;
              const upstream = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey,
                  },
                  body: JSON.stringify(rest),
                }
              );
              const data = await upstream.json();
              res.statusCode = upstream.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
              return;
            }

            if (req.url.startsWith("/api/groq")) {
              const apiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "GROQ_API_KEY is not configured on the server." }));
                return;
              }
              const payload = { model: "openai/gpt-oss-120b", ...parsedBody };
              if (payload.model === "llama-3.3-70b-versatile") payload.model = "openai/gpt-oss-120b";

              const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(payload),
              });
              const data = await upstream.json();
              res.statusCode = upstream.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
              return;
            }
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Internal API handler error", detail: String(err) }));
            return;
          }
          next();
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
});
