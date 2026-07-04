// src/styles/design-system.ts
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type CardVariant = 'default' | 'elevated' | 'inset' | 'flat';

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

export type ContainerWidth = 'narrow' | 'content' | 'wide';

export type SearchFieldSize = 'default' | 'hero';

export function buttonClasses(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
  className = '',
) {
  return ['tf-btn', `tf-btn--${variant}`, `tf-btn--${size}`, className].filter(Boolean).join(' ');
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

export function containerClasses(width?: ContainerWidth, className = '') {
  return ['tf-container', width && `tf-container--${width}`, className].filter(Boolean).join(' ');
}

export function searchFieldClasses(size: SearchFieldSize = 'default', className = '') {
  return ['tf-search-field', `tf-search-field--${size}`, className].filter(Boolean).join(' ');
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
