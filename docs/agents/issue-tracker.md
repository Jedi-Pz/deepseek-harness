# Issue tracker：GitHub

本仓库的 issue 与 spec 记录在 GitHub Issues 里，统一用 `gh` CLI 读写。

## 约定

- **建 issue**：`gh issue create --title "..." --body "..."`。多行正文用 heredoc。
- **读 issue**：`gh issue view <number> --json number,title,body,labels,comments`。
- **列 issue**：`gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`，配合 `--label`、`--state` 过滤。
- **把 issue 变成父 issue 的子 issue**：`gh issue create --parent <parent> ...`，或事后 `gh issue edit <parent> --add-sub-issue <child>`——这两个 flag 需要 `gh` 2.94+（本机为 2.92）。2.94 以下用 `gh api --method POST repos/<owner>/<repo>/issues/<parent>/sub_issues -F sub_issue_id=<child-db-id>`（数据库 id，见下方**阻塞**）：没有子 issue 支持时，退化为在子票正文顶部写 `Part of #<parent>`。
- **评论**：`gh issue comment <number> --body "..."`。
- **打标签 / 去标签**：`gh issue edit <number> --add-label "..."` / `--remove-label "..."`。
- **关闭**：`gh issue close <number> --comment "..."`。

仓库从 `git remote -v` 推断；在 clone 目录里 `gh` 会自动识别（本工作区当前为 `Jedi-Pz/deepseek-harness`，以 `git remote -v` 为准）。

## PR 是否作为 triage 入口

**PR 作为请求入口：否**（`PRs as a request surface: no`）。（只有 issue 进入 triage 队列；若以后要把外部 PR 当作功能请求，把这一行改成 `是`，下面的 `gh pr` 工作流随之生效。）

设为 `是` 时，PR 与 issue 走同一套标签与状态，用 `gh pr` 的等价命令：

- **读 PR**：`gh pr view <number> --comments`；看 diff 用 `gh pr diff <number>`。
- **列待 triage 的外部 PR**：`gh api --paginate 'repos/{owner}/{repo}/pulls?state=open' --jq '.[] | select(.author_association | IN("OWNER","MEMBER","COLLABORATOR") | not) | {number, title, author: .user.login, author_association, labels: [.labels[].name]}'`。
- **评论 / 打标签 / 关闭**：`gh pr comment`、`gh pr edit --add-label`/`--remove-label`、`gh pr close`。

GitHub 的 issue 与 PR 共用一个编号空间，裸 `#42` 可能是其中任一个：先用 `gh pr view 42` 解析，取不到再回退 `gh issue view 42`。

## 当技能说「publish to the issue tracker」

创建一个 GitHub issue。

## 当技能说「fetch the relevant ticket」

按上面的**读 issue**读取。

## Wayfinding 操作

供 `/wayfinder` 使用。**地图**是一张单独的 issue，**子票**是它的子 issue。

- **地图**：一张带 `wayfinder:map` 标签的 issue，承载 Notes / Decisions-so-far / Fog 正文。`gh issue create --label wayfinder:map`。
- **子票**：作为地图的子 issue 关联（见上面的**子 issue**）。仓库未启用子 issue 时，退化为：把子票加进地图正文的任务列表，并在子票正文顶部写 `Part of #<map>`。标签用 `wayfinder:<type>`（`research` / `prototype` / `grilling` / `task`）。认领后把驱动它的开发者指派上去。
- **阻塞**：用 GitHub 原生的 issue 依赖关系，这是 UI 可见的规范表示。加边：`gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`，其中 `<blocker-db-id>` 是阻塞者的数字**数据库 id**（`gh api repos/<owner>/<repo>/issues/<n> --jq .id`，不是 `#number`，也不是 `node_id`）。尚未关闭的阻塞者要用 GraphQL 读取：`gh api graphql -f query='query{repository(owner:"<owner>",name:"<repo>"){issue(number:<n>){issueDependenciesSummary{blockedBy}}}}'`；`gh issue list --json` 不接受该字段名。依赖关系不可用时，退化为在子票正文顶部写 `Blocked by: #<n>, #<n>`。每个阻塞者都关闭后，这张票才算解除阻塞。
- **Frontier 查询**：列出地图下所有未关闭子 issue（`gh issue list --state open`，范围限定在地图的子 issue / 任务列表内），丢掉有未关闭阻塞者（GraphQL `issueDependenciesSummary.blockedBy > 0`，或 `Blocked by` 行里还有未关闭 issue）的、以及已有 assignee 的；取地图顺序里的第一张。
- **认领**：`gh issue edit <n> --add-assignee @me`，是本会话的第一次写操作。
- **解决**：`gh issue comment <n> --body "<answer>"`，然后 `gh issue close <n>`，最后把上下文指针（结论 gist + 链接）追加到地图的 Decisions-so-far。
