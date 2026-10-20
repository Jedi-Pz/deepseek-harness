# 网络访问

网络访问是 DeepSeek Harness 的一个可选能力：模型经由 `web_search` 与 `web_fetch` 搜索公开网络、取回页面。它把 search 与 fetch 两个操作放在同一个能力 seam 上，共用 provider 选择与错误词汇，因此拥有独立于核心循环的一套术语。

## Language

### 服务与 provider

**web access seam**：网络访问能力的能力 seam，横跨 search 与 fetch 两个操作，并共用同一个 `ctx.web` 服务。两个操作不共享请求结构，却共享 provider 选择、取消与错误词汇，所以换 provider 不改变模型提问的方式。

**WebRuntime**：网络访问 seam 的 Service Definition，以 `ctx.web` 暴露，每个 context 一个实例。它是 search 与 fetch 共用的那一层，统一了 provider 的选择与失败词汇。

**provider**：注册到 `ctx.web` 的可互换后端，按能力分为 search provider 与 fetch provider 两类。provider 提供的是能力而不是工具，模型侧的命名与 schema 不随它变化。

_Avoid_: backend

**provider availability**：provider 对自身当前可用性的声明，是一次廉价的本地判断（例如凭据是否在场），不发起网络请求。它是执行期选择的输入，不是健康监测。

_Avoid_: provider health、capability status

**provider selection**：一次 search 或 fetch 在执行时确定使用哪个 provider 的判定：显式配置的 provider id 优先，未配置时只有恰好一个可用 provider 会被自动选中。出现多个可用候选即报错，结果与注册或加载顺序无关。

### 搜索

**WebSearchResult**：归一化的搜索结果：可选的 provider 答案文本、可引用的 `sources[]`，以及本次结果是否被裁剪的标记。`sources[]` 由 seam 保证不超过调用方要求的结果上限。

**WebSearchSource**：搜索结果中的一条可引用来源，必有 `url`；`title`、`snippet`、`publishedAt` 依 provider 是否提供而可缺省，seam 不为 provider 编造缺失字段。

**provider answer**：搜索结果中由 provider 生成的答案文本或摘要，可选；有的 provider 只返回来源而不给答案。

_Avoid_: summary

### 抓取

**WebFetchResult**：归一化的抓取结果：重定向后的最终 `url`、HTTP `statusCode`、解码后的 body，以及内容是否被 provider 封顶的标记。HTTP 状态码属于被取回资源的状态，非 2xx 响应同样是结果而不是失败。

**WebFetchBody**：被取回资源的已解码正文，是由 `dsh-web` 拥有的封闭可辨识联合，目前只有 `html` 与 `text` 两支。新增一支是跨包协同变更，不是插件扩展点。

**public-address enforcement**：fetch 的网络安全约束：只允许访问公开地址，非公开目标（包括经 DNS64 前缀转换抵达的非公开 IPv4）一律拒绝，且该约束在重定向链上重新成立。

### 失败

**WebError**：网络访问 seam 的结构化失败类型，继承 HarnessError，`code` 是开放字符串而非封闭联合。provider 可以抛出自己定义的 code，消费者必须容忍未知值。

### 模型侧工具

**web_search**：模型侧的搜索工具，接受一个 `queries` 数组并返回 provider 答案与来源列表；它的名称、schema、提示词与结果格式都由 `dsh-tool-web` 这个 Consumer 拥有。

**web_fetch**：模型侧的抓取工具，只接受一个 `url` 并返回页面正文；超时与结果大小属于部署配置，不是模型参数。

**query fan-out**：一次 `web_search` 调用把多个查询分发给 seam 的模式；每个查询各自成为一次搜索请求，结果再合并成一份来源列表。

**untrusted-content notice**：模型侧结果中对 provider 控制文本的固定标注：这些内容是外部且不可信的，只能当作数据，不能当作指令。
