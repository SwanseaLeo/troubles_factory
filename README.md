# Troubles Factory

一个收集编程/工程问题并提供可落地解决方案的知识库站点，基于 [Astro](https://astro.build/) + Tailwind CSS 构建。

## 本地开发

```bash
pnpm install
pnpm dev
```

## 常用命令

```bash
pnpm lint
pnpm format
pnpm check
pnpm build
pnpm preview
```

## 部署（Cloudflare Pages）

构建产物目录：`dist`（见 `wrangler.toml`）。

```bash
pnpm build
pnpm deploy:cf
```
