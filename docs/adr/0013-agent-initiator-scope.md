# 按发起 agent 划分注册作用域

`ctx.agents` 用 Node `AsyncLocalStorage` 承载发起当前异步操作的 Agent，替代动态 `ctx.agent` 与进程级 `currentAgent`：注册作用域（`agent.ctx`）与一次操作的主体不是一回事，只有异步链能让并发驱动各自隔离，也让 logger、tracing、host-aware transport 这类底层基础设施不必逐层转发 `agent`。代价是签名里多一层隐式依赖、ALS 有持续传播开销且不跨 worker、进程与 HTTP 边界，因此它只服务受信任的进程内链，会话、取消与所有权仍由显式参数承担。

_来源：[Initiating Agent scope over AsyncLocalStorage](../../.agents/notes/implemented/architecture/2026-07-15-agent-initiator-scope.md)_
