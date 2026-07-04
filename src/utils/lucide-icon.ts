// src/utils/lucide-icon.ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ICON_DIR = join(process.cwd(), 'node_modules/lucide-static/icons');

/** Curated Lucide icons used across the design system. */
export const lucideIconNames = [
  'search',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'arrow-up-right',
  'check',
  'check-circle',
  'circle-check',
  'shield-check',
  'badge-check',
  'alert-triangle',
  'alert-circle',
  'x',
  'x-circle',
  'copy',
  'external-link',
  'rss',
  'github',
  'twitter',
  'linkedin',
  'menu',
  'chevron-right',
  'chevron-down',
  'chevron-up',
  'clock',
  'calendar',
  'tag',
  'tags',
  'folder',
  'book-open',
  'file-text',
  'terminal',
  'cpu',
  'server',
  'container',
  'zap',
  'flame',
  'circle-dot',
  'info',
  'help-circle',
  'home',
  'layout-grid',
  'list',
  'filter',
  'refresh-cw',
  'download',
  'share-2',
  'mail',
  'message-circle',
] as const;

export type LucideIconName = (typeof lucideIconNames)[number];

const iconCache = new Map<string, string>();

export function isLucideIconName(name: string): name is LucideIconName {
  return (lucideIconNames as readonly string[]).includes(name);
}

export function getLucideIconSvg(name: string): string {
  const cached = iconCache.get(name);
  if (cached) return cached;

  const filePath = join(ICON_DIR, `${name}.svg`);
  const raw = readFileSync(filePath, 'utf-8');
  iconCache.set(name, raw);
  return raw;
}

export type IconTone = 'default' | 'muted' | 'brand' | 'success' | 'warning' | 'danger';

export function iconToneClass(tone: IconTone = 'default'): string {
  switch (tone) {
    case 'muted':
      return 'tf-icon--muted';
    case 'brand':
      return 'tf-icon--brand';
    case 'success':
      return 'tf-icon--success';
    case 'warning':
      return 'tf-icon--warning';
    case 'danger':
      return 'tf-icon--danger';
    default:
      return '';
  }
}

export function renderLucideIcon(
  name: string,
  options: {
    size?: number;
    className?: string;
    strokeWidth?: number;
    tone?: IconTone;
  } = {},
): string {
  const { size = 16, className = '', strokeWidth = 2, tone = 'default' } = options;
  const svg = getLucideIconSvg(name);

  const toneClass = iconToneClass(tone);
  const classes = ['tf-icon', toneClass, className].filter(Boolean).join(' ');

  return svg
    .replace('<svg', `<svg class="${classes}" width="${size}" height="${size}"`)
    .replace(/stroke-width="[^"]*"/, `stroke-width="${strokeWidth}"`);
}

/** Map legacy SocialIcon names to Lucide equivalents. */
export const socialLucideMap = {
  github: 'github',
  twitter: 'twitter',
  linkedin: 'linkedin',
  rss: 'rss',
  discord: 'message-circle',
} as const;
