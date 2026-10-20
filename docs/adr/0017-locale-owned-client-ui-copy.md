# 客户端 UI 文案由 locale 字典持有

产品自撰的客户端 UI 文案全部由 locale 字典持有，经类型化 `t` seat 或已本地化的 prop 进入呈现，而用户、模型、provider、插件、wire 与操作系统提供的内容按数据原样渲染，协议 tag、工具名与路径不翻译；`MarkdownText`、`JsonTree` 等无 Cordis 依赖的 primitive 只收完整的本地化 copy props、不自带语言回退，本地化显示文本也不充当身份。这样语言切换只改措辞、不改选择、分组与搜索身份，代价是 primitive 的 prop 类型更重、`verify-client-ui-i18n` 证不了任意动态 prop 已被翻译，locale 激活前的 boot 文案仍在字典路径之外。

_来源：[Locale-owned client UI copy](../../.agents/notes/implemented/architecture/2026-08-23-locale-owned-client-ui-copy.md)_
