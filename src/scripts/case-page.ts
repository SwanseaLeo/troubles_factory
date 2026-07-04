// src/scripts/case-page.ts
export function initCasePage() {
  initCaseToc();
  initCaseCodeCopy();
  initCaseMermaid();
  initCaseShare();
}

function initCaseToc() {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-case-toc-link]');
  const mobilePanel = document.querySelector<HTMLElement>('[data-case-mobile-toc-panel]');
  const mobileToggle = document.querySelector<HTMLButtonElement>('[data-case-mobile-toc-toggle]');

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', () => {
      const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      mobilePanel.hidden = expanded;
    });
  }

  const headingIds = [...navLinks].map((link) => link.getAttribute('href')?.slice(1)).filter(Boolean);
  const headings = headingIds
    .map((id) => document.getElementById(id ?? ''))
    .filter((el): el is HTMLElement => el !== null);

  if (headings.length === 0 || navLinks.length === 0) return;

  const setActive = (id: string) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target.id) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: '-20% 0px -65% 0px',
      threshold: [0, 0.25, 0.5, 1],
    },
  );

  for (const heading of headings) {
    observer.observe(heading);
  }

  if (headings[0]?.id) {
    setActive(headings[0].id);
  }
}

function initCaseCodeCopy() {
  const pres = document.querySelectorAll<HTMLPreElement>('.case-prose pre');
  for (const pre of pres) {
    if (pre.querySelector('.case-code-copy')) continue;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'case-code-copy tf-focus-ring';
    button.setAttribute('aria-label', 'Copy code');
    button.textContent = 'Copy';

    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code?.textContent ?? pre.textContent ?? '';
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied';
        window.setTimeout(() => {
          button.textContent = 'Copy';
        }, 1500);
      } catch {
        /* clipboard unavailable */
      }
    });

    pre.appendChild(button);
  }
}

async function initCaseMermaid() {
  const mermaidBlocks = document.querySelectorAll<HTMLElement>(
    'pre code.language-mermaid, code.language-mermaid',
  );
  if (mermaidBlocks.length === 0) return;

  const { default: mermaid } = await import('mermaid');
  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'strict',
  });

  for (const block of mermaidBlocks) {
    const parent = block.closest('pre') ?? block.parentElement;
    if (!parent) continue;

    const source = block.textContent ?? '';
    const container = document.createElement('div');
    container.className = 'mermaid not-prose';
    container.textContent = source;
    parent.replaceWith(container);
  }

  await mermaid.run({ nodes: document.querySelectorAll('.mermaid') });
}

function initCaseShare() {
  const copyBtn = document.querySelector<HTMLButtonElement>('[data-case-copy-link]');
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const label = copyBtn.querySelector('[data-case-copy-label]');
      if (label) {
        const original = label.textContent ?? 'Copy link';
        label.textContent = 'Copied';
        window.setTimeout(() => {
          label.textContent = original;
        }, 1500);
      }
    } catch {
      /* clipboard unavailable */
    }
  });

  const printBtn = document.querySelector<HTMLButtonElement>('[data-case-export-print]');
  printBtn?.addEventListener('click', () => {
    window.print();
  });
}

initCasePage();
document.addEventListener('astro:page-load', initCasePage);
