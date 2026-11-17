# uixandy.com

Astro + Pages CMS. Websites that small businesses maintain by chatting with their AI.

- `npm install`, `npm run dev`, `npm run build` (output `dist`)
- Rules: [`AGENTS.md`](./AGENTS.md)
- Hosting: Vercel (Hobby), Function region Frankfurt (`fra1`). Staging = branch `staging` previews. Production = promote when shipping.

## Pages

`/`, `/so-funktionierts/`, `/preise/`, `/website-check/`, `/beispiele/`, `/ueber-mich/`, `/wordpress-alternative/`, `/ratgeber/` (+ articles), `/impressum/`, `/datenschutz/`, `/agb/`.
Old Webflow URLs redirect (`/leistungen`, `/meine-methode`, `/kontakt`, `/uber-mich`).

## Placeholders before launch

Search the repo for `Platzhalter` / `PLATZHALTER`.

- [ ] Demo video (hidden until `home.json > video.src` is set)
- [x] Stripe Payment Links (live, netto + Tax) + AGB checkbox + branding → `site.json > booking`
- [x] Calendly 30-Min. Erstgespräch → `site.json > booking.calUrl`
- [ ] Calendly Kunden-Sprechstunde → `site.json > booking.calClientUrl` (optional)
- [x] Testimonials: Ahmet, Anja, Wolfgang → `home.json > proof`
- [ ] Later: Wolfgang's Semmeleck as Beispiele case after Astro rebuild
- [x] Case screenshots: Lovely Hair, Intecra (live); sikamedia copy live, no URL until published
- [x] Hosting FAQ (deploybase / Vercel + Domain/E-Mail getrennt)
- [x] Personal photos kept; no dog name in copy
- [x] Datenschutz + AGB (no lawyer; keep improving as needed)
- [x] Ratgeber: KI-Bearbeiten, WordPress-Pflege-Kosten, Texte selbst ändern
- [ ] Ship: promote staging → Vercel production only when Andy says ship
