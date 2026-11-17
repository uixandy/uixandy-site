# uixandy.com: agent guardrails

**Primary instructions for any LLM in this repo.** Read this file before edits.
Andy's personal German freelance brand. It sells Astro + Pages CMS websites that small businesses maintain by chatting with their own AI. The site itself is the live demo of that promise.

**Shared stack rules:** extend PagesCMS Astro (`wowdesign OS/references/frameworks/pagescms-astro/SHARED-AGENTS.md`). Brand locks below win.

Owner sessions through Claude Desktop or similar: also read [`CLIENT.md`](./CLIENT.md).

---

## Stack

| Layer | Choice |
|-------|--------|
| Site | Astro 7, static, `trailingSlash: "always"` |
| CMS | Pages CMS (`.pages.yml` → GitHub) |
| Production | GitHub `uixandy/uixandy-site` → deploybase.eu (Node 24, `npm run build`, output `dist`) |
| Staging | Vercel preview from branch `staging` (Hobby, non-commercial, staging only) |
| Form | Formspree (`site.json > booking.formEndpoint`) |
| Booking | Stripe Payment Links (50 % deposit) + Calendly 30 Min. Erstgespräch (`calUrl`). Client hours: `calClientUrl` (never on marketing CTAs) |
| Icons | Phosphor via `@phosphor-icons/core`, `src/components/Icon.astro` only |

Branches: work on `staging`. Never push `main` until Andy says ship.
GitHub account: `gh auth switch --user uixandy` before push, switch back to `wowdesign-andy` after.

---

## Brand (do not drift)

| Lock | Value |
|------|--------|
| Token prefix | `--ux-*` in `src/styles/tokens.css` |
| Colors | Navy `#004b76`, navy-deep `#002135`, teal `#00c3a0`, teal-ink `#00866f` (text on white) |
| Gradient | 120deg navy → teal (`--ux-gradient`) |
| Fonts | Plus Jakarta Sans (display), IBM Plex Sans (body) via `@fontsource` (`src/styles/fonts.css`). Not Outfit (wowdesign). |
| Logo | `src/components/Logo.astro` (official paths). No Lottie. CSS arm animation only |
| Claim | Ihre Website. Gepflegt per Chat mit Ihrer KI. |
| Primary CTA | Website-Check → `/website-check/` |
| Secondary CTA | 30 Min. Gespräch → `site.json > booking.calUrl` |
| Voice | German, **Sie**, plain language, no jargon (no "MCP", "Git", "Repo" in public copy) |
| Punctuation | No em dashes anywhere |
| NAP | Andreas Bittner, Tal 44, 80331 München, +49 156 787 356 32, info@uixandy.com |

Prices: Start 990 € netto (bis 6 Seiten + Formular), Individuell 1.490 € (mehr Seiten oder eine Zusatzfunktion), 2+ Funktionen / unklar = Gespräch. No shops. Change in `packages.json` + Website-Check `recommend()`.

---

## Design system

Do:
- Use existing components: `Section`, `SectionHead`, `PageHero`, `Button`, `FeatureCards`, `Steps`, `PackageCards`, `Faq`, `CtaBand`, `Comparison`, `Testimonials`, `VideoBlock`, `ChatDemo`, `LegalPage`
- One button component (`Button.astro`), variants primary / accent / ghost / light / ghost-light. On gradient or dark boxes: light (main action) + ghost-light (secondary)
- Reveal on scroll via `data-reveal`; respect reduced motion

Don't:
- Tailwind, a second CSS system, off-token hex, hand-drawn SVG icons
- Fake proof or metrics. Placeholders are marked `[Platzhalter]` until Andy supplies the real thing
- Visually hidden SEO text

---

## Content & CMS

All copy and images live in `src/data/` and `src/content/ratgeber/`. `.astro` files only compose.

**CMS sync lock:** any new editable field ⇒ JSON + `.pages.yml` in the same change, German label. Reuse the `components:` block in `.pages.yml` (cards, steps, faq, cta, compare, pageHero, icon). See `specs/patterns/cms-first-page.md`.

New icon: add it to `Icon.astro` map **and** to `components.icon` in `.pages.yml`.

## Ratgeber (weekly)

One German article per week in `src/content/ratgeber/<slug>.md`. Frontmatter: title, description, answer (40 to 60 words, shown as "Kurz gesagt"), pubDate, draft. Write for the business owner, answer the question in the first paragraph, cite sources. Not shared on Andy's personal LinkedIn.

## Working agreements

- Andy does not run terminal commands; the agent runs them
- `git pull` before edits that may conflict with Pages CMS commits
- Legal text: never invent. Datenschutz and AGB need a lawyer or generator review
