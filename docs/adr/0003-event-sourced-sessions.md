# 会话日志事件溯源，模型历史由日志派生

`Session` 是一份只追加的类型化 `SessionEvent` 日志，也是唯一事实来源：模型消息历史由 `deriveMessages()` 从日志派生，raw stream chunk 为 token 级回放保真而记录，但派生以组装完成的 `assistant/message` 为准，replay 与 fork 都只是拿既有日志给新会话做种子。相较「可变消息数组加通知事件」，事件溯源让日志本身就是状态，两者不可能分叉，回放、trace 与遥测因此是结构保证而不是外挂；代价是派生成本随日志变长，用 compaction 缓解而不是改写日志。

_来源：[Event-sourced sessions with derived message history](../../.agents/notes/implemented/architecture/2026-06-11-event-sourced-sessions.md)_
