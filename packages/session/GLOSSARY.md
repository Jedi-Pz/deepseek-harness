# 会话数据面

会话数据面让会话在进程之外继续存在：它把活体会话的事件日志落成可重现的存储，从日志派生客户端与检索所需的整值，并为非会话数据提供独立存储。它存在的理由是，模型看到的任何东西都必须能从事后仍可读的记录里重建出来。

## Language

### 持久化

**session handle**：一条已打开、指向某个已存储会话的通道，是某次打开所独占的读写入口，而不是可按 id 共享的服务。

**SessionHeader**：与事件日志分开存放、在创建时固定下来的每会话存储元数据：格式版本、工作目录与 fork 血缘位。

_Avoid_: 会话元数据、`meta`

**fork-inherited prefix**：会话日志开头继承自父会话的事件前缀及其精确长度；它由血缘标记确定，构造时提供的重放历史本身并不构成继承。

**durability barrier**：会话日志写入的持久性分界：越过它之后，已确认的追加在崩溃后依然存在，此前的追加只承诺被接受与排序。

_Avoid_: flush point（checkpoint 是 projection 与 compaction 的正式术语）

**torn tail**：日志物理尾部属于一次从未成功完成的追加的残片；它不是合法日志前缀的一部分，也从不交给读者。

_Avoid_: partial tail、残尾

**format refusal**：某次构建拒绝解释一份日志的判定，用来把「这个版本读不懂」与「存储已损坏」分开。

_Avoid_: format error

**session availability**：一个会话在检索中的两个独立可用性维度：`live` 表示它在本进程是活体会话，`persisted` 表示持久化后端当前列出它。

### 投影

**projection unit**：某个领域贡献的一份纯折叠单元，把已提交事件按序折成该领域在某会话上的当前状态，并可附带客户端可见的整体值。

_Avoid_: projector、projection handler

**projection snapshot**：某个会话上全部已注册客户端可见单元在同一日志位置读出的整值集合；`asOfSeq` 是这些值共同到达的水位。

_Avoid_: projection state

**projection cache**：投影单元已折叠状态的持久检查点集合，让冷读与列表从折叠到位的地方续上，而不必每次重放整条日志。

**cold read**：对一个没有活体会话的会话的读取方式：结果由存储日志或其检查点重建，读取本身不建立活体会话。

### 标题

**title source**：一条被接受标题的归属：内置回退、注册的标题 provider，或用户显式改名；用户来源会钉住标题，使自动生成不再替换它。

### 检索

**logical session**：检索面对的一个会话身份：同一 id 的活体来源与持久化来源合成一份记录，两者并存时以活体为准。

**event surface**：一个事件在折叠后的模型表面上所处的位置：当前模型上下文、已被替换的上下文，或只存在于原始日志。

_Avoid_: visibility、event status

### 存储

**backend**：在存储 hub 上按名字注册、拥有一种存储介质、以可选操作组暴露能力的单元；介质归它，记录语义不归它。

**domain**：非会话数据的一份自包含声明，固定域的名字、格式版本、介质布局与各表的记录 schema。

_Avoid_: namespace、dataset

### 遥测

**telemetry record**：会话活动对外报告的一条有序副本；分为与日志事件一一对应的 ledger 记录和不带日志对应的 ops 记录。

_Avoid_: ledger record、telemetry event
