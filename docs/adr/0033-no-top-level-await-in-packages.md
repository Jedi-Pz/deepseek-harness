# 包内禁用顶层 await

顶层 await 会把模块求值变成异步，让导入方跟着等待，并把入口的启动失败变成模块加载失败；它还会被浏览器 Preview 按 CommonJS 包装的模块加载器拒绝，挡住 voice-input-bundle 进入镜像。因此禁止 `packages/*/*/src/**` 下的 `.ts` 和 `.tsx` 在模块顶层 `await`，由进程直接执行、无人导入的 bin 除外，入口改用显式 `async function main()` 自行处理启动失败。换来的所有可导入包源码同步求值，代价是 `apps/` 与第三方包不在范围内，且 sensevoice 就绪前失败只报错误消息、不带堆栈。

_来源：[Package sources must not use top-level await](../../.agents/notes/implemented/process/2026-10-14-no-top-level-await-in-packages.md)_
