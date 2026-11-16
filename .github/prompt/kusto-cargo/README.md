# KustoCargo · 途序 — 可断点执行的建站 Prompts

这套文件将设计访谈转化为 Astro 静态产品网站的实施规格。读者无需重新查阅聊天记录；新会话从入口和进度记录恢复即可。

本次交付是规格与 prompts，不表示网站已经实现、测试或发布。原始 [reference](../reference/README.md) 保留为方法参考，不作为本项目的执行入口。

## 使用方式

在仓库根目录向 Agent 发出以下任一指令：

```text
阅读 .github/prompt/kusto-cargo/00-START-HERE.md，检查 PROGRESS.md，
从当前断点继续完成本地网站实现与发布准备。遵循各阶段验收条件，
更新进度；表单接收由我后续配置，暂不操作线上服务器。
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
| [specs/01-product-content.md](specs/01-product-content.md) | 产品定位、页面顺序、中英文基线文案、示例数据 |
| [specs/02-design-motion.md](specs/02-design-motion.md) | Logo、设计变量、响应式、航线动画分镜 |
| [specs/03-architecture.md](specs/03-architecture.md) | 技术栈、目录、配置、脚本、双语与 SEO |
| [specs/04-form-contract.md](specs/04-form-contract.md) | 字段、校验、请求与响应、状态机、未配置行为 |
| [specs/05-quality-release.md](specs/05-quality-release.md) | 测试矩阵、性能预算、Lightsail 发布与回滚 |

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
| 12 | [Lightsail 发布准备](12-release-preparation.md) | 制品、Nginx 模板、部署/回滚操作手册 |
| 13 | [正式发布](13-production-release.md) | 有明确部署任务和环境后执行；真实上线记录 |

## 规格状态与权威来源

- 用户已确认：Astro、静态双语单页、Logo 02、深浅混合主题、航线动画、精简界面示意、表单规则和 Lightsail 方向。
- 本包将 TypeScript、CSS 设计变量、SVG + GSAP、npm 和 Nginx 模板定为实施默认值。这些是为本次规格任务作出的工程选择，不伪称用户逐项指定；实现时按其执行，除非用户修改或实际兼容性要求变更。
- 直接业务决定见[设计简报](../../../docs/site-brief.md)，外部接收配置见[手动 TODO](../../../docs/manual-todo.md)。
- 每阶段详细规格在 `specs/`；运行时内容和配置在相应阶段生成后分别以 `src/content/` 和根目录 `site.config.ts` 为准。新增决定先更新相关规格，避免多处互相矛盾。
- 文件中的目标代码路径是未来产物，不代表当前存在。文档里的示例命令不是已执行记录。
