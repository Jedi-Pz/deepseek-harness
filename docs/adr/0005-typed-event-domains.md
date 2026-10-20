# 事件按域划分，用声明合并扩展事件映射

事件按域分工：`session/*` 是持久、可回放的 JSON 事实日志，`agent/*` 是携带 live `Agent` 的运行时信号（拦截 waterfall 与瞬态通知），`tools/*` 是工具注册表与执行管线，三类事件都通过 TypeScript 声明合并扩展各自的映射。边界规则因此只有一条——持久可回放的事实写成 `SessionEvent`，live 拦截或瞬态信号才走 `agent`/`tools`——turn/step 边界只作为日志事件存在，不再镜像成 `agent/*` 事件；这消除了同一事实的两个真相源，也让 hook 订阅只有一个明确答案，代价是边界消费者改读 `session/event`，拿不到边界处的 live `Agent`。

_来源：[Event-domain semantics — session is the fact log, agent is the live event channel](../../.agents/notes/implemented/architecture/2026-06-30-event-domain-semantics.md)_
