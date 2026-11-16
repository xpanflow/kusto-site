# 12 · Cloudflare Workers 发布准备

目标：完成可复核的静态制品、Workers 配置、GitHub 连接说明和用户手动发布交接。依赖：11 done。本阶段全程本地进行。

## 读取

[质量与发布规格](specs/05-quality-release.md)、[视觉检查](specs/06-visual-review.md)、QA 报告、[手动 TODO](../../../docs/manual-todo.md)。

## 子步骤

每完成一个编号子步骤，都按[逐步视觉检查](specs/06-visual-review.md)查看本地构建的中英文页面并记录截图，确认配置和文档变更未引入视觉回归。

### 12.1 静态资源配置

按规格创建 `wrangler.jsonc`，`assets.directory` 为 `./dist`，`not_found_handling` 为 `404-page`；静态站不设 `main` 或 SSR adapter。固定 Wrangler 开发依赖和 lockfile，核对与 Cloudflare 文档的兼容性。建议名称 `kusto-cargo-site`，最终名称由用户连接时确认。

构建后检查 `dist/index.html`、`dist/en/index.html`、`dist/404.html` 与必要资源；列表核对没有 prompts、密钥、源代码或测试数据意外进入 dist。

### 12.2 本地 Workers 路由预览

用 Wrangler 的本地预览方式检查 `/`、`/en/`、不存在路径返回 404、图片/CSS/JS 资源响应。若本地工具受限，记录具体错误并修复；不能用 Astro preview 的结果冒充 Workers 路由验收。再用真实浏览器看中英文桌面和手机页面，保存截图并目视确认 Workers 本地预览与 Astro 构建一致。

### 12.3 GitHub 连接和用户发布说明

创建 `docs/implementation/release-runbook.md`，给用户一份按顺序操作的手册：选择 Worker 名称/URL，填 `site.config.ts`，执行完整检查及 release build，用户推送 GitHub，Cloudflare 控制台连接仓库，设置 build command `npm run build:release` 与 deploy command `npx wrangler versions upload`，关闭不需要的 Preview，再由用户检查版本并手动激活。写清 Worker 名称必须匹配配置、默认 deploy 可能随 push 自动上线、版本上传与正式激活的区别。

用实际可用的本地工具验证步骤和命令格式，但不访问或配置账户，不运行任何远程版本上传/部署命令。准备检查清单和回退说明，不生成假公开 URL。

### 12.4 交接核对

更新 README 和手动 TODO，明确用户待填 Worker 名称/HTTPS origin、表单接收端、GitHub 连接、手动激活与线上验收。完成一次最后的本地视觉回归和截图记录；当前外部条件缺失时清楚注明 release build 尚未可能通过。

## 产物与验收

- `wrangler.jsonc`、固定依赖/lockfile、Workers 本地 2 路由+404 结果、逐步视觉证据。
- 发布手册可由用户按步骤执行，自动发布默认项已明确替换为 `versions upload`。
- README/手动 TODO 与 Cloudflare 方案一致；无 Lightsail/Nginx 当作初版目标的指令。
- 不 push、不连接 GitHub/Cloudflare、不上传版本、不激活部署。
- 01–12 均通过后可记录“本地实现与 Cloudflare 手动发布准备完成”；13 仍交给用户。

## 断点

记录 `12.1`–`12.4` 的命令、截图、实际观察、仍需用户提供的值。结束后停在 `13.1 用户手动发布`，不能为了完成进度而自行上线。
