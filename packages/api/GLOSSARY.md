# 远程 API

本上下文是 Client 与 Host 之间的远程层：Client 环境把 Host 上运行的业务能力当作类型化方法来调用，取回结果或流，并观察转发过来的 Host 事件。同属这一上下文的还有两条让外部进程驱动 harness 的通道——SDK 的 JSON-RPC 与只面向自动化的 ACP。

## Language

### 远程调用

**Remote method**：Host 上一项对外暴露的业务能力，用命名空间加方法名标识，参数按名过线，并带一份生成的描述符。

_Avoid_: Remote endpoint

**Remote namespace**：把一组 Remote 方法归到同一条线上的命名空间，缺省取拥有这些方法的服务键；Client 以它作为调用入口。

**InvocationDescriptor**：对一个可调用方法的完整描述，涵盖身份、命名空间、参数、编解码与结果；它是两侧各自生成的本地反射，不是线上消息。

_Avoid_: wire message

**Remote stream**：一条在单一载体上承载的逻辑流，包含 Host 向 Client 交付的项，以及同一条流上可选的 Client 回传项与取消。

**uplink**：Client 在一条逻辑流上回传给 Host 的项，由接收方法从调用上下文读取，不进入参数列表。

**forwarded event**：Host 上的一条 Cordis 事件经 Remote 事件流转推到 Client 后的形态，Client 以订阅方式接收；只有活动的 owner Client 事件流才能应答其中需要接续的请求。

### 型图

**Typert**：由源码类型声明在构建期产出的类型图，给出 Host 与 Client 两侧共享的 schema、包反射与方法描述符，让跨进程调用不必手写线协议代码。

**Typert registry**：运行时保存生成 schema、包反射与方法描述符的注册表，同时容纳 lookup、Context 与资源种类的提供者。

_Avoid_: schema registry

**Host Gateway**：Host 侧接收 Remote 请求的入口，把线上的命名空间、方法与命名参数对接到当前活跃的业务服务，并把基础设施与边界失败表示为网关错误码。

**Consumer Remote**：Client 侧的远程能力面，只暴露显式导入的生成产物所贡献的命名空间，并把它们挂载为调用方作用域内的子服务。

_Avoid_: Remote client

**lookup**：一项声明，把某一类 Host 业务对象与其线上身份对应起来，使方法参数可以按身份过线，而不是按对象结构序列化。

_Avoid_: reference

**Context declaration**：一项声明，把某一作用域 Context 种类与其线上身份对应起来，使调用可以经上下文选取接收者，而无需把上下文放进参数。

### 身份与访问

**Peer**：一位 Client 在本 Host 上的一次会话，调用者身份在创建时固定，其注册随 Peer 释放。

_Avoid_: client connection

**Principal**：一次调用的调用者身份，授权层只读它；`owner` 指本 Host 的本地用户，其余种类由各自的接入方声明。

_Avoid_: user

**Remote Access**：所有 Remote 方法的访问控制面：非 owner 调用只有在 principal 的策略于调用触及的每个 resource 上都绑定允许该端点动作的角色时才放行。

**resource**：一次调用或转发事件所触及的对象，取值为内建的 `global`，或某个已声明资源种类的一个身份。

### 外部驱动通道

**SDK protocol**：跨进程驱动一个完整 harness 运行时的线协议，以换行分隔的 JSON-RPC 请求、结果与通知交换命名消息。

_Avoid_: SDK wire format

**ACP server**：以 Agent Client Protocol 暴露 harness 的服务端，供程序创建、恢复和关闭会话并收发提示与语义更新，全程无需人在环。

_Avoid_: ACP client
