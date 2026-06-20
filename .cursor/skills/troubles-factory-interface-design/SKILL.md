---
name: troubles-factory-interface-design
description: Design, review, and implement all user-facing interfaces for Troubles Factory. Use for any Astro component, page, layout, navigation, search, case list, case detail, responsive styling, accessibility, or visual-system change in this repository. Keep the product focused on quickly matching a technical problem to a reproducible, verified solution rather than presenting cases like forum threads or generic blog posts.
---

# Troubles Factory Interface Design

Treat Troubles Factory as a troubleshooting workbench and case index, not a
marketing site, community forum, or image-led blog.

## Start With Product Intent

Optimize every screen for this decision sequence:

1. **Match**: Is this the same symptom and environment?
2. **Assess**: Is the cause plausible and is the procedure safe?
3. **Apply**: What is the shortest reproducible fix?
4. **Verify**: What exact output proves it worked?
5. **Recover**: How can the user roll back or try an alternative?

Prefer information that increases confidence over decorative content.

Before editing, inspect the relevant page, its parent layout, shared components,
`src/content.config.ts`, and at least two cases in `src/data/cases/`. Preserve
existing Astro, TypeScript, Tailwind, font, and component conventions unless a
change has a concrete product benefit.

## Information Architecture

### Search and home

- Make search the primary action and support exact error strings, commands,
  tools, versions, operating systems, symptoms, and tags.
- Show useful recent cases below search, but do not let recency outrank match
  quality.
- Use suggestions based on real case data; avoid generic promotional copy.
- Explain the product difference through interface signals such as
  `Reproduced`, `Verified`, environment labels, and expected outputs rather
  than a large marketing hero.

### Case lists and search results

- Prefer dense, scannable rows or compact records over image-dominant cards.
- Make the entire result target clear and accessible.
- Show, in this order when data exists: title or exact error, symptom summary,
  environment, verification state, updated date, and tags.
- Keep screenshots secondary unless they help identify a visual symptom.
- Provide filtering for high-value facets such as tool, OS, version,
  environment, and verification state before adding more topic navigation.
- Keep titles readable; do not truncate the distinguishing error text too
  aggressively.

### Case detail

Put a compact case summary before long-form explanation:

- exact symptom or error
- affected and tested environments
- root cause in one or two sentences
- risk or downtime warning
- estimated procedure length when known
- verification status and last verified date

Then organize the procedure in this order:

1. Reproduce or confirm the symptom
2. Check prerequisites and backups
3. Apply numbered fix steps
4. Show expected output after meaningful commands
5. Run a final verification
6. Provide rollback, alternatives, and known non-matches

The quick fix may be visually prominent, but never detach a destructive command
from its warning or prerequisite. Keep the table of contents useful by showing
major sections only; do not flood it with every FAQ question or minor heading.

## Visual Direction

- Keep the interface quiet, technical, and utilitarian.
- Use neutral backgrounds, near-black text, blue for links and active
  navigation, green for verified success, amber for caution, and red only for
  destructive actions or failed verification.
- Preserve the Troubles Factory logo colors without turning the page into a
  multi-color theme.
- Use `Outfit` for compact display headings and `Poppins` for interface text
  when following the current codebase. Use a monospace stack for commands,
  errors, paths, versions, and output.
- Use borders, spacing, alignment, and typography for hierarchy. Avoid heavy
  drop shadows, oversized radii, decorative gradients, floating page-section
  cards, and image-first article grids.
- Keep cards at 8px radius or less. Do not nest cards.
- Use icons only when they improve scanning. Prefer the existing icon library
  or Lucide if introduced project-wide; do not draw one-off SVG controls.
- Use compact headings inside operational surfaces. Reserve large type for a
  true page title.

## Component Rules

- Reuse shared layouts and components before adding page-local duplicates.
- Introduce a component only when it represents a repeated semantic unit such
  as `VerificationBadge`, `EnvironmentList`, `CaseSummary`, or `CommandBlock`.
- Do not encode meaningful status with color alone; pair it with text and,
  where useful, an icon.
- Keep links visually distinct from static text.
- Use native controls and visible focus states. Every icon-only control needs
  an accessible name and tooltip.
- Keep code blocks horizontally scrollable on small screens and provide a copy
  action when commands are intended to be executed.
- Format dates for humans; never render raw JavaScript `Date.toString()` output.

## Responsive Behavior

- Design mobile as a complete troubleshooting workflow, not a collapsed desktop
  page.
- Replace persistent sidebars with a compact filter or contents control on
  small screens.
- Keep the primary search and case title visible without horizontal scrolling.
- Ensure tables and command output remain usable at 320px width.
- Avoid fixed heights for variable titles and descriptions.
- Test long error strings, long tool names, empty metadata, and many tags.

## Accessibility and Trust

- Maintain semantic heading order and one clear page `h1`.
- Meet WCAG AA contrast for text and controls.
- Support keyboard navigation, visible focus, reduced motion, and meaningful
  image alt text.
- Label external links and downloads appropriately.
- Distinguish `Reproduced`, `Verified`, `Community reported`, and `Unverified`;
  never imply proof the content does not have.
- Surface destructive commands, privilege requirements, data-loss risk, and
  rollback information before execution steps.

## Content Model Guidance

When a design needs structured metadata, extend `src/content.config.ts` rather
than parsing prose or inferring status from tags. Prefer optional fields first
so existing cases continue to build.

Useful future fields include:

```yaml
symptom: "Exact failure or user-visible behavior"
testedOn:
  - "Ubuntu 22.04"
  - "Docker Engine 27.x"
verificationStatus: "verified"
lastVerified: "2026-06-20"
risk: "low"
estimatedMinutes: 10
```

Do not add fields solely to decorate the UI. Each field must improve matching,
safety, reproducibility, or verification.

## Implementation Workflow

1. Inspect the current page at desktop and mobile widths.
2. State the user decision the change improves.
3. Make the smallest coherent change across schema, components, and styles.
4. Preserve unrelated work and avoid broad visual rewrites.
5. Run `pnpm check` and `pnpm build`.
6. Verify the affected pages in a browser at desktop and mobile widths.
7. Check overflow, focus, empty states, long content, and console errors.

Reject a visually polished result if it makes the final answer harder to find,
weakens warnings, hides environment differences, or lacks a verifiable success
state.
