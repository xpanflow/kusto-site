# Cloudflare Workers 手动发布手册

此仓库输出静态 Astro 网站。Agent 已验证本地资源与路由；本次用户另行授权将代码提交推送。尚未连接 Cloudflare 账户、上传版本或激活部署。

## 1. 当前公开配置与用户核查

2026-11-17：用户已提供并配置 `https://kusto.xpanflow.com` 与 Formspree `https://formspree.io/f/myewwkwl`，表单 remote/专用 formspree 适配器；无需密钥。以下为配置变更时的通用流程。

1. 确认 Worker 名称。`wrangler.jsonc` 当前建议 `kusto-cargo-site`，必须与控制台一致。
2. 在 `site.config.ts` 填写实际 HTTPS origin（无路径、查询或结尾斜杠），可为 workers.dev 或自定义域。不使用测试域名。
3. 准备表单 HTTPS 接收端、CORS、服务器校验、去重和通知，并补充隐私说明。协议见 `docs/manual-todo.md`。配置 `form.mode: 'remote'` 及 endpoint；仅用户明确选择先发布展示站时才能将 `release.allowDisabledForm` 改为 true。
4. 安装 Node `.node-version` 指定版本；运行 `npm ci`、`npm run check`、`npm run format:check`、`npm test`、`npm run test:e2e`、`npm run build:release`。未填域名时最后一项应失败，不能把预览构建当成正式制品。

## 2. 本地检查

`npm run dev` 开发，`npm run build` 后 `npm run preview` 检查静态产物。Workers 预览使用 `npx wrangler dev --local --ip 127.0.0.1 --port 8787`；检查 `/`、`/en/`、不存在路径的 404、资源、导航与手机布局。此命令不上传版本。受限机器可设置 `XDG_CONFIG_HOME` 到可写目录及 `WRANGLER_SEND_METRICS=false`。浏览器测试优先 `CHROMIUM_PATH`，云环境已安装 `/usr/bin/chromium`。

## 3. 用户连接 GitHub 与 Cloudflare

确认本次已推送到仓库的代码后，在 Cloudflare 控制台创建/选择匹配名称的 Worker，连接 GitHub 仓库及 main 分支，根目录为仓库根。Node 版本按 `.node-version` 配置。

- Build command：`npm run build:release`
- Deploy command：`npx wrangler versions upload`
- 无需分支预览时关闭 Preview builds。

默认 `wrangler deploy` 可能随 push 直接上线，须改为上述版本上传命令。版本上传只创建版本，不等于正式激活；用户检查构建日志、版本内容、公开 URL 和表单配置后，在控制台手动激活。首次创建时控制台可能提供 Save and Deploy，由用户审查操作。Agent 不执行这些远程命令。

## 4. 绑定子域名

确认 `xpanflow.com` 在同一 Cloudflare 账户内且 zone 有效。在 Worker 的 Settings → Domains & Routes → Add → Custom Domain 中输入 `kusto.xpanflow.com`，由 Cloudflare 按控制台提示管理 DNS 和 HTTPS 证书。若已有同名 DNS 记录，先核查用途再处理冲突。仅将域名写进 `site.config.ts` 不会创建 DNS、绑定 Worker 或签发证书。

Formspree 控制台确认表单激活/收件邮箱验证、通知渠道。如设置提交域名限制，允许 `kusto.xpanflow.com`。保持仅微信也可提交，不要把 email 设为单独必填。前端不包含收件邮箱或密钥，真实接收只能通过用户提交测试并在控制台/收件渠道核查。详见 `docs/manual-todo.md`。

## 5. 上线验收与回退

用户检查实际 HTTPS 地址的中英文、canonical/alternate、robots/sitemap、404、CSS/JS/分享图、手机导航及表单接收。remote 模式用合成申请验证真实通知，并按实际保留策略清理。中国/欧洲网络体验需上线后分别实测。

记录活动版本、时间、URL 和检查结果到 `release-record.md`。发现问题时在控制台将上一已验证版本恢复为活动部署，确认资源与表单配置一致，再重复验收。

## 依据与本次工具范围

- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/versions-and-deployments/
- https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/

本次直接获取官方网页返回 HTTP 403，未声称重新读取成功；配置依据仓库已给出的规范，并以固定 Wrangler 4.163.0 本地实际运行验证。Wrangler 本地 Request.cf 辅助信息获取失败后使用默认占位，静态路由仍实际通过；无 Worker 后端或地域逻辑依赖该字段。
