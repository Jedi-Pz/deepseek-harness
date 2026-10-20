# Cookbook：删除 package 或功能

[English](removing-a-package.md) | 中文

删除 package 或能力没有倒挡。下面这份清单同时去掉代码、提到它的生成产物，以及那些会继续描述它的记录。

## 1. 先把决定记下来

删除是一项持久决定。在 `docs/adr/` 新增一条 ADR 写清删掉什么、为什么；如果它取代了早先的决定，就用新 ADR supersede 那条，而不是改写它。按 [Agent Notes README](../../.agents/notes/README.zh.md) 的归档与删除规则处理对应笔记；当删除的是对外可见的接口时，按[升级指南](../../.agents/skills/dsh-create-upgrade-guide/SKILL.md)的要求记录一条。

## 2. 删除 package

删除 `packages/<group>/<pkg>/`，再运行 `pnpm run clean`——它负责清掉已删除 package 留下的构建产物与残留（[clean.ts](../../scripts/clean.ts)）。

然后从根 TypeScript 聚合工程里移除它：

- `tsconfig.host.json` 或 `tsconfig.client.json` 的 `references`。
- 组 README 的包表。
- 组本身消失时，更新[组表](../../packages/README.zh.md)与根 `AGENTS.md` 的 Repository layout。

## 3. 重新生成生成产物

过期的生成页面会在新鲜度门禁上变红。让 `pnpm run doc-sync` 指出过期项，再重新生成受影响的产物：

```sh
pnpm run gen-plugin-packages
pnpm run gen-config-catalog
pnpm run gen-tool-catalog
pnpm run gen-session-format-catalog
pnpm run gen-persistence-catalog
pnpm run gen-module-graph
pnpm run gen-cli-help
pnpm run gen-third-party-notices
```

## 4. 修复引用

- 修掉或删掉每一处入站链接；`pnpm run verify-md-links` 会点名坏链。
- 被删包拥有领域术语时，更新对应上下文的术语表以及它在 [GLOSSARY-MAP.md](../../GLOSSARY-MAP.md) 里的映射行。
- 删除已发布页面时，同时更新 `website/docs.ts`，并整组删除双语三件套（`*.md`、`*.zh.md`、`*.i18n.yaml`）。
- 删掉只服务该 package 的工作流状态、设置键与组合配置。

## 5. 处理持久数据

删除的功能若曾写 Session 事件、持久化类型或线上格式，读取义务仍然保留：

- 继续读所有已提交的世代，或加一个以版本命名的后继。绝不移动、覆盖或删除已发布的世代。
- 在持久化变更历史与升级指南里记录这次转换。
- 只保留以「该行为不存在」为对象的测试，停止测试已删除的行为。

## 6. 验证

```sh
pnpm install
pnpm run clean
pnpm run doc-sync
pnpm run constraints && pnpm run typecheck && pnpm run lint
pnpm run build && pnpm run hygiene
```

删除相关的行为级检查由[仓库测试策略](../testing.zh.md)负责。
