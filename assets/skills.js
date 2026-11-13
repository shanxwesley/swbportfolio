/* Shan Wesley Bachain portfolio. Editorial, minimal, light by default with a dark option.
   Design tokens live in :root. Everything else reads from them. No build step. */

@font-face {
  font-family: "Plus Jakarta Sans";
  src: url("plus-jakarta-sans-latin-wght-normal.woff2") format("woff2");
  font-weight: 200 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Anton";
  src: url("anton-latin-400-normal.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ---------- Design tokens ---------- */
/* Vibe: cream and blue, bold condensed display type, pill buttons (UGC portfolio look). */
:root {
  /* Surfaces */
  --bg: #f4e2a1;
  --surface: #fbf3d6;
  --surface-2: #f8ebc0;
  --surface-3: #efd98a;

  /* Text */
  --text: #26325a;
  --text-2: #34406b;
  --muted: #55608a;

  /* Blue accents */
  --accent: #5b74ad;
  --accent-soft: #e3e9f5;
  --accent-ink: #3a5390;
  --btn-bg: #5b74ad;
  --btn-hover: #4a63a0;
  --btn-text: #fbf3d6;

  /* Lines */
  --border: #d9c27a;
  --border-strong: #5b74ad;

  /* Blue block sections (stats band, contact block) */
  --band: #4d66a3;
  --band-text: #fbf3d6;
  --band-muted: #dce4f4;
  --band-line: #7e93c6;

  --ok: #2f6b45;
  --ok-on-dark: #bdf2cf;
  --side: #f8ebc0;

  /* Shape */
  --radius: 14px;
  --radius-lg: 22px;

  /* Elevation */
  --shadow-sm: 0 2px 0 rgba(38, 50, 90, .12);
  --shadow: 0 2px 0 rgba(38, 50, 90, .12), 0 14px 30px rgba(38, 50, 90, .14);
  --shadow-hover: 0 4px 0 rgba(38, 50, 90, .14), 0 22px 40px rgba(38, 50, 90, .2);

  /* Type */
  --sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  --display: "Anton", "Impact", "Arial Narrow Bold", sans-serif;

  color-scheme: light;
}

:root[data-theme="dark"] {
  --bg: #26356a;
  --surface: #304580;
  --surface-2: #3a5090;
  --surface-3: #456099;

  --text: #fbf3d6;
  --text-2: #f1e6be;
  --muted: #c9d3ee;

  --accent: #f2d98a;
  --accent-soft: #3a5090;
  --accent-ink: #f2d98a;
  --btn-bg: #f2d98a;
  --btn-hover: #f8e6a8;
  --btn-text: #26325a;

  --border: #4a5f99;
  --border-strong: #f2d98a;

  --band: #1f2c5c;
  --band-text: #fbf3d6;
  --band-muted: #c9d3ee;
  --band-line: #3a4d85;
  --side: #2c3d76;

  --ok-on-dark: #bdf2cf;

  --shadow-sm: 0 2px 0 rgba(0, 0, 0, .25);
  --shadow: 0 2px 0 rgba(0, 0, 0, .25), 0 14px 30px rgba(0, 0, 0, .35);
  --shadow-hover: 0 4px 0 rgba(0, 0, 0, .25), 0 22px 40px rgba(0, 0, 0, .5);

  color-scheme: dark;
}

/* ---------- Base ---------- */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }

html { height: 100%; }

body {
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 450;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow: hidden;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

img { max-width: 100%; display: block; }
button, textarea { font: inherit; color: inherit; }
a { color: var(--accent-ink); text-underline-offset: .2em; text-decoration-thickness: 1px; }
a:hover { text-decoration-thickness: 2px; }
ul, ol, dl { padding: 0; list-style: none; }

h1, h2, h3 { line-height: 1.12; font-weight: 800; letter-spacing: -.03em; }
h3 { font-size: 1.2rem; font-weight: 750; letter-spacing: -.02em; }

:focus-visible { outline: 2px solid var(--accent-ink); outline-offset: 3px; border-radius: 8px; }
[hidden] { display: none !important; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.noscript {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; margin: 0;
  padding: .7rem 1rem; text-align: center; font-size: .9rem;
  background: #fff4d6; color: #4a3b00;
}

/* ---------- Top navigation ---------- */
.site-nav {
  flex: 0 0 auto;
  position: relative;
  z-index: 20;
  padding-top: env(safe-area-inset-top, 0px);
  background: color-mix(in srgb, var(--bg) 90%, transparent);
  backdrop-filter: saturate(1.2) blur(10px);
  -webkit-backdrop-filter: saturate(1.2) blur(10px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1440px;
  margin: 0 auto;
  height: 68px;
  padding: 0 clamp(1.25rem, 3vw, 3.5rem);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  padding: .3rem .4rem .3rem .3rem;
  border: 0;
  border-radius: 10px;
  background: none;
  cursor: pointer;
  font-size: .95rem;
  font-weight: 750;
  letter-spacing: -.015em;
  white-space: nowrap;
  color: var(--text);
  flex-shrink: 0;
}
.logo {
  width: 36px; height: 36px; flex-shrink: 0;
  border-radius: 10px;
}
.tabs {
  display: flex;
  align-items: center;
  gap: .15rem;
  flex: 1;
  min-width: 0;
  justify-content: center;
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }
.nav-item {
  position: relative;
  padding: .5rem .9rem;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--muted);
  font-size: .92rem;
  font-weight: 550;
  white-space: nowrap;
  cursor: pointer;
  transition: color .2s ease, background-color .2s ease;
}
.nav-item:hover { color: var(--text); background: var(--surface-2); }
.nav-item[aria-current="true"] { color: var(--text); font-weight: 700; background: var(--accent-soft); }
.nav-actions { display: flex; align-items: center; gap: .5rem; flex-shrink: 0; }
.nav-cta {
  padding: .55rem 1.05rem;
  border: 0;
  border-radius: 999px;
  background: var(--btn-bg);
  color: var(--btn-text);
  font-size: .9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color .2s ease, transform .2s ease;
}
.nav-cta:hover { background: var(--btn-hover); transform: translateY(-1px); }
.icon-link, .icon-btn {
  width: 40px; height: 40px;
  display: grid; place-items: center;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  color: var(--text-2);
  cursor: pointer;
  transition: border-color .2s ease, color .2s ease;
}
.icon-link:hover, .icon-btn:hover { border-color: var(--accent); color: var(--accent-ink); }
.icon-link svg, .icon-btn svg {
  width: 17px; height: 17px;
  fill: none; stroke: currentColor; stroke-width: 2;
  stroke-linecap: round; stroke-linejoin: round;
}

/* ---------- Main and panels ---------- */
.main { flex: 1; min-height: 0; position: relative; overflow: hidden; }
.view { height: 100%; position: relative; }
.pf-scroll {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
}
.pf {
  max-width: 1440px;
  margin: 0 auto;
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1.25rem, 4vw, 3.5rem) 4rem;
}
.panel[hidden] { display: none; }
.panel:not([hidden]) > * { animation: rise .7s cubic-bezier(.2, .7, .2, 1) both; }
.panel:not([hidden]) > *:nth-child(2) { animation-delay: .06s; }
.panel:not([hidden]) > *:nth-child(3) { animation-delay: .12s; }
.panel:not([hidden]) > *:nth-child(n+4) { animation-delay: .18s; }

@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes line-up { from { transform: translateY(105%); } to { transform: none; } }
@keyframes hm-rise {
  from { opacity: 0; transform: translate(-50%, 18px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--ok) 45%, transparent); }
  100% { box-shadow: 0 0 0 8px transparent; }
}

/* Reveal on scroll (motion.js adds .js to <html>; without JS everything stays visible) */
.js .reveal {
  opacity: 0;
  translate: 0 22px;
  transition:
    opacity .8s ease,
    translate .8s cubic-bezier(.2, .7, .2, 1),
    transform .35s cubic-bezier(.2, .8, .2, 1),
    box-shadow .35s ease,
    border-color .35s ease;
}
.js .reveal.is-in { opacity: 1; translate: 0 0; }

/* Section header */
.panel-head { margin-bottom: 2.6rem; max-width: 760px; }
.eyebrow {
  font-size: .78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .14em;
  color: var(--accent-ink);
}
.panel-head h2 {
  font-size: clamp(2.2rem, 4.4vw, 3.4rem);
  letter-spacing: -.045em;
  margin-top: .8rem;
}
.panel-head .intro {
  color: var(--muted);
  margin-top: .9rem;
  max-width: 58ch;
  font-size: 1.05rem;
}
.block { margin-top: 3.4rem; }
.block > h3 { margin-bottom: .5rem; }
.block > .gallery,
.block > .steps,
.block > .timeline { margin-top: 1.2rem; }
.meta { color: var(--muted); max-width: 70ch; }
.prose p { max-width: 66ch; margin-bottom: 1rem; color: var(--text-2); }
.prose p:last-child { margin-bottom: 0; }
.col-title {
  font-size: 1.1rem;
  font-weight: 800;
  padding-bottom: .8rem;
  margin-bottom: .3rem;
  border-bottom: 1px solid var(--border-strong);
}

/* ---------- Buttons and text links ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .45rem;
  padding: .8rem 1.25rem;
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  background: var(--surface);
  color: var(--text);
  font-size: .95rem;
  font-weight: 650;
  text-decoration: none;
  cursor: pointer;
  transition: transform .2s ease, border-color .2s ease, background-color .2s ease, color .2s ease, box-shadow .2s ease;
}
.btn:hover {
  border-color: var(--accent-ink);
  color: var(--accent-ink);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
}
.btn--primary,
.btn--primary:hover {
  background: var(--btn-bg);
  border-color: var(--btn-bg);
  color: var(--btn-text);
}
.btn--primary:hover { background: var(--btn-hover); border-color: var(--btn-hover); }
.btn-block { width: 100%; }

.text-btn {
  padding: 0;
  border: 0;
  background: none;
  color: var(--accent-ink);
  font-size: .92rem;
  font-weight: 650;
  cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0 1px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: background-size .35s ease;
}
.text-btn:hover { background-size: 100% 1px; }

/* ---------- Hero ---------- */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: start;
  padding-top: clamp(.5rem, 2vw, 1.5rem);
}
.hero > div:first-child > * { animation: rise .8s cubic-bezier(.2, .7, .2, 1) both; }
.hero > div:first-child > :nth-child(2) { animation-delay: .05s; }
.hero > div:first-child > :nth-child(3) { animation-delay: .1s; }
.hero > div:first-child > :nth-child(4) { animation-delay: .15s; }
.hero > div:first-child > :nth-child(5) { animation-delay: .2s; }
.hero > div:first-child > :nth-child(6) { animation-delay: .25s; }
.hero > div:first-child > :nth-child(7) { animation-delay: .3s; }

