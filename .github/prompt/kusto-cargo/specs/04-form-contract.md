# 规格 04 · 演示与试用表单契约

## 字段与校验

| 字段/键 | 标签 zh / en | 规则 |
| --- | --- | --- |
| `name` | 姓名 / Name | trim 后必填，最多 80 字符 |
| `company` | 公司 / Company | trim 后必填，最多 120 字符 |
| `email` | 邮箱 / Email | 与微信至少一项非空；非空时做常规邮箱格式校验，最多 254 字符 |
| `wechat` | 微信 / WeChat ID | 与邮箱至少一项非空，最多 100 字符；不凭空增加过严的微信号正则 |
| `phone` | 手机号码 / Phone (optional) | 选填，最多 40 字符，允许国际区号、空格及常见分隔符 |
| `intent` | 意向 / Interest | 必须为 `demo` 或 `trial`，直接进入表单默认 `demo` |
| `message` | 需求说明 / Requirements (optional) | 选填，最多 2000 字符 |

长度限制是工程默认值，保持前后端契约一致。trim 空白后再校验。邮箱和微信可以同时填写；只填手机无效；填写了无效邮箱，即使有微信，也需修正邮箱或清空后提交。

HTML 不给邮箱和微信同时添加 required。使用组说明“邮箱或微信至少填写一个 / Provide an email address or WeChat ID”，配合跨字段校验。姓名/公司使用 autocomplete，邮箱 `type=email`，手机号 `type=tel`，需求说明不设不必要的必填。

## 模式

### disabled（默认）

用户明确将接收方式留待手动设置。接收端未知时仍可完成页面和本地测试：

- 表单上方显示“在线申请暂未开放，请稍后再试。 / Online requests are not available yet. Please check back later.”。
- 字段组与提交按钮 disabled，按钮文字“暂未开放 / Currently unavailable”。不让访客填完才发现无法提交。
- CTA 仍可定位到该区段，浏览其他联系说明。没有真实联系信息时不编造邮箱或微信。
- 不发送 fetch，不将资料写进 localStorage，不显示提交成功。
- `<noscript>` 说明需要启用 JavaScript 才可在线申请；正文照常阅读。

### remote

配置经过校验的绝对 HTTPS `endpoint`，允许同源或明确支持 CORS 的外部接收服务。只有接收端准备好时才启用。静态网站不含邮件/数据库密钥。

表单初始 HTML 的字段组/提交按钮保持 disabled，由脚本成功绑定提交处理后在 remote 模式启用。表单使用 `method="post"`，不允许无 JS 或初始化失败时把个人资料通过默认 GET 写进 URL；noscript 提示可读。

初始实现以本规格 JSON 协议为准；未来选定第三方服务若协议不同，新增明确 adapter 并单独测试，不能把任何 2xx 都当作符合本协议的成功。

## 请求协议

```http
POST <configured endpoint>
Content-Type: application/json
Accept: application/json
```

```json
{
  "schemaVersion": 1,
  "requestId": "UUID generated for this submission attempt",
  "name": "示例联系人",
  "company": "示例公司",
  "email": "contact@example.com",
  "wechat": "",
  "phone": "",
  "intent": "demo",
  "message": "希望了解适合小团队的流程定制。",
  "locale": "zh-CN",
  "source": "kusto-cargo-site"
}
```

空的选填字段用空字符串；locale 仅 `zh-CN` / `en`。不收集整页 URL 查询参数、剪贴板或不必要的设备信息。`requestId` 作为重试去重键，接收端须配合去重，客户端不能独自保证幂等。

## 响应协议

- 成功：HTTP 200/201 且 JSON 为 `{ "ok": true, "submissionId": "..." }`，submissionId 为非空字符串。
- 字段错误：HTTP 400/422，JSON `{ "ok": false, "code": "VALIDATION_ERROR", "fieldErrors": { "email": "invalid" } }`。客户端只接受已知字段/错误码，并映射本地化消息。
- 限流：HTTP 429，显示稍后重试，不自动循环重发。
- 网络失败、超时、5xx、非 JSON、2xx 但缺少成功结构：显示可恢复错误，保留输入。
- 不使用 `mode: 'no-cors'`，opaque 响应不能证明送达。不将任意服务端 HTML 或异常栈直接展示给访客。

如果未来用户选择服务商的 HTML 表单或其他成功格式，必须调整 transport/adapter 和测试后启用，不能悄悄放宽成功判定。

## 状态机与用户体验

`disabled` 或 `idle → validating → submitting → success | error`。

- 非法输入停留编辑状态，提交后聚焦首个错误，组错误关联邮箱/微信并以文字解释。
- submitting 时禁用重复提交，显示“提交中… / Sending…”；可用 AbortController 在配置超时时间后结束等待。
- 每次新的有效载荷创建 requestId；内容不变的失败重试复用同一 ID，用户修改内容后使用新 ID。
- 成功显示“已收到申请，我们会通过你留下的联系方式安排演示或试用。 / Your request has been received. We will contact you to arrange a demo or trial.”。
- 不承诺即时账号或具体回复时限。只有有效成功响应后清除输入；失败时保留。
- 状态用 `role=status`/适当 aria-live，错误用字段关联；不在每次按键时反复播报。
- 使用键盘可完成所有操作；复选/单选都有关联 label。触控目标至少 44×44px。

## 接收端责任与手动 TODO

接收服务由用户后续配置，须执行同样的服务器端校验、去重、合理的滥用防护及数据保存/通知。前端规则不等同服务器验证。

实际收集前，在表单附近说明“所留信息用于联系并安排演示或试用 / Your details will be used to contact you and arrange a demo or trial”。具体接收主体与隐私说明由用户根据实际服务补充，不伪造公司名称或法律文本。

维护[手动 TODO](../../../../docs/manual-todo.md)，包含 endpoint/adapter、接收渠道、真实收件测试、隐私说明。不要因接收未配置而停止已可执行的页面开发。

## 必测矩阵

| 情形 | 结果 |
| --- | --- |
| 仅有效邮箱 | 可进入提交 |
| 仅微信 | 可进入提交 |
| 邮箱 + 微信 | 可进入提交 |
| 两者空/仅空格 | 拒绝，并显示组错误 |
| 只有手机号 | 拒绝 |
| 无效邮箱 + 有微信 | 拒绝邮箱字段 |
| 姓名/公司空、未知 intent、超长内容 | 拒绝对应字段 |
| disabled | 零网络请求，无成功反馈 |
| 连续双击 | 单个进行中的请求 |
| 合法成功 JSON | 成功反馈和清理 |
| 422 / 429 / 500 / 超时 / 非 JSON / 不完整成功 JSON | 错误反馈，保留输入，可重试 |

单元测试验证数据规则；浏览器用拦截的合成响应验证状态与请求，不向真实外部接收端发送自动测试信息。真实收件是后续单独的发布验收。
