# KustoCargo · 途序 — 连续自主开发指令

将本文件完整交给有仓库读写与浏览器能力的 AI Agent：

> 你负责从当前断点连续完成 KustoCargo 网站的**全部可自主完成的本地开发与 Cloudflare Workers 发布准备**。从 `.github/prompt/kusto-cargo/PROGRESS.md` 恢复，先读 `00-START-HERE.md`、阶段 prompt 和 `specs/`。阶段 01 的环境工作与阶段 02 的工程骨架已存在；当前先补 `02.4` 视觉检查基线，再推进 03–12。不要重做已完成的脚手架，不覆盖用户改动。
>
> **持续推进。** 完成一个子步骤后立即记录结果并执行下一项；不要每阶段停下等我确认。正常的字体、排版、布局、动画实现及测试修复由你根据规格自行决定。遇到信息不足，使用规格中已有默认值；仅真实外部账号、域名、表单接收端或受限环境无法解决时记录阻塞，并继续其他不依赖它的工作。不要因为暂缺表单接收服务停止页面开发。
>
> **每个子步骤都要视觉检查。** 每做完一个编号子步骤，启动当前站点，在实际浏览器中查看中文和英文页面；至少检查桌面 1440×900 与手机 390×844，相关布局还要看 768×1024。保存截图并由你实际打开/查看，检查文字、比例、溢出、对比度、交互状态、动画和 console/network。对没有直接 UI 变化的子步骤，也拍摄当前页面并记录视觉回归无变化。发现问题就修复并重新查看，不能只生成截图或跑完测试便宣称视觉通过。截图与检查说明记录到进度文件和阶段证据，具体执行按 `specs/06-visual-review.md`。
>
> 检查失败时说明失败项和下一动作，不将阶段标为完成。浏览器不可用时优先修复本地工具、使用其他可用的真实浏览器或安装项目测试浏览器；仍不可用则记录具体阻塞，继续不依赖视觉验收的工作，不伪造截图。
>
> 只修改本仓库。产品源码 `../kusto-cargo` 只读。完成类型检查、构建、适用测试和各阶段视觉验收；最终交付 Cloudflare Workers 静态资源配置、GitHub 连接的手动发布指引、可复核的本地构建与 QA 记录。**不要连接 GitHub/Cloudflare、不要 push、不要运行 `wrangler deploy`、不要调用 `wrangler versions upload`，也不要把任何版本设为线上活动部署。发布由我亲自完成。**
>
> 工作结束时报告：完成的阶段、可打开的本地预览方式、实际检查结果、视觉证据、仍待我手动处理的事项，以及 `.github/prompt/kusto-cargo/PROGRESS.md` 的准确断点。不要把阶段 13 记为 Agent 已完成。

## 执行次序

1. 读适用 `AGENTS.md`、用户最新指令、`git status --short`、进度与当前阶段；按现有改动恢复。
2. 先完成 `02.4` 浏览器与视觉基线。确认中文 `/`、英文 `/en/` 页面能在浏览器渲染并留下截图。
3. 按依赖执行阶段 03–12。每个子步骤按“修改 → 当前相关检查 → 浏览器渲染与人工视觉判断 → 修复 → 记录”闭环；不要仅在最后做一次整体截图。
4. 阶段 11 再做完整功能/响应式/性能验收，阶段 12 准备 Workers/GitHub 文件和手动说明。阶段 13 保持 `deferred / 用户手动发布`。
5. 如果新需求改变已完成阶段，精确重开受影响的子步骤和视觉检查，不重新做全部项目。

## 视觉证据最小格式

每个子步骤在 `PROGRESS.md` 或其引用的阶段视觉记录中写：

```text
步骤：06.2
浏览器与构建：Chromium，本地 Astro preview，构建标识/时间
截图：docs/implementation/visual/06.2-zh-desktop.png、06.2-zh-mobile.png、06.2-en-desktop.png、06.2-en-mobile.png
实际观察：标题完整、路线与货物标记对齐、手机无横向溢出；English 文字未遮节点
交互：滚动到达港口/返回，console 0 error；network 未请求外部产品服务
结论：通过 / 修复后通过 / 阻塞；若修复，写改动与复查路径
```

截图要来自真实页面、与当前代码对应；不能使用生成的设计稿代替。详情看[视觉检查规范](specs/06-visual-review.md)。

## 手动发布交接

GitHub 连接默认可在 push 后触发自动部署。为保留用户手动控制正式上线时间，准备的 Workers Builds 说明应将 deploy command 设为 `npx wrangler versions upload`，这会产生版本但不使其成为活动部署；由用户在 Cloudflare 控制台手动激活。首次创建 Worker、连接 GitHub、设置该命令、选择版本和验证正式站点均由用户操作。官方依据见 [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) 与 [Versions & deployments](https://developers.cloudflare.com/workers/versions-and-deployments/)。
