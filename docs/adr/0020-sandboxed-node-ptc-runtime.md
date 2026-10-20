# PTC 运行时跑在沙箱里的 Node 进程

Node worker 只隔离 JavaScript 状态，却不套用调用 Session 的 OS sandbox 策略，模型代码可以直接 import 文件系统与子进程 API 绕过 tool-policy 路径，而终止 worker 也不能证明它的子进程已经停止。因此 `dsh-ptc-runtime-node` 的默认 `per-call` 模式把每个程序放进一个新 Node 进程：host 通过与 Bash 相同的 `ctx.sandbox` provider 约束启动，把进程生命周期交给 `ctx.subprocess`，子进程只拿到空模型环境和 host 提供的异步 bindings，执行后不留 worker 或常驻 kernel。代价是每次 `run_code` 付出 Node 进程启动与 sandbox 准备的开销、清理可能延长调用方等待，后代进程的强隔离仍取决于所选 subprocess backend，换来的是直接 Node API 受 OS 策略约束且程序效果只结算一次。

_来源：[Sandboxed Node execution for PTC](../../.agents/notes/implemented/architecture/2026-09-11-sandboxed-node-ptc-runtime.md)_
