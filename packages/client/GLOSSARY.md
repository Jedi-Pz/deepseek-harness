# Web 客户端与宿主

Web GUI 的两半：浏览器里的 Web Client 由独立加载的插件组装成完整应用，宿主侧则提供页面投递、插件入口与 API。这套词汇关心页面如何被启动、UI 如何被组合、内容如何被寻址，而不是某个具体功能的界面。

## Language

### 启动与插件图

**client module**：页面所见的浏览器侧插件单元，与提供它的包一一对应；入口图里的一项就是一个 client module 在这次启动中的出现。

_Avoid_: plugin bundle

**WebBootGraph**：Host 交给一个页面的客户端入口图，列出页面要启动的入口、它们的初始脚本批次，以及这些内容属于哪个 Host release。

_Avoid_: boot manifest

**WebBootEntry**：入口图里的一项内容，以 client module 的包名为身份，并携带它与其他入口的先后关系。

**WebBootBatch**：入口图里的初始调度单位，只有 `bootstrap` 与 `application` 两个阶段；一条入口恰好属于一批，一个阶段可以有多批。

**WebBootRelease**：Host 的发行身份，由版本标签与构建时定入的源码提交组成；两份 release 相同当且仅当两个字段都相同。页面只在与 Host 同一 release 上采用新的入口图，否则等一次重载。

### 客户端模型与传输

**Connection generation**：浏览器与 Host 之间一次有效的传输期。物理重连会建立新的 generation，逻辑流在它上面各自重新打开自己的源。

_Avoid_: client generation

**Client model**：Host 权威状态在浏览器侧的无 React 投影，保持对象身份，对外暴露可观察快照与命令服务。它只持有最新的可用本地投影，不是第二个事实来源。

### Slot 与组合

**slot**：Web Client 的类型化 React 组合位置，有一个声明它的父组件和一个填充它的注册组件。

**slot declaration**：父组件对自己拥有的渲染位置所做的声明；位置键、基数、作用域与 owner props 都固定在声明里，一个位置只有一个所有者。

**slot cardinality**：slot 在声明处固定的填充方式：`single` 是一个位置、`list` 按 `id` 与 `order` 排列、`keyed` 由所有者按 `entryKey` 派发、`chain` 按优先级取第一个非空结果。

**slot scope**：slot 在声明处固定它和 Session 的关系：`root` 不绑定 Session，`session-maybe` 允许没有绑定，`session` 要求一个已解析的绑定。

### 资源与右栏

**resource address**：指向一份可寻址内容的 `dsh-resource://` 地址，host 段是协议键；地址本身就是内容身份，同一个地址只对应一份内容。

**resource protocol**：资源地址里的 host 段，也是资源协议表的一个键；它规定这段地址由谁解释、值是什么类型，一个协议恰好有一个 provider。

_Avoid_: resource type、scheme

**resource provider**：某个协议对地址的唯一解释者，把地址变成「当前状态加后续变化」的帧流；它的存活期与注册它的插件相同。

**holder**：一份资源的持有者，可以是一次订阅，也可以是一次只为让资源在场上而设的 pin。第一个 holder 打开资源，最后一个释放它。

**tab type**：Sidebar 里一种 tab 的实现，由说明它识别哪些地址的静态定义与提供 tab 本体的注册共同构成，两者共享同一个 `id`。

### 宿主与页面

**WebServer**：GUI 宿主的浏览器 HTTP 载体（`ctx.webServer`）：一条 HTTP(S) 服务，向页面提供具名路由、index 注入表，以及唯一一个承接无人认领请求的座位。它不认识任何 harness 概念，每个特性路由都由别的插件注册上去。

**index injection**：页面 index.html 每次渲染前收集的结构化注入行；启动入口图、主题与预加载都以行的形式进入页面。
