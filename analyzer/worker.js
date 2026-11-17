/**
 * uixandy Website-Analyzer (Cloudflare Worker)
 * GET /?url=www.example.de -> JSON with system, page count, features, load-time score.
 * Results are a first estimate only; the website check states that we verify everything.
 * Deploy: see analyzer/README.md
 */

const ALLOWED_ORIGINS = [
  "https://www.uixandy.com",
  "https://uixandy.com",
  "http://localhost:4321",
];
const ALLOWED_ORIGIN_PATTERN = /^https:\/\/uixandy-site[a-z0-9-]*\.vercel\.app$/;

const UA = "Mozilla/5.0 (compatible; uixandy-website-check/1.0; +https://www.uixandy.com/website-check/)";
const CACHE_SECONDS = 60 * 60 * 24;

const CMS = [
  { id: "wordpress", label: "WordPress", test: /wp-content|wp-includes|<meta name="generator" content="WordPress/i },
  { id: "wix", label: "Wix", test: /static\.wixstatic\.com|wix\.com website builder|_wixCssImports/i },
  { id: "jimdo", label: "Jimdo", test: /jimdo(cdn|site)?\.com|jimdo-/i },
  { id: "squarespace", label: "Squarespace", test: /squarespace\.com|static1\.squarespace/i },
  { id: "webflow", label: "Webflow", test: /data-wf-site|webflow\.com|website-files\.com/i },
  { id: "shopify", label: "Shopify", test: /cdn\.shopify\.com|Shopify\.theme/i },
  { id: "ionos", label: "IONOS Baukasten", test: /mywebsite-editor|ionos\.(de|com)\/website/i },
  { id: "typo3", label: "TYPO3", test: /typo3(conf|temp)?\//i },
  { id: "joomla", label: "Joomla", test: /\/media\/jui\/|content="Joomla/i },
  { id: "strato", label: "STRATO Baukasten", test: /strato-editor|sitebuilder\.strato/i },
];

const FEATURES = [
  { id: "blog", url: /\/(blog|ratgeber|news|aktuelles|magazin|beitraege|artikel)(\/|$)/i, html: /<article[\s>]/i },
  { id: "jobs", url: /\/(karriere|jobs?|stellen(angebote)?|ausbildung)(\/|$)/i },
  { id: "termine", html: /calendly\.com|etermin\.net|doctolib|treatwell|shore\.com|timify|termin(e)?\s*(online\s*)?buchen/i },
  // Need a real shop signal. Bare "woocommerce" in theme CSS is a common false positive.
  {
    id: "shop",
    url: /\/(shop|store|warenkorb|cart|checkout)(\/|$)/i,
    html: /cdn\.shopify\.com|add-to-cart|in den warenkorb|woocommerce-cart|wc-block-cart|product_type_|data-product_id/i,
  },
  { id: "login", url: /\/(login|mitglieder|member|konto|account)(\/|$)/i },
];

const json = (data, status, origin) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${status === 200 ? CACHE_SECONDS : 60}`,
      ...cors(origin),
    },
  });

const cors = (origin) => {
  const ok = origin && (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGIN_PATTERN.test(origin));
  return ok ? { "access-control-allow-origin": origin, vary: "Origin" } : {};
};

const normalize = (input) => {
  let raw = String(input || "").trim();
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  try {
    const url = new URL(raw);
    if (!/^https?:$/.test(url.protocol)) return null;
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname)) return null;
    if (/^(localhost|.*\.local|.*\.internal)$/i.test(url.hostname)) return null;
    return new URL(`${url.protocol}//${url.hostname}/`);
  } catch {
    return null;
  }
};

const get = async (url, ms = 8000) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  const started = Date.now();
  try {
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,application/xml;q=0.9,*/*;q=0.8" }, redirect: "follow", signal: ctrl.signal });
    const ttfb = Date.now() - started;
    const text = res.ok ? (await res.text()).slice(0, 2_000_000) : "";
    return { ok: res.ok, url: res.url, text, timing: { ttfb, total: Date.now() - started, bytes: text.length } };
  } catch {
    return { ok: false, url: String(url), text: "", timing: null };
  } finally {
    clearTimeout(timer);
  }
};

const locs = (xml) => Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi), (m) => m[1]);

const isPage = (u) => !/\.(jpe?g|png|gif|webp|svg|pdf|zip|mp4|xml)(\?|$)/i.test(u);

/** Prefer WP page sitemaps. Posts/authors/categories inflate "Seiten" and are not package pages. */
const isPageSitemap = (u) => /page[-_]?sitemap|wp-sitemap-pages|pages[-_]?sitemap/i.test(u);
const isNoiseSitemap = (u) =>
  /(image|video|attachment|author|tag|category|kategorie|post[-_]?sitemap|wp-sitemap-posts|news[-_]?sitemap)/i.test(u);

const sitemapUrls = async (origin) => {
  const robots = await get(new URL("/robots.txt", origin), 5000);
  const declared = Array.from(robots.text.matchAll(/^sitemap:\s*(\S+)/gim), (m) => m[1]);
  const candidates = [...new Set([...declared, `${origin}sitemap.xml`, `${origin}sitemap_index.xml`, `${origin}wp-sitemap.xml`])];

  for (const sm of candidates.slice(0, 4)) {
    const res = await get(sm, 6000);
    if (!res.ok || !/<(urlset|sitemapindex)/i.test(res.text)) continue;
    if (/<sitemapindex/i.test(res.text)) {
      const children = locs(res.text);
      const pageOnly = children.filter(isPageSitemap);
      const usable = (pageOnly.length ? pageOnly : children.filter((u) => !isNoiseSitemap(u))).slice(0, 8);
      const nested = await Promise.all(usable.map((c) => get(c, 6000)));
      return nested.flatMap((n) => (n.ok ? locs(n.text) : [])).filter(isPage);
    }
    return locs(res.text).filter(isPage);
  }
  return [];
};

const linkUrls = (html, origin) =>
  Array.from(html.matchAll(/href=["']([^"'#]+)["']/gi), (m) => {
    try {
      const u = new URL(m[1], origin);
      return u.hostname === origin.hostname ? u.pathname : null;
    } catch {
      return null;
    }
  }).filter(Boolean);

/** Always-available estimate from our own fetch (Google PSI often fails without a key). */
const speedFromTiming = (timing) => {
  if (!timing) return null;
  let score = 100;
  if (timing.ttfb > 1200) score -= 40;
  else if (timing.ttfb > 600) score -= 25;
  else if (timing.ttfb > 300) score -= 12;
  if (timing.total > 3500) score -= 35;
  else if (timing.total > 1800) score -= 20;
  else if (timing.total > 900) score -= 10;
  if (timing.bytes > 1_500_000) score -= 20;
  else if (timing.bytes > 700_000) score -= 10;
  return {
    score: Math.max(5, Math.min(100, score)),
    ttfbMs: timing.ttfb,
    totalMs: timing.total,
    source: "fetch",
  };
};

const pageSpeed = async (url, key) => {
  if (!key) return null;
  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", "mobile");
  api.searchParams.set("category", "performance");
  api.searchParams.set("key", key);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(api, { signal: ctrl.signal });
    if (!res.ok) return null;
    const data = await res.json();
    const score = data?.lighthouseResult?.categories?.performance?.score;
    const lcp = data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.numericValue;
    return typeof score === "number"
      ? { score: Math.round(score * 100), lcpSeconds: lcp ? Math.round(lcp / 100) / 10 : null, source: "pagespeed" }
      : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const analyze = async (origin, env) => {
  const home = await get(origin);
  if (!home.ok) return { reachable: false, host: origin.hostname };
  // Fetch timing first (always available after a successful home GET). PSI only when PSI_KEY is set.
  const speed = (await pageSpeed(origin.toString(), env?.PSI_KEY)) || speedFromTiming(home.timing);

  const finalOrigin = new URL(home.url);
  const html = home.text;
  const sitemap = await sitemapUrls(new URL(`${finalOrigin.protocol}//${finalOrigin.hostname}/`));
  const links = linkUrls(html, finalOrigin);
  const paths = [...new Set([...sitemap.map((u) => { try { return new URL(u).pathname; } catch { return u; } }), ...links])];

  const cms = CMS.find((c) => c.test.test(html));
  const hreflangs = new Set(Array.from(html.matchAll(/hreflang=["']([a-z]{2})/gi), (m) => m[1].toLowerCase()));
  const langPaths = new Set(paths.map((p) => p.match(/^\/(en|de|fr|it|es|nl|pl|tr)(\/|$)/i)?.[1]?.toLowerCase()).filter(Boolean));
  const languages = Math.max(hreflangs.size, langPaths.size, 1);

  const features = FEATURES.filter((f) => (f.url && paths.some((p) => f.url.test(p))) || (f.html && f.id !== "blog" && f.html.test(html))).map((f) => f.id);
  if (languages > 1) features.push("sprachen");

  const pageCount = sitemap.length ? sitemap.length : null;
  const navCount = new Set(links.filter((p) => p !== "/" && !/\.(jpe?g|png|pdf|webp|svg)$/i.test(p)).map((p) => p.replace(/\/$/, ""))).size;

  return {
    reachable: true,
    host: finalOrigin.hostname,
    https: finalOrigin.protocol === "https:",
    cms: cms ? { id: cms.id, label: cms.label } : null,
    pages: pageCount,
    pagesSource: pageCount ? "sitemap" : "links",
    linkedPages: navCount,
    languages,
    features,
    speed,
  };
};

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("origin");
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: { ...cors(origin), "access-control-allow-methods": "GET", "access-control-max-age": "86400" } });
    }
    if (request.method !== "GET") return json({ error: "method" }, 405, origin);

    const target = normalize(new URL(request.url).searchParams.get("url"));
    if (!target) return json({ error: "url" }, 400, origin);

    const bypass = request.headers.get("cache-control")?.includes("no-cache") || new URL(request.url).searchParams.has("fresh");
    const cacheKey = new Request(`https://analyzer.cache/v5/${target.hostname}`);
    const cache = caches.default;
    if (!bypass) {
      const hit = await cache.match(cacheKey);
      if (hit) {
        const body = await hit.text();
        let cached = null;
        try {
          cached = JSON.parse(body);
        } catch {
          cached = null;
        }
        // Drop stale entries that never stored a load-time score
        if (cached?.reachable && cached?.speed?.score == null) {
          ctx.waitUntil(cache.delete(cacheKey));
        } else {
          return new Response(body, { headers: { "content-type": "application/json; charset=utf-8", ...cors(origin) } });
        }
      }
    }

    const result = await analyze(target, env);
    const response = json(result, 200, origin);
    if (result.reachable && result.speed?.score != null) ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  },
};