.eyebrow-hi {
  display: inline-flex;
  align-items: center;
  gap: .55rem;
  margin-bottom: 1rem;
  padding: .35rem .8rem;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent-ink);
  font-size: .84rem;
  font-weight: 700;
}
.eyebrow-hi::before {
  content: "";
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--accent-ink);
}
.hero h1 {
  font-size: clamp(3rem, 5.6vw, 5.2rem);
  font-weight: 800;
  letter-spacing: -.055em;
  line-height: .98;
  color: var(--text);
}
.hero h1 .ln { display: block; overflow: hidden; padding-bottom: .06em; }
.hero h1 .ln > span { display: inline-block; animation: line-up 1s cubic-bezier(.2, .8, .2, 1) both; }
.hero h1 .ln:nth-child(2) > span { animation-delay: .12s; }
.role { margin-top: 1rem; font-size: 1.1rem; font-weight: 700; color: var(--text); }
.hl { color: var(--accent-ink); }
.lead { margin-top: .6rem; max-width: 52ch; color: var(--muted); font-size: 1.08rem; }
.status {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  margin-top: 1rem;
  padding: .4rem .85rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--ok) 25%, transparent);
  background: color-mix(in srgb, var(--ok) 7%, transparent);
  color: var(--ok);
  font-size: .86rem;
  font-weight: 650;
}
:root[data-theme="dark"] .status { color: var(--ok-on-dark); }
.status i {
  flex-shrink: 0;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2.4s ease-out infinite;
}
.btns { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.2rem; }

.hero-ask { margin-top: 1.4rem; max-width: 600px; }
.composer {
  display: flex;
  flex-direction: column;
  gap: .4rem;
  padding: .8rem .9rem .6rem 1.1rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
  transition: border-color .2s ease, box-shadow .2s ease;
}
.composer:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft), var(--shadow);
}
.composer textarea {
  width: 100%;
  min-height: 28px;
  max-height: 180px;
  padding: .2rem 0;
  border: 0;
  background: transparent;
  resize: none;
  outline: none;
  font-size: 1rem;
  line-height: 1.5;
}
.composer textarea::placeholder { color: var(--muted); }
.composer-foot { display: flex; justify-content: flex-end; }
.hero-ask .composer { flex-direction: row; align-items: center; gap: .6rem; padding: .45rem .45rem .45rem 1.1rem; }
.hero-ask textarea { height: 24px; min-height: 24px; padding: 0; font-size: .96rem; }
.send {
  width: 36px; height: 36px;
  display: grid; place-items: center;
  border: 0;
  border-radius: 10px;
  background: var(--btn-bg);
  color: var(--btn-text);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color .2s ease;
}
.send:hover { background: var(--btn-hover); }
.send:disabled { opacity: .4; cursor: default; }
.mini-chips { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .9rem; }
.mini-chips button {
  padding: .32rem .85rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: .85rem;
  cursor: pointer;
  transition: color .2s ease, border-color .2s ease, background-color .2s ease;
}
.mini-chips button:hover { color: var(--text); border-color: var(--accent); background: var(--accent-soft); }

