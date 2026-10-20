# Agent Teams：隐式 Lead 与具名可续队友

subagent seam 只有直接父子控制，没有 peer 通信、稳定的具名 roster 或共享任务所有权，而所有同进程 Agent 又共享一个 checkout，把队友名或 task owner 当文件锁只会掩盖而不是解决并发写入。因此每个普通 runtime root 都是以其 `SessionId` 标识的 Team 的隐式 Lead，Team 没有创建事件，roster 扁平且名字是不可变的小写 kebab-case，每个队友都是保留 Session id 的可继续直接子级、只能由 Lead 创建或中断，共享 task 是用 `expectedRevision` 做 compare-and-set 的完整快照；实现在显式 opt-in 的 `@deepseek-ai/dsh-experimental-agent-team` 与 `@deepseek-ai/dsh-experimental-tool-agent-team` 两个包中，因为若进默认目录，scoped Team 控制会遮蔽同名 legacy global，无请求的委派还会给简单任务增加延迟与 token 成本。代价是 Lead Session 保留整份成员与任务快照及历史 mailbox（append-only，偏重可检查的恢复而非紧凑 delta），活跃成员可能不驻留而带来冷恢复延迟，协调也不能消除 filesystem compare-and-set 之外的写入；换来的是默认工具目录与简单任务行为不变，Team 还能跨 activation 结算与进程 teardown 存活。

_来源：[Durable Agent Teams over continuable children](../../.agents/notes/implemented/feature/2026-08-05-agent-teams.md)_
