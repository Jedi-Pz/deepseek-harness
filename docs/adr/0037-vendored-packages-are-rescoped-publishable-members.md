# vendored 包是改写 scope 的发布成员

上游 Cordis 包以 pinned source 复制进 `vendor/<dir>/` 后，把 `name` 改写到 `@deepseek-ai` scope（`cordis` → `@deepseek-ai/cordis`、`@cordisjs/plugin-<x>` → `@deepseek-ai/cordis-plugin-<x>`），保留上游的 `exports` 与 `type`，并作为可发布成员不设 `private: true`、设 `publishConfig.access: public`；vendored 之间的引用走 `workspace:~`，本地解析到 workspace、发布范围允许同 minor 的 patch 更新。`scripts/rescope-vendor.ts` 用 `vendor/README.md` 的两列名字锁定这层改写，每次 sync 后以 `pnpm run rescope-vendor --apply` 重放、由 `rescope-vendor:check` 在 hygiene gate 断言结果。换来的是框架层与 harness 一起发布、拥有可审计的 npm 身份，代价是每个 vendored 包都要付一次性的改写成本，以及每次同步后重放改写并更新本地修改日志的持续成本。

_来源：[Cookbook: adding a vendored package](../../docs/cookbook/adding-a-vendored-package.md)、[Vendored Packages](../../vendor/README.md)、[Public package manifest fields](../../.agents/notes/implemented/architecture/2026-09-10-public-package-manifest.md)_
