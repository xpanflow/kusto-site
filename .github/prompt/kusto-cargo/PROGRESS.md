# KustoCargo 网站实施进度

唯一进度记录；创建于 2026-11-16。规格文件已编写，本地环境与 Astro 工程已验收；其余开发阶段按下表推进。

## 当前断点

- 当前阶段：03
- 当前子步骤：03.1
- 下一动作：根据 `03-content-i18n.md` 建立类型化中英文内容；本轮用户要求的本地环境配置已完成。
- 最近完成的实施步骤：02.1–02.3；依赖、双语最小路由和静态构建已验证
- 本地可交付：未完成
- 正式上线：未开始

## 阶段状态

| ID | 阶段 | 状态 | 子步骤检查点 | 产物/证据 |
| --- | --- | --- | --- | --- |
| 01 | 基线与环境 | done | 01.1–01.3 | `docs/implementation/environment.md`；Node/npm/版本核查完成 |
| 02 | Astro 工程 | done | 02.1–02.3 | `package.json`/`package-lock.json`、`astro.config.ts`、`site.config.ts`、`src/pages/`；check/build/preview/dev 通过 |
| 03 | 内容与双语 | pending | 03.1 | — |
| 04 | 品牌与设计系统 | pending | 04.1 | — |
| 05 | 页面骨架 | pending | 05.1 | — |
| 06 | 开场航线 | pending | 06.1 | — |
| 07 | 业务功能 | pending | 07.1 | — |
| 08 | AI、追踪与 MCP | pending | 08.1 | — |
| 09 | 部署选择与表单 | pending | 09.1 | — |
| 10 | SEO 与分享 | pending | 10.1 | — |
| 11 | 整体质量验收 | pending | 11.1 | — |
| 12 | Lightsail 发布准备 | pending | 12.1 | — |
| 13 | 正式发布 | deferred | 13.1 | 目标环境和上线任务未提供 |

## 外部待办与阻塞

| 事项 | 状态/负责人 | 影响与解除方式 |
| --- | --- | --- |
| 表单接收地址、渠道和服务设置 | deferred / 用户 | 本地默认 disabled；配置后做真实接收验证，见手动 TODO |
| 域名、主机、Web 服务、证书和发布路径 | pending / 用户提供，Agent 整理 | 不阻塞本地实现；正式发布前补齐 |
| 亚洲节点 | deferred / 用户 | 不阻塞现有 Lightsail 方案 |
| 当前执行阻塞 | 无 | 实施尚未开始 |

## 最近检查

阶段 01–02：默认 Node 20.18.0；项目用 nvm 24.22.3/npm 11.19.1。固定依赖安装与 lockfile 完成；`npm ls --depth=0`、`npm run check`、`npm run format:check`、`npm run build` 均通过。`dist/` 生成 2 页；dev 与 preview 本地 HTTP 验证 `/`、`/en/` 的 lang/H1 均通过。沙箱执行 Astro 时设置 `ASTRO_TELEMETRY_DISABLED=1`，监听/localhost 检查获得了受限环境所需权限。详见 `docs/implementation/environment.md`。

## 变更与恢复日志

| 日期 | 步骤 | 修改与结果 | 下一动作 |
| --- | --- | --- | --- |
| 2026-11-16 | 规格准备 | 建立 prompts、规格与空白进度记录；未执行应用阶段 | 等待实施任务，从 01.1 开始 |
| 2026-11-16 | 01.1–01.3 | 核查 Git、Node/npm、官方 Astro engine 与 npm 版本；修复 `.gitignore` 首行，建立环境记录和 Node 版本文件 | 02.1 Astro 静态工程 |
| 2026-11-16 | 02.1–02.3 | 固定 Astro 7.4.12、TS 6.0.3 等版本并安装；完成共享双语路由，check/build/format、dev/preview HTTP 检查通过 | 03.1 内容与双语 |

## 交接记录

- 已生成并验证本地依赖、最小 `src/` 和静态构建产物；完整网站区段尚未实施。
- 选定 Logo 方向是现有探索图中间的 02；原图在 `docs/brand/logo-exploration-v3.png`。
- 参考文件夹保留，不从其阶段重新开始。
- 更新本文件时填写准确路径、子步骤和验证证据，避免只写“继续做前端”。
