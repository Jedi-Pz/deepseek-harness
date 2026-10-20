# 已存凭据的优先级规则

此前两类已存凭据的优先级相反：pi-ai 的 resolver 先读 `llm-pi-ai/<provider>` 下的已存记录、再读环境变量，而 Models 页面存下的 reference 却输给同名的已导出变量，于是请求用哪份凭据取决于 provider 家族，页面还会在该名字被导出时禁用 key 字段。现在已存凭据对所有 provider 都优先：`LocalCredentialProvider` 按 `$DSH_HOME/.credentials.yaml` > 继承的进程环境 > `<invocation cwd>/.env` > `$DSH_HOME/.env` 解析，保存总是写获胜层，`set` 与 `unset` 不再因为名字已导出而拒绝，`describe` 仍报告实际供给层。代价是 store 之上没有 per-run 覆盖、要临时换用导出值得另起一个 `DSH_HOME`，换来的是各 provider 一致的优先级和始终可写的 Models 页面。该优先级只在 store 挂载时成立：headless profile 不挂 store，headless 环境认证决定部分取代了 store 的 per-run 覆盖策略。

_来源：[Stored credentials take precedence over the launch environment](../../.agents/notes/implemented/architecture/2026-10-09-stored-credential-precedence.md)_
