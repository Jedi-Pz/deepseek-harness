# 一切皆插件：Cordis 组合，没有特权内核

DeepSeek Harness 的每一部分——模型适配器、工具注册表、会话日志乃至 agent loop 本身——都是挂在共享上下文上的 Cordis 插件，一次运行只是 profile 与 bundle 分层组合出的一棵插件树，因此没有需要打补丁的特权内核，扩展的方式是把插件挂载到其他插件旁边，注册作为 effect 随插件卸载而回收。换来的是任何一层都能从配置整体替换、换实现不必 fork 产品，放弃的是「就地改一行」的自由：新行为必须落在已声明的扩展点上。

_来源：[DeepSeek Harness Architecture](../../docs/architecture.md)_
