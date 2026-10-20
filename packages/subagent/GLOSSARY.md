# 委派与后台任务（delegation）

这个上下文覆盖代理把工作交给其他执行体的几种方式：subagent 委派、workflow 编排脚本、后台 job，以及 Ralph 的 fresh-agent 迭代。它单独成域，是因为委派产生自己的身份、归属、交付与结算词汇，而这些词汇不属于 agent 循环本身。

## Language

### 子代理与激活

**activation**：一次受管理的子代理执行，把确切的子代理身份与本次执行的结果交付方式绑在一起；它是一次执行，不是子代理本身。

**subagent provider**：注册在 `ctx.subagents` 名下的一种子代理后端，声明自己支持哪些启动能力。

_Avoid_: backend

**continuable child**：拥有自有持久会话、之后还能继续接收消息的本地子代理；与只执行一次的外部执行相对。

**subagent run**：provider 签发的一次外部子代理执行句柄，携带该次执行的终局结果，且不接收后续消息。

**child catalog**：父会话持有的直接子代理成员记录，按该父会话的事件顺序排列；它只记录成员关系，不记录执行状态。

**delivery**：子代理结果的交付目标：交给父代理并由运行时通知模型，或只交回发起调用的消费者。

### 工作流

**workflow script**：一段由模型编写、交给 workflow 引擎执行的编排脚本；它用 `agent()` 启动子代理，并以一个 JSON 值作为返回值。

**workflow run**：从一次启动请求产生、由持有者拥有的活动 workflow 执行，持有者通过它取得终局结果。

### 后台任务

**job**：由 producer 注册、注册表管理的后台执行；通常归属于启动它的会话，未声明 owner 的 job 对任何调用方开放。

_Avoid_: background task, task

**producer**：声明 job 规格、启动实际工作并拥有其执行资源的一方。

**job owner**：注册 job 时声明的拥有会话；访问授权与生命周期清理都以它为准，未声明拥有者的是无主 job。

**output ring**：每个 job 拥有的一段有界输出缓冲，其中的输出块按绝对字节偏移定位。

**job settlement**：job 的终局记录与状态，取值为 `completed`、`killed` 或 `failed`；每个 job 只有一条。

### Ralph 循环

**Ralph loop**：朝一个不可变目标连续运行的前台 fresh-agent 迭代，由 workflow 与 subagent 原语组合而成；它不是同会话的 goal，也不是 agent 循环的一种模式。

**Ralph round**：Ralph loop 中的一个 fresh 子会话；它不带父会话或前任子会话的历史，跨轮只靠共享工作区与 Ralph handoff。

**Ralph handoff**：从一个 Ralph round 传给下一轮的有界结构化报告，携带状态、摘要、证据、后续步骤与阻塞说明。

### 团队

**Team Lead**：Team 的根代理，其根会话界定 Team 身份，并且是每个 teammate 的直接父代理。

**teammate**：Team 中由 Team Lead 创建、名字不可变的可继续直接子代理。
