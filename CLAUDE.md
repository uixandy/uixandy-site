# uixandy-site — Migration Project

## What this is

Andy's old personal freelancing website at **uixandy.com**, currently live on Webflow. Migrating to a static deploy on Vercel.

- Language: German only
- No CMS — pure static pages + animations
- Personal brand (not wowdesign) — separate GitHub account: `uixandy`

---

## Current Status

**Waiting on:** Webflow export ZIP from Andy.

Export from Webflow: Site Settings → Export Code → Download ZIP (requires paid Webflow plan).

Once the ZIP is here, unzip into this folder and follow the steps below.

---

## Migration Plan

### 1. Unzip Webflow export here
Drop all exported files into `d:\Web Projects\uixandy-site\`. The export gives clean HTML/CSS/JS + assets — no build step needed.

### 2. Check for issues
- **Forms:** Any Webflow form won't work after migration. Rewire with Formspree or remove if unused.
- **Internal links:** Webflow sometimes exports links with `.html` extensions. Find-and-replace if needed.
- **Embeds/widgets:** If any page used a Webflow-hosted embed, review manually.

### 3. Create GitHub repo
- Account: `uixandy` (Andy's personal GitHub, used for non-wowdesign projects)
- Repo name: `uixandy-site`
- Push all files to `main`

### 4. Deploy to Vercel
- Connect `uixandy/uixandy-site` repo to Vercel (hobby tier, free)
- Framework preset: **Other** (static HTML — no build command, output dir = `.`)
- First deploy ~30 seconds

### 5. Point domain
- In Vercel: Settings → Domains → add `uixandy.com`
- Update DNS at registrar: A/CNAME to Vercel's values
- SSL auto-provisioned

### 6. Verify
- Run `vercel dev` locally to confirm all pages and animations work
- Check all internal links resolve
- After domain cutover: SSL, all pages, www vs. non-www redirect

---

## Tech notes

- Webflow Interactions 2.0 animations export as `webflow.js` — they work fully in a static deploy
- No framework, no build pipeline — just static files
- Vercel chosen over GitHub Pages: same tooling Andy uses for wowdesign, better CDN, cleaner DX
