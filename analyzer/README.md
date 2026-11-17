# uixandy-analyzer

Cloudflare Worker behind the Website-Check. Step 1 sends the visitor's URL, the Worker returns a quick, public-data-only read of the site:

- CMS (WordPress, Wix, Jimdo, Squarespace, Webflow, Shopify, IONOS, TYPO3, Joomla, STRATO)
- Page count from the sitemap (prefers WordPress `page-sitemap`; ignores posts/authors/categories), otherwise internal links on the homepage
- Features: blog, jobs, termine, shop, login, sprachen (shop needs cart/checkout signals, not leftover WooCommerce CSS)
- Load-time score: Google PageSpeed when a `PSI_KEY` secret is set, otherwise a reliable estimate from our own fetch timing

Results are cached per hostname for 24 hours.

- Live: `https://uixandy-analyzer.uixandy.workers.dev/?url=www.example.de`
- Cloudflare account: info@uixandy.com
- Frontend setting: `booking.analyzerUrl` in `src/data/site.json`. Empty value = Website-Check skips the analysis.
- **Free tier only.** Never enable Workers Paid or any other paid Cloudflare product without Andy's explicit approval.

## CORS

Allowed origins are in `ALLOWED_ORIGINS` and `ALLOWED_ORIGIN_PATTERN` at the top of `worker.js`: www.uixandy.com, uixandy.com, localhost:4321 and the Vercel staging previews. Add any new production domain there and redeploy.

## Redeploy

Either ask the agent to upload `worker.js` through the Cloudflare MCP (Workers script upload, module syntax, main module `worker.js`), or:

```
npx wrangler login
npx wrangler deploy worker.js --name uixandy-analyzer --compatibility-date 2026-11-01
```

## PageSpeed key (optional)

Without a key the Worker scores from fetch timing only (`speed.source: "fetch"`) and does not call Google. For Lighthouse scores, create a free PageSpeed Insights API key and set Worker secret `PSI_KEY`. Cache is `v5`; incomplete (null speed) results are not cached. `?fresh=1` or `Cache-Control: no-cache` bypasses cache.
