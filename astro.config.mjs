// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  trailingSlash: "always",
  site: "https://www.uixandy.com",
  redirects: {
    "/leistungen": "/preise/",
    "/meine-methode": "/so-funktionierts/",
    "/kontakt": "/website-check/",
    "/uber-mich": "/ueber-mich/",
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(style-guide|danke|agb|datenschutz)\//.test(page),
    }),
  ],
});
