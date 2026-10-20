# 每个包 README 必须写 Model Experience 与已知限制

模型可见的 context 效果由 owning package 在自己的 README 里逐字段声明：每个直接、条件、capped、生命周期或辅助 context surface 一个 H3，配 `What the model sees`、`Token effect`、`KV Cache effect` 三个 H4，system-prompt 等稳定文本原文照抄，tool schema 只链接生成的 tool catalog 锚点并只写那里没有的差异。README 以 `## Known Limitations and Deferred Work` 收尾，无直接 context 效果或路径完全由 consumer 呈现的包用 verifier 审计过的 `None, as ` / `Indirectly, through ` 短句，模型无关的通用包才进 allowlist 省略。这样审阅者从任一包就能看到它向模型请求贡献了什么、token 如何增长、哪一步会打断可复用的 KV cache 前缀，代价是每条模型可见输入或生命周期变化都要同步维护这段声明，并由 `verify-package-readme-model-experience` 检查结构。

_来源：[Cookbook: adding a workspace package](../../docs/cookbook/adding-a-package.md)（Write the package README）、[Package Model Experience contract](../../.agents/notes/archived/process/2026-07-12-package-model-experience-contract.md)（归档决定）_
