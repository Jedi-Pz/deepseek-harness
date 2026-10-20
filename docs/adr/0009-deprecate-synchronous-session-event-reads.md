# 废弃同步式会话事件读取

`Session.eventAt()`、`Session.snapshotEvents()` 和 `Session.ownEvents()` 标记为 deprecated，禁止新的同步读取任意事件位置或区间，也禁止用新别名或包装重新暴露同一能力；既有调用可以延后迁移。理由是存储方向要求不再把完整事件序列常驻内存，而同步任意读一旦历史需要 I/O 便无法维持；代价是恢复后需要的状态必须由 projection 在 resume 时重建并增量维护，真正的全历史操作（如 fork）必须显式走存储读取，且当前实现仍把完整序列留在内存。

_来源：[Deprecate synchronous reads of arbitrary Session events](../../.agents/notes/implemented/architecture/2026-09-09-deprecate-synchronous-session-event-reads.md)_
