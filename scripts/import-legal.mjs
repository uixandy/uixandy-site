// One-off: converts the legal HTML from the old Webflow export into CMS JSON.
// Usage: node scripts/import-legal.mjs <impressum.html> <datenschutz.html>
import { readFile, writeFile } from "node:fs/promises";

const clean = (html) =>
  html
    .replace(/<h1>[\s\S]*?<\/h1>\s*(<\/p>)?/i, "")
    .replace(/<p>\s*(<h[2-4][^>]*>)/gi, "$1")
    .replace(/(<\/h[2-4]>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*<p>/gi, "<p>")
    .replace(/<\/p>\s*<\/p>/gi, "</p>")
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/\s*\n\s*/g, "\n")
    .trim();

const [impressumPath, datenschutzPath] = process.argv.slice(2);

const impressum = clean(await readFile(impressumPath, "utf8"));
await writeFile(
  "src/data/pages/impressum.json",
  JSON.stringify(
    {
      seoTitle: "Impressum | uixandy",
      seoDescription: "Impressum von uixandy, Andreas Bittner, München.",
      heading: "Impressum",
      notice: "",
      bodyHtml: impressum,
    },
    null,
    2,
  ) + "\n",
);

const datenschutz = clean(await readFile(datenschutzPath, "utf8"));
await writeFile(
  "src/data/pages/datenschutz.json",
  JSON.stringify(
    {
      seoTitle: "Datenschutzerklärung | uixandy",
      seoDescription: "Datenschutzerklärung von uixandy.",
      heading: "Datenschutzerklärung",
      notice:
        "[Platzhalter] Dieser Text stammt von der alten Website und muss vor dem Launch aktualisiert werden: Hosting (deploybase.eu statt Webflow und Cloudflare), Formspree (Website-Check), Stripe (Anzahlung), Cal.com (statt Calendly). Google Analytics und Cookie-Hinweise entfernen, die neue Website setzt keine Tracking-Cookies.",
      bodyHtml: datenschutz,
    },
    null,
    2,
  ) + "\n",
);

console.log("legal imported", impressum.length, datenschutz.length);
