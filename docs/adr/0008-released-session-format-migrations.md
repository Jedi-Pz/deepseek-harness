# 已发布的会话格式只增不改：用版本化后继迁移

会话格式 v0 随 alpha 版本发布后，已提交的日志成为不可丢弃的用户数据，格式演进因此固化为「只增不改」：破坏性变更只能新增一条相邻版本的迁移边，把旧代转换为新的当前代，绝不移动、覆盖或删除已提交的旧代，也不承诺回退或降级。这使历史证据保持字节不变、每条旧日志都有唯一的正式转换路径，代价是每次破坏性变更都要维护一条迁移边和一份新代，旧运行时不能安全解释更新的代。整份 artifact 一次性迁移曾在 116 MB 的真实会话上耗尽 16 GB 堆，因此迁移边按记录流式推进，不再物化源与中间版本。

_来源：[Released Session formats migrate through stateful streaming stages](../../.agents/notes/implemented/architecture/2026-08-31-released-session-format-migrations.md)_
