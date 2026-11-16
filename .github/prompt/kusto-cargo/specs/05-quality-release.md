# 规格 05 · 质量、Cloudflare Workers 制品与手动发布

## 质量检查边界

每个编号子步骤都执行[视觉检查](06-visual-review.md)，阶段 11 再完整执行类型、格式、单元、构建和浏览器矩阵。检查失败应修复并复测；无法运行就标为未完成，不把写好测试当作已通过。

## 功能验收矩阵

| 范围 | 必须证明 |
| --- | --- |
| 内容 | 双语区段、导航、状态和可访问名称完整，示例一致 |
| 导航 | hash 正确，固定导航不遮标题，语言切换保留区段，菜单可键盘关闭 |
| 航线 | 往返滚动、resize 后不重复初始化，路径与标记对齐 |
| 降级 | JS 关闭、动画失败、减少动态效果时正文/CTA可读，手机无长空白 |
| 示例 | 流程、AI 和海/空运切换正确，不发真实产品后台请求 |
| 表单 | disabled、邮箱/微信组合、失败保留输入及成功契约均通过 |
| SEO | 单一 H1，双语 lang/title/description，预览与正式配置一致 |
| 路由 | `/`、`/en/`、资源和真实 404，不把未知路径回退到首页 |

至少检查 390×844、768×1024、1440×900，另查 320px 溢出、200% 缩放和键盘遍历。用实际浏览器看截图和交互；自动断言不能替代目视。普通文本对比度 ≥4.5:1，必要的大字/控件 ≥3:1。

## 性能预算（工程目标）

- 首屏关键压缩资源目标 ≤1 MB；初始 JS gzip ≤150 KB；CSS gzip ≤60 KB。
- 完整静态资源目标 ≤2 MB；首屏不载入大视频、在线地图或远程字体。
- 本地生产预览 Lighthouse 移动性能目标 ≥90、可访问性 ≥95，LCP ≤2.5s、CLS ≤0.1。记录测试环境，不把模拟分数当真实用户指标。
- 不达标时修复资源/布局/动画并复测；仍有偏差则如实记录，不暗改阈值。

## 本地与正式构建

- `npm run build`：允许域名空、表单 disabled，供本地预览；页面 noindex，不生成假 canonical。
- `npm run build:release`：设置 `KUSTO_RELEASE=1` 后校验有效 HTTPS `siteUrl`。表单 remote 时 endpoint 必须有效 HTTPS；disabled 时 `release.allowDisabledForm` 仅在用户明确选择展示站先上线后才可设 true。
- `npm run check` 单独执行，不能用 Astro build 代替。
- 01–12 完成可称本地开发和发布准备完成；阶段 13 是用户手动连接、激活版本和线上验收。

## Cloudflare Workers 静态资源结构

Astro `dist/` → Cloudflare Workers `assets.directory`。创建 `wrangler.jsonc`：

```jsonc
{
  "name": "kusto-cargo-site",
  "compatibility_date": "2026-11-16",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  }
}
```

`name` 是待用户确定的初始建议，GitHub 连接时必须与控制台 Worker 名称一致。没有 `main`，不添加 Astro Cloudflare SSR adapter，也不创建营销站 Worker API。`404-page` 使用 `dist/404.html` 并返回 404；`auto-trailing-slash` 配合 Astro 的 `/en/index.html`。静态资源只来自 `dist/`，不包括源码、prompts、环境文件和 node_modules。依据：[Cloudflare Astro 指南](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)、[静态站与 404 配置](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)。

阶段 12 将 Wrangler 固定为项目开发依赖，更新 lockfile，并用本地 `wrangler dev` 或等效预览验证 `/`、`/en/`、404 与资源。此处仅本地预览，不登录 Cloudflare、不调用 `wrangler deploy` 或 `wrangler versions upload`。

## GitHub 连接与手动激活

Cloudflare Workers Builds 连接 GitHub 后，默认在目标分支 push 后构建并部署。用户要求控制正式发布时间，所以交接说明应明确：

1. 用户在 Cloudflare 控制台创建/选择 Worker，名称与 `wrangler.jsonc` 的 `name` 一致，再连接 GitHub 仓库。
2. 用户设置构建命令 `npm run build:release`，生产 deploy command **`npx wrangler versions upload`**。该命令在构建后上传新版本，但不激活为线上部署。若不需要分支 Preview，关闭 Preview builds；不要留默认 `wrangler deploy`。
3. 用户检查版本 URL、实际构建日志和表单模式后，在 Cloudflare 控制台手动激活目标版本。后续回退也由用户在版本/部署界面操作。
4. GitHub 仓库内容需要由用户自己推送；Agent 不连接 GitHub、push、配置 Cloudflare 账户、上传 Worker 版本或手动/自动激活部署。

`versions upload` 上传发生在用户配置的 GitHub 构建中，属于版本生成，不等于正式上线。首次控制台创建 Worker 的界面可能含 “Save and Deploy”；由用户审查并执行，不纳入 Agent 自主步骤。依据：[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)、[版本与部署](https://developers.cloudflare.com/workers/versions-and-deployments/)。

## 交接输入与验收

用户手动准备：Worker 名称/账户、公开 `workers.dev` 或自定义域 HTTPS origin、GitHub 仓库连接、表单接收设置。Agent 在本地可完成配置模板、构建/预览、视觉验收、版本匹配清单和操作文档。未知真实地址不阻塞本地页面，但 `build:release` 应明确失败，不能拿预览包冒充正式包。

用户上线后检查中文、英文、404、静态资源、导航、手机布局；表单 remote 时做合成申请并在接收端确认。正式 URL、版本、检查与回退入口记录在 `docs/implementation/release-record.md`。Agent 未亲自执行线上验证时不能将阶段 13 标 done。

发布后再实测中国和欧洲访问体验，按结果决定是否需要其他方案，不预先承诺地区性能。
