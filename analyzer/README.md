# uixandy-analyzer

Cloudflare Worker behind the Website-Check. Step 1 sends the visitor's URL, the Worker returns a quick, public-data-only read of the site:

- CMS (WordPress, Wix, Jimdo, Squarespace, Webflow, Shopify, IONOS, TYPO3, Joomla, STRATO)
- Page count from the sitemap (robots.txt, sitemap.xml, sitemap_index.xml, wp-sitemap.xml), otherwise internal links on the homepage
- Features: blog, jobs, termine, shop, login, sprachen
- Google PageSpeed mobile score (often `null` without an API key because of rate limits)

Results are cached per hostname for 24 hours.

- Live: `https://uixandy-analyzer.uixandy.workers.dev/?url=www.example.de`
- Cloudflare account: info@uixandy.com
- Frontend setting: `booking.analyzerUrl` in `src/data/site.json`. Empty value = Website-Check skips the analysis.

## CORS

Allowed origins are in `ALLOWED_ORIGINS` and `ALLOWED_ORIGIN_PATTERN` at the top of `worker.js`: www.uixandy.com, uixandy.com, localhost:4321 and the Vercel staging previews. Add any new production domain there and redeploy.

## Redeploy

Either ask the agent to upload `worker.js` through the Cloudflare MCP (Workers script upload, module syntax, main module `worker.js`), or:

```
npx wrangler login
npx wrangler deploy worker.js --name uixandy-analyzer --compatibility-date 2026-11-01
```

## PageSpeed key (optional)

Create a free Google PageSpeed Insights API key and add it as a Worker secret `PSI_KEY` to get the load-time row filled reliably. The Worker must then append `&key=${env.PSI_KEY}` to the PageSpeed request.
