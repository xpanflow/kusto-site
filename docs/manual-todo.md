# 手动 TODO

## 表单接收配置

负责人：用户。状态：待用户后续设置，不阻塞页面设计。

- [ ] 选择表单接收服务或自建接口，设置提交地址。
- [ ] 配置接收结果的位置和通知渠道，凭据放在接收端配置中。
- [ ] 根据选定服务接入 [JSON 提交契约](../.github/prompt/kusto-cargo/specs/04-form-contract.md)；若协议不同，明确适配器和成功判定规则。
- [ ] 补充实际接收主体与隐私说明，确保表单附近说明信息用途。
- [ ] 接通后验证：仅邮箱、仅微信、两者都有均可提交；两者都为空时拒绝提交，手机号码不能替代此要求。
- [ ] 验证真实接收记录、成功反馈与失败重试流程。

前端开发先按 [设计简报](site-brief.md) 实现字段和校验，并保留可配置接收端。未接通时应明确告知暂不可提交，不模拟成功或丢弃访客信息。

## Cloudflare Workers 与 GitHub 手动发布

- [ ] 确定 Cloudflare Worker 名称与公开地址，将 HTTPS origin 填入 `site.config.ts` 的 `siteUrl`；如使用自有域名，另行完成域名设置。
- [ ] 在 Cloudflare 控制台创建 Worker，并连接本 GitHub 仓库；Worker 名称需与仓库内 Wrangler 配置一致。
- [ ] 在 Workers Builds 中将生产 deploy command 设为 `npx wrangler versions upload`，避免 GitHub 推送直接成为线上活动部署；如不需要分支 Preview，关闭 Preview builds。
- [ ] 检查构建产物和版本 URL，手动将目标版本设为线上活动部署，并记录版本与回退入口。
- [ ] 手动验证正式 URL 的中英文页面、404、资源、导航和移动端效果。
- [ ] 接收端完成后做真实收件验证；若决定先发布展示站而暂不开申请，在发布记录中明确这一选择并保持表单禁用提示。

Agent 完成本地实施与交接材料；上线操作遵循[阶段 13](../.github/prompt/kusto-cargo/13-production-release.md) 的手动步骤。`versions upload` 会在 GitHub 构建时上传版本，但不会自行将其设为活动部署；用户控制正式上线时间。

## 后续访问评估

- [ ] 发布后实测中国与欧洲的访问体验，再决定是否需要其他区域或方案。

## 接收端协议（本地实现）

表单默认 disabled，字段停用且不发送请求。用户提供 HTTPS endpoint 后设 remote；接收服务须支持跨域 JSON POST、服务器端同样校验、requestId 去重、滥用防护与合适的数据保存策略。
成功仅接受 HTTP 200/201 + `{ "ok": true, "submissionId": "非空字符串" }`。422/400 可返回已知字段错误，429 限流，其余失败保留内容。超时由 AbortController 控制；相同内容失败重试复用 requestId，修改后生成新 ID。
第三方服务协议不同须修改 transport adapter 并重新测试。启用前补充接收主体和隐私说明，进行合成申请并在真实接收渠道确认；浏览器拦截测试不代表送达。

## 最终发布交接

Worker 建议名称 `kusto-cargo-site`，用户确认并与配置保持一致；填写真实 HTTPS origin，连接 GitHub/Cloudflare，并按 [手动发布手册](implementation/release-runbook.md) 设置 build command `npm run build:release`、deploy command `npx wrangler versions upload`。用户检查版本后手动激活，完成线上双语/404/资源与实际表单收件验收。当前所有本地接收测试均为拦截模拟，不代表真实送达。阶段 13 仍 deferred。

## 站点页脚与搜索收录

- [ ] 确定正式 HTTPS 域名并设置 `site.config.ts` 的 `siteUrl`；预览配置的 sitemap 为空，robots 禁止收录，不能向搜索平台提交预览地址。
- [ ] 上线后查看正式 `/sitemap.xml` 与 `/robots.txt`，向所使用的搜索平台提交 sitemap，并确认中文 `/`、英文 `/en/` 的 canonical 与语言替代链接指向正式域名。
- [ ] 在启用表单前补齐真实隐私说明和接收主体；若需要独立隐私政策、服务条款或公司联系资料，提供准确内容后再添加页脚链接。
- [ ] 仅在实际使用需要同意的 Cookie 或追踪工具时评估 Cookie 提示；当前站点不因通用模板而显示虚构的同意弹窗。
