# KustoCargo · 途序

面向小微货代的双语产品介绍网站：中文 `/`，英文 `/en/`。Astro 静态输出，原生 CSS/TypeScript 与 GSAP 航线增强；托管到 Cloudflare Workers 静态资源。网站中的业务、AI、追踪及 MCP 都是明确标注的示例。

## 开发

使用 `.nvmrc` / `.node-version` 指定的 Node 24.22.3：

```bash
npm ci
npm run dev
```

云环境工具路径：`export PATH=/workspace/.onboarding-tools/node-v24.22.3-linux-x64/bin:$PATH`；受限用户目录可设置 `npm_config_cache=/workspace/.onboarding-tools/npm-cache`、`ASTRO_TELEMETRY_DISABLED=1`。现有 checkout 已隔离，无需额外 worktree。

```bash
npm run check
npm run format:check
npm test
npm run test:e2e
npm run build
npm run preview
npx wrangler dev --local --ip 127.0.0.1 --port 8787
```

浏览器测试使用 Chromium（默认 `/usr/bin/chromium`，可用 `CHROMIUM_PATH` 指定）；测试构建 `.test-site` 仅复制白名单源码与配置、链接现有依赖，隔离接收地址及正式 Formspree endpoint 均由 Playwright 拦截，无真实提交。不要发布 `.test-site/dist`。

唯一非秘密运行配置在 `site.config.ts`。当前正式域名为 `https://kusto.xpanflow.com`，表单通过 Formspree 发送（公开 endpoint，非 API 密钥）。本地开发也会加载真实提交配置，手工点击提交会产生真实申请。`npm run build:release` 要求真实域名和表单配置或用户明确的展示站豁免。

## 实施与交接

- [准确进度](.github/prompt/kusto-cargo/PROGRESS.md)
- [QA 报告](docs/implementation/qa-report.md)
- [逐步视觉证据](docs/implementation/visual-review.md)
- [素材来源](docs/design/assets.md)
- [Cloudflare 手动发布手册](docs/implementation/release-runbook.md)
- [用户待办](docs/manual-todo.md)

本次按用户另行授权提交并推送代码；正式发布仍由用户连接 Cloudflare 并手动激活版本。保留 Workers Builds 的 deploy command 为 `npx wrangler versions upload`，避免默认 push 自动上线行为。
