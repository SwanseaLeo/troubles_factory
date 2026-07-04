// src/styles/design-system.ts
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'brand' | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type CardVariant = 'default' | 'elevated' | 'inset' | 'flat' | 'brand';

export type TagTone = 'neutral' | 'blue' | 'gray' | 'green' | 'orange' | 'red' | 'yellow';

export type StatusVariant =
  | 'verified'
  | 'success'
  | 'reproduced'
  | 'documented'
  | 'community'
  | 'unverified'
  | 'caution'
  | 'warning'
  | 'danger';

export type ContainerWidth = 'narrow' | 'content' | 'wide' | 'max';

export type SearchFieldSize = 'default' | 'hero';

export type GridGap = 'sm' | 'md' | 'lg' | 'xl';

export type IconTone = 'default' | 'muted' | 'brand' | 'success' | 'warning' | 'danger';

export function buttonClasses(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
  className = '',
) {
  return ['tf-btn', `tf-btn--${variant}`, `tf-btn--${size}`, className].filter(Boolean).join(' ');
}

export function iconButtonClasses(size: ButtonSize = 'md', className = '') {
  return ['tf-btn', 'tf-btn--ghost', 'tf-btn--icon', `tf-btn--${size}`, className]
    .filter(Boolean)
    .join(' ');
}

export function cardClasses(variant: CardVariant = 'default', className = '') {
  return ['tf-card', `tf-card--${variant}`, className].filter(Boolean).join(' ');
}

export function tagClasses(
  tone: TagTone = 'neutral',
  options: { pill?: boolean } = {},
  className = '',
) {
  return ['tf-tag', `tf-tag--${tone}`, options.pill && 'tf-tag--pill', className]
    .filter(Boolean)
    .join(' ');
}

export function badgeClasses(variant: StatusVariant, className = '') {
  return ['tf-badge', `tf-badge--${variant}`, className].filter(Boolean).join(' ');
}

export function trustPillClasses(className = '') {
  return ['tf-trust-pill', className].filter(Boolean).join(' ');
}

export function containerClasses(width?: ContainerWidth, className = '') {
  return ['tf-container', width && `tf-container--${width}`, className].filter(Boolean).join(' ');
}

export function sectionClasses(options: { lg?: boolean } = {}, className = '') {
  return ['tf-section', options.lg && 'tf-section--lg', className].filter(Boolean).join(' ');
}

export function gridClasses(options: { gap?: GridGap; cols?: 2 | 3 | 4 } = {}, className = '') {
  const gapClass =
    options.gap === 'sm'
      ? 'tf-grid--sm'
      : options.gap === 'lg'
        ? 'tf-grid--lg'
        : options.gap === 'xl'
          ? 'tf-grid--xl'
          : '';
  const colsClass =
    options.cols === 2
      ? 'tf-grid-cols-2'
      : options.cols === 3
        ? 'tf-grid-cols-3'
        : options.cols === 4
          ? 'tf-grid-cols-4'
          : '';
  return ['tf-grid', gapClass, colsClass, className].filter(Boolean).join(' ');
}

export function searchFieldClasses(size: SearchFieldSize = 'default', className = '') {
  return ['tf-search-field', `tf-search-field--${size}`, className].filter(Boolean).join(' ');
}

export function navLinkClasses(active = false, className = '') {
  return ['tf-nav-link', 'tf-focus-ring', active && 'is-active', className]
    .filter(Boolean)
    .join(' ');
}

export function sidebarLinkClasses(
  options: { active?: boolean; muted?: boolean } = {},
  className = '',
) {
  return [
    'browse-nav-link',
    'tf-focus-ring',
    options.muted && 'browse-nav-link-muted',
    options.active && 'is-active',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function tocLinkClasses(active = false, className = '') {
  return ['tf-toc-link', 'tf-focus-ring', active && 'is-active', className]
    .filter(Boolean)
    .join(' ');
}

export function proseClasses(className = '') {
  return ['tf-prose', className].filter(Boolean).join(' ');
}

export function imageFrameClasses(
  options: { hero?: boolean; contain?: boolean } = {},
  className = '',
) {
  return [
    'tf-image-frame',
    options.hero && 'tf-image-frame--hero',
    options.contain && 'tf-image-frame--contain',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function listPanelClasses(className = '') {
  return ['tf-list-panel', className].filter(Boolean).join(' ');
}

export function listPanelRowClasses(className = '') {
  return ['tf-list-panel__row', 'not-prose', className].filter(Boolean).join(' ');
}

const tagTones: TagTone[] = ['blue', 'gray', 'green', 'orange', 'red', 'yellow'];

/** Deterministic accent tone for topic labels. */
export function tagToneFromLabel(label: string): TagTone {
  let hash = 0;
  for (const char of label.toLowerCase()) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return tagTones[hash % tagTones.length];
}
