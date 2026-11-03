# Shan Wesley Bachain: portfolio + AI assistant

Static site (`index.html`, `assets/`) plus one serverless function (`api/chat.js`). No build step.

## Run / deploy

- **Deploy:** push to GitHub and import the repo in Vercel (or run `vercel`).
- **Enable the live AI chat:** in Vercel go to *Project Settings > Environment Variables*, add
  `GROQ_API_KEY` (from https://console.groq.com/keys), then redeploy.
  Without the key the chat still answers common questions from a built-in profile and labels
  those replies as "Quick answer from Shan's saved profile".
- **Run locally with the chat:** `npx vercel dev` (set `GROQ_API_KEY` in a `.env` file).
- **Just looking:** opening `index.html` directly works too (tabs, theme, photos, fallback chat).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Layout, styles, and all portfolio content |
| `assets/app.js` | Tabs, URL hash links (`#projects`, `#chat`), chat UI, offline fallback |
| `assets/theme.js` | Light/dark theme (saved in localStorage, follows the OS by default) |
| `api/chat.js` | Groq-powered chat endpoint, with the facts the assistant answers from |
| `vercel.json` | Security headers (strict CSP: no inline scripts) and caching |

When you change something on the site (a project, a date), update the matching facts in
`api/chat.js` and the fallback list in `assets/app.js` so the assistant stays consistent.
