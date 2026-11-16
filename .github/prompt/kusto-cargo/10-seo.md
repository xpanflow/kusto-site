# 10 · 双语 SEO、分享图与发布预检

目标：静态 HTML 有正确的双语元信息，预览与正式配置不会混淆。依赖：05、03、04 done。

## 读取

[工程规格](specs/03-architecture.md)、[质量与发布](specs/05-quality-release.md)、品牌正式资产。

## 子步骤

### 10.1 元信息与路由

为中文/英文设置独立 title、description、lang、OG 和 Twitter 元信息。公开 origin 存在时生成 self canonical 和 zh-CN/en/x-default alternate；无 origin 则 noindex，不能使用 example.com 作为正式 URL。

按实际路由生成 sitemap/robots，并实现 404。结构化数据只描述有据可依的产品名称、介绍和 URL；不写不存在的评级、价格或组织信息。

### 10.2 分享图

使用最终 Logo、深海蓝/青绿、清晰主张制作中英文 1200×630 分享图。可用本地矢量/HTML 渲染生成确定性图稿，记录源文件与输出；不得使用旧三候选探索图。若选择生成图片，应使用可用图像工具及其规则。

### 10.3 正式构建入口

实现 `scripts/build-release.mjs` 和 `npm run build:release`，让子构建携带 `KUSTO_RELEASE=1`。在 Astro 配置加载时校验 siteUrl、表单 remote/endpoint 及 disabled 豁免规则，明确错误原因。

测试域名为空时预览 build 可成功，而 release build 必须失败。使用隔离配置验证有效 origin 的元信息，不污染正式配置；不把阶段内的预期失败写成任务失败或发布成功。

## 产物与验收

- 元信息、双语分享图、robots/sitemap 策略、404和发布预检。
- check/build/format:check 通过；检查实际生成 HTML、路径与图片尺寸。
- 空域名不会导致伪造 canonical；缺发布输入的 release 命令以非零状态结束并说明缺项。
- 图片来源与正式 URL 的未配置状态记录清楚。

## 断点

记录 `10.1`–`10.3`、两种配置的验证结果。域名待提供不阻塞本地阶段完成。完成后转 11.1。
