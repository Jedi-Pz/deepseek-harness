# 运行时（runtime）

runtime 是把一次 dsh 启动组装成可运行插件树的包组：它决定按什么顺序叠哪些层、每个会话挂哪套 agent 能力，并承载技能、请求上下文、上下文压缩、外部 MCP 工具、设置与凭据这些运行期基础设施。它存在的原因，是产品没有需要打补丁的特权核心——装什么、怎么叠，本身就是需要命名的装配领域。

## Language

### 启动与组装

**profile**：一套命名的启动组合，住在 Harness home 中，列出自己堆叠的 bundle、安装的树外插件，以及用户自己的补丁文件；同一份安装靠它交付 web、headless、sdk 等不同应用形态。

_Avoid_: 配置、应用模板

**bundle**：一种分发格式，把一组 Cordis 配置行连同它们挂载的代码一起交付，使插进来的内容仍能被上层的补丁改写。

_Avoid_: 插件包、扩展包

**patch**：一份以配置行为对象的改写文档，按 entry id 替换某一行的整份 config 或插入新的行；profile 层、home 层与启动参数层依次叠加。

_Avoid_: override

**agent preset**：用普通 Cordis 配置声明的一套每会话 agent 能力，决定这个 agent 看到哪些工具、提示与技能。

_Avoid_: profile、template

### 技能与请求上下文

**skill**：一份按需加载的可选任务指令，以名字寻址，用来说明 agent 在某类任务上该怎么做；它不是会话事件。

_Avoid_: 提示词片段、命令

**skill catalog**：模型可见的技能清单，只含名字与描述，不含正文与文件路径。

_Avoid_: 技能列表、索引

**workspace instructions**：工作区指导文件（如 AGENTS.md、CLAUDE.md）贡献的模型可见指导，作为普通会话消息进入历史。

### 上下文压缩

**compaction**：历史逼近模型上下文上限时，把其中一段较旧内容换成一条摘要的操作；它遮蔽内容而不删除日志。

_Avoid_: summarization、截断

**compaction checkpoint**：压缩成功后写入会话的替换消息，携带这次压缩的事务身份，供消费者识别并关联这次压缩。

_Avoid_: summary message、summary

**shadowed range**：一次压缩从模型可见历史里换掉的那段内容，按位置顺序而非事件编号大小界定。

**tool-result pruning**：对超出预算的工具结果做确定性裁剪、写入更短的替换内容，从而减少需要压缩的历史。

_Avoid_: truncation

### 外部工具

**MCP server**：在某个 scope 里配置的一台外部服务，向模型提供工具、资源以及它自己的指令。

_Avoid_: 连接、外部插件

**MCP resource**：由某台已配置服务器的连接拥有的外部数据，按需经共享资源工具读取，而不是随连接一起拉取。

### 运行时自改

**dynamic plugin**：由 agent 自己编写并运行的 Cordis 包，分 Host 与浏览器两半；它有稳定的 Plugin 身份和一组不可变的 Package 版本。

_Avoid_: extension、用户插件

**activation**：把某个确切的 Package 版本挂到运行时上的一次运行实例；带浏览器半边的激活需要页面，并可能需要用户授权。

_Avoid_: run、deploy

### 设置与凭据

**form namespace**：当前 profile 中某个可寻址 entry 的本地 id，用来指这个插件实例的设置表单；entry id 不同就是不同的表单。

_Avoid_: namespace、section

**credential reference**：以 POSIX 风格环境变量名指代某个凭据的引用；配置里携带的是引用，值由 provider 持有。

_Avoid_: env var、secret name

**credential record**：以 key 寻址的一条已存储凭据，内容按属主插件自己的格式存放。

_Avoid_: secret、credential key

### 包与发布

**package group**：`packages/` 下按能力家族划分的容器目录；包只住组下一层，组本身不含 `package.json` 或源码。

**Model Experience**：每个 package README 中声明其模型可见 context、token 与 KV cache 效果的固定小节。

**feature preview**：插件内置功能预览的展示单元，用固定尺寸 SVG 呈现并按页面契约登记。

**vendored package**：从上游复制进 `vendor/`、改写 scope 后作为可发布成员维护的依赖。

**extension plugin**：运行时挂载的扩展插件形态，包括工具、hook、UI 与外部协议驱动。

**persistence-type change**：声明为持久化的类型发生变化、必须留下变更记录的变更类型。

### 身份与遥测

**anonymous id**：每个 harness home 一份、供遥测、反馈与 DeepSeek 请求关联的匿名标识。

**product telemetry record**：产品分析记录，含事件名、字符串正文、Unix 毫秒时间戳与标量属性。
