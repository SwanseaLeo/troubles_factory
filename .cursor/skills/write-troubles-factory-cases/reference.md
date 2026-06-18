# Case Writing Reference

Annotated patterns from existing Troubles Factory cases.

## Example frontmatter (error-fix case)

```yaml
---
title: "How to Fix Docker Logs Error: invalid character 'l' after object key:value pair"
pubDate: 05/29/2026 17:20
author: "Leo"
tags:
  - Docker
  - Linux
  - Troubleshooting
imgUrl: '../../assets/blog2.jpeg'
description: "Fix docker logs error \"invalid character 'l' after object key:value pair\" on Docker Engine 24.x/27.x by clearing corrupted json-file logs and configuring log rotation."
---
```

## Opening paragraph pattern

1. Show the symptom (quoted error or command)
2. Clarify what layer is failing (Docker, not the app)
3. Offer a one-line quick fix when possible

```markdown
When running `docker logs` or `docker compose logs`, Docker may fail before printing the container output and show this error:

\`\`\`bash
error from daemon in stream: Error grabbing logs: invalid character 'l' after object key:value pair
\`\`\`

This is usually a Docker log reading problem, not an exception thrown directly by your application code.

Quick fix: find the container log file with `docker inspect`, clear the corrupted `*-json.log` file, then run `docker logs` again.
```

## "Why it happens" section

Explain mechanism, then list causes as bullets:

```markdown
### Why docker logs invalid character after object key value pair happens

By default, Docker writes container `stdout` and `stderr` to a `json-file` log. Each log entry should be one valid JSON object per line:

\`\`\`json
{"log":"...","stream":"stdout","time":"..."}
\`\`\`

If one of those lines becomes corrupted, Docker can no longer parse the log file. Common causes include:

- A truncated log line
- Broken log rotation
- ...
```

## Step sections

Each step = one `###` heading + brief context + code block:

```markdown
### Clear the corrupted Docker json-file log

First, find the log file path for the affected container:

\`\`\`bash
docker inspect -f '{{.LogPath}}' <container_id_or_name>
\`\`\`

Then truncate the file:

\`\`\`bash
sudo truncate -s 0 "$(docker inspect -f '{{.LogPath}}' <container_id_or_name>)"
\`\`\`
```

Add a short note after destructive-ish steps explaining what is *not* affected.

## Long-tail keywords (no dedicated section)

Do not add a `### Long-tail searches this fix covers` heading or bullet list — it disrupts reading flow.

Instead, work query variants into natural places:

- **Headings** — `Why docker logs invalid character after object key value pair happens`
- **Opening paragraph** — repeat the exact error string once in context
- **FAQ questions** — `Is docker json-file log corruption the cause?`

## FAQ pattern

Questions as `####` headings — phrased as real searches:

```markdown
### FAQ

#### Is this caused by my application?

Usually no. The application may have written normal `stdout` or `stderr` logs, but Docker fails because the `json-file` log is corrupted.

#### Will truncating the log file stop the container?

No. It only clears the stored Docker log file. The running container is not removed.
```

## Guide-style case (no single error)

For conceptual or how-to topics, open with use-case bullets and a "short answer":

```markdown
## Supervisor Start Order: Wait for One Program to Be Ready Before Starting Another

Use this guide when you manage multiple Linux processes with **Supervisor 4.2.x** and need to start the second program only after the first program is really ready.

This is common for setups like:

- Start a backend API after a database proxy is ready
- Start a worker after a web service exposes a health check

The short answer: Supervisor can control **start order**, but it cannot natively guarantee **readiness order**.
```

## Comparison / explainer case

For "why can't I find X" topics:

```markdown
## Why You Cannot Find 5.15.0-139.149~20.04.1 on kernel.ubuntu.com Mainline

If you run `uname -r` on Ubuntu 20.04 and see a kernel like `5.15.0-139-generic`, then search kernel.ubuntu.com for `5.15.0-139.149~20.04.1`, you will not find it.

That is expected. Many admins first hit this when comparing **Ubuntu mainline kernel vs HWE kernel** numbering…

This guide explains:

- What Ubuntu Mainline Kernel publishes
- What `5.15.0-139.149~20.04.1` actually means
```
