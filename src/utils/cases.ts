import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type TagEntry = {
  slug: string;
  label: string;
  count: number;
};

export async function getPublishedCases() {
  return getCollection('blog').then((collection) =>
    collection
      .filter((post) => !post.data.draft)
      .sort((a, b) => b.id.localeCompare(a.id))
  );
}

export function buildTagIndex(
  posts: CollectionEntry<'blog'>[]
): TagEntry[] {
  const tagCounts = new Map<string, { count: number; label: string }>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tag.toLowerCase();
      const existing = tagCounts.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagCounts.set(slug, { count: 1, label: tag });
      }
    }
  }

  return [...tagCounts.entries()]
    .map(([slug, { count, label }]) => ({ slug, label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
