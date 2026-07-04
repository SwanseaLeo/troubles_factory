// src/scripts/search-page.ts
import {
  filterEntries,
  highlightText,
  type SearchEntry,
} from './search-utils';

function resultHtml(entry: SearchEntry, query: string) {
  const tags = entry.tags.map((tag) => highlightText(tag, query)).join(' · ');
  return `<li class="browse-case-item"><a href="${entry.url}" class="browse-case-item__link not-prose"><div class="browse-case-item__header"><div class="min-w-0"><p class="browse-case-item__title">${highlightText(entry.title, query)}</p><p class="browse-case-item__description">${highlightText(entry.description, query)}</p></div></div>${tags ? `<p class="browse-case-item__date mt-2">${tags}</p>` : ''}</a></li>`;
}

export async function initSearchPage() {
  const heading = document.querySelector<HTMLElement>('.browse-page-header__title');
  const meta = document.querySelector<HTMLElement>('[data-search-meta]');
  const results = document.querySelector<HTMLUListElement>('[data-search-results]');
  const input = document.querySelector<HTMLInputElement>('[data-tf-search-input]');
  if (!heading || !meta || !results) return;

  const query = new URLSearchParams(window.location.search).get('q') ?? '';
  if (input && query) input.value = query;

  heading.textContent = query ? `Results for "${query}"` : 'Search cases';

  if (!query.trim()) {
    meta.textContent = 'Enter a keyword above to search documented cases.';
    results.innerHTML = '';
    return;
  }

  const res = await fetch('/search.json');
  const entries = (await res.json()) as SearchEntry[];
  const matches = filterEntries(entries, query);

  meta.textContent = matches.length
    ? `About ${matches.length} ${matches.length === 1 ? 'result' : 'results'}`
    : `No results for "${query}"`;

  results.innerHTML = matches.length
    ? matches.map((entry) => resultHtml(entry, query)).join('')
    : '<li class="browse-search__empty">Try different error text, a tool name, or a topic tag.</li>';
}

initSearchPage();
document.addEventListener('astro:page-load', initSearchPage);