/* Portrait: the photo stands on the page with no background. The bottom fades into the page. */
.hero-me {
  position: relative;
  width: 100%;
  max-width: 460px;
  margin: -3rem auto 0;
}
.hm-facts { position: absolute; inset: 0; pointer-events: none; }
.hm-fact {
  position: absolute;
  width: 186px;
  padding: .9rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  pointer-events: auto;
  transition: transform .3s ease, border-color .3s ease;
}
.hm-fact:hover { transform: translateY(-3px); border-color: var(--accent); }
.hm-fact b { display: block; font-size: .95rem; font-weight: 750; letter-spacing: -.015em; line-height: 1.3; color: var(--text); }
.hm-fact span { display: block; margin-top: .25rem; font-size: .82rem; line-height: 1.4; color: var(--muted); }
.hm-f1 { left: -32px; top: 12%; }
.hm-f2 { right: -72px; top: 24%; }
.hm-f3 { left: -72px; top: 56%; }
.hm-f4 { right: -128px; top: 80%; }
.hm-me {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, #000 80%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 80%, transparent 100%);
  animation: hm-rise 1.1s .2s cubic-bezier(.2, .8, .2, 1) both;
}
@keyframes hm-rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}

/* Stats band: the first dark section */
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  background: var(--band);
  color: var(--band-text);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.stats > div { padding: 1.6rem 1.5rem; }
.stats > div + div { border-left: 1px solid var(--band-line); }
.stats b { display: block; font-size: 1.05rem; font-weight: 750; letter-spacing: -.015em; line-height: 1.3; }
.stats span { font-size: .86rem; color: var(--band-muted); }

.sec-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin: 4.5rem 0 1.5rem;
}
.sec-head h2 { font-size: clamp(1.7rem, 2.8vw, 2.1rem); letter-spacing: -.035em; }

/* ---------- Project cards ---------- */
.cards { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
@media (min-width: 900px) { .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.card {
  position: relative;
  min-width: 0;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: .7rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  transition: transform .35s cubic-bezier(.2, .8, .2, 1), box-shadow .35s ease, border-color .35s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: color-mix(in srgb, var(--accent) 65%, var(--border));
}
.card h3 { font-size: 1.4rem; font-weight: 800; letter-spacing: -.025em; }
.card h3 small { font-size: .85rem; font-weight: 550; color: var(--muted); letter-spacing: 0; }
.card p { color: var(--text-2); }
.card .tag { font-size: .85rem; font-weight: 550; color: var(--muted); }
.card .tag b { color: var(--ok); font-weight: 700; }
:root[data-theme="dark"] .card .tag b { color: var(--ok-on-dark); }
.card .result {
  font-size: .92rem;
  font-weight: 650;
  color: var(--text);
  background: var(--accent-soft);
  border-radius: 10px;
  padding: .6rem .85rem;
}
.card dl { display: grid; gap: .5rem; margin-top: .2rem; font-size: .92rem; }
.card dl div { display: grid; grid-template-columns: 7rem 1fr; gap: .8rem; }
.card dt { color: var(--muted); }
.card dd { color: var(--text); }
.card .links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.1rem;
  margin-top: auto;
  padding-top: .5rem;
  font-size: .92rem;
  font-weight: 650;
}

/* Gallery fallback (gallery.js turns this into a reel when JavaScript runs) */
.gallery { display: flex; gap: .6rem; overflow-x: auto; padding-bottom: .25rem; scrollbar-width: thin; }
.gallery img { width: 180px; height: auto; flex-shrink: 0; border-radius: 12px; border: 1px solid var(--border); }
.gallery--wide { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); overflow: visible; }
.gallery--wide img { width: 100%; }

/* ---------- Thesis ---------- */
.facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.fact {
  padding: 1.4rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}
.fact b { display: block; font-size: 1.35rem; font-weight: 800; letter-spacing: -.025em; }
.fact span { font-size: .9rem; color: var(--muted); }
.role-callout {
  padding: clamp(1.6rem, 3vw, 2.2rem);
  background: var(--accent-soft);
  border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
  border-radius: var(--radius-lg);
}
.kicker { font-size: .74rem; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; color: var(--accent-ink); }
.role-callout h3 { margin-top: .45rem; font-size: clamp(1.4rem, 2.4vw, 1.7rem); letter-spacing: -.03em; }
.role-callout p:last-child { max-width: 64ch; margin-top: .6rem; color: var(--text-2); }

.steps { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .75rem; }
.steps li {
  padding: 1.2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: .9rem;
  color: var(--muted);
  line-height: 1.55;
  transition: border-color .25s ease, transform .25s ease;
}
.steps li:hover { border-color: var(--accent); transform: translateY(-2px); }
.steps .n {
  display: grid; place-items: center;
  width: 30px; height: 30px;
  margin-bottom: .8rem;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent-ink);
  font-size: .82rem;
  font-weight: 800;
}
.steps b { display: block; margin-bottom: .3rem; font-size: 1rem; font-weight: 750; color: var(--text); }

.timeline { display: grid; gap: 1.5rem; max-width: 640px; }
.timeline > div {
  position: relative;
  padding: .1rem 0 .1rem 1.4rem;
  border-left: 1px solid var(--border-strong);
}
.timeline > div::before {
  content: "";
  position: absolute;
  left: -5px;
  top: .55rem;
  width: 9px; height: 9px;
  border-radius: 50%;
  background: var(--accent-ink);
  box-shadow: 0 0 0 4px var(--bg);
}
.timeline .when { font-size: .8rem; font-weight: 700; color: var(--accent-ink); }
.timeline strong { display: block; font-size: 1.02rem; font-weight: 750; letter-spacing: -.01em; }
.timeline .note { font-size: .92rem; color: var(--muted); }

.bullets { list-style: disc; padding-left: 1.3rem; display: grid; gap: .45rem; max-width: 70ch; }

