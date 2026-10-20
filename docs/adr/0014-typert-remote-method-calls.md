# 远程方法调用走 Typert 型图

一对一的远程方法调用归实现它的业务 Service 所有：继承 `TypertRemoteService` 并用 `@Remote` / `@RemoteScope()` 标出可远程调用的方法，Typert 从 Host Program 生成 Host 反射与平台无关的 Remote 消费投影，取代中央 API Proxy、路由表和手写 client stub。这样新增一个方法只需在业务包内声明一处，代价是 Remote 类型依赖生成的 `lib` 声明（构建必须先完成 Host 契约）、参数位置受限（lookup 只占一个顶层参数）；发布包要带 `.d.ts.map`，但它指向的 `src` 不随包发布，published map 在包外解析不到目标，跳转只在 workspace 通过 package link 生效。

_来源：[Typert Gateway Targeted Method Calls](../../.agents/notes/implemented/architecture/2026-08-02-typert-remote-method-calls.md)_
