// src/scripts/search-bar.ts
import {
  filterEntries,
  highlightText,
  type SearchEntry,
} from './search-utils';

let cache: SearchEntry[] | null = null;
let outsideClickBound = false;

async function loadIndex(): Promise<SearchEntry[]> {
  if (cache) return cache;
  const res = await fetch('/search.json');
  cache = (await res.json()) as SearchEntry[];
  return cache;
}

function bindOutsideClick() {
  if (outsideClickBound) return;
  outsideClickBound = true;
  document.addEventListener('click', (event) => {
    document.querySelectorAll<HTMLElement>('[data-tf-search]').forEach((root) => {
      const results = root.querySelector<HTMLUListElement>('[data-tf-search-results]');
      if (results && !root.contains(event.target as Node)) {
        results.classList.add('hidden');
      }
    });
  });
}

function initSearchBar(root: HTMLElement) {
  if (root.dataset.tfSearchBound === '1') return;

  const input = root.querySelector<HTMLInputElement>('[data-tf-search-input]');
  const results = root.querySelector<HTMLUListElement>('[data-tf-search-results]');
  if (!input || !results) return;

  root.dataset.tfSearchBound = '1';

  const close = () => results.classList.add('hidden');

  const render = async () => {
    const entries = await loadIndex();
    const matches = filterEntries(entries, input.value).slice(0, 6);
    if (!input.value.trim()) {
      close();
      return;
    }
    if (matches.length === 0) {
      results.innerHTML =
        '<li class="px-4 py-3 tf-ui text-sm text-tf-text-muted">No matching cases.</li>';
      results.classList.remove('hidden');
      return;
    }
    const query = input.value;
    results.innerHTML = matches
      .map(
        (entry) =>
          `<li><a href="${entry.url}" class="tf-search-result"><span class="tf-search-result__title">${highlightText(entry.title, query)}</span><span class="tf-search-result__description">${highlightText(entry.description, query)}</span></a></li>`,
      )
      .join('');
    results.classList.remove('hidden');
  };

  const submit = () => {
    const q = input.value.trim();
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  input.addEventListener('focus', render);
  input.addEventListener('input', render);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submit();
    } else if (event.key === 'Escape') {
      close();
      input.blur();
    }
  });

  root.querySelector<HTMLButtonElement>('[data-tf-search-submit]')?.addEventListener('click', submit);
}

export function initSearchBars() {
  bindOutsideClick();
  document.querySelectorAll<HTMLElement>('[data-tf-search]').forEach(initSearchBar);
}

initSearchBars();
document.addEventListener('astro:page-load', initSearchBars);
