# uixandy.com

Astro + Pages CMS. Websites that small businesses maintain by chatting with their AI.

- `npm install`, `npm run dev`, `npm run build` (output `dist`)
- Rules: [`AGENTS.md`](./AGENTS.md)
- Staging: Vercel preview of branch `staging`. Production: deploybase.eu from `main`

## Pages

`/`, `/so-funktionierts/`, `/preise/`, `/website-check/`, `/beispiele/`, `/ueber-mich/`, `/wordpress-alternative/`, `/ratgeber/` (+ articles), `/impressum/`, `/datenschutz/`, `/agb/`.
Old Webflow URLs redirect (`/leistungen`, `/meine-methode`, `/kontakt`, `/uber-mich`).

## Placeholders before launch

Search the repo for `Platzhalter` / `PLATZHALTER`.

- [ ] Demo video (60 to 90 s) → `home.json > video.src` + poster
- [ ] Stripe Payment Links for both deposits → `site.json > booking`
- [ ] Cal.com 15-min link → `site.json > booking.calUrl`
- [ ] Testimonials with permission (Lovely Hair, Intecra, sikamedia) → `home.json > proof`
- [ ] Case screenshots, URLs and facts → `beispiele.json`
- [ ] Hosting cost per month → `home.json` FAQ
- [ ] Nanuk text check → `ueber-mich.json > personal`
- [ ] Datenschutz update (deploybase, Formspree, Stripe, Cal.com; remove Webflow, Cloudflare, Calendly, Google Analytics)
- [ ] AGB written and reviewed (required before taking deposits online)
- [ ] Confirm delivery times and "second half at Abnahme" in `packages.json` / `preise.json`
