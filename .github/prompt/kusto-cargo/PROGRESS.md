# KustoCargo 网站实施进度

唯一进度记录；创建于 2026-11-16。02.4与03–12本地实现及视觉验收已完成；阶段13由用户手动发布。

## 当前断点

- 当前阶段：13（deferred / 用户手动发布）
- 当前子步骤：13.1
- 下一动作：用户按 `docs/implementation/release-runbook.md` 填写真实 HTTPS origin、Worker 名称与接收端，连接 GitHub/Cloudflare，审查并手动激活版本。
- 最近完成的实施步骤：12.4；02.4 与 03–12 的本地实现、检查和视觉证据已完成
- 本地可交付：完成；代码与证据纳入本次用户授权的提交推送
- 正式上线：未开始，Agent 未上传或激活版本

## 阶段状态

| ID | 阶段 | 状态 | 子步骤检查点 | 产物/证据 |
| --- | --- | --- | --- | --- |
| 01 | 基线与环境 | done | 01.1–01.3 | `docs/implementation/environment.md`；Node/npm/版本核查完成 |
| 02 | Astro 工程 | done | 02.1–02.4 | 原工程及视觉基线02.4；见 visual-review.md |
| 03 | 内容与双语 | done | 03.1–03.3 | src/content、src/data、i18n；见 visual-review.md |
| 04 | 品牌与设计系统 | done | 04.1–04.3 | public/brand、styles、assets.md、04-brand-sizes.png；见 visual-review.md |
| 05 | 页面骨架 | done | 05.1–05.3 | 双语共享页面、原生菜单、导航与降级；见 visual-review.md |
| 06 | 开场航线 | done | 06.1–06.4 | Journey、GSAP、motion截图、resize/reduce检查；见 visual-review.md |
| 07 | 业务功能 | done | 07.1–07.3 | 流程/角色/费用示意及统一fixture；见 visual-review.md |
| 08 | AI、追踪与 MCP | done | 08.1–08.3 | 3任务、海空模式、MCP说明；见 visual-review.md |
| 09 | 部署选择与表单 | done | 09.1–09.4 | 校验/适配器/状态机，29单测与remote矩阵；见 visual-review.md |
| 10 | SEO 与分享 | done | 10.1–10.3 | 双语meta/OG、404、release预检；见 visual-review.md |
| 11 | 整体质量验收 | done | 11.1–11.4 | 21浏览器测试；qa-report.md、lighthouse、视觉证据；见 visual-review.md |
| 12 | Cloudflare Workers 发布准备 | done | 12.1–12.4 | wrangler.jsonc、本地200/404、release-runbook.md；见 visual-review.md |
| 13 | 用户手动发布 | deferred | 13.1 | GitHub 连接、Cloudflare 版本激活和线上验收由用户操作 |

## 外部待办与阻塞

| 事项 | 状态/负责人 | 影响与解除方式 |
| --- | --- | --- |
| 表单接收地址、渠道和服务设置 | deferred / 用户 | 本地默认 disabled；配置后做真实接收验证，见手动 TODO |
| Worker 名称、公开 URL、GitHub/Cloudflare 连接 | deferred / 用户 | 不阻塞本地实现；阶段 12 使用占位说明，阶段 13 手动完成 |
| 中国与欧洲访问测试 | deferred / 用户 | 上线后实测，不阻塞本地开发 |
| 当前执行阻塞 | 无 | 本地无阻塞；真实收件、公开URL与用户发布属于外部待办 |

## 最近检查

2026-11-16：Node24.22.3；check 0 errors/warnings/hints，format通过，Vitest29通过，Playwright21通过（0跳过/失败），普通build通过。缺域名release预期失败；隔离有效配置release成功，未污染正式配置。Workers本地中英文/资源200、未知路径404。Lighthouse移动模拟性能95、可访问性100、LCP约1.02s、CLS0。完整证据见 `docs/implementation/qa-report.md`、`visual-review.md` 与 `visual/`。

## 变更与恢复日志

| 日期 | 步骤 | 修改与结果 | 下一动作 |
| --- | --- | --- | --- |
| 2026-11-16 | 规格准备 | 建立 prompts、规格与空白进度记录；未执行应用阶段 | 等待实施任务，从 01.1 开始 |
| 2026-11-16 | 01.1–01.3 | 核查 Git、Node/npm、官方 Astro engine 与 npm 版本；修复 `.gitignore` 首行，建立环境记录和 Node 版本文件 | 02.1 Astro 静态工程 |
| 2026-11-16 | 02.1–02.3 | 固定 Astro 7.4.12、TS 6.0.3 等版本并安装；完成共享双语路由，check/build/format、dev/preview HTTP 检查通过 | 03.1 内容与双语 |
| 2026-11-16 | 计划修订 | 初版改为 Cloudflare Workers 静态资源 + GitHub，用户手动发布；新增每个子步骤的视觉门槛，重开 02.4 | 02.4 浏览器视觉基线 |

| 2026-11-16 | 02.4–12.4 | 从指定远端HEAD连续实现双语页面、航线、功能、表单、SEO与Workers本地准备；29单测/21浏览器测试通过，逐步视觉证据已查看 | 13.1 用户手动发布 |
| 2026-11-17 | 页脚与收录补充 | 补版权行、页脚导航、双语 sitemap 关联；中英文视觉及构建验证通过 | 填正式域名后复核并提交 sitemap |

| 2026-11-17 | 首屏定位调整 | 主标题突出国际货代 TMS 系统，同步英文、页面 title、分享图和规格；检查、构建与四种视口视觉验证通过 | 13.1 用户手动发布 |

## 交接记录

- 已从远端main指定HEAD `bce468b53fca8c6ea5d907b3f117241b5fb8dcdf` 快进恢复；完成本地阶段02.4–12，未修改其他仓库。
- 表单正式配置仍disabled；测试接收端仅在忽略的.test-site构建内，全部由浏览器拦截，无真实收件声明。
- 固定依赖与lockfile已更新；使用README中的工具路径与开发/检查命令恢复。
- 正式发布仍停在13.1，由用户手动操作；本次用户授权提交推送；无Cloudflare账户连接/版本上传/激活。
- 逐步截图保留历史状态；最终截图以12.4与final前缀为准。小字对比度与菜单CLS已修复，细节见QA记录。

- 用户要求后续每次改动创建新的 commit；不 amend 已有提交。本次沿用已授权的 main 推送流程。
