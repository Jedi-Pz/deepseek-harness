# 对等主体与远程访问的权限模型

Remote 方法原先无法知道自己代表谁：Connection 只有一个 operator Peer，Gateway 在调用方未指名时静默回落到 `operatorPeer()`，于是首个非 owner 调用方 liveshare viewer 的 prompt 被当成 owner 自己的输入。新模型把 caller identity 收敛为只能由进程内 Host 代码在创建 Peer 时设置的 `principal`，wire 字段不能设置或覆盖，每个调用路径显式指名自己的 Peer；Gateway 把 `@Remote({ resources })` 解析出的资源交给 `remote-access` 按 role、binding、policy 决策，前端读同一份 snapshot，user message 的 `source.principal` 记录发起者。代价是 Connection 与 Gateway 的 breaking rename、非 owner 可调方法必须声明其触达的每个资源（否则落到 `global` 被默认拒绝）、以及所有浏览器连接共享一个 Peer；换来的是权限在 Host 单点计算与执行、身份无法从请求体伪造，且规则变化自动传导到前端显隐。

_来源：[Peer principals and method-level Remote access control](../../.agents/notes/implemented/architecture/2026-10-12-peer-principal-and-remote-access.md)_