/* ---------- Skills ---------- */
/* Impact stats and soft skills (Skills panel) */
.impact-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 1rem; }
.impact-stat {
  padding: 1.5rem 1.6rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
.impact-stat b { display: block; font-size: 2.6rem; font-weight: 800; letter-spacing: -.04em; line-height: 1; color: var(--accent-ink); }
.impact-stat span { display: block; margin-top: .6rem; font-size: .95rem; font-weight: 600; color: var(--text); }
.softskills {
  margin-top: 1rem;
  padding: 1.5rem 1.7rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.softskills h3 { margin-bottom: .8rem; }
.softskills .pill-row { margin-top: 0; }

.skill-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; margin-bottom: 2.2rem; }
.skill-stat {
  padding: 1.2rem 1.3rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}
.skill-stat b { display: block; font-size: 1.7rem; font-weight: 800; letter-spacing: -.03em; line-height: 1.15; }
.skill-stat span { display: block; margin-top: .3rem; font-size: .86rem; color: var(--muted); }
.skill-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.skill-grid > div {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: border-color .25s ease, box-shadow .25s ease;
}
.skill-grid > div:hover { border-color: var(--accent); box-shadow: var(--shadow); }
.skill-grid dt { font-size: 1.05rem; font-weight: 750; letter-spacing: -.015em; }
.skill-grid dd { color: var(--muted); font-size: .95rem; }
.pill-row { display: flex; flex-wrap: wrap; gap: .4rem; margin: .2rem 0 .3rem; }
.pill {
  padding: .25rem .75rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-2);
  font-size: .84rem;
  font-weight: 550;
  transition: border-color .2s ease, background-color .2s ease;
}
.pill:hover { border-color: var(--accent); background: var(--accent-soft); }
.used { font-size: .86rem; color: var(--muted); }
.impact {
  margin-top: .3rem;
  padding: .6rem .8rem;
  border-radius: 10px;
  background: var(--surface-2);
  color: var(--text-2);
  font-size: .9rem;
}
.skill-soft {
  margin-top: 1.5rem;
  padding: 1.5rem 1.7rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.skill-soft h3 { margin-bottom: .5rem; }
.skill-soft p { color: var(--muted); max-width: 75ch; }

/* ---------- About ---------- */
.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr);
  gap: clamp(2.5rem, 5vw, 4.5rem);
  align-items: start;
}
.pull {
  max-width: 24ch;
  margin-bottom: 1.5rem;
  font-size: clamp(1.5rem, 2.5vw, 2.05rem);
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -.035em;
  color: var(--text);
}
.signature { margin-top: 1rem; font-size: .92rem; color: var(--muted); }
.awards div {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 1rem;
  align-items: baseline;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}
.awards span:first-child { font-size: .84rem; font-weight: 700; color: var(--accent-ink); }
.awards span:last-child { font-size: .98rem; color: var(--text); }

/* ---------- Contact ---------- */
.contact-layout { display: grid; gap: 1rem; max-width: 1000px; }
.contact-primary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.8rem, 4vw, 2.6rem);
  background: var(--band);
  color: var(--band-text);
  border-radius: var(--radius-lg);
}
.contact-primary .status-pill {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  width: fit-content;
  padding: .3rem .75rem;
  border: 1px solid color-mix(in srgb, var(--ok-on-dark) 30%, transparent);
  border-radius: 999px;
  color: var(--ok-on-dark);
  font-size: .84rem;
  font-weight: 650;
}
.contact-primary .status-pill i {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2.4s ease-out infinite;
}
.contact-primary h3 { font-size: clamp(1.7rem, 3vw, 2.4rem); letter-spacing: -.035em; }
.contact-primary p { max-width: 46ch; color: var(--band-muted); }
.contact-primary .btn-row { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: .3rem; }
.contact-primary .btn:not(.btn--primary) {
  background: transparent;
  border-color: var(--band-line);
  color: var(--band-text);
}
.contact-primary .btn:not(.btn--primary):hover { border-color: var(--accent); color: var(--accent); }

.contact-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .9rem; }
.contact-card {
  min-height: 104px;
  display: flex;
  flex-direction: column;
  gap: .4rem;
  padding: 1.3rem 1.4rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color .2s ease, transform .2s ease;
}
.contact-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.contact-card--wide { grid-column: 1 / -1; }
.contact-card .label { font-size: .74rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); }
.contact-card a,
.contact-card .value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  word-break: break-word;
}
.contact-card a:hover { color: var(--accent-ink); }
.contact-card .icon {
  width: 36px; height: 36px;
  padding: 9px;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent-ink);
  box-sizing: border-box;
}

.resume-block .resume-card {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  max-width: 1000px;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}
.resume-thumb {
  flex-shrink: 0;
  width: 150px;
  overflow: hidden;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  background: #fff;
  box-shadow: var(--shadow);
  line-height: 0;
  transition: transform .35s cubic-bezier(.2, .8, .2, 1);
}
.resume-thumb:hover { transform: translateY(-3px); }
.resume-thumb img { width: 100%; height: auto; }
.resume-info p { max-width: 44ch; color: var(--muted); }
.resume-info .btn-row { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: .9rem; }

.pf-foot {
  margin-top: 4.5rem;
  padding-top: 1.4rem;
  border-top: 1px solid var(--border);
  font-size: .86rem;
  color: var(--muted);
}

/* ---------- Ask AI view ---------- */
.view-chat { display: flex; flex-direction: column; height: 100%; }
.chat-layout {
  height: 100%;
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
}
.chat-side {
  display: flex;
  flex-direction: column;
  gap: .3rem;
  min-height: 0;
  padding: 1.1rem .8rem;
  background: var(--side);
  border-right: 1px solid var(--border);
}
.chat-side .btn { margin-bottom: .6rem; }
.side-label {
  padding: .8rem .6rem .3rem;
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--muted);
}
.recents { display: flex; flex-direction: column; gap: .1rem; flex: 1; min-height: 0; overflow-y: auto; }
.recent {
  display: block;
  width: 100%;
  padding: .5rem .65rem;
  border: 0;
  border-radius: 10px;
  background: none;
  color: var(--text-2);
  font-size: .88rem;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: background-color .2s ease;
}
.recent:hover { background: var(--surface-3); }
.recent[aria-current="true"] { background: var(--surface); color: var(--text); font-weight: 650; box-shadow: var(--shadow-sm); }
.recents-empty { padding: .3rem .65rem; font-size: .85rem; color: var(--muted); }

.chat-main { display: flex; flex-direction: column; min-width: 0; min-height: 0; height: 100%; background: var(--bg); }
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 60px;
  padding: 0 1.5rem;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border);
}
.topbar-title { font-size: .98rem; font-weight: 700; }
.topbar-title span { font-weight: 500; color: var(--muted); }
.text-link {
  padding: .35rem .7rem;
  border: 0;
  border-radius: 8px;
  background: none;
  color: var(--muted);
  font-size: .9rem;
  cursor: pointer;
}
.text-link:hover { color: var(--text); background: var(--surface-2); }
.chat-scroll { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.chat-col {
  min-height: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}
.welcome { margin: auto 0; padding: 3rem 0 1rem; text-align: center; }
.welcome h1 { font-size: clamp(1.9rem, 3.6vw, 2.7rem); font-weight: 800; letter-spacing: -.04em; }
.welcome p { margin-top: .5rem; color: var(--muted); }
.chips { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; margin-top: 2rem; }
.chips button {
  padding: .9rem 1rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
  color: var(--text);
  font-size: .92rem;
  line-height: 1.4;
  text-align: left;
  cursor: pointer;
  transition: border-color .2s ease, background-color .2s ease;
}
.chips button:hover { border-color: var(--accent); background: var(--accent-soft); }
.thread { display: flex; flex-direction: column; gap: 1.6rem; }
.msg-user {
  align-self: flex-end;
  max-width: 78%;
  padding: .7rem 1rem;
  border-radius: 16px 16px 4px 16px;
  background: var(--accent-soft);
  color: var(--text);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  animation: rise .35s ease both;
}
.msg-bot { line-height: 1.75; overflow-wrap: anywhere; animation: rise .4s ease both; }
.msg-bot p { margin-bottom: .75rem; }
.msg-bot p:last-child { margin-bottom: 0; }
.msg-bot ul { list-style: disc; padding-left: 1.3rem; margin: .3rem 0 .75rem; }
.msg-bot li { margin-bottom: .3rem; }
.msg-bot strong { font-weight: 700; }
.msg-bot a { word-break: break-word; }
.msg-note {
  margin-top: .6rem !important;
  padding-top: .5rem;
  border-top: 1px solid var(--border);
  font-size: .8rem;
  color: var(--muted);
}
.msg-wait { display: inline-flex; align-items: center; gap: .55rem; font-size: .9rem; color: var(--muted); }
.msg-error { padding: .7rem .9rem; border: 1px solid var(--border-strong); border-radius: 12px; background: var(--surface); font-size: .9rem; }
.dots { display: inline-flex; gap: 4px; }
.dots i { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-ink); animation: blink 1.2s infinite; }
.dots i:nth-child(2) { animation-delay: .15s; }
.dots i:nth-child(3) { animation-delay: .3s; }
@keyframes blink { 0%, 80%, 100% { opacity: .25; } 40% { opacity: 1; } }

