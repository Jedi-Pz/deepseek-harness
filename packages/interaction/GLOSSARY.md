# 人机协作（interaction）

人机协作是人介入一次运行中 agent 的全部接口：让某个敏感动作先获批、让 agent 停下来问人、让人直接执行斜杠命令、用一个预设同时选定沙箱与审批，以及人事后留下的反馈。它存在的原因，是把「人什么时候批准、回答、选择或评价」收敛为一组与具体界面无关的词汇，使交互应用与自动化接入同一套 seam。

## Language

### 审批

**user approval**：人机协作中「这一个特定动作能否继续」的许可能力，由一次询问、闭合的结果词汇、回答方链与会话级策略共同定义。

_Avoid_: permission（权限预设把沙箱模式与审批策略捆成一个可选择项，不是同一件事）

**ApprovalRequest**：一次只读、同进程的许可询问，指明是哪个 agent 的哪个工具动作，以及提问者为什么要问。

**ApprovalOutcome**：审批结果的闭合词汇：`allowed-once`、`rejected`、`cancelled`、`unavailable`；其中只有 `allowed-once` 是放行。

**answerer**：某一类人机询问上的回答方：认领请求就给出答案，不认领就把它交给下一个回答方；它可以由人回答，也可以由自动化组件回答。

_Avoid_: provider（provider 指某项能力的实现方，answerer 只是某次询问的回答角色）

**ApprovalPolicy**：一个会话的审批策略：`ask` 把询问交给已组合的回答方，`never` 从不询问任何人、每个询问都直接是拒绝。

### 提问

**AskUserQuestionItem**：一次提问请求里的单个问题，由调用方给出稳定的 `id`；回答按这个 `id` 回传，因此批量提问仍可逐题对应。

**AskUserQuestionIntent**：调用方声明的「这个问题属于哪种已知决定」，例如把一份计划交给人批准；它只影响界面如何呈现，不改变回答的编码。

**AskUserQuestionAnswer**：人对一次提问的回答，按问题 `id` 给出一批条目，每条包含选中的选项标签，以及可选的一段自由填写的「其他」。

**timed question**：带有限前台等待窗口的提问：窗口内拿到回答就返回回答，窗口结束则让 agent 继续别的工作，而问题保持可回答。

**SettledUserQuestion**：已经用某个回答批次结算的定时提问，记录着人最终给出的答案。

### 命令

**human command**：由人输入、由面向人的界面适配器直接执行的斜杠指令；它不会变成一条模型消息，也不是 shell 命令。

_Avoid_: command（未限定的 command 会与 shell 命令混淆）

**CommandResult**：一条命令直接交回界面的结果，只有成功与错误两种；它不是工具结果，也不是会话事件。

### 权限预设

**permission preset**：一个命名的组合，把沙箱模式与审批策略捆在一起，让人在 Permissions 选择器里一次选定。

**custom preset**：沙箱与审批的当前组合不匹配任何可用预设时派生出的当前值；它只作为当前值显示，永远不是可切换的目标。

### 反馈

**message feedback**：人对某一条 assistant 消息的评判：正面或负面，可附一段说明与一个分类；它是关于输出的信号，从不作为模型的输入。

**MessageFeedbackVersion**：一个反馈项的 compare-and-set 令牌，只比较是否相等，且只与所寻址的那条消息相关；调用方不排序，也不自行合成。

**session remark**：人对整个会话的一条自由文本备注，可附一个固定分类；它不针对任何单条消息。
