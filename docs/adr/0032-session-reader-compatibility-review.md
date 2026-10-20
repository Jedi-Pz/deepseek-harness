# 会话读取兼容性评审

结构性 schema 差异本身既不能证明需要升 `SessionHeader.version`，也不能证明旧读取器会安全拒绝，因此把读取器行为定为版本判据：旧读取器能正确恢复、安全忽略并保留可选特性，或在执行、修改与尾部修复前拒绝必需特性时，允许同版本变更；只有既有判别标记无法阻止不安全解释时才升版本。这样避免了无谓的代际与相邻迁移，代价是每处 schema 差异都要留下显式的同版本决策与新、旧读取器证据，而书面评审不能替代对实际准入与修改路径的验证。

_来源：[Session versions follow reader compatibility](../../.agents/notes/implemented/process/2026-10-08-session-reader-compatibility-review.md)_
