# 用统一的超时/截止时间库而不是散落定时器

超时的「计时与分类」抽成 `packages/util/` 下的纯函数库 `@deepseek-ai/dsh-timeout`（`clampTimeout`、`deadline`、`idleWatchdog`、`timeoutOf`），而不是 cordis service 或插件；真正的终止——终止进程、拆除 socket、结束 iterator——仍由各 capability 自己实现。超时逻辑此前在 bash、web_fetch 等工具里各写一套：夹取上限、起定时器、融合 upstream 取消、区分超时与取消，web_fetch 手写的那套 controller 与 `signal.reason` 恢复正是容易出错的证据；而各类工作的终止机制本质上不同，共享层无法统一知道如何停止它们。代价是每个 capability 仍需自己监听 signal 并驱动终止，本地文件工具继续保持无超时，`web_search` 也仍未加超时。

_来源：[A shared timeout/deadline primitive, with hard-kill left to each capability](../../.agents/notes/implemented/architecture/2026-07-06-timeout-deadline-library.md)_
