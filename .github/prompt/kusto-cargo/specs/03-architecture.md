# 规格 03 · 工程架构、配置与内容组织

## 栈与版本策略

- Astro，`output: 'static'`，构建目录 `dist/`，不安装服务端 adapter。
- TypeScript strict；Astro 组件负责静态 HTML，必要的行为使用浏览器 TypeScript 模块。
- 原生 CSS 分层组织；GSAP + ScrollTrigger 仅用于明确需要的动画。
- npm + `package-lock.json`；阶段 01 查官方兼容要求，选受支持的 Node LTS 和稳定版依赖，在阶段 02 写入精确版本与 lockfile。后续用 `npm ci`，不要每会话重新安装 latest。
- 格式化使用 Prettier + Astro 插件；单元测试使用 Vitest；浏览器测试使用 Playwright。
- 不默认引入 React、Tailwind、客户端路由、全局状态库、CMS、WebGL 或数据库。

## 目标目录

按阶段逐步创建实际需要的文件，不一次性生成空实现。

```text
astro.config.ts
site.config.ts                    # 非秘密的唯一站点配置
package.json / package-lock.json
tsconfig.json / .node-version
src/
  pages/index.astro               # 中文，使用共享 HomePage
  pages/en/index.astro            # 英文，使用共享 HomePage
  pages/404.astro
  pages/robots.txt.ts              # 构建时静态生成
  layouts/BaseLayout.astro
  components/HomePage.astro
  components/layout/{Header,Footer,Logo}.astro
  components/sections/            # Journey, Workflow, Collaboration, Finance,
                                  # AiAssistant, Tracking, Mcp, Deployment, Faq, Contact
  components/ui/                   # 仅提取实际复用的控件
  content/{types,zh,en}.ts
  data/{journey,demo-fixtures}.ts
  lib/{i18n,contact-validation,site-config}.ts
  scripts/{navigation,hero-journey,feature-demos,contact-form}.ts
  styles/{tokens,global,layout,components,journey}.css
public/
  brand/                          # 正式矢量 Logo 与小图标
  images/                         # 优化过的公开图片和双语 OG
  fonts/                          # 仅在使用许可明确的自托管字体时创建
tests/
  unit/contact-validation.test.ts
  e2e/{navigation,contact,journey}.spec.ts
scripts/build-release.mjs
ops/nginx/kusto-site.conf.template
docs/design/assets.md
docs/implementation/{environment,qa-report,release-runbook,release-record}.md
```

文件名可按实际组件拆分，但职责与路由不能偏离。官网内容、示例与动画状态在各自模块管理；不要把大段字符串或示例财务值散落在组件中。

## 站点配置契约

阶段 02 创建根目录 `site.config.ts`，由 Astro 配置和页面共享导入。业务文案在双语内容文件中；颜色只在 CSS tokens 中，不复制进配置。

```ts
import type { SiteConfig } from './src/lib/site-config';

export const siteConfig: SiteConfig = {
  brand: { name: 'KustoCargo', nameZh: '途序' },
  defaultLocale: 'zh-CN',
  locales: ['zh-CN', 'en'],
  paths: { 'zh-CN': '/', en: '/en/' },
  siteUrl: '', // 未配置时为预览；正式使用绝对 HTTPS origin
  form: {
    mode: 'disabled', // 'disabled' | 'remote'
    endpoint: '',
    transport: 'json',
    timeoutMs: 15000,
  },
  release: {
    allowDisabledForm: false, // 仅用户明确选择先发布展示站时改为 true
  },
};
```

在 `src/lib/site-config.ts` 定义对应类型/校验函数；该模块接收配置作为参数，不反向导入根配置以免循环。`form.mode` 类型为 `'disabled' | 'remote'`，`transport` 为 `'json'`，locale/path 的键仅限 `'zh-CN' | 'en'`。编辑配置后类型仍正确，不通过 `as any` 绕过。配置中的域名和 endpoint 属公开数据；密码、SMTP 密钥、云凭据和 API token 绝不能写入静态配置或前端环境变量。

`siteUrl` 为空时：本地构建可成功，页面输出 `noindex,nofollow`，不生成伪造 canonical 或包含示例域名的 sitemap。非空时须是合法 HTTPS origin（无路径、查询或 fragment）。正式发布构建还检查表单状态，见质量规格。

## 双语与内容模型

