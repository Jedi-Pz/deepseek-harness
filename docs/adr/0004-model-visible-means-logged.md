# 模型可见即已记录：模型输入必须可从会话日志重建

原则是模型可见 ⟺ 可从日志重建——任何进入模型请求的内容都必须由会话日志及其引用的不可变、内容寻址对象还原出来：`request/header` 记录调用配置与 tool schema，渲染后的系统提示词作为 `system/message` 进入派生历史，循环请求由这两者冻结而成，而不是按调用临时拼装。于是前缀缓存稳定、逐字节审计回放、以及漂移可归因的 resume 与 fork 都是派生结论而非另行维护的机制；代价是每个循环实例和真实变更都要写完整 header 快照（比 delta 编码占更多日志），compaction、真实提示词或工具变更仍要向 provider 付全价。

_来源：[Every LLM request is reconstructable from the session log](../../.agents/notes/implemented/architecture/2026-07-05-reconstructable-requests.md)_
