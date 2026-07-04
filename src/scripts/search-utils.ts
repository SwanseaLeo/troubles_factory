export type SearchEntry = {
  title: string;
  description: string;
  tags: string[];
  url: string;
};

export function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function filterEntries(entries: SearchEntry[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return entries.filter((e) => {
    const haystack = [e.title, e.description, ...e.tags].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightText(text: string, query: string) {
  const escaped = escapeHtml(text);
  const terms = [...new Set(query.trim().split(/\s+/).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  if (terms.length === 0) return escaped;

  return terms.reduce((result, term) => {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    return result.replace(regex, '<mark class="search-hit">$1</mark>');
  }, escaped);
}
