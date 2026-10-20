# 新 package 组只是容器，包只住一层

每个包只属于一个组，组目录本身是纯容器：不放 `package.json`、不放源码，包始终位于组下一层（`packages/<group>/<pkg>/`）。包的归属因此由位置唯一决定，根 `package.json` workspaces、`tsdown.config.ts`、`.oxlintrc.json` 等通配配置无需编辑；新增组要同步 `tsconfig.base.json` 的 `@deepseek-ai/dsh-*` wildcard candidate 与 `packages/README.md` 的组表。换来的是每个包恰好一个组、组 README 是唯一包地图，代价是多一层目录与新增组时的登记工作。

_来源：[Cookbook: adding a workspace package](../../docs/cookbook/adding-a-package.md)、[Packages](../../packages/README.md)、[AGENTS.md — Repository layout](../../AGENTS.md#repository-layout)_
