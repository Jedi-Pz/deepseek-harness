# 统一的 GitHub 标签分类

PR 标签回答两个独立问题——这次改动属于哪种工作，以及它实质影响哪些长期领域——混用这两个维度、或同时保留 plain 与带前缀的同义标签，会让查询与策略执行变得有歧义，而封闭的 area 清单又会把新领域逼进不准确的分类。决定每个 open 或 merged 的 PR 恰好带一个封闭互斥集合里的 `kind/*`，并带至少一个实质受影响的 `area/*`（可扩展，当前清单由 GitHub 上活的 label 描述持有），Issue 改用原生 Issue Type 而不是 `kind/*`、`source/*` 只记录 Issue 的来源，标签迁移先加规范值再删旧值。换来的是意图、语义范围、来源、优先级与自动化触发可以分别查询，代价是维护者必须读改动本身——标题前缀和路径不再能推出分类——且每次分类变更都要付出历史回填与校验的成本。

_来源：[Unified GitHub label taxonomy](../../.agents/notes/implemented/process/2026-08-08-unified-github-label-taxonomy.md)_
