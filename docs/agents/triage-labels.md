# Triage 标签

技能用五个规范 triage 角色讨论问题，本文件把角色映射到本仓库 issue tracker 实际使用的标签字符串。

| 技能里的角色 | 本仓库标签 | 含义 |
| ------------ | ---------- | ---- |
| `needs-triage` | `needs-triage` | 维护者需要先评估这张 issue |
| `needs-info` | `needs-info` | 等待报告者补充信息 |
| `ready-for-agent` | `ready-for-agent` | 已完整描述，可交给 AFK 的 agent 直接实现 |
| `ready-for-human` | `ready-for-human` | 需要人来实现 |
| `wontfix` | `wontfix` | 不会处理 |

当技能提到某个角色（例如「给这张 issue 打上 AFK-ready 的 triage 标签」），用表里对应的标签字符串。

分类角色映射到 issue 的 native Issue Type（`bug` / `enhancement`）：Issue 用 Issue Type 表达类别，`kind/*` 与 `area/*` 只用于 PR，不要为 issue 打这两类标签。除此之外不额外强制任何标签。

要换词表时，直接改「本仓库标签」这一列。
