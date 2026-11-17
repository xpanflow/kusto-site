# 本地 QA 与发布准备

基线：远端 main `bce468b53fca8c6ea5d907b3f117241b5fb8dcdf`，2026-11-16。执行环境：Linux、Node 24.22.3、Chromium、Astro静态构建。本报告记录提交前的本地验证；未进行Cloudflare远程发布。

| 检查 | 实际结果 |
| --- | --- |
| Astro check | 0 errors / 0 warnings / 0 hints |
| Prettier | 通过 |
| Vitest | 29通过，0失败/跳过 |
| Playwright | 21通过，0失败/跳过；结果摘要 qa-results.json |
| build | 通过，中文/英文/404与公开资源 |
| build:release 默认配置 | 预期非零失败：缺siteUrl；不是正式包 |
| 隔离有效release | 通过，测试origin与remote配置仅在忽略的.test-site；canonical/alternate/index验证通过 |
| Workers本地 | `/`、`/en/`、SVG/分享图200；未知路径404 |
| 双语Axe | 零违规 |
| Lighthouse移动模拟英文 | 性能95，可访问性100，LCP约1.02s，CLS 0；见lighthouse-en.json |
| 资源 | 初次测量全制品约268KB，JS gzip约44.4KB，CSS gzip约3.2KB；最终精确值见resource-budget.json，低于1MB首屏/2MB全站与150KB JS/60KB CSS预算 |

## 功能与隔离

21项浏览器用例覆盖双语320/390/768/1440、菜单Esc焦点返回、有效hash语言切换、两种流程、三AI任务、海空追踪、CTA意向、FAQ、无JS、阻断脚本、resize/reduced-motion/往返滚动、200% CSS放大与Axe。截图与逐步实际观察见visual-review.md。

表单：仅邮箱/仅微信/同时填写，空白、仅电话、无效邮箱及长度通过单元校验。浏览器拦截remote成功、422、429、500、超时、非JSON、不完整成功、网络失败；验证内容保留、错误聚焦、同内容requestId复用、修改后新ID、成功清理及重复提交锁。默认disabled单独证实零POST。

隔离构建由 `scripts/prepare-test-site.mjs` 只复制src/public/公开配置/package元数据，链接node_modules；不复制.git、.env或凭据。`https://forms.example.test/request` 被Playwright拦截；测试域名仅用于忽略的.test-site。正式site.config.ts保持空域名与disabled。最终发布只能由正式配置重新build:release。

## 已修复

- 原teal小字对浅底4.41:1，调整交互文字token至#087582。
- 手机JS菜单初始化导致CLS 0.129，改原生details后CLS 0。
- 单元/浏览器检查中发现的类型与断言错误均修正，未删除失败场景或放宽成功契约。
- 中文标题增加平衡换行，避免孤字；航线模式退出清理内联样式与控制器。

## 限制与用户事项

Lighthouse为本地Chromium移动模拟，不能代表真实中国/欧洲访问。WebKit、实际移动设备和线上测试未运行。官方Cloudflare网页本次抓取403，配置/CLI以仓库规范和固定Wrangler本地运行核实。Wrangler Request.cf辅助获取失败后采用默认值，不影响已测试的静态路由。

公开域名、Worker最终名称、接收端、隐私主体、GitHub/Cloudflare连接与手动激活仍由用户完成。真实收件未验证。阶段13保持deferred；详见release-runbook.md与manual-todo.md。

最终补充：初始外部与内联JavaScript gzip合计上界46,426 bytes，CSS gzip3,360 bytes，全制品268,278 bytes。已补remote成功/422两张实际状态截图并完成2项定向复测；主矩阵仍为21项，不将定向复测重复计入总数。

2026-11-17 增量验证：页脚版权与导航、双语 sitemap 语言链接、正式配置下404不索引。`npm run check` 0错误/警告、`npm run format:check`、`npm run build` 通过；Chromium中英文手机实点页脚两个链接通过。预览 sitemap 0 条 URL、robots 禁止收录；隔离 HTTPS 测试配置 sitemap 2 条 URL，每条含两个语言替代链接，robots 指向 sitemap。四张页脚截图已实际查看，未重跑与改动无关的表单矩阵。正式域名仍由用户配置。

2026-11-17 首屏文案增量验证：主标题、说明、页面 title、分享图及内容规格同步突出国际货代 TMS。`npm run check`、`npm run format:check`、`npm run build` 通过；Chromium 中英文桌面/手机四种视口截图完成，无控制台错误、外部请求或横向溢出，截图与分享图已实际查看。此次为文案调整，未重跑表单测试矩阵。

2026-11-17 AI 原生定位、十区块图标与 MCP 助手示例增量验收：`check` 39 文件 0 errors/warnings/hints，`format:check` 与构建通过。页面 Playwright 矩阵初跑 10 通过、1 失败：此前添加页脚后，旧 `nav` 选择器同时匹配两个导航。将无 JavaScript 用例定位到实际顶部菜单 `#site-nav` 后，定向复跑 1 通过；共 11 个页面用例均通过，含 320/390/768/1440、示例切换、语言与意向、无 JS/脚本阻断、减少动态效果、反向滚动、双语 Axe 与 200% 布局。表单实现未改，未重跑表单矩阵。

独立视觉矩阵覆盖中英文 1440×900、768×1024、390×844。检查三张 Logo 的 complete/naturalWidth，十区块图标数量及横向溢出、pageerror、外部请求，全部通过。图形保留上游 MIT 许可；字节与固定 Lobe Icons 提交逐一核对一致。尚未验证三个助手与实际产品的端到端连接，网站将其作为需 MCP 配置的助手示例。

2026-11-17 正式域名与 Formspree：配置 `https://kusto.xpanflow.com`、remote/Formspree endpoint。新增独立适配器，成功格式按官方 npm `@formspree/core@4.0.0` 的 next 类型检查核实，包来自 registry.npmjs.org；官方帮助页在本环境返回代理 403。没有向真实 endpoint 提交测试。

检查 39 文件零错误/警告、格式通过、Vitest 40 通过、`build:release` 通过。Playwright 首轮 34 通过、1 失败：旧无 JS/动画脚本阻断用例默认认为表单始终禁用；remote 模式下 Astro 内联表单初始化正常运行，仅阻断外部动画时表单应可用。修正为 JS 关闭时禁用、仅动画阻断时启用，定向复测 1 通过，35 个不同用例均通过。包含原自定义 JSON 接收矩阵以及双语 Formspree 成功/422/429/500/非JSON/缺确认/网络失败、仅微信请求不含空 email、失败保留输入与字段焦点。正式 Formspree endpoint 在测试中始终被拦截，隔离构建始终替换正式配置。

构建产物检查：双语 canonical 均为正式域名且 index,follow；404 无 canonical 且 noindex；sitemap 两 URL、各含双语关联，robots 正确指向正式 sitemap。四种双语/桌面手机视觉与四张模拟 Formspree 成功/字段错误截图已实际查看，布局正常；当前证据见 formspree-*。真实邮件通知、Formspree 控制台设置、DNS、TLS 和 Worker 域名绑定未验证，交接用户操作。
