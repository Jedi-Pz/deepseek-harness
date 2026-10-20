# Web 访问做成能力 seam

Web 访问按 capability seam 拆成三层：`@deepseek-ai/dsh-web` 持有 `ctx.web` 的 provider 注册、选择、共享请求/结果词汇与 `WebError`，各家 provider 只注册能力、不注册工具，`@deepseek-ai/dsh-tool-web` 独占 `web_search` 与 `web_fetch` 的模型可见 schema、提示与呈现。这样换 provider 不动模型契约，模型也不学后端细节；代价是 search 与 fetch 共用一个 seam 造成成对的 `searchX` / `fetchX`，search schema 刻意保持很薄，而且 provider 缺失或配置错误要等到执行时才以结构化 `WebError` 暴露。

_来源：[Web capability seam - stable tools over multiple providers](../../.agents/notes/implemented/architecture/2026-06-24-web-capability-seam.md)_
