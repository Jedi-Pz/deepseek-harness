# 会话持久化改用句柄式接口

上一版持久化 seam 把存储、Session 构造与生命周期混在一起，用全局 `session/*` 订阅、prepared-Session 缓存和 revision 轮询兜底，写所有权因此没有明确落点，也阻碍了跨进程写所有权。改为 `create`/`open`/`stat`/`list`/`flush` 五个服务方法加按会话的 `SessionHandle`，写所有权由 agent 生命周期在发布前显式交付、在同一次 teardown 中释放，未来的跨进程 lease 可以落在同一形状上；代价是后端插件重载会让存活会话的句柄失效并让写入直接报错，而不再静默重新认领旧日志，没有句柄的 `ctx.sessions.create` + `flush` 也不再持久化任何东西。

_来源：[Handle-based session persistence](../../.agents/notes/implemented/architecture/2026-08-27-handle-based-session-persistence.md)_
