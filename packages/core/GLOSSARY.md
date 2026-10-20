# 核心运行模型（core）

core 是每个组合都会启动的包组：会话日志、系统提示词装配、工具注册表与执行管线、agent 句柄与默认循环，以及让注册按 agent 隔离的作用域原语。它存在的原因，是把「模型看到的一切都能由会话日志重建」这条主干收敛成一份共享实现，其余能力都以插件形式接在它声明的扩展点上。

## Language

### 会话与循环

**turn**：会话中一次被接纳输入的处理单位，从排队输入被接纳开始，到模型与其工具停下或某个终止策略介入为止。

_Avoid_: round（round 是外层策略迭代的独立术语，不要用来指 turn）

**step**：一次模型请求，加上该响应所请求的工具执行；一个 turn 包含零个或多个 step。

**Session**：一个 agent 交互历史的追加式事件日志，是这份历史的唯一事实来源；消息历史由它派生，而不是另行存储。

_Avoid_: transcript

**derived history**：由会话日志投影出的模型可见消息序列；它是同一份事件的重新派生，而不是第二份被保存下来的状态。

**surface**：会话日志中产生消息的事件按 `surfaceOp` 组成的有序消息面；派生历史就是这个消息面的投影。

**inbox**：agent 拥有的待处理输入投影，按下一回合与下一步两个队列组织。

_Avoid_: queue

### agent

**Agent**：驱动一个会话的公开活动句柄，其身份即该会话的 `SessionId`；UI、hook 与编排插件都面向它编程。

**AgentHandle**：创建者持有的 agent 与其 disposer 的组合；disposer 是一项能力，只有持有者才能拆除这个 agent。

**setup window**：创建 agent 时的组装时段——scope 与 agent 对象已经存在，但 agent、session 尚未公布，`agent/created` 与第一次提示词装配都还没有发生。

**initiating agent**：`ctx.agents` 携带的进程内因果归属，即当前异步驱动链的发起 agent；它的在场既不是存活证明，也不是授权。

_Avoid_: current agent, ambient agent

### 作用域注册

**scope**：按 agent 划分的注册单元：同一个贡献要么全局可见，要么恰好属于一个 scope key。

**scope key**：scope 的不透明身份，按对象身份比较；约定上一个 live agent 就是它自己 scope 的 key。

_Avoid_: scope id

**shadowing**：最具体者胜的名字解析：同名时 scoped 注册遮蔽全局注册，且只对该 scope 生效。

_Avoid_: override

### 提示词装配

**PromptSection**：系统提示词的一段有序贡献，名字唯一，按 order 升序拼接。

**PromptContext**：与 section 相对的动态上下文贡献，以一段 user-role 快照进入模型历史，而不是拼进系统提示词。

### 工具管线

**ToolDefinition**：一个已注册工具：面向模型的 `ToolSchema`、必须声明的规范输出契约，以及执行函数。

**ToolRestriction**：某个 scope 对继承来的全局工具集合施加的限制。

### 循环卫生

**repeat-tool reminder**：在模型重复同一工具调用时提醒它换方法或收尾的循环卫生守卫。

**timeout policy**：给声明了执行时限的工具调用设上限、超时返回明确错误的循环卫生守卫。
