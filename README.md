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
- [x] Stripe Payment Links (live, netto + Tax) + branding/logo/invoice template → `site.json > booking`
- [x] Calendly 30-Min. Erstgespräch → `site.json > booking.calUrl`
- [ ] Calendly Kunden-Sprechstunde → `site.json > booking.calClientUrl` (create event, then paste URL)
- [ ] Testimonials with permission (Lovely Hair, Intecra, sikamedia) → `home.json > proof`
- [x] Case screenshots + URLs: Lovely Hair, Intecra (live); sikamedia preview only until approved → `beispiele.json`
- [ ] Case quotes with permission → `beispiele.json` + `home.json > proof`
- [ ] Hosting cost per month → `home.json` FAQ
- [ ] Nanuk text check → `ueber-mich.json > personal`
- [ ] Datenschutz update (deploybase, Formspree, Stripe, Calendly; remove Webflow, Google Analytics / old cookie text)
- [ ] AGB written and reviewed (required before taking deposits online)
- [ ] Confirm delivery times and "second half at Abnahme" in `packages.json` / `preise.json`