.composer-wrap { flex-shrink: 0; padding: .5rem 1.5rem 0; }
.composer-wrap .composer { max-width: 800px; margin: 0 auto; }
.chat-note { padding: .65rem 1rem .8rem; text-align: center; font-size: .75rem; color: var(--muted); }


/* ---------- Responsive ---------- */
@media (max-width: 1100px) {
  .hero { grid-template-columns: 1fr; }
  .hero-me { max-width: 320px; order: 2; }
  .icon-link.gh { display: none; }
  .nav-item { padding: .45rem .65rem; }
}

@media (max-width: 900px) {
  .nav-inner {
    height: auto;
    flex-wrap: wrap;
    gap: .5rem .75rem;
    padding: .6rem 1rem .5rem;
  }
  .brand .name { display: none; }
  .nav-actions { margin-left: auto; }
  .tabs {
    order: 3;
    flex-basis: 100%;
    justify-content: flex-start;
    margin: 0 -1rem;
    padding: .1rem 1rem .5rem;
  }
  .nav-item { font-size: .86rem; }

  .pf { padding-inline: 1.1rem; }
  .hero { grid-template-columns: 1fr; gap: 2.2rem; }
  .hero-me { max-width: none; }
  .hm-me { max-width: 280px; margin: 0 auto; }
  .hm-facts { position: static; display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; margin-top: 1.2rem; }
  .hm-fact { position: static; width: auto; }
  .hm-fact:nth-child(n) { transform: none; }
  .hero h1 { font-size: clamp(2.8rem, 12vw, 3.6rem); }
  .btns .btn { flex: 1 1 auto; }
  .hero-ask { max-width: none; }
  .stats { grid-template-columns: 1fr 1fr; }
  .stats > div:nth-child(3) { border-left: 0; }
  .stats > div:nth-child(n+3) { border-top: 1px solid var(--band-line); }
  .facts { grid-template-columns: 1fr; }
  .steps { grid-template-columns: 1fr; }
  .about-grid { grid-template-columns: 1fr; gap: 2.4rem; }
  .skill-stats { grid-template-columns: 1fr 1fr; }
  .skill-grid { grid-template-columns: 1fr; }
  .impact-row { grid-template-columns: 1fr; }
  .contact-grid { grid-template-columns: 1fr; }
  .card dl div { grid-template-columns: 1fr; gap: .1rem; }
  .resume-block .resume-card { flex-direction: column; align-items: flex-start; }
  .resume-thumb { width: 130px; }

  /* Ask AI: recent chats become a horizontal strip above the thread */
  .chat-layout { grid-template-columns: 1fr; grid-template-rows: auto minmax(0, 1fr); }
  .chat-side {
    flex-direction: row;
    align-items: center;
    gap: .4rem;
    padding: .5rem .75rem;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid var(--border);
    scrollbar-width: none;
  }
  .chat-side::-webkit-scrollbar { display: none; }
  .chat-side .btn { margin: 0; flex-shrink: 0; }
  .side-label { display: none; }
  .recents { flex-direction: row; flex: none; overflow: visible; }
  .recent { width: auto; max-width: 180px; flex-shrink: 0; }
  .chat-col { padding: 1rem .9rem .5rem; }
  .msg-user { max-width: 90%; }
  .chips { grid-template-columns: 1fr; }
  .topbar { padding: 0 1rem; }
}

@media (max-width: 520px) {
  .brand .logo { width: 28px; height: 28px; }
  .stats > div { padding: 1.2rem 1.1rem; }
  .skill-stats { grid-template-columns: 1fr 1fr; }
  .card { padding: 1.3rem; }
  .composer-wrap { padding: .4rem .75rem 0; }
  .hm-me { max-width: 240px; }
}

