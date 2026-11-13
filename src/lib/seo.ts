import site from "../data/site.json";
import { SITE_ORIGIN } from "./site-url";

export type PageSeo = {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};

export function absoluteUrl(path: string, siteOrigin = SITE_ORIGIN): string {
  if (!path) return siteOrigin;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = siteOrigin.replace(/\/$/, "");
  return path.startsWith("/") ? `${origin}${path}` : `${origin}/${path}`;
}

export function resolveSeo(
  page: PageSeo | undefined,
  fallbacks: { title?: string; description?: string; ogImage?: string } = {},
) {
  const title = page?.seoTitle || fallbacks.title || site.title;
  const description =
    page?.seoDescription || fallbacks.description || site.claim;
  const ogImage = absoluteUrl(
    page?.ogImage || fallbacks.ogImage || "/media/og-default.jpg",
  );
  return { title, description, ogImage };
}
