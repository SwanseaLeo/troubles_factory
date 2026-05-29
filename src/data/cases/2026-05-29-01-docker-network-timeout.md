---
title: "How to Fix Docker Logs Error: invalid character 'l' after object key:value pair"
pubDate: 05/29/2026 17:20
author: "Leo"
tags:
  - Docker
  - Linux
  - Troubleshooting
imgUrl: '../../assets/blog2.jpeg'
description: "Fix docker logs error \"invalid character 'l' after object key:value pair\" by clearing corrupted json-file logs and enabling Docker log rotation."
---

## How to Fix Docker Logs Error: invalid character 'l' after object key:value pair

When running `docker logs` or `docker compose logs`, you may see an error like this:

```bash
error from daemon in stream: Error grabbing logs: invalid character 'l' after object key:value pair
```

This is usually a Docker log reading error, not an exception thrown directly by your application code.

Quick fix: find the container log file with `docker inspect`, truncate the corrupted log file, then run `docker logs` again.

### Why it happens

By default, Docker writes container `stdout` and `stderr` to a `json-file` log. Each log entry is expected to be one valid JSON object per line:

```json
{"log":"...","stream":"stdout","time":"..."}
```

If one of those lines becomes corrupted, Docker can no longer parse the log file. Common causes include:

- A truncated log line
- Broken log rotation
- Interrupted disk writes
- Manual edits to the Docker log file
- Docker daemon issues
- A full or unstable disk

When Docker reaches the malformed line, `docker logs` fails while parsing the file and reports the invalid character error.

In most cases, the container is still running normally. The failure happens when Docker tries to parse its own `json-file` log.

### Clear the corrupted log file

First, find the log file path for the affected container:

```bash
docker inspect -f '{{.LogPath}}' <container_id_or_name>
```

Then truncate the file:

```bash
sudo truncate -s 0 "$(docker inspect -f '{{.LogPath}}' <container_id_or_name>)"
```

After that, check the logs again:

```bash
docker logs <container_id_or_name>
```

This removes the corrupted log content but keeps the container itself.

### Restart or recreate the container

If the container state is also abnormal, restart it:

```bash
docker restart <container_id_or_name>
```

For Docker Compose, recreating the container is also an option:

```bash
docker compose down
docker compose up -d
```

Be careful with `docker compose down`: it removes containers, but it does not remove named volumes by default. If important data is stored inside the container filesystem instead of a volume, back it up before recreating the container.

### Prevent it with log rotation

To reduce the chance of oversized or corrupted log files, configure Docker log rotation:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

This configuration is usually placed in:

```bash
/etc/docker/daemon.json
```

Restart Docker after changing it. Existing containers usually need to be recreated before the new logging configuration applies to them.

### FAQ

#### Is this caused by my application?

Usually no. The application may have written normal `stdout` or `stderr` logs, but Docker fails because the `json-file` log is corrupted.

#### Will truncating the log file stop the container?

No. It only clears the stored Docker log file. The running container is not removed.
