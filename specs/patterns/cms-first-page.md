# Pattern — CMS-first page (hard lock)

The client is **not a coder**. They edit copy and images only in **Pages CMS**.  
Any design/layout change that introduces new editable content **must** ship with matching CMS fields in the same change.

## For every public route

1. `src/data/pages/<name>.json` with `seoTitle` + `seoDescription`
2. Fields wired in `.pages.yml` (German labels, clear descriptions)
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
