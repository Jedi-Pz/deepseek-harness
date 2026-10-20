# profile 与 bundle 分层组合插件树

启动组合从 launcher 写死的 `base.cordis.yml` + `web.cordis.yml` 与全局个人 overlay 改为 profile 与 bundle 分层：profile 是 `$DSH_HOME/profiles/<name>` 目录，用 `dsh.profile.bundles` 的有序清单叠 bundle 提供的 `cordis.patch.yml`，bundle 则是声明 `dsh.bundle.patch` 的普通 npm 包。换来的是 TUI、provider pack 这类新组合面可以按 profile 安装、不必在仓库里占一行，代价是放弃依赖扫描和传递式 bundle 应用、in-box bundle 改为安装优先解析，旧 `$DSH_HOME/config.yaml` 在预发布立场下直接不再读取。

_来源：[Profile plugin bundles replace the fixed surface overlays](../../.agents/notes/implemented/architecture/2026-08-05-profile-plugin-bundles.md)_
