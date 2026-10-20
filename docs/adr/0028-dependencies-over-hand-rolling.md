# 优先用维护中的依赖，而不是手写替代

仓库大量手写 SSE 解析、协议分帧、重试循环和 glob 匹配，这并非有人决定过「不加依赖」，而是 agent 从既有依赖表反推出的、比任何人的决定都更严的潜规则，每一份手写的库克隆都要自己测试、记录和审查。决定把引入维护中的外部依赖当作一次正当的简化：只要替换真正减少我们拥有的代码、测试与契约面，包处于活跃维护、传递依赖合理，其语义覆盖实际契约，就优先用依赖替掉手写实现；`packages/util/` 的 zero-dependency 章程只约束 export 面而不禁止外部包，schemastery、vendored Cordis、`@earendil-works` twins 这些已记录的 seam 不因此重开。换来的是不必再维护别人早已修好的边界情况，代价是依赖与供应链面随依赖表增长，且判断落在每个 PR 的证据上而不是一份需要长期维护的白名单。

_来源：[Prefer maintained dependencies over hand-rolling](../../.agents/notes/implemented/process/2026-07-26-dependencies-over-hand-rolling.md)_
