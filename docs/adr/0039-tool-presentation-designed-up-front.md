# 工具的 UI 呈现与实现一起设计

工具在实现时就同时设计它的 UI 呈现：Host 的 `presentCall` / `presentResult` 是只依赖 args 与结果的纯函数，因为它们同样跑在 live streaming 和 session-log replay 上；Web 卡片由 Client 从原始 `tool/call`、`tool/result` 事件与持久化的 `result.meta` 派生，Session 读取不执行 presenter、也不传输 view。只有模型可见文本无法无损表达的边界事实才用 `output.presentationMeta` 落进 `result.meta`，不存 React props、不在 Client 建第二个 presenter registry，畸形或旧输入回退 generic 卡片而不抛错。换来的是同一份 raw journal 同时服务模型与所有 UI，代价是每个工具在实现时就绑定呈现契约，且卡片语义归 Client 所有。

_来源：[Cookbook: adding a tool](../../docs/cookbook/adding-a-tool.md)（How your tool renders in a UI、Web Client presentation）、[Harness Packages](../../packages/AGENTS.md)、[Client-Derived Presentation from Raw Session Tool Events](../../.agents/notes/implemented/architecture/2026-08-23-client-derived-tool-presentation.md)_
