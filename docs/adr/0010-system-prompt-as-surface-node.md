# 系统提示词作为会话面节点随日志演进

系统提示词不再寄存在 `request/header` 的 `system` 字段，而是作为普通 surface 事件 `system/message` 成为 surface node 0，prompt 的每次生命周期变化都表达为对该节点的 `SurfaceOp` append 或 replace。于是「模型看到了什么」只有一个来源——折叠 surface——prompt 变更与 tool/config 变更在日志中可区分（节点替换后跟 `series` header，config 或 tools 变更则是 `change`），也为后续把 system 消息放进历史留出了表示；代价是 `EpochHeader` 去掉 `system` 字段后旧读者在编译期失效，snapshot fixture 改由 `system/message` 事件承载提示词。

_来源：[The system prompt is surface node 0](../../.agents/notes/implemented/architecture/2026-09-02-system-prompt-as-surface-node.md)_
