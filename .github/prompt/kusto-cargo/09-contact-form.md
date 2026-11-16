# 09 · 产品部署说明与演示/试用表单

目标：完成页面结尾与可接通的表单，实现用户明确要求的邮箱/微信规则。依赖：05、03 done。

## 读取

[表单契约](specs/04-form-contract.md)、[内容规格](specs/01-product-content.md)、[手动 TODO](../../../docs/manual-todo.md)。

## 子步骤

### 09.1 部署说明、FAQ 与表单结构

完善托管/自部署说明及 FAQ，遵循产品含义。表单字段、label、autocomplete、长度、组说明、intent 及 CTA 预选依契约实现；不把邮箱与微信都设置为 required。

### 09.2 校验和状态机

实现无 DOM 副作用的 contact-validation 函数，并在浏览器脚本中编排 idle/validating/submitting/success/error。设置 AbortController 超时、重复点击锁、请求 ID 和错误聚焦。

disabled 默认模式不请求网络，清楚提示暂未开放并停用字段。remote 模式由非秘密配置启用，严格检查 HTTP 与响应结构；失败保留内容，成功才清理。不将服务端任意文本当 HTML。

### 09.3 单元与行为测试

引入 Vitest 并添加 `npm test`。测试表单规格中关键组合、空格、长度、invalid intent 和邮箱/微信规则。网络状态行为可通过测试注入 fetch/接收适配器验证，不依赖真实服务。

浏览器至少检查默认禁用模式、CTA 意向选择机制、标签/错误焦点；remote 完整矩阵在阶段 11 的隔离测试配置中验收。不能在正式 site.config.ts 填入假接收地址当作完成。

### 09.4 更新手动待办

保留用户负责的接收配置，补充接收协议、真实收件测试、隐私说明和 adapter 注意事项。未接通是真实状态，不能自动清空待办或生成可公开使用的假联系方式。

## 产物与验收

- Contact/Deployment/Faq、校验模块、提交适配器和有意义的单元测试。
- check/test/build/format:check 通过；disabled 无请求，组校验与错误文案正确。
- 本地实现可验收，即使实际接收端仍 deferred；明确区分“表单代码完成”与“送达已验证”。

## 断点

记录 `09.1`–`09.4` 及未完成测试矩阵，失败响应不改成 success 来通过测试。完成后转 10.1。
