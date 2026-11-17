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
