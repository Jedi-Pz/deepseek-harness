# 持久 PTY 会话

每次 `bash` 前台执行都起一个新 shell，cwd、导出的变量、venv 激活、job control 和交互式子进程都随该次调用结束，`gdb` 单步、REPL 探索、打断前台命令后回到同一个 shell 这类状态留在终端里的工作因此做不了。决定新增可选的终端能力族，在 `ctx.terminals` 后面提供由 Agent 拥有、按行交互的持久 PTY 会话：会话只在工具调用中创建并绑定创建它的 `Agent`，spawn 时解析出的 sandbox mode 与 workspace root 就是该 PTY 整个生命周期的进程边界，全屏 TUI、按键序列、进程丢失后的恢复和跨 agent 共享明确推迟（deferred）、不在本次范围，`bash`、`read`、`write`、`edit` 仍是有界操作的默认工具。换来的是终端状态可以跨调用延续，放弃的是一次性工具更强的校验、审批与回放契约——PTY 会话更难审计，macOS 和拿不到内核证据的场景只能给出启发式 idle 推断，会话与 scrollback 也不随 harness 进程存活。

_来源：[persistent PTY sessions](../../.agents/notes/implemented/feature/2026-07-16-persistent-pty-sessions.md)_
