import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const ratgeber = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ratgeber" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    answer: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ogImage: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { ratgeber };
