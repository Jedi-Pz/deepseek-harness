# 包角色词汇表决定包与 `ctx` key 的命名

包名只描述当前稳定的职责：接口包命名能力，实现包补上区分它的机制、协议、环境或 vendor，不用首个实现、未来扩张或 Cordis 基类命名，角色词按一张「何时可用、何时不可用」的判据表取用（Controller/Store/Directory/Presenter/Registry/Runtime/Resolver/Binder/Engine/Policy/Executor/Gateway/Provider/Backend/Handle/Config/Service，`SDK` 只指 Python 与 TypeScript SDK 的 JSON-RPC 协议）。Cordis `ctx` key 与类角色同数：单个 engine、runtime、policy、controller、resolver、store 或当前配置用单数，registry 或持有多具名成员的服务用复数，Host 与 Client 两个面不共用同一个 `Context` key。这样名字的含义由职责而非历史决定，代价是每次新增包或服务都要逐条过这套判据。

_来源：[Cookbook: adding a workspace package](../../docs/cookbook/adding-a-package.md)（Name the role that exists）、[Harness Packages](../../packages/AGENTS.md)（Naming rules）_
