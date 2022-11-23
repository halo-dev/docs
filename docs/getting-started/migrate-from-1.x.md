---
title: 从 Halo 1.x 迁移
description: 从 Halo 1.x 迁移的完整指南和注意事项
---

因为 Halo 2.0 的底层架构变动，无法兼容 1.x 的数据，导致无法平滑升级，所以需要进行数据迁移。为此，我们提供了从 Halo 1.5 / 1.6 版本迁移的插件。在进行迁移之前，**有几点注意事项和要求，如果你目前无法满足，建议先暂缓迁移。**

- Halo 版本必须为 1.5.x 或 1.6.x。如果不满足，需要先升级到 1.5.x 或 1.6.x 版本。
- Halo 2.0 不兼容 1.x 的主题，建议在升级前先查询你正在使用的主题是否已经支持 2.0。你可以访问 [halo-sigs/awesome-halo](https://github.com/halo-sigs/awesome-halo) 查阅目前支持的主题。
- Halo 2.0 暂时没有 Markdown 编辑器，**在迁移之后会丢失 Markdown 编辑器的内容**，仅保留已渲染的 HTML 内容以供富文本编辑器使用。如果你对 Markdown 有强需求，建议先暂缓迁移。
- Halo 2.0 不再内置 `友情链接`、`相册`、`日志` 等模块，如果你使用了这些模块，你需要在搭建好 2.0 之后，安装以下插件之后再进行迁移。
  - <https://github.com/halo-sigs/plugin-links>
  - <https://github.com/halo-sigs/plugin-moments>
  - <https://github.com/halo-sigs/plugin-photos>
- Halo 2.0 的外置云存储目前仅有阿里云 OSS 的插件，如果你对其他外部云存储有强需求，建议先暂缓迁移。
- 为了防止直接升级 2.0 导致 1.x 的数据受到破坏，我们已经将工作目录由 `~/.halo` 变更为 `~/.halo2`。

如果有遇到迁移过程中的问题，也可以向我们提交 Issue: <https://github.com/halo-dev/halo/issues/new/choose>

## 备份数据

在进行迁移操作之前，我们强烈建议先**完整备份所有数据**，
