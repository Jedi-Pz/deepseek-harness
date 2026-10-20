# 后台任务合并为统一 jobs seam

后台任务从「生产方重复声明输出、registry 维护三套词汇、三族监听器交付重叠事实」收敛为统一 jobs seam：一个 job 只有一条 output ring、一份 `JobView` 投影和一条 `events.subscribe` 流，模型读与观察者读共用同一份字节，通知记账移到 `dsh-tool-jobs`，roster 离开 session 控制流归 `dsh-api-job-controller`。换来的是接口层只有一处可学，代价是 Web 端把每个 live job 都渲染成可展开（没写过输出的任务显示空运行面板），且 roster 只发整帧、不逐次 append。

_来源：[One output ring, one projection, one event stream for background jobs](../../.agents/notes/implemented/architecture/2026-09-03-jobs-seam-consolidation.md)_
