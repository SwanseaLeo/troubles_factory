import type { CollectionEntry } from 'astro:content';
import { homeTechnologies, type HomeTechnology } from '../data/home-technologies';
import { buildTagIndex, type TagEntry } from './cases';

const OS_SLUGS = new Set(['linux', 'ubuntu', 'centos', 'rhel', 'debian', 'windows', 'macos']);

const FRAMEWORK_SLUGS = new Set([
  'docker',
  'pytorch',
  'onnx',
  'tensorrt',
  'opencv',
  'cuda',
  'ffmpeg',
  'cmake',
  'ros',
  'ros2',
  'nvidia',
  'yolo',
  'systemd',
  'supervisor',
  'deep learning',
  'computer vision',
]);

const ARCH_SLUGS = new Set(['amd64', 'arm64', 'x86_64', 'aarch64']);

const VERSION_PATTERN = /\b(?:v?\d+\.\d+(?:\.\d+)?(?:[x][\d]+)?|\d+\.x|opset\d+)\b/gi;

export type CaseDisplayMeta = {
  environment: string;
  framework: string;
  version: string;
  architecture: string;
};

export type TechnologyStat = HomeTechnology & {
  count: number;
  href: string;
};

export type HomeStats = {
  verifiedCases: number;
  versionCount: number;
  technologyCount: number;
  verifiedRate: string;
};

function slugify(value: string) {
  return value.toLowerCase();
}

export function extractVersions(posts: CollectionEntry<'blog'>[]) {
  const versions = new Set<string>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      if (VERSION_PATTERN.test(tag)) {
        VERSION_PATTERN.lastIndex = 0;
        versions.add(tag);
      }
    }

    const sources = [post.data.title, post.data.description];
    for (const source of sources) {
      const matches = source.match(VERSION_PATTERN) ?? [];
      for (const match of matches) {
        versions.add(match);
      }
    }
  }

  return [...versions].sort((a, b) => a.localeCompare(b));
}

export function buildFilterOptions(posts: CollectionEntry<'blog'>[]) {
  const frameworks = new Set<string>();
  const operatingSystems = new Set<string>();
  const architectures = new Set<string>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = slugify(tag);
      if (FRAMEWORK_SLUGS.has(slug)) frameworks.add(tag);
      if (OS_SLUGS.has(slug)) operatingSystems.add(tag);
      if (ARCH_SLUGS.has(slug)) architectures.add(tag);
    }

    const archMatches =
      `${post.data.title} ${post.data.description}`.match(/\b(?:amd64|arm64|x86_64|aarch64)\b/gi) ??
      [];
    for (const arch of archMatches) {
      architectures.add(arch.toLowerCase());
    }
  }

  return {
    versions: extractVersions(posts),
    frameworks: [...frameworks].sort((a, b) => a.localeCompare(b)),
    operatingSystems: [...operatingSystems].sort((a, b) => a.localeCompare(b)),
    architectures: [...architectures].sort((a, b) => a.localeCompare(b)),
  };
}

export function inferCaseMeta(post: CollectionEntry<'blog'>): CaseDisplayMeta {
  const osTags = post.data.tags.filter((tag) => OS_SLUGS.has(slugify(tag)));
  const frameworkTags = post.data.tags.filter((tag) => FRAMEWORK_SLUGS.has(slugify(tag)));

  const versionFromContent =
    post.data.title.match(VERSION_PATTERN)?.[0] ??
    post.data.description.match(VERSION_PATTERN)?.[0] ??
    post.data.tags.find((tag) => {
      VERSION_PATTERN.lastIndex = 0;
      return VERSION_PATTERN.test(tag);
    }) ??
    'Version-specific';

  const archFromContent =
    `${post.data.title} ${post.data.description}`
      .match(/\b(?:amd64|arm64|x86_64|aarch64)\b/i)
      ?.at(0)
      ?.toLowerCase() ?? 'Multi-arch';

  return {
    environment: osTags.length > 0 ? osTags.join(' · ') : 'Linux',
    framework:
      frameworkTags.length > 0 ? frameworkTags.join(' · ') : (post.data.tags[0] ?? 'General'),
    version: versionFromContent,
    architecture: archFromContent,
  };
}

export function buildTechnologyStats(posts: CollectionEntry<'blog'>[]): TechnologyStat[] {
  const tagIndex = buildTagIndex(posts);
  const tagCountBySlug = new Map(tagIndex.map((tag) => [tag.slug, tag.count]));

  return homeTechnologies.map((tech) => {
    const count = tech.tagSlugs.reduce((total, slug) => total + (tagCountBySlug.get(slug) ?? 0), 0);
    const primarySlug = tech.tagSlugs.find((slug) => tagCountBySlug.has(slug));
    return {
      ...tech,
      count,
      href: primarySlug ? `/cases/tags/${primarySlug}/` : '/cases/',
    };
  });
}

export function buildTrendingCases(posts: CollectionEntry<'blog'>[]) {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()).slice(0, 5);
}

export function buildHomeStats(posts: CollectionEntry<'blog'>[]): HomeStats {
  const technologyStats = buildTechnologyStats(posts);
  const versions = extractVersions(posts);

  return {
    verifiedCases: posts.length,
    versionCount: Math.max(versions.length, 1),
    technologyCount: technologyStats.filter((tech) => tech.count > 0).length,
    verifiedRate: posts.length > 0 ? '100%' : '—',
  };
}

export function buildPopularSearches(tags: TagEntry[]) {
  return tags.slice(0, 6).map((tag) => ({
    query: tag.label,
    label: tag.label,
  }));
}

export function formatVerifiedDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
