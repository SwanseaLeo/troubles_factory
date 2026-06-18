---
name: write-troubles-factory-cases
description: Writes Troubles Factory case articles in English following the project's existing case format, SEO conventions, and human technical writing style. Use when creating or editing case posts in src/data/cases/, writing troubleshooting guides, or when the user asks for case-style content for this site.
---

# Write Troubles Factory Cases

Write case articles for **Troubles Factory** — documented software issues and solutions. Language is **English only**.

Before writing, read 1–2 existing cases in `src/data/cases/` to match current tone and structure.

## File Location and Naming

- Path: `src/data/cases/YYYY-MM-DD-NN-kebab-slug.md`
- `NN` is a same-day sequence (`01`, `02`, …)
- Slug should include primary search terms (tool, error message, or task)

## Frontmatter

```yaml
---
title: "How to Fix …"   # or a clear question/statement with target keywords
pubDate: MM/DD/YYYY HH:MM
author: "Leo"
tags:
  - PrimaryTool
  - Linux
  - Troubleshooting
imgUrl: '../../assets/example.jpeg'
description: "One-sentence meta description with the error message, tool names, versions, and outcome."
---
```

Rules:
- `title` — include the exact error string or task users search for when possible
- `description` — 120–160 chars ideal; mirror search intent; name tools, versions, OS
- `tags` — 3–6 concrete tags (tool, OS, topic); include `Troubleshooting` when appropriate
- `imgUrl` — relative path under `src/assets/`; use **1200 × 600** images (2:1 aspect ratio) for the article hero

## Article Structure

Use this outline. Adapt sections to the topic; not every section is required.

```markdown
## [H2 title — matches or closely mirrors frontmatter title]

[Opening: state the symptom, who hits it, and when to use this guide. 2–4 sentences.]

[Optional: one-line quick fix or "short answer" if it helps impatient readers.]

### [Context section — versions, environments, prerequisites]

### [Why it happens / root cause]

### [Step-by-step fix — one H3 per major step]

### [Prevention or alternative approaches]  (optional)

### FAQ

#### [Question in natural search form?]

[Direct answer. 1–3 sentences.]
```

### Heading levels

| Level | Use for |
|-------|---------|
| `##` | Article title (once) |
| `###` | Major sections |
| `####` | FAQ questions only |

### Body content patterns

- Lead with the **symptom** (error message, command output, or user goal)
- Explain **why** before or alongside **how**
- Use imperative steps: "Find the log file", "Restart Docker"
- Include real commands in fenced code blocks (`bash`, `ini`, `json`, `yaml`)
- Call out caveats plainly: data loss risk, version mismatches, what this does *not* fix
- Mention specific versions (`Docker Engine 24.x`, `Supervisor 4.2.x`, `Ubuntu 22.04`)
- Link to official docs or repos when helpful

## SEO Guidelines

Integrate keywords naturally — never stuff.

1. **Title & H2** — primary keyword + error/task phrase
2. **First paragraph** — repeat the exact error or task once, in context
3. **Headings** — phrase as search queries where natural (`Why docker logs invalid character…`)
4. **Description field** — complete answer preview for SERP snippets
5. **FAQ** — 3–6 questions phrased how people ask Google
6. **Long-tail keywords** — weave common query variants into headings, body, and FAQ; do **not** add a dedicated "Long-tail searches" section (it breaks article flow)
7. **Named entities** — tool names, file paths, config files, version numbers
8. **Synonyms** — weave related terms in prose (`json-file log`, `container log`, `docker logs`)

Avoid: keyword lists without context, a standalone long-tail bullet section, duplicate H2/title wording in every paragraph, robotic "In this article we will…" openers.

## Human Writing Style

Sound like an experienced engineer explaining to a colleague — not a content farm.

**Do:**
- Be direct and specific ("Usually no.", "This is expected.")
- Acknowledge common misconceptions ("This is the part that often surprises people…")
- Use "you" for instructions; "this guide" for scope
- Vary sentence length; short sentences for warnings, longer for explanations
- State uncertainty honestly when it varies by environment

**Don't:**
- Use filler ("In today's fast-paced world…", "It is worth noting that…")
- Overuse bold or exclamation marks
- Write generic intros that could apply to any article
- Repeat the title verbatim in consecutive sentences

**Tone examples from existing cases:**

> When running `docker logs` or `docker compose logs`, Docker may fail before printing the container output and show this error:

> The short answer: Supervisor can control **start order**, but it cannot natively guarantee **readiness order**.

> That is expected. Many admins first hit this when comparing Ubuntu mainline kernel vs HWE kernel numbering…

## Checklist Before Finishing

- [ ] Frontmatter complete and `description` is SEO-ready
- [ ] H2 present; sections flow symptom → cause → fix → FAQ
- [ ] Commands are copy-pasteable with placeholders (`<container_id_or_name>`)
- [ ] FAQ answers real follow-up questions
- [ ] No dedicated "Long-tail searches" section — keywords live in prose, headings, and FAQ
- [ ] English throughout; no Chinese in published content
- [ ] Filename follows `YYYY-MM-DD-NN-slug.md` convention

## Additional Resources

- For a full annotated example, see [reference.md](reference.md)
- Schema: `src/content.config.ts`
- Existing cases: `src/data/cases/`
