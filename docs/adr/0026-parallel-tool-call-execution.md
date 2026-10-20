# 工具调用并行执行

同一条 assistant 消息里的 sibling `tool-call` 串行执行会白白叠加彼此独立的读取与网络请求的延迟，而并发是否安全是宿主调度问题，不该硬编码工具名或写进模型可见的 schema。决定让每个工具用同步纯函数 `isConcurrencySafe(args)` 自行分类：只有显式 `true` 才允许与同样返回 `true` 的 sibling 重叠，连续可并行的调用进入由 `maxParallelToolCalls`（默认 10）限量的滚动池，exclusive 调用构成顺序屏障，只有 dispatch 与工具主体重叠而 `tools/pre-execute`、`tools/post-execute` 仍按模型顺序执行，`tool/result` 与 `additionalContexts` 由提交游标恢复模型顺序。换来的是不必硬编码工具名就能并行独立调用，且缺失、抛错或返回非 `true` 的分类器一律 fail closed；放弃的是一元分类器表达不了的关系型安全——两个写不同路径的写操作只能保持 exclusive——以及快结果可能被前一个慢 sibling 挡在提交游标之后。

_来源：[Parallel tool-call execution by per-call safety](../../.agents/notes/implemented/feature/2026-07-10-parallel-tool-call-execution.md)_
