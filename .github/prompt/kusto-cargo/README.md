# KustoCargo · 途序 — 可断点执行的建站 Prompts

这套文件将设计访谈转化为 Astro 静态产品网站的实施规格。读者无需重新查阅聊天记录；新会话从入口和进度记录恢复即可。初版发布目标为 Cloudflare Workers 静态资源，连接 GitHub；用户手动完成连接与正式上线。

当前仅本地环境与最小 Astro 双语工程已验证，完整网站、视觉验收和发布仍按进度推进。此前讨论的 `.github/prompt/reference/` 当前未在仓库中；本包已独立描述实施方法，不依赖该目录。

## 使用方式

在仓库根目录向 Agent 发出以下任一指令：

**连续自主开发推荐使用 [AUTONOMOUS-BUILD.md](AUTONOMOUS-BUILD.md)。** 该指令要求 Agent 完成所有可自主执行的本地工作，并在每个子步骤后查看实际页面与截图；GitHub 连接和 Cloudflare 正式发布由用户亲自完成。

```text
阅读 .github/prompt/kusto-cargo/00-START-HERE.md，检查 PROGRESS.md，
从当前断点继续完成本地网站实现与发布准备。每个子步骤检查浏览器实际画面并记录截图，
更新进度；表单接收由我后续配置，GitHub 连接与 Cloudflare 发布由我手动完成。
```

```text
阅读 .github/prompt/kusto-cargo/00-START-HERE.md 和 PROGRESS.md，
仅执行第 06 阶段。先验证依赖，结束时记录检查结果和准确断点。
```

```text
根据 .github/prompt/kusto-cargo/PROGRESS.md 恢复工作。
先核对现有文件和最后一次检查，不要重复初始化或覆盖已完成的设计。
```

这里的 `PROGRESS.md` 指[本目录的进度文件](PROGRESS.md)，不创建第二套根目录进度记录。

## 文件导航

| 文件 | 职责 |
| --- | --- |
| [00-START-HERE.md](00-START-HERE.md) | 范围、执行规则、依赖图、恢复协议 |
| [PROGRESS.md](PROGRESS.md) | 唯一执行状态、精确断点、证据、阻塞与交接 |
| [AUTONOMOUS-BUILD.md](AUTONOMOUS-BUILD.md) | Agent 连续自主实施任务与逐步视觉检查规则 |
| [specs/01-product-content.md](specs/01-product-content.md) | 产品定位、页面顺序、中英文基线文案、示例数据 |
| [specs/02-design-motion.md](specs/02-design-motion.md) | Logo、设计变量、响应式、航线动画分镜 |
| [specs/03-architecture.md](specs/03-architecture.md) | 技术栈、目录、配置、脚本、双语与 SEO |
| [specs/04-form-contract.md](specs/04-form-contract.md) | 字段、校验、请求与响应、状态机、未配置行为 |
| [specs/05-quality-release.md](specs/05-quality-release.md) | 测试矩阵、性能预算、Cloudflare 静态资源与手动发布 |
| [specs/06-visual-review.md](specs/06-visual-review.md) | 每个编号子步骤的浏览器、截图与目视检查 |

## 阶段顺序

| 阶段 | Prompt | 主要产物 |
| --- | --- | --- |
| 01 | [基线与环境](01-baseline.md) | 环境/依赖版本记录、现场差异 |
| 02 | [Astro 工程](02-scaffold.md) | 静态构建、配置、最小双语路由 |
| 03 | [内容与双语](03-content-i18n.md) | 类型化中英文内容、统一锚点与示例 |
| 04 | [品牌与设计系统](04-brand-design.md) | 矢量 Logo、颜色/字体/布局规范、素材记录 |
| 05 | [页面骨架](05-page-shell.md) | 共享首页、导航、页脚、语言切换 |
| 06 | [开场航线](06-hero-journey.md) | SVG 场景、滚动动画、手机与减少动态效果版本 |
| 07 | [业务功能](07-business-features.md) | 流程、多方关系、费用与利润区段 |
| 08 | [AI、追踪与 MCP](08-ai-tracking-mcp.md) | 产品能力示意与有限交互 |
| 09 | [部署选择与表单](09-contact-form.md) | 产品部署说明、真实校验、可配置提交、单元测试 |
| 10 | [SEO 与分享](10-seo.md) | 双语元信息、分享图、站点地图与发布预检 |
| 11 | [整体质量验收](11-quality.md) | 浏览器测试、响应式与性能报告 |
| 12 | [Cloudflare 发布准备](12-release-preparation.md) | Wrangler 静态资源配置、版本上传与手动交接说明 |
| 13 | [用户手动发布](13-production-release.md) | GitHub/Cloudflare 连接、版本激活与线上验收，由用户操作 |

## 规格状态与权威来源

- 用户已确认：Astro、静态双语单页、Logo 02、深浅混合主题、航线动画、精简界面示意、表单规则、Cloudflare Workers 静态发布和 GitHub 连接。连接与正式发布由用户手动执行。
- 本包将 TypeScript、CSS 设计变量、SVG + GSAP、npm 和 Wrangler 静态资源配置定为实施默认值。这些是工程选择，不伪称用户逐项指定；实现时按其执行，除非用户修改或实际兼容性要求变更。
- 直接业务决定见[设计简报](../../../docs/site-brief.md)，外部接收配置见[手动 TODO](../../../docs/manual-todo.md)。
- 每阶段详细规格在 `specs/`；运行时内容和配置在相应阶段生成后分别以 `src/content/` 和根目录 `site.config.ts` 为准。新增决定先更新相关规格，避免多处互相矛盾。
- 文件中的目标代码路径是未来产物，不代表当前存在。文档里的示例命令不是已执行记录。
