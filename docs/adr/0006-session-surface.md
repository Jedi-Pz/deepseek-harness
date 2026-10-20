# 会话面：一次会话对外的稳定契约

会话面（surface）是日志之上由 `surfaceOp` 与 `sourceEventSeqs` 标记维护的有序投影，`deriveMessages()` 只沿这条投影派生模型历史；压缩等历史改写改为追加一条 replace 事件，记下被遮蔽的区间与来源 seq，而不是靠顺序敏感的 `agent/request` 监听器改写派生请求。这样每次历史操作都留下可回放的持久记录，新增改写方式也不必再改 core 的派生路径，代价是每个产生消息的事件都必须携带 `surfaceOp`，区间与来源还要由 `Session` 在 seed/append 时校验。

_来源：[Session surface — an ordered projection over the event log](../../.agents/notes/implemented/architecture/2026-06-18-session-surface.md)_
