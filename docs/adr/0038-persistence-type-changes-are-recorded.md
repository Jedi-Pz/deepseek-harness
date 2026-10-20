# 持久化类型变更必须留下变更记录

声明为持久化的类型一变，就在同一变更里记录精确转换而不是只改代码：`pnpm run persistence-changes --record <date>-<slug> --prose <file>` 为每个受影响的 root 保存 after digest、完整 after schema 与中英双语的 summary/compatibility/verification。记录绑定在 root 的 after digest 上，前一条记录的 after schema 充当后一条的 before schema；同版本变更要显式 `--decision same-version` 并在 Compatibility 里解释两个读取方向，只有既有判别标记无法阻止不安全解释时才升 `SessionHeader.version`。这样评审拿到的是可比的 before/after 结构证据，代价是每次类型变化都多一份必须人工写解释与已执行验证证据的记录和一次评审。

_来源：[Cookbook: reviewing persistence-type changes](../../docs/cookbook/reviewing-persistence-type-changes.md)、[In-tree persistence-type history](../../.agents/notes/implemented/process/2026-09-11-persistence-type-history.md)、[Recorded user-source attribution compatibility](../../.agents/notes/implemented/architecture/2026-09-17-persistence-attribution-policy.md)_
