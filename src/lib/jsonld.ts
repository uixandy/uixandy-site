import site from "../data/site.json";
import { absoluteUrl } from "./seo";
import { SITE_ORIGIN } from "./site-url";

export type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const PERSON_ID = `${SITE_ORIGIN}/#andy`;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: site.title,
    legalName: site.legalName,
    description: site.claim,
    url: `${SITE_ORIGIN}/`,
    email: site.email,
    telephone: site.phoneHref,
    logo: absoluteUrl("/favicon.svg"),
    image: absoluteUrl("/media/og-default.jpg"),
    priceRange: "990 € bis 1.490 €+",
    areaServed: [
      { "@type": "Country", name: "Deutschland" },
      { "@type": "Country", name: "Österreich" },
      { "@type": "Country", name: "Schweiz" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: "DE",
    },
    founder: { "@id": PERSON_ID },
  };
}

export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Andreas (Andy) Bittner",
    jobTitle: "Webdesigner und Entwickler",
    worksFor: { "@id": ORG_ID },
    image: absoluteUrl("/media/andy-bittner.jpg"),
    url: `${SITE_ORIGIN}/ueber-mich/`,
  };
}

export function webSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.title,
    url: `${SITE_ORIGIN}/`,
    description: site.claim,
    publisher: { "@id": ORG_ID },
    inLanguage: "de-DE",
  };
}

export function webPageJsonLd(opts: { title: string; description: string; url: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.title,
    description: opts.description,
    url: opts.url,
    isPartOf: { "@type": "WebSite", url: `${SITE_ORIGIN}/` },
    inLanguage: "de-DE",
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function servicesJsonLd(
  items: { name: string; price: string; tagline: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Website-Pakete",
    itemListElement: items.map((item) => ({
      "@type": "Offer",
      name: item.name,
      description: item.tagline,
      price: item.price.replace(/[^\d]/g, ""),
      priceCurrency: "EUR",
      seller: { "@id": ORG_ID },
    })),
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: Date;
  dateModified?: Date;
  image?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    datePublished: opts.datePublished.toISOString(),
    dateModified: (opts.dateModified ?? opts.datePublished).toISOString(),
    image: opts.image ? absoluteUrl(opts.image) : absoluteUrl("/media/og-default.jpg"),
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "de-DE",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function jsonLdScript(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data, null, 0).replace(/</g, "\\u003c");
}
