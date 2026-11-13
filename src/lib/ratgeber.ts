import { getCollection, type CollectionEntry } from "astro:content";

export type RatgeberEntry = CollectionEntry<"ratgeber">;

export const ratgeberHref = (entry: RatgeberEntry) => `/ratgeber/${entry.id}/`;

export async function getPublishedRatgeber(): Promise<RatgeberEntry[]> {
  const all = await getCollection("ratgeber", ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(date);
