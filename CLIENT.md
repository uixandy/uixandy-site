# uixandy.com: guide for the owner's AI

This site is maintained the same way uixandy sells it: the owner (Andy) writes to his AI what should change, the AI edits the content files and publishes.

Read [`AGENTS.md`](./AGENTS.md) first, then this file.

## Who does what

| Task | Who | How |
|------|-----|-----|
| Texts, photos, FAQs, prices, Ratgeber articles | Owner via chat or Pages CMS | `src/data/**/*.json`, `src/content/ratgeber/*.md` |
| Firmendaten, booking links, form endpoint | Owner | Pages CMS → **Firmendaten und Links** (`site.json`) |
| Layout, new sections, CSS, bugs | AI | Edit code and update `.pages.yml` in the same change |
| Deploy | Automatic | Push → host rebuilds |

## Rules for content edits

1. Change only the JSON or Markdown that holds the text. Do not hardcode copy in `.astro`.
2. Keep the voice: German, Sie, short sentences, no em dashes, no tech jargon.
3. Do not touch `value` keys in `website-check.json` (`pagesOptions`, `featuresOptions`, `timingOptions`). The package recommendation depends on them.
4. Prices live only in `packages.json`.
5. Replace a `[Platzhalter]` only with real, approved content. Never invent quotes, numbers or client names.
6. After a change, say in one sentence what changed and where it shows up.
