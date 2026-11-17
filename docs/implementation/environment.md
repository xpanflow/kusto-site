# 本地开发环境

更新：2026-11-16。根据 [阶段 01](../../.github/prompt/kusto-cargo/01-baseline.md) 记录实际环境及版本选择。

## 仓库基线

- 开始时 `git status --porcelain=v1` 为空；最近提交 `cb40dbe init repo with prompts`。
- 现有 README、设计简报、Logo 探索图和 `.github/prompt` 均已保留。
- 原 `.gitignore` 第一行前误写 `n'ca`，本次修正并增加开发产物规则。
- 当前目录开始时没有 `package.json`、Astro 配置、`src/` 或 lockfile。
- 产品源码 `../kusto-cargo` 仅供业务参考，本次没有修改。

## Node 与 npm

| 环境 | Node | npm | 结果 |
| --- | --- | --- | --- |
| 原默认 PATH | 20.18.0 | 10.8.2 | 不符合当前 Astro engine |
| 本机 nvm 已安装版本 | 24.22.3 | 11.19.1 | 符合 Astro `>=22.23.4` 与 npm `>=9.6.5` |

项目用 `.nvmrc` 和 `.node-version` 固定 `24.22.3`。进入仓库后运行：

```bash
source "$HOME/.nvm/nvm.sh"
nvm use
node --version
npm --version
```

在本会话的命令中使用本机已安装的 `/home/xiaopan/.nvm/versions/node/v24.22.3/bin`，不改变系统默认 Node。

## 依赖版本与依据

2026-11-16 从 npm registry 实际查询并安装：

| 包 | 选用/记录版本 | 依据 |
| --- | --- | --- |
| `astro` | 7.4.12 | npm `version` 与 `engines`；Node `>=22.23.4` |
| `typescript` | 6.0.3 | 最新 6.x；与 `@astrojs/check` peer `^5 || ^6` 相容 |
| `@astrojs/check` | 0.9.12 | npm `version` / peerDependencies |
| `prettier` | 3.10.1 | 满足 Astro 插件 `^3.5.3` |
| `prettier-plugin-astro` | 1.1.2 | npm `version` / peerDependencies |
| `gsap` | 3.15.1 | 已查询，阶段 06 如仍兼容再安装 |

Astro 的运行时要求来自[官方安装文档](https://docs.astro.build/en/install-and-setup/)。版本来自本日 npm `view` 结果；首次普通沙箱查询返回 `EAI_AGAIN`，随后在批准的网络查询中成功。阶段 02 已执行 `npm install --no-audit --no-fund`，新增 271 个包并生成 `package-lock.json`；`npm ls --depth=0` 显示五个直接依赖均为表中固定版本。`gsap` 在阶段 06 再安装。

## 浏览器与外部参数

- 本机 PATH 未发现 `chromium`、`google-chrome` 或 `playwright` 命令；阶段 02.4 应准备真实浏览器并完成视觉基线，不记为已通过。
- 正式域名、Cloudflare Worker 名称/账户、GitHub 连接和表单接收端仍未知，不影响本地 Astro 开发。初版托管方案已由用户改为 Cloudflare Workers 静态资源；连接与发布由用户手动完成。
- 本次仅配置本地开发与最小静态工程，不使用真实产品后端或线上环境。

## 实测命令

- `node --version`：20.18.0（默认 PATH）。
- `npm --version`：10.8.2（默认 PATH）。
- Node 24 PATH 下 `node --version`：24.22.3；`npm --version`：11.19.1。
- `npm view astro version engines --json`：7.4.12；engine Node `>=22.23.4`。
- 其他 `npm view` 结果如上表；`source "$HOME/.nvm/nvm.sh"`、`nvm use` 正确选中项目的 Node 24.22.3/npm 11.19.1。
- `npm run check`：0 errors / 0 warnings / 0 hints（运行时设置 `ASTRO_TELEMETRY_DISABLED=1`）。首次未设置该变量时，受限环境无法写入 `~/.config/astro`；这是沙箱配置权限问题，设置变量后已通过。
- `npm run format:check`：通过。首次不符合格式，执行本地 Prettier 格式化后复查通过。
- `npm run build`：通过，生成 `dist/index.html` 和 `dist/en/index.html`，静态输出共 2 页。
- `npm run preview -- --host 127.0.0.1`：本地 4321 端口启动；HTTP 获取两页并核对 lang/H1 成功。
- `npm run dev -- --host 127.0.0.1 --port 4322`：本地启动；HTTP 获取两页并核对 lang/H1 成功。受限沙箱需要允许本机监听与 localhost 请求；检查结束后服务进程已退出。

## Cloud 实施更新（2026-11-16）

本次从main bce468b恢复。复用已安装Node24.22.3、Chromium `/usr/bin/chromium` 和npm可写cache；新增精确依赖GSAP3.15.1、Playwright1.65.1、Vitest5.1.0、Axe4.14.0、Lighthouse13.6.0、Wrangler4.163.0。版本见package.json/lockfile。依赖安装未关闭完整性或TLS校验。

本地服务：Astro dev 4321；Wrangler本地8787；浏览器测试临时静态服务4322/4323，由Playwright启动并关闭。需要 `ASTRO_TELEMETRY_DISABLED=1`；Wrangler可将 `XDG_CONFIG_HOME` 指向可写目录且禁用指标上报。源码变动后重新build再使用Wrangler检查。测试构建与公开构建严格分目录。
