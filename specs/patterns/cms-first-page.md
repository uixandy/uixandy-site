# Pattern — CMS-first page (hard lock)

The client is **not a coder**. They edit copy and images only in **Pages CMS**.  
Any design/layout change that introduces new editable content **must** ship with matching CMS fields in the same change.

Stack for client sites: **Astro + Pages CMS + GitHub** (same as uixandy.com). Content stays in JSON/Markdown files.

## Sidebar shape (lock for client projects)

Mirror a simple GitCMS-style left nav in `.pages.yml` with `type: group`:

| Sidebar | What |
|---------|------|
| **Seiten** | Marketing/legal page files under `src/data/pages/` (optional nested **Rechtliches**) |
| **Ratgeber** (or Blog) | Markdown collection under `src/content/…` |
| **Website-Daten** | `site.json` (Navigation und Footer), `packages.json` / shared data |
| **Medien** | Comes from top-level `media:` (no extra content entry) |

German labels only. No English chrome labels for clients.

## SEO fields (bottom of every page)

Keep **flat** keys in JSON (`seoTitle`, `seoDescription`, optional `ogImage`) so Astro keeps reading the same paths. In `.pages.yml`, put them **last** in `fields` (after all content), with:

- `maxlength: 60` on title, `155` on description
- German `description` hints (Ideal 50–60 / 120–155 Zeichen)
- Do **not** nest under `seo: { … }` unless you also migrate every `.astro` reader

## For every public route

1. `src/data/pages/<name>.json` with `seoTitle` + `seoDescription`
2. Fields wired in `.pages.yml` (German labels, clear descriptions); SEO last
3. `.astro` imports JSON and passes props into section components — **no hardcoded marketing copy**
4. Shared lists stay in shared JSON + `.pages.yml` groups
5. Images → `public/media/` as `/media/…` only

No "hardcode now, CMS later."

## When design or layout changes

If you add, remove, rename, or relocate a text/image/CTA that a human should edit later:

| You must also | Where |
|---------------|--------|
| Add/update JSON fields + sample values | `src/data/**/*.json` |
| Add/update Pages CMS fields (labels in German) | `.pages.yml` |
| Keep `.astro` reading those fields | `src/pages/` · `src/components/` |
| Note the pattern if new | `specs/` |

If the change is pure CSS (spacing, color token, motion) with **no** new copy/images — CMS update not required.

## Checklist before commit

- [ ] Client can change every new headline, paragraph, alt, and image in Pages CMS without opening code
- [ ] New image fields use type `image` and `/media/…` paths
- [ ] `.pages.yml` labels make sense to a non-technical German speaker
- [ ] `npm run build` succeeds
