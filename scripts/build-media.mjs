// One-off media prep: resizes source photos from src/assets/brand into public/media
// and renders the default social image. Run: node scripts/build-media.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const src = "src/assets/brand";
const out = "public/media";

await sharp(`${src}/andy-portrait-source.jpg`)
  .resize(900, 900, { fit: "cover", position: "top" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(`${out}/andy-bittner.jpg`);

await sharp(`${src}/andy-nanuk-source.jpg`)
  .resize(900, 1200, { fit: "cover" })
  .webp({ quality: 78 })
  .toFile(`${out}/andy-nanuk.webp`);

await sharp(`${src}/favicon-source.png`).resize(32, 32).png().toFile("public/favicon.png");
await sharp(`${src}/favicon-source.png`).resize(180, 180).png().toFile("public/apple-touch-icon.png");

const logo = await readFile(`${src}/uixandy-next-black.svg`, "utf8");
const logoPaths = logo.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replaceAll('fill="black"', "");

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#002135"/>
      <stop offset="0.6" stop-color="#004B76"/>
      <stop offset="1" stop-color="#00A88E"/>
    </linearGradient>
    <radialGradient id="glow" cx="1050" cy="80" r="520" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#00C3A0" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#00C3A0" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g fill="#ffffff" transform="translate(90 90) scale(0.9)">${logoPaths}</g>
  <text x="90" y="330" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700">Ihre Website. Gepflegt per Chat.</text>
  <text x="90" y="410" fill="#B9CDD6" font-family="Segoe UI, Arial, sans-serif" font-size="34">Ohne WordPress. Ohne Agentur für jede Kleinigkeit.</text>
  <rect x="90" y="470" width="360" height="64" rx="32" fill="#00C3A0"/>
  <text x="270" y="512" fill="#002135" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700">Start ab 990 €</text>
</svg>`;

await sharp(Buffer.from(og)).jpeg({ quality: 86, mozjpeg: true }).toFile(`${out}/og-default.jpg`);

console.log("media ready");
