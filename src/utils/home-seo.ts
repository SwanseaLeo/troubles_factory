import type { CollectionEntry } from 'astro:content';
import { homeFaq } from '../data/home-faq';
import { extractVersions, type HomeStats, type TechnologyStat } from './home-data';

export type PopularVersionLink = {
  label: string;
  href: string;
};

export type HomeSeoContext = {
  siteUrl: string;
  canonicalUrl: string;
  title: string;
  description: string;
  posts: CollectionEntry<'blog'>[];
  technologies: TechnologyStat[];
  stats: HomeStats;
};

export function buildPopularTechnologies(technologies: TechnologyStat[]) {
  return [...technologies]
    .filter((tech) => tech.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function buildPopularVersionLinks(posts: CollectionEntry<'blog'>[]): PopularVersionLink[] {
  return extractVersions(posts).map((version) => ({
    label: version,
    href: `/search?q=${encodeURIComponent(version)}`,
  }));
}

export function buildLatestUpdatedCases(posts: CollectionEntry<'blog'>[]) {
  return [...posts].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 6);
}

export function buildHomeKeywords(
  posts: CollectionEntry<'blog'>[],
  technologies: TechnologyStat[],
) {
  const tagKeywords = posts.flatMap((post) => post.data.tags);
  const techKeywords = technologies.map((tech) => tech.label);
  const base = [
    'verified software troubleshooting',
    'production tested fixes',
    'version specific debugging',
    'reproducible software fixes',
    'Docker troubleshooting',
    'Linux troubleshooting',
    'NVIDIA troubleshooting',
    'TensorRT',
    'ONNX',
    'PyTorch',
  ];

  return [...new Set([...base, ...techKeywords, ...tagKeywords])].slice(0, 24).join(', ');
}

function absoluteUrl(siteUrl: string, path: string) {
  return new URL(path, siteUrl).toString();
}

export function buildHomeJsonLd(context: HomeSeoContext) {
  const { siteUrl, canonicalUrl, title, description, posts, technologies, stats } = context;

  const popularTechnologies = buildPopularTechnologies(technologies);
  const latestCases = buildLatestUpdatedCases(posts);

  const organization = {
    '@type': 'Organization',
    '@id': `${siteUrl}#organization`,
    name: 'TroubleFactory',
    alternateName: 'Troubles Factory',
    url: siteUrl,
    logo: absoluteUrl(siteUrl, '/logo_a.png'),
    sameAs: [absoluteUrl(siteUrl, '/feed.xml')],
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: siteUrl,
    name: 'TroubleFactory',
    description,
    publisher: { '@id': `${siteUrl}#organization` },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl(siteUrl, '/search')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const softwareApplication = {
    '@type': 'SoftwareApplication',
    '@id': `${siteUrl}#software`,
    name: 'TroubleFactory',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Troubleshooting knowledge base',
    operatingSystem: 'Web',
    url: canonicalUrl,
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Verified troubleshooting cases',
      'Version-specific fixes',
      'Reproducible procedures',
      'Production-tested validation',
    ],
    publisher: { '@id': `${siteUrl}#organization` },
  };

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: canonicalUrl,
      },
    ],
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    mainEntity: homeFaq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const latestCasesList = {
    '@type': 'ItemList',
    '@id': `${canonicalUrl}#latest-verified-cases`,
    name: 'Latest verified troubleshooting cases',
    itemListElement: latestCases.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: post.data.title,
      url: absoluteUrl(siteUrl, `/cases/${post.id}/`),
    })),
  };

  const technologyList = {
    '@type': 'ItemList',
    '@id': `${canonicalUrl}#popular-technologies`,
    name: 'Popular technologies',
    itemListElement: popularTechnologies.map((tech, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tech.label,
      url: absoluteUrl(siteUrl, tech.href),
    })),
  };

  const dataset = {
    '@type': 'Dataset',
    '@id': `${canonicalUrl}#knowledge-stats`,
    name: 'TroubleFactory knowledge statistics',
    description:
      'Aggregate statistics for verified troubleshooting cases, versions, and technologies.',
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'Verified cases',
        value: stats.verifiedCases,
      },
      {
        '@type': 'PropertyValue',
        name: 'Versions',
        value: stats.versionCount,
      },
      {
        '@type': 'PropertyValue',
        name: 'Technologies',
        value: stats.technologyCount,
      },
      {
        '@type': 'PropertyValue',
        name: 'Verified rate',
        value: stats.verifiedRate,
      },
    ],
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': canonicalUrl,
    url: canonicalUrl,
    name: title,
    description,
    isPartOf: { '@id': `${siteUrl}#website` },
    about: { '@id': `${siteUrl}#software` },
    breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
    inLanguage: 'en-US',
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      website,
      softwareApplication,
      webPage,
      breadcrumb,
      faqPage,
      latestCasesList,
      technologyList,
      dataset,
    ],
  };
}
