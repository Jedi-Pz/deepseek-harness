# 超大工具输出溢出到文件，引用返回给模型

工具结果默认经 `tools/post-execute` 由 `dsh-spill-policy` 处理：超过 `maxInlineTokens` 的最终文本/图像结果在模型侧只保留有序预览，完整文本结果（图像以可读路径代替）经最小化的 `SpillStore` 存入会话作用域文件，模型拿到 `Branded<'SpillLocator'>` 与 `retrievalHint`，可用现有 `read`/`grep` 自查。这让模型请求只承载有界预览、完整结果仍可访问，同时 seam 只承诺不透明 locator，远程后端可以返回 URI 或 key 而不假设一定是文件路径；代价是策略只看得到最终格式化文本，provider 在更早阶段已截断掉的原始内容与从未进入 `ToolExecutionResult.content` 的运行时产物无法被它保存，本地后端还依赖一条前提：`read`/`grep` 的读取不被限制在工作区内。

_来源：[Tool output spill policy](../../.agents/notes/implemented/architecture/2026-07-08-tool-output-spill-files.md)_
