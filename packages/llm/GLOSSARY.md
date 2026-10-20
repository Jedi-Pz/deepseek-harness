# 模型接入

本上下文负责 harness 与模型供应商之间的接入：供应商中立的消息、内容块与流式词汇，provider 适配器 seam，以及基于会话日志的 token 计量。插件通过 `ctx.llm` 发起模型调用，各适配器把供应商的线协议翻译成同一套词汇。

## Language

### 消息与内容

**Message**：会话中的一条消息，由 role、来源与内容块数组组成，是带身份且不可变的值。

_Avoid_: chat message

**ContentBlock**：消息内容里带类型的最小单元，`type` 决定它是文本、推理、图片、文件还是工具调用。

_Avoid_: content part

**ToolResultMessage**：把工具执行结果表示为一条一等消息，而不是内容块；它用 `toolCallId` 指回发起的工具调用。

_Avoid_: tool result block

**MessageSource**：声明一条消息或注入内容由谁产生的标记，如 `user`、`model`、`tool`、`system-prompt`；来源只回答「谁产生」，信息种类由 producer 另行声明的 `form` 表示。

_Avoid_: origin

### 请求与适配

**GenerateOptions**：一次模型调用的完整请求，包含 provider 路由、模型、消息序列、工具声明与采样控制。

_Avoid_: request body, payload

**provider route**：注册在 `ctx.llm` 上的 provider 键，一次请求通过它选定唯一的 adapter 实例；它与供应商公司或端点不是同一层概念。

_Avoid_: provider, vendor, endpoint

**LlmAdapter**：供应商线协议与 harness 消息、流式词汇之间的适配契约；一个实现可以服务多条 provider 路由。

_Avoid_: driver, provider client

### 流式与记录

**StreamChunk**：adapter 产出的原始流式协议单元，包含按 `index` 关联到块的增量、`usage` 与终止的 `finish`。

_Avoid_: stream event

**BlockAssembler**：把 `StreamChunk` 流还原成完整内容块、用量、终止原因与重放元数据的共享装配器。

_Avoid_: accumulator, stream parser

**FinishReason**：模型响应终止的原因，是可合并扩展的联合。

_Avoid_: stop reason

**LlmFailure**：供应商或传输失败的可序列化、provider 中立事实；是否可重试由策略层决定。

_Avoid_: provider error

**ReplayEnvelope**：随一次成功响应保存的 adapter 私有重放元数据，由 response 级状态与可选的逐块条目组成；两部分对 harness 都不透明。

_Avoid_: replay state, adapter metadata

**assistant stream**：会话日志中保存的一次模型尝试的定时记录序列，相邻同类增量合并为一条记录，但不合并 token 边界。

_Avoid_: chunk log, raw stream

### token 计量

**request pressure**：一次模型请求连同其回复将要占用的上下文预算，是压缩与保留决策的计量依据。

_Avoid_: context pressure, token pressure

**TokenUsage**：一次模型调用的 token 计数，各项互不重叠：未缓存输入、缓存读、缓存写与输出分别计数。

_Avoid_: usage stats

**TokenMeasurement**：在某个已消费日志版本上取得的一份不可变度量，给出当前请求压力与按位置计价的会话 surface。

_Avoid_: token count, context size

**TokenSurfaceNode**：当前会话 surface（按时序排列的模型可见消息序列）中的一个节点，记录该位置一条消息的请求压力 token。

_Avoid_: surface entry
