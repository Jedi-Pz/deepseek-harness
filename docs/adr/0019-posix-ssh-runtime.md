# SSH 远程运行时的 POSIX 实现

远程编码要求文件工具、Bash、终端、语言服务器与 Node 程序看到同一个文件系统和进程世界，而 OpenSSH 的 exec 通道并不映射任意子进程描述符，单靠它替换进程所有者会留下控制流桥接、启动发布、EOF、取消与断连清理没有实现。因此远程执行世界由部署方自有的 OpenSSH alias 加远端安装的 POSIX helper 组成，文件系统、子进程与 sandbox provider 共用该 helper，而 Cordis 对象、模型传输、权限、回调与 Session 持久化留在本地 Harness，终端方法保持异步。代价是 provider 额外承担传输、流预留与断连责任，换来的是复用本地文件与进程机制及其既有守卫语义，并用独立 SSH channel 与每流 TLS-PSK 把管理 RPC 和程序输出隔开。

_来源：[POSIX SSH execution providers](../../.agents/notes/implemented/architecture/2026-09-11-posix-ssh-runtime.md)_
