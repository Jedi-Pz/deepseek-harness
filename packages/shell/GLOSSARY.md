# 命令与进程执行

本上下文负责命令与进程的执行：一条命令从请求解析成执行规格，到起子进程、捕获输出、受沙箱约束，直到在远端主机或持久终端里运行。它固定 shell、subprocess、terminal、ssh、sandbox 与 PTC 运行时的共享词汇，使模型侧工具与各 provider 用同一套说法描述执行。

## Language

### 命令执行

**ShellExecutor**：命令执行能力的抽象服务定义（`ctx.shell`）。一次执行是前台还是后台，取决于调用方是否等待结果，而不是启动方式。

**ShellExecRequest**：调用方（模型工具或插件）提交的一次命令执行请求，工作目录、超时等字段可以缺省。

**ShellExecSpec**：请求解析之后得到的执行规格：字段全部确定，执行器不再补默认值。

**ShellProcess**：后台命令运行的句柄，是读取增量输出、观察退出与终止该进程的唯一入口；它本身不带 id 或所有者。

_Avoid_: background job

### 子进程与执行世界

**SubprocessSpawnSpec**：启动一个子进程的完全显式规格：argv、工作目录、每条流的安置方式与清理宽限全部由调用方给出，服务层不补默认值。

**Managed range**：提供方实际管理并负责观测的那一段进程范围，即被启动的命令连同它派生、提供方仍能看见的工作。

**DshEnvironment**：Harness 拥有的 `DSH_*` 变量命名空间，承载一次子进程执行的可信事实。

**Execution world**：文件系统身份、可执行文件查找、进程工作目录与沙箱根共同所属的那一个执行坐标空间，可以是本机，也可以是一台 SSH 主机。

### 持久终端会话

**TerminalSendOperation**：向一条持久终端会话写入并等待就绪的一次操作；同一会话同时只允许一个。

**TerminalWaitReason**：一次终端发送把控制权交还给调用方的原因，取值为 `stdin_read`、`inferred_idle`、`timeout` 或 `session_exit`。

### SSH 远端执行

**Helper**：安装在 SSH 主机上、以该机上的受信本地 provider 执行文件系统与进程请求的组件。

**Forwarded stream**：经 SSH 独立通道转发并各自认证的流，覆盖 stdin、stdout、stderr、终端输出与可选的控制流。

### 沙箱约束

**SandboxMode**：受限进程的文件效果策略，取值为 `read-only`、`workspace-write` 或 `danger-full-access`；它只约束文件效果。

**SandboxEnforcement**：所选后端对当前策略承诺的文件效果能执行到的完整度，取值为 `full` 或 `partial`。

**ConfinedArgv**：沙箱约束的结果：调用方应当 spawn 的替换 argv，附带执行完整度，以及识别拒绝与 runner 失败的两类 stderr 特征。

### PTC 运行时

**PtcRuntime**：PTC 执行的抽象服务（`ctx.ptcRuntime`），运行一段程序并报告输出、失败种类与适用的沙箱事实。

**PtcBindingNamespace**：运行时暴露给 PTC 程序的一组宿主函数，在程序里表现为单个全局对象。

**PtcRunFailure**：一次 PTC 运行失败的分类（`kind`），取值为 `exception`、`timeout`、`abort`、`worker-exit`、`invalid-output`、`output-limit`、`protocol` 或 `sandbox-unavailable`。
