# 浏览器与桌面自动化（automation）

这个上下文让模型经一个配置好的后端去看和操作网页与本地桌面：DSH 拥有任务循环，provider 提供操作与状态。两组包（browser use 与 computer use）结构相同，共同点是一处具名且排他的 provider 注册，以及「谁拥有浏览器或桌面」这条所有权线。

## Language

### 能力

**browser use**：DSH 的网页自动化能力：模型通过配置好的后端检查并操作网页。任务循环归 DSH，浏览器操作与跨回合的浏览器状态归 provider。

**computer use**：DSH 对本地桌面自动化能力的称呼：模型观察并操作这台机器的桌面，操作与平台要求由 provider 提供。上游实现叫 Cua Driver，能力本身仍是 computer use。

_Avoid_: CUA

### Provider 与注册

**browser provider**：一种浏览器后端，自带浏览器工具与操作，并在共享 browser-use 服务上占住唯一 provider 槽位。同一部署同一时刻只有一个 browser provider。

**computer-use provider**：一种桌面后端，自带上游工具目录、权限与平台要求，并在共享 computer-use 服务上占住唯一 provider 槽位。它不为某个会话保留桌面。

**browser registration**：provider 在 `ctx.browserUse` 上占住唯一槽位的那份贡献。它以自己的名字为身份，第二份注册——即使同名——直接失败，槽位直到释放前都归它。

**computer-use registration**：落在 `ctx.computerUse` 上的同构贡献，同样是具名、排他的唯一槽；启动失败会释放本次尝试。

### 所有权与生命周期

**per-Session ownership**：浏览器资源归使用它的那一个活体 Agent 与会话所有，不归共享服务或整个部署所有。

**launched browser**：由 provider 自己启动、随所用会话运行时而关闭的浏览器。它的 profile 与登录状态属于浏览器自己，不进入会话日志。

**attached browser**：外部拥有、由 provider 在自己的实例内为一个会话预留的浏览器。它保留原有浏览器状态，拒绝第二个会话同时附加，拆除时只断开而不关闭。

**activation**：一次按 provider 配置启用浏览器后端的实例，绑定在一个新建或恢复的会话上。配置在 launch 与 attach 之间选定这次接入的方式。

**browser profile**：浏览器自己的用户配置与登录状态。它属于浏览器而不属于会话日志，因此会话重新加载或 fork 时不会从日志里恢复。

**browser MCP client**：provider 为每个在它加载之后创建的活体 Agent 初始化的一条 MCP 连接，负责连接与发现。它随会话跨回合保留。

### 上游与共享

**Cua Driver**：computer use 依赖的上游桌面驱动实现的名字。DSH 通过 Cua Driver MCP 与 Cua Driver native 两种 provider 使用它，但能力层仍称 computer use。

**desktop sharing**：桌面作为多个会话与 DSH 进程共用资源的属性：没有哪个已注册的 provider 会为单个会话预留桌面，完整的观察、操作、验证流程由调用方协调。

_Avoid_: exclusive desktop
