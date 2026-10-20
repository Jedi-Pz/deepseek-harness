# Domain Docs（领域文档）

技能在探索代码库时应如何消费本仓库的领域文档。

**布局结论：multi-context。** 领域文档按上下文组织：每个上下文一份 `GLOSSARY.md`（当前 14 个），根目录的 `GLOSSARY-MAP.md` 是索引，列出全部 52 个 package 组到上下文的映射与相互关系；系统级架构决定记录在 `docs/adr/`。

## Before exploring, read these

- 根目录 **`GLOSSARY-MAP.md`**：它指向每个上下文自己的 `GLOSSARY.md`。读与当前主题相关的那几份。
- **`docs/adr/`**：读与即将改动的区域相关的 ADR。本仓库的 ADR 是「一句话决定 + 指向完整论证的链接」，完整 rationale 仍由对应的 Agent Note（`.agents/notes/`）持有。
- 上下文自己的 `packages/<group>/docs/adr/`（如果存在）：也要读。

如果这些文件不存在，**安静跳过**：不要提示缺失，也不要建议立刻补建。真正写下第一个词条或第一条决定时，才由 `/domain-modeling` 等技能惰性创建。

## File structure

本仓库是 multi-context（根目录有 `GLOSSARY-MAP.md`）：

```text
/
├── GLOSSARY-MAP.md                    ← 上下文索引与相互关系
├── docs/
│   ├── adr/                           ← 系统级决定
│   └── agents/                        ← 技能配置（本文件所在）
└── packages/
    ├── core/
    │   ├── GLOSSARY.md
    │   └── docs/adr/                  ← 上下文级决定（需要时才建）
    └── llm/
        └── GLOSSARY.md
```

## Use the glossary's vocabulary

当输出要提到某个领域概念（issue 标题、重构提案、假设、测试名），用 `GLOSSARY.md` 里定义的术语，不要漂移到它明确列在 `_Avoid_` 里的同义词。

需要的概念还不在术语表里，这是一个信号：要么你在发明项目不用的语言（重新考虑），要么确实存在缺口（记下来，交给 `/domain-modeling`）。

## Flag ADR conflicts

如果输出与已有 ADR 冲突，显式说出，不要静默覆盖：

> _与 ADR-0007（事件溯源订单）矛盾，但值得重开，因为……_