/* ---------- Small phones: tighter type, buttons, and spacing (not just stacked) ---------- */
@media (max-width: 600px) {
  body { font-size: 15px; }
  .pf { padding-inline: .9rem; padding-top: .9rem; }
  .nav-inner { padding: .5rem .8rem .45rem; gap: .4rem .6rem; }
  .tabs { margin: 0 -.8rem; padding: .1rem .8rem .5rem; }
  .brand { font-size: .85rem; }
  .brand .logo { width: 26px; height: 26px; }
  .nav-cta { padding: .42rem .8rem; font-size: .8rem; }
  .icon-link, .icon-btn { width: 34px; height: 34px; }
  .icon-link svg, .icon-btn svg { width: 15px; height: 15px; }
  .nav-item { font-size: .8rem; padding: .38rem .65rem; }

  .eyebrow-hi { font-size: .75rem; padding: .28rem .6rem; margin-bottom: .7rem; }
  .hero h1 { font-size: clamp(2.2rem, 10.5vw, 2.8rem); letter-spacing: -.045em; }
  .role { font-size: .9rem; margin-top: .6rem; }
  .lead { font-size: .88rem; margin-top: .5rem; }
  .status { font-size: .74rem; padding: .3rem .65rem; margin-top: .7rem; }
  .btns { gap: .45rem; margin-top: .8rem; }
  .btn { font-size: .86rem; padding: .6rem .8rem; border-radius: 10px; }
  .hero-ask { margin-top: 1rem; }
  .hero-ask textarea { font-size: .85rem; }
  .composer { border-radius: 14px; }
  .send { width: 30px; height: 30px; }
  .mini-chips { gap: .35rem; margin-top: .6rem; }
  .mini-chips button { font-size: .8rem; padding: .3rem .65rem; }

  .panel-head { margin-bottom: 1.4rem; }
  .panel-head h2 { font-size: clamp(1.7rem, 7.5vw, 2.1rem); }
  .panel-head .intro { font-size: .88rem; }
  .eyebrow { font-size: .74rem; }
  .sec-head { margin: 2.5rem 0 1rem; }
  .sec-head h2 { font-size: 1.3rem; }
  .text-btn { font-size: .86rem; }
  .block { margin-top: 2.2rem; }
  .block > h3, .col-title { font-size: 1rem; }

  .card { padding: 1.1rem; border-radius: 18px; gap: .5rem; }
  .card h3 { font-size: 1.1rem; }
  .card p { font-size: .92rem; }
  .card dl div { font-size: .9rem; }
  .card .links { font-size: .88rem; gap: .8rem; }
  .card .result { font-size: .88rem; }
  .gallery img { width: 140px; }

  .fact { padding: .9rem; }
  .fact b { font-size: 1.05rem; }
  .fact span { font-size: .8rem; }
  .role-callout { padding: 1.2rem; }
  .role-callout h3 { font-size: 1.15rem; }
  .steps li { font-size: .88rem; padding: .9rem; }
  .timeline strong { font-size: .9rem; }
  .timeline .note { font-size: .88rem; }

  .skill-stat { padding: .9rem; }
  .skill-stat b { font-size: 1.3rem; }
  .skill-stat span { font-size: .82rem; }
  .skill-grid > div { padding: 1rem; }
  .skill-grid dt { font-size: .95rem; }
  .skill-grid dd { font-size: .9rem; }
  .pill { font-size: .8rem; padding: .2rem .6rem; }
  .impact-stat { padding: 1.1rem; }
  .impact-stat b { font-size: 1.9rem; }
  .impact-stat span { font-size: .8rem; }
  .softskills { padding: 1.1rem; }
  .skill-soft { padding: 1.1rem; }
  .skill-soft p { font-size: .9rem; }

  .pull { font-size: 1.3rem; }
  .prose p { font-size: .95rem; }
  .awards div { grid-template-columns: 4rem 1fr; gap: .6rem; padding: .7rem 0; }
  .awards span:last-child { font-size: .92rem; }

  .contact-primary { padding: 1.3rem; }
  .contact-primary h3 { font-size: 1.4rem; }
  .contact-primary p { font-size: .85rem; }
  .contact-card { padding: .9rem 1rem; min-height: 0; }
  .contact-card a, .contact-card .value { font-size: .95rem; }
  .resume-block .resume-card { padding: 1rem; gap: 1rem; }
  .resume-info p { font-size: .9rem; }
  .pf-foot { font-size: .82rem; }

  .hm-fact { padding: .6rem .7rem; border-radius: 12px; }
  .hm-fact b { font-size: .84rem; }
  .hm-fact span { font-size: .76rem; }

  .chips button { font-size: .8rem; padding: .6rem .75rem; }
  .welcome h1 { font-size: 1.5rem; }
  .msg-user, .msg-bot { font-size: .95rem; }
  .composer-wrap { padding: .3rem .6rem 0; }
  .chat-note { font-size: .72rem; padding: .4rem .6rem .5rem; }
  .topbar-title { font-size: .85rem; }
  .text-link { font-size: .8rem; }
}

/* Phone polish: even tab grid (no clipped tabs) and even hero buttons */
@media (max-width: 600px) {
  .tabs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .35rem;
    margin: 0;
    padding: 0 0 .2rem;
    overflow: visible;
  }
  .tabs .nav-item {
    width: 100%;
    padding: .5rem .3rem;
    text-align: center;
    justify-content: center;
    font-size: .8rem;
    border-radius: 10px;
  }
  .nav-inner { padding: .6rem .8rem .5rem; }
  .btns { display: grid; grid-template-columns: 1fr 1fr; gap: .45rem; }
  .btns > .btn:first-child { grid-column: 1 / -1; }
  .btns .btn { width: 100%; flex: none; padding: .6rem .5rem; white-space: nowrap; }
}

/* Phone hero: everything centered, photo with floating cards around it */
@media (max-width: 900px) {
  .hero > div:first-child { text-align: center; }
  .lead { margin-inline: auto; }
  .mini-chips { justify-content: center; }
  .hero-ask { width: 100%; }

  .hero-me { max-width: 380px; height: 360px; margin: 0 auto; }
  .hm-me {
    position: absolute;
    left: 0; right: 0; bottom: 0;
    margin: 0 auto;
    height: 100%;
    width: auto;
    max-width: none;
    transform: none;
  }
  .hm-facts { position: absolute; inset: 0; display: block; margin: 0; }
  .hm-fact { position: absolute; width: 118px; padding: .6rem .7rem; border-radius: 12px; text-align: left; }
  .hm-f1 { left: 0; top: 2%; }
  .hm-f2 { right: 0; top: 30%; }
  .hm-f3 { left: 0; top: 58%; }
  .hm-f4 { right: -12px; top: 84%; }
  .hm-fact b { font-size: .84rem; }
  .hm-fact span { font-size: .68rem; margin-top: .15rem; }
}

/* Phone header: one linear row (avatar + name + actions), then one scrolling line of tabs */
@media (max-width: 600px) {
  .nav-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .55rem;
    padding: .6rem .8rem .4rem;
    height: auto;
  }
  .brand { gap: .45rem; padding: .2rem 0; min-width: 0; }
  .brand .logo { width: 28px; height: 28px; flex-shrink: 0; }
  .brand .name { display: inline; font-size: .82rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nav-actions { margin-left: auto; gap: .4rem; }
  .nav-cta { padding: .4rem .75rem; font-size: .78rem; }
  .icon-btn { width: 32px; height: 32px; }
  .icon-btn svg { width: 14px; height: 14px; }
  .tabs {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: .2rem;
    width: 100%;
    margin: 0 -.8rem;
    padding: .15rem .8rem .45rem;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tabs .nav-item {
    width: auto;
    flex-shrink: 0;
    padding: .42rem .75rem;
    font-size: .8rem;
    text-align: left;
    justify-content: initial;
    border-radius: 999px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
  .js .reveal { opacity: 1; translate: none; }
}

/* ---------- Contact: compact desktop layout so the whole section fits one laptop screen ---------- */
@media (min-width: 901px) {
  #contact .panel-head { margin-bottom: 1.3rem; }
  #contact .panel-head h2 { font-size: clamp(1.9rem, 3vw, 2.5rem); margin-top: .5rem; }
  #contact .panel-head .intro { margin-top: .5rem; font-size: .98rem; }

  #contact .contact-layout {
    max-width: none;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    gap: 1rem;
    align-items: stretch;
  }
  #contact .contact-primary { padding: 1.5rem 1.6rem; gap: .6rem; }
  #contact .contact-primary h3 { font-size: 1.7rem; }
  #contact .contact-primary p { font-size: .92rem; }
  #contact .contact-primary .btn { padding: .6rem 1rem; }

  #contact .contact-grid { gap: .6rem; }
  #contact .contact-card {
    min-height: 0;
    padding: .8rem 1rem;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: .75rem;
    row-gap: .1rem;
    align-items: center;
  }
  #contact .contact-card .icon { grid-row: span 2; width: 34px; height: 34px; }
  #contact .contact-card .label { font-size: .7rem; }
  #contact .contact-card a,
  #contact .contact-card .value { font-size: .95rem; }

  #contact .resume-block { margin-top: 1.4rem; }
  #contact .resume-block h3 { margin-bottom: .6rem; }
  #contact .resume-block .resume-card { max-width: none; padding: 1rem 1.2rem; gap: 1.2rem; }
  #contact .resume-thumb { width: 92px; }
  #contact .resume-info p { font-size: .9rem; }
  #contact .resume-info .btn-row { margin-top: .6rem; }
  #contact .resume-info .btn { padding: .55rem .95rem; }
}

