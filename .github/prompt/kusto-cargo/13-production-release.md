# 13 · 用户手动连接 GitHub 并发布 Cloudflare Workers

本阶段由用户执行。Agent 的自主开发 prompt 在阶段 12 完成后停止，不登录账户、连接仓库、push、上传版本或激活正式部署。

## 用户准备

- 确定 Worker 名称和公开 HTTPS URL（`workers.dev` 或自有域名），使 `site.config.ts.siteUrl` 与其一致。
- 按[表单 TODO](../../../docs/manual-todo.md)配置真实接收端；若先发布展示站，明确保留 disabled 和对应提示。
- 确认仓库中的 `wrangler.jsonc` 名称与 Cloudflare 控制台 Worker 名称相同。

## 用户手动步骤

### 13.1 本地发布预检

按阶段 12 生成的 `docs/implementation/release-runbook.md` 核对 `npm run check`、格式、测试、完整浏览器/视觉验收、`npm run build:release`。若真实地址尚未知，先在控制台确定 Worker 地址，再更新配置并重新构建。不得把 noindex 的本地预览构建当正式版本。

### 13.2 GitHub 和 Workers Builds 连接

用户将审核后的代码推送到自己的 GitHub 仓库，在 Cloudflare 控制台创建或选择 Worker 并连接该仓库。生产 build command 为 `npm run build:release`；deploy command 为 `npx wrangler versions upload`。检查设置界面，确保没有默认 `npx wrangler deploy` 自动发布，必要时关闭 Preview builds。

GitHub push 后的构建会生成可供检查的 Worker 版本，但不自行切换线上活动部署。若首次创建流程中的按钮明确写“Save and Deploy”，需由用户自行评估首次发布后再继续。

### 13.3 检查版本并手动激活

用户查看构建日志和版本 URL，核对中文/英文、404、静态资源、Logo、手机布局、导航及表单模式。确认后在 Cloudflare 的 Versions/Deployments 界面手动将目标版本设为活动部署。若结果有问题，用户在界面选择先前版本回退。

### 13.4 线上验收与记录

用户验证正式 URL、HTTPS、中文/英文、404、移动端、CTA。表单 remote 时做合成申请并确认真实接收；disabled 时检查页面真实提示。记录发布版本、公开 URL、时间和回退方式到 `docs/implementation/release-record.md`，之后才将本阶段标 done。

## Agent 的角色

Agent 可以在用户后续请求时阅读检查线上结果并协助诊断，但不能因用户已连接 GitHub 就自行推送或发布。未得到真实上线结果时，`PROGRESS.md` 保持 13 deferred，不写“已上线”。
