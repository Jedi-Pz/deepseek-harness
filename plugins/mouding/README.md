# dsh-mouding

谋鼎智能体（藏宝智道 V11）的 DeepSeek Harness profile bundle。它把原 Pi 版谋鼎的
「一个主 Agent + 九个专业角色 + 固定五阶段工作流」移植为 DSH 的 Agent preset 组合：
主 Agent 通过 `subagent` 工具的 `agent_preset` 参数调度九个角色，角色以独立 preset
运行，各自拥有角色提示词与工具面。

## 结构

```text
plugins/mouding/
├── package.json          dsh.bundle.patch 指向 cordis.patch.yml
├── cordis.patch.yml      插入 1 行 MCP 占位 + 10 个 agent preset
├── prompts/
│   ├── main.md           主 Agent 系统提示词（世界观 + 五阶段调度 + 输出模板）
│   └── agents/           九个角色提示词（原 Pi 版 agents/*.md 改写）
├── locale/               Plugins 页面显示用的中英文标题与描述
└── icon.svg
```

## 安装

用 DSH 的 `plugin_manager` 以绝对包目录安装：

```text
plugin_manager(action: install_bundle, target: "<repo>/plugins/mouding")
```

安装后 profile 会写入该 bundle 依赖；新会话的 preset 选择器（Settings 或新会话
picker 的自定义组）中出现以下 preset：

| preset id | 名称 | 阶段 |
|---|---|---|
| `mouding` | 谋鼎 | 主 Agent |
| `mouding-delta-insight` | Δ 洞察体 | Phase 1 |
| `mouding-macro-worldview` | 宏观世界观 | Phase 1 |
| `mouding-omega-awareness` | Ω 圆觉体 | Phase 2 |
| `mouding-treasure-map` | 藏宝图（左核） | Phase 2 |
| `mouding-chain-balance` | 链式制衡 | Phase 2 |
| `mouding-venus-system` | 金星七维（右核） | Phase 3 |
| `mouding-risk-radar` | 风险雷达 | Phase 3 |
| `mouding-phi-prediction` | Φ 预言体 | Phase 4 |
| `mouding-research-report` | 研报升维 3.0 | Phase 4 |

## 使用

选择「谋鼎」preset 开始新会话。简单数据查询直接调用 MCP 工具；完整研究请求会走
五阶段：Phase 1 并行调度 `delta-insight` 与 `macro-worldview`，Phase 2 校验、窗口与
产业链，Phase 3 趋势与风险，Phase 4 情景与研报，Phase 5 主 Agent 综合九条 outcome
record 输出裁决。

九个角色也可以直接作为独立会话使用（选中角色 preset），用于单角色复核。

## 外部数据（MCP）

`cordis.patch.yml` 插入了一行 `@deepseek-ai/dsh-mcp-client` 占位，未设置环境变量
`MCP_URL` 时整行禁用。设置后以 Streamable HTTP 连接：

```sh
export MCP_URL='https://your-mcp-host/mcp'
```

MCP 工具在模型侧名为 `mcp__mouding__<tool>`。连接失败不会阻塞 Harness 启动，但角色
会把数据能力标注为不可达并按数据不足处理。

该行挂在 Host 作用域，因此 MCP 工具对当前 profile 的所有 Agent（含非谋鼎 preset）
可见；如果只想让谋鼎使用，改为在每个 preset 的 plugins 内挂 mcp-client（会为每个
Agent 建独立连接）。

## 与原 Pi 版的差异

- **调度**：Pi 的 `workflowScript` + `await runs.all` 改为 DSH `subagent` 的
  `agent_preset` 参数；子代理异步执行，结果以完成通知返回，阶段内并行、阶段间等待。
- **数据**：Pi 的 `mcp` 三步（搜索/描述/调用）改为直达的 `mcp__mouding__*` 工具。
- **工具面**：主 Agent 固定为 `subagent`、`list_agents`、`ask_user_question`、
  `todo_write` 与 MCP 工具，无 shell 与文件读写；角色只有角色提示词、时间上下文与
  继承的 Host 工具，没有 `subagent` 工具，因此不能递归委派。
- **frontmatter**：角色 md 的 `tools` / `defaultContext` 等 Pi 字段由 preset 结构
  表达，正文保持不变。

## 已知限制

- preset 不指定模型：主 Agent 模型由会话选择或 Host 默认决定；子代理继承父会话模型。
- MCP 不支持 Pi 的懒加载；行启用时启动即连接。
- 九个角色 preset 也会出现在自定义 preset 列表中，可被直接选为新会话。

## 文件来源

`prompts/` 由 `/Users/pz/Projects/01-Study/mouding-container/config/agent/` 的
`SYSTEM.md`、`agents/*.md` 与 `config/workspace/AGENTS.md` 合并改写而来。
