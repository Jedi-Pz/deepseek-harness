# fork 出的子会话保留父级请求前缀

fork 用父级已完成轮次的前缀给子 Session 做种子，种子要花 token，只有在相同 provider 与模型下、子请求开头字节与父级一致时才能换来 provider 侧的前缀复用；子级专属的系统提示词 section 或工具 schema 出现在继承历史之前就会破坏它。早期组合因此把 fork 子级限制为 one-shot，而那只是当时 child-only 返回工具的后果：现在 `send_message` 在所有 Agent 上全局注册，可继续的 fork 子级拿到与父级相同的工具名、描述、schema 与顺序，含直接 parent id 与返回指引的初始任务追加在继承种子之后，base bundle 与 `cordis`、`standard`、`ptc` preset 都把 fork 绑到 continuable 生命周期。代价是逐字节前缀复用仍取决于 provider、模型与组装输入，冷恢复时历史 child descriptor 的 `toolFilter` 还可能重新引入差异；换来的是 fork 子级在保留请求前缀的同时可以多轮续聊。

_来源：[Forked children preserve the parent request prefix](../../.agents/notes/implemented/architecture/2026-08-10-fork-children-stay-one-shot.md)_
