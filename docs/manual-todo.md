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
