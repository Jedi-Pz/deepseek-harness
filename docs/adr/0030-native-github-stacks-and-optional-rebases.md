# 用 GitHub 原生 stacked PR，rebase 可选

只用 base 分支表示的依赖 PR 链没有官方 stack 身份，落地要人工逐个合并、保住每个中间分支、把每个子 PR 重新指向新 base，事后还得判断这条链是否还在；而对已评审分支一律禁止重写的规则，又会把原生 `gh stack` 的级联同步工作流一起排除。决定同仓库中两条及以上依赖 PR 组成的链在落地前必须使用 GitHub 官方 stack 对象，以活的 `PullRequest.stack` 与 `stackEntry.position` 为准，缺失原生支持或跨 fork 的链一律停手，同时不再对已评审分支全面禁止改写：merge-forward 与 rebase 都是允许的刷新历史，但远端重写只能走精确 lease 或 `gh stack` 的带 lease 推送、禁用 `--force`，`gh stack sync` 之后立即校验。换来的是 GitHub 承担 stack 顺序、trunk 规则、每层 CI 与自底向上的合并和重定向，代价是 rebase 会让 commit hash、approval 和评论锚点失效，每次重写推送都要重做一次活的评审与检查审计，`gh stack sync` 也可能短暂发布本地证据尚未通过的代码。

_来源：[Native GitHub stacks and optional PR rebases](../../.agents/notes/implemented/process/2026-08-02-native-github-stacks-and-optional-rebases.md)_
