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

// Transparent cutout for OG (arms-crossed portrait, BG already removed)
await sharp(`${src}/andy-portrait-cutout.png`)
  .resize(520, null, { fit: "inside" })
  .png()
  .toFile(`${out}/andy-portrait-cutout.png`);

const ogBase = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#002135"/>
      <stop offset="0.55" stop-color="#004B76"/>
      <stop offset="1" stop-color="#00A88E"/>
    </linearGradient>
    <radialGradient id="glow" cx="980" cy="60" r="480" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#00C3A0" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#00C3A0" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g fill="#ffffff" transform="translate(72 72) scale(0.85)">${logoPaths}</g>
  <text x="72" y="290" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="700">Neue Website.</text>
  <text x="72" y="358" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="700">Danach pflegen per Chat.</text>
  <text x="72" y="430" fill="#B9CDD6" font-family="Segoe UI, Arial, sans-serif" font-size="30">Wir bauen. Sie ändern selbst. Ohne WordPress.</text>
  <rect x="72" y="480" width="340" height="60" rx="30" fill="#00C3A0"/>
  <text x="242" y="520" fill="#002135" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700">Website ab 990 €</text>
</svg>`;

const portrait = await sharp(`${src}/andy-portrait-cutout.png`)
  .resize({ height: 600, fit: "inside" })
  .png()
  .toBuffer({ resolveWithObject: true });

const portraitLeft = 1200 - portrait.info.width + 20;
const portraitTop = 630 - portrait.info.height + 10;

await sharp(Buffer.from(ogBase))
  .composite([{ input: portrait.data, left: portraitLeft, top: portraitTop }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(`${out}/og-default.jpg`);

console.log("media ready");
