# 素材与品牌

正式标志 public/brand/{mark,mark-light,favicon}.svg：按用户选定探索板中间 02 的两条错位开口路径重建，自制矢量；不分发探索板。Logo.astro 使用 HTML 品牌文字，图形保留纵横比。浅底双色、深底浅色。SVG 路线与地图为自制地理示意，不表示实时航线或承运商服务。

字体仅系统字体栈，无远程字体请求。网页示例全部为虚构 DEMO 数据，无客户素材。后续分享图由正式 Logo 和本地 HTML 确定性渲染。

分享图：`public/images/og-zh.png`、`og-en.png`，1200×630，源生成器 `scripts/generate-share.mjs` 用 Chromium 渲染本地 HTML 与正式 SVG；已查看实际输出，无生成式图片、外部字体或素材。标志 24/32/48px 深浅底证据：`docs/implementation/visual/04-brand-sizes.png`。小字 teal token 为通过对比度测试调深至 #087582；标志原色不变。

## 区块图标与 AI 助手品牌（2026-11-17）

`src/components/SectionIcon.astro`：十个自制线性 SVG，统一笔画与图标容器。装饰图标使用 `aria-hidden`，标题提供完整语义。

`public/brand/assistants/`：WorkBuddy、Codex、Claude Code 品牌图形来自 [Lobe Icons](https://github.com/lobehub/lobe-icons/tree/34270bc208d7122778dc00b30bd460f97ea03216/packages/static-svg/icons)，使用以下原始文件，未重绘或改变品牌颜色：

- `workbuddy.svg` ← `workbuddy-color.svg`
- `codex.svg` ← `codex.svg`（单色）
- `claude-code.svg` ← `claudecode-color.svg`

上游版本 `34270bc208d7122778dc00b30bd460f97ea03216`；MIT 许可全文保存在同目录 `LICENSE`。图形以静态文件本地加载，不发出第三方图片请求。图片为相邻品牌名称的装饰，空 alt 避免重复朗读。官方品牌网页受当前环境网络白名单限制，未声称图形来自官方品牌素材包；使用可追溯的公开图标库。商标归各自权利人，卡片仅用于识别用户要求的助手示例，不表示官方合作、背书或已完成端到端兼容验证。