/* ---------- Mobile header: one clean row (brand + actions), then one scrolling line of tabs ---------- */
@media (max-width: 600px) {
  .site-nav { overflow: hidden; }
  .nav-inner {
    height: auto;
    max-width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: .6rem;
    padding: .7rem .9rem .3rem;
  }
  .brand { min-width: 0; gap: .5rem; padding: .2rem 0; }
  .brand .logo { width: 32px; height: 32px; }
  .brand .name { display: inline; min-width: 0; font-size: .92rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .nav-actions { display: flex; align-items: center; gap: .4rem; justify-content: flex-end; margin: 0; }
  .nav-cta { padding: .45rem .8rem; font-size: .82rem; white-space: nowrap; }
  .icon-btn { width: 34px; height: 34px; }
  .icon-btn svg { width: 15px; height: 15px; }

  .tabs {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: .3rem;
    width: auto;
    margin: 0 -.9rem;
    padding: .2rem .9rem .7rem;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tabs .nav-item {
    width: auto;
    flex-shrink: 0;
    padding: .42rem .85rem;
    font-size: .86rem;
    border-radius: 999px;
    text-align: center;
  }
}

/* ---------- Vibe layer: display type, pills, blocky cards ---------- */
h1, h2, .panel-head h2, .sec-head h2, .hero h1, .welcome h1 {
  font-family: var(--display);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: .01em;
  line-height: 1;
}
.hero h1 { letter-spacing: .01em; }
.card h3,
.block > h3,
.role-callout h3,
.contact-primary h3,
.softskills h3,
.skill-soft h3 {
  font-family: var(--display);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: .02em;
  line-height: 1.05;
}
.card h3 { font-size: 1.75rem; }
.eyebrow, .eyebrow-hi, .side-label { letter-spacing: .12em; }

.btn, .btn--primary, .nav-cta, .nav-item, .text-btn, .mini-chips button, .pill, .status-pill {
  border-radius: 999px;
}
.btn { border: 2px solid var(--accent); }
.nav-item[aria-current="true"] { background: var(--btn-bg); color: var(--btn-text); }
.nav-item:hover { background: var(--surface-2); }

.card {
  border: 2px solid var(--accent);
  border-radius: var(--radius-lg);
}
.icon-link, .icon-btn { border: 2px solid var(--accent); }

/* ---------- Skills: spacing fix, filter chips, cute motion ---------- */
.impact-row { margin-bottom: 1.6rem; }

.skill-filter { display: flex; flex-wrap: wrap; gap: .5rem; margin: 0 0 .4rem; }
.chip-filter {
  padding: .45rem 1.05rem;
  border: 2px solid var(--accent);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: .88rem;
  font-weight: 650;
  cursor: pointer;
  transition: transform .25s cubic-bezier(.3, 1.6, .5, 1), background-color .2s ease, color .2s ease;
}
.chip-filter:hover { transform: translateY(-2px) rotate(-2deg); }
.chip-filter:active { transform: scale(.92); }
.chip-filter[aria-pressed="true"] { background: var(--btn-bg); color: var(--btn-text); }
.filter-count { font-size: .85rem; color: var(--muted); margin: .4rem 0 1.2rem; }

@keyframes pop {
  0% { transform: scale(.4); opacity: 0; }
  70% { transform: scale(1.08); opacity: 1; }
  100% { transform: none; opacity: 1; }
}
@keyframes bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes wiggle {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

/* Cards slide in when a filter reveals them; pills pop in with a small stagger */
.skill-grid > div:not([hidden]) { animation: rise .5s cubic-bezier(.2, .7, .2, 1) both; }
.skill-grid > div:nth-child(2):not([hidden]) { animation-delay: .08s; }
.skill-grid > div:nth-child(3):not([hidden]) { animation-delay: .16s; }
.skill-grid > div:nth-child(4):not([hidden]) { animation-delay: .24s; }
.skill-grid .pill { animation: pop .5s cubic-bezier(.3, 1.4, .5, 1) backwards; }
.skill-grid .pill:nth-child(2) { animation-delay: .05s; }
.skill-grid .pill:nth-child(3) { animation-delay: .1s; }
.skill-grid .pill:nth-child(4) { animation-delay: .15s; }
.skill-grid .pill:nth-child(5) { animation-delay: .2s; }
.skill-grid .pill:nth-child(6) { animation-delay: .25s; }
.skill-grid .pill { transition: transform .25s cubic-bezier(.3, 1.6, .5, 1), background-color .2s ease; }
.skill-grid .pill:hover { transform: translateY(-2px) rotate(-3deg); }

.impact-stat, .skill-stat { transition: transform .3s cubic-bezier(.3, 1.4, .5, 1); }
.impact-stat:hover, .skill-stat:hover { transform: translateY(-3px); }
.impact-stat:hover b, .skill-stat:hover b { animation: wiggle .5s ease; }
.impact-stat b, .skill-stat b { font-variant-numeric: tabular-nums; }

.soft-pill-float .pill { animation: bob 3s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .skill-grid > div, .skill-grid .pill, .soft-pill-float .pill,
  .impact-stat:hover b, .skill-stat:hover b { animation: none !important; }
  .chip-filter:hover, .chip-filter:active, .skill-grid .pill:hover,
  .impact-stat:hover, .skill-stat:hover { transform: none; }
}

/* ---------- Hero photo frame + more motion ---------- */
.hm-me { position: relative; z-index: 1; }
.hm-blob {
  position: absolute;
  z-index: 0;
  left: 6%;
  right: 6%;
  top: 8%;
  bottom: 4%;
  background: linear-gradient(160deg, var(--accent), var(--accent-ink));
  border-radius: 46% 54% 40% 60% / 50% 40% 60% 50%;
  opacity: .92;
  animation: blob-morph 9s ease-in-out infinite;
}
@keyframes blob-morph {
  0%, 100% { border-radius: 46% 54% 40% 60% / 50% 40% 60% 50%; }
  50% { border-radius: 60% 40% 55% 45% / 45% 60% 40% 55%; }
}

/* Fact cards float using the translate property, so hover transform still works */
@keyframes float-a { 0%, 100% { translate: 0 0; } 50% { translate: 0 -7px; } }
@keyframes float-b { 0%, 100% { translate: 0 0; } 50% { translate: 0 6px; } }
.hm-f1 { animation: float-a 4.5s ease-in-out infinite; }
.hm-f2 { animation: float-b 5.2s ease-in-out infinite .4s; }
.hm-f3 { animation: float-b 4.8s ease-in-out infinite .9s; }
.hm-f4 { animation: float-a 5.6s ease-in-out infinite 1.3s; }
.hm-fact { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
.hm-fact:hover { box-shadow: var(--shadow-hover); }

/* Buttons: lift */
.btn { position: relative; overflow: hidden; transition: transform .25s cubic-bezier(.3, 1.5, .5, 1), background-color .2s ease, border-color .2s ease, color .2s ease, box-shadow .2s ease; }
.btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.btn:active { transform: scale(.96); }

/* Nav and cards */
.nav-item { transition: color .2s ease, background-color .2s ease, transform .25s cubic-bezier(.3, 1.5, .5, 1); }
.nav-item:hover { transform: translateY(-1px); }
.card { transition: transform .35s cubic-bezier(.3, 1.4, .5, 1), box-shadow .35s ease, border-color .35s ease; }
.card:hover { transform: translateY(-4px) rotate(-.3deg); }

/* Small living details */
.eyebrow-hi::before, .status i { animation: pulse 2s ease-out infinite; }
.hero h1 .ln:nth-child(2) > span { color: var(--accent-ink); }

@media (prefers-reduced-motion: reduce) {
  .hm-blob, .hm-f1, .hm-f2, .hm-f3, .hm-f4,
  .eyebrow-hi::before, .status i { animation: none !important; }
  .btn:hover, .btn:active, .nav-item:hover, .card:hover { transform: none; }
}

/* ---------- Ladybug guide ---------- */
.lbug {
  position: fixed;
  right: 10px;
  top: 120px;
  z-index: 40;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  translate: var(--lbug-x, 0px) 0;
  transition: top .55s cubic-bezier(.3, 1, .4, 1), translate 1.3s ease-in-out, opacity .3s ease;
  -webkit-tap-highlight-color: transparent;
}
.lbug[hidden] { display: none; }
.lbug svg { display: block; width: 100%; height: 100%; overflow: visible; transition: transform .5s ease; filter: drop-shadow(0 3px 2px rgba(0, 0, 0, .25)); }
.lbug[data-dir="down"] svg { transform: rotate(180deg); }
@media (hover: hover) and (pointer: fine) { .lbug:hover svg { transform: scale(1.12) rotate(var(--lbug-rot, 0deg)); } }
.lbug[data-dir="down"] { --lbug-rot: 180deg; }
.lbug[data-dir="left"] svg { transform: rotate(-90deg); }
.lbug[data-dir="right"] svg { transform: rotate(90deg); }
.lbug[data-dir="left"] { --lbug-rot: -90deg; }
.lbug[data-dir="right"] { --lbug-rot: 90deg; }
.lbug:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; border-radius: 50%; }
.lbug .lbug-leg { transform-box: fill-box; transform-origin: center; }
.lbug.is-walking .lbug-leg-a { animation: lbug-leg .22s ease-in-out infinite alternate; }
.lbug.is-walking .lbug-leg-b { animation: lbug-leg .22s ease-in-out infinite alternate-reverse; }
@keyframes lbug-leg { from { transform: rotate(-14deg); } to { transform: rotate(14deg); } }
.lbug .lbug-wing { transform-box: fill-box; transform-origin: 50% 0; }
.lbug.is-flutter .lbug-wing-l { animation: lbug-wing-l .5s ease-in-out 2; }
.lbug.is-flutter .lbug-wing-r { animation: lbug-wing-r .5s ease-in-out 2; }
@keyframes lbug-wing-l { 50% { transform: rotate(-18deg); } }
@keyframes lbug-wing-r { 50% { transform: rotate(18deg); } }
.lbug .lbug-ant { transform-box: fill-box; transform-origin: 50% 100%; animation: lbug-ant 2.4s ease-in-out infinite; }
@keyframes lbug-ant { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }

.lbug-tip {
  position: absolute;
  right: 52px;
  top: 50%;
  transform: translateY(-50%) scale(.85);
  transform-origin: right center;
  padding: .45rem .8rem;
  background: var(--btn-bg);
  color: var(--btn-text);
  font: 700 .82rem/1.2 var(--sans);
  white-space: nowrap;
  border-radius: 999px;
  box-shadow: var(--shadow);
  opacity: 0;
  pointer-events: none;
  transition: opacity .25s ease, transform .3s cubic-bezier(.3, 1.5, .5, 1);
}
.lbug-tip::after {
  content: "";
  position: absolute;
  right: -5px; top: 50%;
  width: 10px; height: 10px;
  margin-top: -5px;
  background: inherit;
  transform: rotate(45deg);
  border-radius: 2px;
}
.lbug.show-tip .lbug-tip { opacity: 1; transform: translateY(-50%) scale(1); }
/* Hover/focus tips only for real pointers. On touch screens :hover sticks after a tap,
   which kept the bubble stuck open (and changing text) while scrolling. */
@media (hover: hover) and (pointer: fine) {
  .lbug:hover .lbug-tip, .lbug:focus-visible .lbug-tip { opacity: 1; transform: translateY(-50%) scale(1); }
}
.lbug.show-tip { animation: lbug-hop .9s ease-in-out 3; }
@keyframes lbug-hop { 0%, 100% { margin-top: 0; } 35% { margin-top: -9px; } 60% { margin-top: 0; } 78% { margin-top: -4px; } }
.lbug.is-wander .lbug-ant { animation-duration: .5s; }

/* The tab the ladybug is pointing at gives a little wiggle and glow */
.nav-item.lbug-nudge { animation: lbug-nudge .9s ease-in-out 3; box-shadow: 0 0 0 3px var(--accent); }
@keyframes lbug-nudge { 0%, 100% { transform: translateY(0) rotate(0); } 25% { transform: translateY(-3px) rotate(-3deg); } 50% { transform: translateY(0) rotate(0); } 75% { transform: translateY(-3px) rotate(3deg); } }

@media (max-width: 640px) {
  .lbug { width: 36px; height: 36px; right: 4px; }
  .lbug-tip { right: 42px; font-size: .76rem; padding: .4rem .65rem; }
}
@media (prefers-reduced-motion: reduce) {
  .lbug, .lbug svg { transition: none; }
  .lbug .lbug-ant, .lbug.is-walking .lbug-leg, .lbug.is-flutter .lbug-wing, .lbug.show-tip, .nav-item.lbug-nudge { animation: none !important; }
}

/* ---------- Shirt color follows the theme: blue in dark mode, golden yellow in light mode ---------- */
.hm-me--light { display: none; }
:root[data-theme="light"] .hm-me.hm-me--light { display: block; }
:root[data-theme="light"] .hm-me.hm-me--dark { display: none; }
