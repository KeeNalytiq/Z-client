# Z-Client

A support-response generator ("Client Response") plus a Zoho-help-grounded
Q&A assistant ("Jr SME"), built as a static React app with two small
serverless functions that keep your API keys off the browser.

## Why two providers

- **Client Response** (plain text generation, no tools) runs on **Groq**
  (`llama-3.3-70b-versatile`). Groq's free tier is genuinely free — no
  card, generous daily limits — and it's fast.
- **Jr SME** (needs live web search) runs on **Gemini** (`gemini-2.5-flash`)
  using its built-in `google_search` grounding tool. Grounding is included
  free up to a daily/monthly quota before any billing kicks in, which is
  comfortably enough for a support team. (Groq's web-search tool exists
  too, via `groq/compound`, but it's billed per search even on a free-tier
  key, so it's not used here.)

Both are wired the same way the original Anthropic version was: the React
app POSTs a plain JSON body to a serverless function, which attaches the
real key server-side and forwards the request.

## Project structure

```
z-client/
├── api/
│   ├── groq.js            # proxy for Client Response (Groq)
│   └── gemini.js          # proxy for Jr SME (Gemini + Google Search grounding)
├── src/
│   ├── App.jsx            # the whole app (both tabs)
│   └── main.jsx           # React entry point
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## 1. Get free API keys

- **Groq**: sign up at https://console.groq.com/keys — free, no card.
- **Gemini**: sign up at https://aistudio.google.com/apikey — free, no card.

## 2. Local development

```bash
npm install
npm install -g vercel        # one-time
cp .env.example .env         # then paste your real keys into .env
vercel dev                   # serves the app AND the /api functions together on :3000
```

Open http://localhost:3000. (Running `npm run dev` alone starts Vite on
its own port and proxies `/api` to `vercel dev` per `vite.config.js`, but
`vercel dev` is the simplest single command for local testing.)

## 3. Deploy to Vercel

**Option A — from the CLI:**
```bash
vercel                       # first deploy, follow the prompts
vercel env add GROQ_API_KEY
vercel env add GEMINI_API_KEY
vercel --prod                # redeploy so the new env vars take effect
```

**Option B — from GitHub (recommended for ongoing updates):**
1. Push this folder to a GitHub repo.
2. In the Vercel dashboard, "Add New Project" → import that repo. Vercel
   auto-detects Vite; no build settings to change.
3. Before the first deploy finishes, go to Project Settings → Environment
   Variables and add `GROQ_API_KEY` and `GEMINI_API_KEY` with your real keys.
4. Deploy. Every future push to `main` redeploys automatically.

## Notes

- **Storage**: templates, response history, Jr SME history, and your
  theme/AI-mode preference are saved in the browser's `localStorage` —
  per browser/device, no account system. If you later want these shared
  across a team or across devices, that's a real backend + database
  addition (out of scope here, but ask if you want to plan it).
- **Jr SME grounding caveat**: unlike Anthropic's web-search tool, Gemini's
  `google_search` grounding has no hard "only search this domain" setting.
  The prompt instructs the model to use only `help.zoho.com`, and it
  follows that well in practice, but it isn't enforced the way it was
  before — worth spot-checking sources on answers you're unsure about.
- **Formatting**: customer-facing response text is locked to Verdana,
  10px, justified, black, per the original spec — that's independent of
  the light/dark theme, which only affects the app UI itself.
