# 目标、计划、提醒与待办

这个上下文管的是「接下来要做什么」这一类意图状态：同一会话的一份完成目标、一次需要人审阅的规划、一条到点投递的提醒，以及一份会话内的待办清单。它把这些意图记成持久状态，人和模型都能读、也都能改，使它们跨过轮次、恢复与重启仍然成立。

## Language

### 目标与续跑

**goal**：附着在一个既有会话上的一份持久完成目标，带一个随每次变更递增的版本和一个轮次上限。它是状态，不是调度器，也不是另一段对话。

_Avoid_: objective、task

**goal phase**：目标在持久层的生命周期取值：`active`、`paused`、`blocked`、`complete`。它回答目标本身处于什么状况，与自动续跑当前是否放行是两件事。

_Avoid_: goal status、lifecycle state

**goal activation**：一份进程内的续跑许可，取值为 `armed` 或 `disarmed`，决定还能不能再准入一个 goal round。它从不持久化，所以恢复或 fork 之后都需要一次人为的 resume。

**goal round**：为当前目标准入的一轮自动续跑循环，被记成一次以该目标为来源的 turn。同会话里与人对话产生的 turn 不占轮次额度。

_Avoid_: round、iteration

**goal round cap**：一个目标总共可以准入多少个 goal round 的上限（`maxGoalRounds`）。它只数轮次，不计量 token、费用、挂钟时间或供应商配额。

_Avoid_: budget、quota

**goal revision**：目标每被接受一次持久变更就加一的正整数版本。写入必须携带读到的确切版本，过期版本会被拒绝，而不是覆盖更新的状态。

_Avoid_: version、seq

**clear tombstone**：目标被清除后留在日志里的墓碑，只记下被清除目标的身份与时间，使这段历史与之后的目标仍可判读。

_Avoid_: deleted goal、archived goal

### 计划模式

**plan mode**：每个 agent 各自的一份协作状态：激活时该 agent 的每次模型请求都带上部署提供的规划文本。它是软引导，任何工具都照旧可用，所以不构成限制手段。

_Avoid_: planning、read-only mode

**plan guidance**：部署自己撰写的一段规划指引，在 plan mode 激活时作为 `plan:policy` 提示词段落出现在每次请求里；停用时它不贡献任何文本。

_Avoid_: plan prompt、plan policy text

**pending selection**：人已经选定、但当下还没生效的 plan mode 取值；它要等到下一次被接受的 turn 内步骤开始时才成为已记录的模式。

_Avoid_: queued mode、pending mode

**reviewed exit**：plan mode 的退出路径：模型提交完整计划供人审阅，批准才离开 plan mode，选择继续规划则带着反馈回到规划。

_Avoid_: plan confirmation（approval 是 interaction 的正式术语，不要收进来）

### 提醒

**reminder task**：一条绑定创建时会话的持久提醒，含标题、指令、定时规则与状态。到期时它在原会话里作为普通后续消息出现，而不是邮件、短信或推送。

_Avoid_: job、notification、alert

**schedule rule**：一条提醒采用的定时规则；若干互斥规则中的一种。

_Avoid_: schedule type、frequency

**delivery receipt**：一次提醒已经写进原会话收件箱的凭据。它确认的是投递，不是模型执行过或执行完了。

_Avoid_: acknowledgment、completion record

**catch-up**：Host 重启时对待已过期周期性提醒的方式：每条只补最近一次到期，错过的发生不累积也不重放。

_Avoid_: backlog、replay

### 待办

**todo list**：一个 agent 会话维护的待办清单，属于创建它的那个会话。每次写入都整表替换，所以条目不需要稳定标识。

_Avoid_: task list、plan

**TodoItem**：todo list 里的一条，只有一句面向人的内容和一个三态状态：`pending`、`in_progress`、`completed`。

_Avoid_: todo entry、item
