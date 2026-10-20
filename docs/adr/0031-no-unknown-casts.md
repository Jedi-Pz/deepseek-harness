# 禁止新增到 unknown 的断言

经由 `unknown` 的断言会抹掉 TypeScript 对原值与目标类型之间的兼容性检查，而一次性清理全仓又会把规则落地与无关的类型、fixture 重设计绑在一起，因此决定在第一方 JavaScript 和 TypeScript（含测试、fixture、基准与脚本）中禁止新增 `as unknown` 与 `<unknown>`，并用按仓库相对路径与 token 指纹记录的精确基线冻结存量。这样规则可以立即生效，代价是存量断言继续作为各包可见的债务存在，且改动断言 token 或删除断言都必须同步维护基线条目。

_来源：[Prohibit new assertions to unknown](../../.agents/notes/implemented/process/2026-09-19-no-unknown-casts.md)_
