# 文件、语言服务与交付物

这个上下文是 Agent 伸向文件世界的部分：读写文件、经语言服务做代码导航、持久化二进制附件、把过大的文本溢出到磁盘，并在回合结束时把文件交到用户面前。这些能力都以可选能力 seam 的形式挂在 agent 循环之外，因此换掉某个后端不会改变模型发出的请求或收到的结果。

## Language

### 文件访问

**FsTarget**：后端把调用方给的路径解析成的稳定文件身份；同一个文件经不同别名解析出同一个 target，此后每个操作都以它为准。

_Avoid_: 绝对路径、文件句柄

**FsVersion**：后端持有的文件版本令牌，标识目标当前处于哪个内容世代；写入与编辑可以要求「仍是我看到的那个版本」。

_Avoid_: mtime、revision

**FsWriteIntent**：一次写入携带的守卫意图——只在目标不存在时创建，或只在目标仍处于给定版本时替换；不给意图即无条件创建或覆盖。

_Avoid_: 写模式、覆盖标记

**FsObservation**：对一个 target 的一次权威观测——它存在于某个版本，或已确认不存在。已确认不存在只放行受守卫的创建，不放行编辑。

_Avoid_: 快照、缓存

### 代码导航

**LspOperation**：语言服务 seam 与模型共有的四种语义导航查询——goToDefinition、findReferences、goToImplementation、hover。它是闭集合：新增一种就是贯穿 seam、provider 与工具的编译期改动。

_Avoid_: LSP method、语言服务器命令

**LspProvider**：注册在 `ctx.lsp` 上的语言服务器后端，拥有稳定的 id 和一份专属的「小写点前缀扩展名 → 语言 id」映射；一次查询落到哪个 provider 只看文件扩展名，与注册顺序无关。

_Avoid_: language server、backend adapter

**LspPosition**：语言服务 seam 里表示源码位置的坐标。

_Avoid_: 行列号、一基光标

### 附件

**ImageAttachmentRef**：指向一张不可变、已归一化图像的持久引用，只带不透明存储标识和已核验的元数据——不是路径，不是 URL，也不是 base64。

_Avoid_: 图片路径、image URL

**admission**：把调用方提交的字节在所属消息被记录之前验证并提升为持久引用的那一步；未经准入的调用方无法引用一枚它没上传的附件。

_Avoid_: upload、入库

**request version**：从同一张归一化图像出发、按某条模型路由选定的目标尺寸与字节目标派生出的确定性编码版本，带自己的缓存与上传身份。

_Avoid_: variant、压缩副本

### 溢出

**spill**：把本会整段占住上下文的文本原样持久化、只把定位符交还模型的做法；存储本身不决定何时溢出，那是消费者的判断。

_Avoid_: 缓存、临时文件、dump

**SpillLocator**：后端返回、交给模型的不透明定位句柄；本地后端把它渲染成文件路径，远程后端可以渲染成 URI 或键，消费者只配合取回提示使用、不解析它。

_Avoid_: 溢出文件路径

### 交付物

**deliverable**：一个回合结束时交给用户的文件集合——模型用 `present` 声明的文件，加上该回合改动过的文件；两者都记录在只由客户端读取的会话事件里，不回给模型。

_Avoid_: artifact、输出文件

**PresentedFile**：模型声明为最终交付物的一个既有文件；内容留在源路径上，交付物只记路径和可选描述。

_Avoid_: 导出文件、临时交付文件

**workspace changes**：一个顶层回合内发生过改动的文件集合，每个文件带增删行数，以及按需计算的回合首尾内容对比。

_Avoid_: git diff、变更列表

### 文档转换

**deferred read**：转换请求里被推迟、带字节上限的源读取；provider 先按已授权的元数据准入，之后才读源字节。

_Avoid_: 预读取、eager read

**conversion generation**：一次转换 provider 的生命周期标识；替换它即让此前的 PDF 缓存复用一并失效。

_Avoid_: version、epoch
