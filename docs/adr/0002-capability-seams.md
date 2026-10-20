# 能力 seam 由 Service Definition / Service Provider / Consumer 三角色组成

可替换能力包含变化速率不同的三个关注点——约定、实现与消费方 API；捆在一个包里，把本地执行器换成沙箱执行器就会连带搅动模型看到的 tool schema。因此一项能力是 Service Definition、Service Provider、Consumer 三个角色组成的 seam，单个角色本身不构成 seam：角色独立演进时拆成不同的包，确实同属一个关注点时保持合并（LLM seam 把 Definition 与 Consumer 折进 `dsh-llm`）。换来的是换后端不波及面向模型的约定，代价是更多的包与注入接线。

_来源：[Capability seams — Service Definition / Service Provider / Consumer roles](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.md)_
