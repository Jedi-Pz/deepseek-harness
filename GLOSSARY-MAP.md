# Glossary Map（术语地图）

本仓库采用 multi-context 领域文档布局：领域文档按上下文组织，每个上下文一份 `GLOSSARY.md`，记录该上下文独有的领域术语；本文件是索引，写上下文定位、全部 package 组到上下文的映射与相互关系，术语定义留在各自的 `GLOSSARY.md`。系统级架构决定记录在 `docs/adr/`，每条 ADR 指向持有完整论证的 Agent Note（没有对应 note 时指向 architecture 章节）。

## Contexts

- [core](./packages/core/GLOSSARY.md)：核心运行模型——会话日志、提示词装配、工具注册表、agent 与循环、按 agent 的作用域注册、循环卫生守卫
- [llm](./packages/llm/GLOSSARY.md)：模型接入——消息与流式词汇、adapter seam、token 计量
- [session](./packages/session/GLOSSARY.md)：会话数据面——持久化 seam、投影、检索、存储、遥测副本
- [execution](./packages/shell/GLOSSARY.md)：命令与进程执行——shell、subprocess、terminal、ssh、sandbox、PTC 运行时
- [filesystem](./packages/fs/GLOSSARY.md)：文件、语言服务与交付物——fs seam、LSP、附件、spill、交付物
- [web](./packages/web/GLOSSARY.md)：网络访问——搜索与抓取 seam
- [delegation](./packages/subagent/GLOSSARY.md)：委派与后台任务——subagent、workflow、jobs、agent team、Ralph
- [goal](./packages/goal/GLOSSARY.md)：目标、计划、提醒与待办
- [interaction](./packages/interaction/GLOSSARY.md)：人机协作——审批、提问、命令、反馈、权限预设
- [api](./packages/api/GLOSSARY.md)：远程 API——BFF、型图、SDK、ACP
- [client](./packages/client/GLOSSARY.md)：Web 客户端与宿主
- [runtime](./packages/boot/GLOSSARY.md)：运行时与仓库基础设施——profile 与 bundle、扩展、技能、压缩、MCP、设置、凭据、包与发布、身份与产品遥测
- [workspace](./packages/workspace/GLOSSARY.md)：工作区实体——Workspace 身份、canonical path、成员、状态、pin 与 archive
- [automation](./packages/browser-use/GLOSSARY.md)：浏览器与桌面自动化——browser provider、per-Session 归属、computer-use provider、Cua Driver

## Package groups

每个 package 组归属一个上下文；`—` 表示纯基础设施、测试支撑或实验容器，不单独拥有领域术语（其包的术语落在各自所属的上下文里）。

| Package group | Context |
|---|---|
| acp | api |
| api | api |
| attachment | filesystem |
| boot | runtime |
| browser-use | automation |
| bundle | runtime |
| client | client |
| compaction | runtime |
| computer-use | automation |
| context | runtime |
| core | core |
| credentials | runtime |
| deliverables | filesystem |
| document | filesystem |
| experimental | — |
| extensions | runtime |
| feedback | interaction |
| fs | filesystem |
| goal | goal |
| guard | core |
| host | client |
| identity | runtime |
| interaction | interaction |
| jobs | delegation |
| llm | llm |
| lsp | filesystem |
| mcp | runtime |
| plan | goal |
| preset | runtime |
| ptc-runtime | execution |
| sandbox | execution |
| schedule | goal |
| sdk | api |
| session | session |
| session-query | session |
| settings | runtime |
| shell | execution |
| skill | runtime |
| spill | filesystem |
| ssh | execution |
| storage | session |
| subagent | delegation |
| subprocess | execution |
| telemetry | runtime |
| terminal | execution |
| test-support | — |
| todo | goal |
| typert | api |
| util | — |
| web | web |
| workflow | delegation |
| workspace | workspace |

## Relationships

- **core → llm**：`agent-loop` 通过 `ctx.llm` 的 adapter seam 发起模型请求，请求与响应写进会话日志。
- **core → session**：`ctx.sessions` 提供会话日志的打开与持久化入口，`Session` 持有追加式日志，投影从日志派生模型历史。
- **core → 所有能力 seam**：工具经 `ctx.tools` 注册；shell、fs、web 等能力都以 Service Definition / Service Provider / Consumer 三种角色接入，不是直接调用。
- **delegation → core/session**：subagent 与 workflow 创建子会话，结果经会话事件回到父上下文；jobs 不创建子会话，它创建归属某个会话（或无主）的后台执行，结果作为 job 事件回到该会话。
- **interaction ↔ core**：审批与提问是工具执行管线里的人机交互点；批准策略属于 interaction，执行语义属于 core。
- **api → core/client**：远端 BFF 用型图（typert）把 Host 服务暴露给 Web 与 Desktop 客户端。
- **runtime → 全仓**：profile 与 bundle 决定一次启动加载哪些插件；设置、凭据、MCP、压缩、技能都挂进同一棵插件树。
- **workspace → session/fs**：工作区实体给出会话与文件工具共享的 canonical path 与生命周期状态。
- **automation → core**：browser-use 与 computer-use 是两类能力 seam，工具经注册表暴露、按会话归属资源。
