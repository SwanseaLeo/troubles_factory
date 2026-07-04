import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

export type TagEntry = {
  slug: string;
  label: string;
  count: number;
};

const VERSION_PATTERN = /\b(?:v?\d+\.\d+(?:\.\d+)?(?:[x][\d]+)?|\d+\.x|opset\d+)\b/gi;

export async function getPublishedCases() {
  return getCollection('blog').then((collection) =>
    collection.filter((post) => !post.data.draft).sort((a, b) => b.id.localeCompare(a.id)),
  );
}

export function buildTagIndex(posts: CollectionEntry<'blog'>[]): TagEntry[] {
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

export function extractCaseVersions(post: CollectionEntry<'blog'>): string[] {
  const versions = new Set<string>();

  for (const tag of post.data.tags) {
    VERSION_PATTERN.lastIndex = 0;
    if (VERSION_PATTERN.test(tag)) versions.add(tag);
  }

  for (const source of [post.data.title, post.data.description]) {
    VERSION_PATTERN.lastIndex = 0;
    for (const match of source.match(VERSION_PATTERN) ?? []) {
      versions.add(match);
    }
  }

  return [...versions].sort((a, b) => a.localeCompare(b));
}

export function getRelatedCases(
  posts: CollectionEntry<'blog'>[],
  current: CollectionEntry<'blog'>,
  limit = 5,
) {
  const tagSet = new Set(current.data.tags.map((tag) => tag.toLowerCase()));

  const scored = posts
    .filter((post) => post.id !== current.id)
    .map((post) => ({
      post,
      score: post.data.tags.filter((tag) => tagSet.has(tag.toLowerCase())).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) => b.score - a.score || b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime(),
    )
    .slice(0, limit)
    .map((entry) => entry.post);

  if (scored.length > 0) return scored;

  return posts.filter((post) => post.id !== current.id).slice(0, limit);
}
