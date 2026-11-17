# 手动 TODO

## 已配置到仓库（2026-11-17）

- [x] 正式 HTTPS origin：`https://kusto.xpanflow.com`。
- [x] Formspree endpoint：`https://formspree.io/f/myewwkwl`，remote 模式，专用 Formspree JSON 适配器。
- [x] 表单附近的中英文说明明确通过 Formspree 向 KustoCargo 团队发送信息。
- [x] 合成响应测试与本地正式构建；不向真实接收端发送自动测试申请。

## Formspree 控制台（用户）

- [ ] 确认表单已激活、接收邮箱已验证，通知收件人和保存策略正确。
- [ ] 如启用了域名限制，允许 `kusto.xpanflow.com`；若限制校验完整 origin，使用 `https://kusto.xpanflow.com`。测试 workers.dev 地址时按需额外允许。
- [ ] 邮箱与微信至少填写一个；不要在 Formspree 端将 email 单独设为必填，否则仅微信申请将被拒绝。依据套餐支持情况配置 name/company 必填与服务器端校验，前端校验不是防滥用边界。
- [ ] 核查 Formspree 垃圾过滤、额度、反滥用设置及第三方数据处理说明；补齐实际运营主体/隐私政策等业务资料。
- [ ] 上线后各提交一条标明测试的申请，验证仅邮箱、仅微信均真实进入 Formspree 与通知渠道；清理测试记录。浏览器模拟成功不代表已收到邮件。

## Cloudflare Workers 与 GitHub（用户）

- [ ] 创建 `kusto-cargo-site` Worker，连接 `xpanflow/kusto-site` 的 `main`，根目录 `/`，Node `24.22.3`。
- [ ] Build command：`npm run build:release`；Deploy command：`npx wrangler versions upload`；无需分支预览时关闭 Preview builds。
- [ ] 审查上传版本后手动部署/激活；Agent 不执行远程发布。
- [ ] Workers → `kusto-cargo-site` → Settings → Domains & Routes → Add → Custom Domain，填写 `kusto.xpanflow.com`。
- [ ] `xpanflow.com` 需位于同一 Cloudflare 账户的有效 zone；按控制台确认 DNS 和证书，等待 HTTPS 可用。若子域名已被占用，先核查现有记录用途，避免覆盖其他服务。
- [ ] 检查中英文页面、404、静态资源、手机导航、实际表单收件，以及 `/robots.txt`、`/sitemap.xml` 的正式域名。
- [ ] 向需要的搜索平台提交 `https://kusto.xpanflow.com/sitemap.xml`；上线后实测中国/欧洲访问。
- [ ] 记录活动版本、域名、时间和回退入口，参见[发布手册](implementation/release-runbook.md)。

## 接收协议

`transport: "formspree"`：JSON POST，设置 `Accept: application/json`。依据官方 `@formspree/core@4.0.0`，成功须 HTTP 200/201、JSON 含非空字符串 `next`，且没有错误字段；只显示本地成功状态，不跳转服务端 URL。400/422 的已知字段错误码映射本地消息；429 显示限流；非 JSON、网络、超时或未确认成功均保留输入。仅微信申请不发送空 email。公开 Form ID 可进仓库，不需要任何私钥。

`transport: "json"` 保留原自建接收端严格协议（需 submissionId），供隔离测试与未来自建接收服务使用。失败重试保留 requestId，客户端锁阻止并行提交；Formspree 是否按此字段去重未验证，不承诺服务器幂等。阶段 13 继续为用户手动发布。
