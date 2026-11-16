# 02 · Astro 静态工程

目标：在当前仓库建立可构建、可预览的最小双语工程。依赖：01 done。

## 读取

[工程规格](specs/03-architecture.md)、[内容规格](specs/01-product-content.md)、阶段 01 环境记录。

## 子步骤

### 02.1 依赖与配置

在非空仓库中手动建立最小 Astro 工程，或先在临时目录生成再选择性迁移；不能直接让脚手架覆盖 README、docs、prompts、品牌素材或 .git。若已有工程只补缺项。

使用阶段 01 的兼容版本；package.json 中依赖使用精确版本，提交范围留给用户的版本控制指令。创建 package-lock、TypeScript strict 配置、.node-version 和 engines。只维护 npm 一个锁文件。

`astro.config.ts` 配置 static 输出、目录形式的页面、中文和英文路径；不加 SSR adapter。创建工程规格中的 `site.config.ts`，siteUrl 空、表单 disabled、allowDisabledForm false。

### 02.2 最小可运行路由

创建共享 BaseLayout 和 HomePage，两个 index 页面引用同一组件，显示正确语言的临时完整主标题和品牌。它们是可运行基线，后续替换为完整内容；不要创建大量空功能组件。

建立 dev/check/build/preview/format:check 脚本。格式化只覆盖新应用、配置和后续测试，忽略原 reference 以及用户不属于本次范围的文档。

补充 `.gitignore` 中 node_modules、dist、.astro、浏览器测试报告等实际产物，保留现有规则与 `.env.example` 例外；不可改写用户已有忽略配置。

### 02.3 构建与记录

执行安装后 `npm run check`、`npm run build`，检查 `dist/index.html` 和 `dist/en/index.html`。运行本地 preview 验证两条路径，随后按环境规则管理进程。将真实命令、版本和错误修复记录回环境文档。

## 产物与验收

- Astro 静态构建成功；不存在服务端 adapter、常驻后端要求或 Next.js 残留。
- 双语 HTML 具有正确 lang，主要文本不需要客户端渲染。
- 依赖与 lockfile 一致；本次新文件格式与类型检查通过。
- 预览允许空域名/禁用表单，不把它当发布完成。

## 断点

安装中断先检查 package/lockfile/安装状态再恢复；不重复 scaffold。记录 `02.1`–`02.3`，通过后转 03.1。
