# ExperimentUI 整窗表面机制原型（throwaway）

本目录是 wayfinder 票 [决定 ExperimentUI 整窗表面的实现机制](https://github.com/Jedi-Pz/deepseek-harness/issues/2) 的一次性原型，**不是产品代码，不合并**。它的唯一用途是验证候选 1 的可运行性，并把结论留给实现票。

## 结论（已在真机验证）

候选 1 可行：在 `shell.overlay` 注册一个入口，用 `createPortal(..., document.body)` 渲染整窗层，同时给 `#root` 设 `inert` 并把 opacity 归零；`Esc`（window capture 阶段）和角落按钮退出，卸载时恢复 `#root` 的 inert/opacity 原值。

用户确认：进入后整窗空白（侧栏/聊天/底栏不可见）、Esc 与角落按钮都能退出、退出后原界面恢复、inert 生效（Tab 焦点不穿透）、观感可接受。

原型代码只覆盖「表面机制」：右下角的 launcher 胶囊是调试入口；正式的侧栏图标 + 快捷键入口由后续决策票决定。

## 接线（原型专用，均需在实现时替换）

- `packages/bundle/web-app/cordis.patch.yml` 临时插入 `experiment-ui-prototype` 行，把本包加入 web roster。这违反 `packages/experimental/AGENTS.md` 的默认产品隔离规则，仅限原型；正式结构由「决定 ExperimentUI 的包与 bundle 结构」票决定。
- `packages/bundle/web-app/package.json` 声明本包为 workspace 依赖（让 profile 运行时解析到它）。
- `tsconfig.client.json` 增加本包引用。
- `pnpm-lock.yaml` 与 `packages/client/ui-sidebar-documentpreview/package.json` 里的 `xlsx` 改成 `file:` 本地 tarball：弱网环境下 `cdn.sheetjs.com` 会挂起，`.prototype-deps/xlsx-0.20.3.tgz` 是本机缓存。该 tarball 未提交，重新安装前需从 `https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz` 取回（sha512 与 lockfile 原值一致）。

## 运行

```sh
# 依赖（worktree 内已有 node_modules；重装见上面的 xlsx 说明）
export SDKROOT=/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX26.2.sdk
pnpm run build:artifacts
pnpm run start:web -- --no-open --port 52755
```

`build:artifacts` 的 native addon 步骤需要这个 `SDKROOT`：本机 `xcrun` 解析到 CommandLineTools 的 MacOSX27.0 SDK，与 Xcode 26.2 的 ld 不兼容（`ld: tapi error: malformed file`）。