- `SiteContent` 明确规定 nav、hero、journey、各 feature、FAQ、form、footer 和 aria 文案的键结构。
- `zh.ts` 与 `en.ts` 都通过 `satisfies SiteContent` 或等价方式检查。不以中文回退掩盖缺失英文。
- 两个路由调用同一个 `HomePage.astro`，传入 locale 与内容；不复制两份整页 markup。
- HTML `lang` 分别使用 `zh-CN`、`en`。品牌名称保留 KustoCargo · 途序。
- 导航与区段 ID 两种语言一致；语言切换优先保留当前 hash（目标存在时），没有 JS 时仍能切换到相应首页。
- CTA 使用链接作为基础：`href="#contact"` 加 `data-intent="demo|trial"`，脚本只负责预选意向和必要焦点提示；用户之后可更改。
- 无 JS 时正文、导航、FAQ、示例信息可读。依赖 JS 的场景切换隐藏/停用时要有默认内容，不能留下失效按钮。

## 客户端脚本边界

- 使用 Astro 正常打包的 `<script>` 导入模块；不把未经转义的内容拼进内联 HTML。
- DOM 数据用属性或安全序列化的 JSON 传递；用户输入和接口消息用 `textContent`，不能放入 `innerHTML`。
- 每个脚本有明确初始化作用域，事件只绑定一次。避免公共入口把全部脚本初始化多遍。
- GSAP 在浏览器端初始化；静态构建时不能访问 window/document。动画销毁和断点变化按设计规格处理。
- 内容显示不能依赖动画脚本成功加载，不在初始 CSS 中把全部 feature 永久设为 opacity:0。

## npm 脚本契约

| 脚本 | 何时加入 | 行为 |
| --- | --- | --- |
| `dev` | 02 | `astro dev`，默认本地访问 |
| `check` | 02 | `astro check`，类型检查单独执行 |
| `build` | 02 | `astro build`，允许预览配置，产出 dist |
| `preview` | 02 | `astro preview`，本地验证构建产物 |
| `format:check` | 02 | 检查应用与配置文件格式，不重排原 reference 或用户文件 |
| `test` | 09 | `vitest run`，有真实测试后加入 |
| `test:e2e` | 11 | `playwright test`，启动/复用本地构建预览 |
| `build:release` | 10 | Node 包装脚本设置 `KUSTO_RELEASE=1` 后调用 build，要求发布配置通过 |

`astro build` 不能替代类型检查。脚本尚未建立时不可宣称已执行。预览与发布使用同一源码；发布标志只控制缺失配置的严格校验，不建立两套内容。

## SEO 与站点文件

- 每种语言独立 title、description、OG/Twitter 信息；公开 HTTPS origin 存在时设置 self canonical 和 zh-CN/en/x-default alternates。
- 分享图为 1200×630，主要标题可读，分别制作中文/英文版本；保留本地源文件与来源记录。
- sitemap 仅列真实站点路由，`@astrojs/sitemap` 可在阶段 10 按需加入。域名空时不生成正式 sitemap。
- `robots.txt` 在预览时禁止抓取，生产配置有效时允许并引用 sitemap；页面头部策略一致。
- 结构化数据可使用 WebSite 和 SoftwareApplication 的名称、描述与 URL；不编造 price、rating、review、组织地址或收费计划。
- 404 使用明确状态页；服务器返回真正 404，不能把所有未知路径回退为首页。

## 依赖与素材记录

阶段 01/02 在 `docs/implementation/environment.md` 记录 Node、npm、所选依赖版本、兼容依据及实测命令。素材在 `docs/design/assets.md` 记录来源、许可、用途、生成方式及路径；自制 SVG 标注自制。仓库中只放需要的公开资产。

## 官方依据

查阅基准为 2026-11-16；实施时仅为确认版本兼容性复核，避免无目的升级。

- [Astro 安装](https://docs.astro.build/en/install-and-setup/)：核对当前稳定版与 Node 要求。
- [Astro 配置](https://docs.astro.build/en/reference/configuration-reference/)：使用 static 输出与站点配置。
- [Astro TypeScript](https://docs.astro.build/en/guides/typescript/)：显式运行类型检查。
- [Astro 双语路由](https://docs.astro.build/en/guides/internationalization/)：默认语言和路径前缀。
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) 与 [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/)：滚动控制及响应式清理。
