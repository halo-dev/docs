---
title: 从 Halo 1.x 迁移
description: 从 Halo 1.x 迁移的完整指南和注意事项
---

因为 Halo 2.0 的底层架构变动，无法兼容 1.x 的数据，导致无法平滑升级，所以需要进行数据迁移。为此，我们提供了从 Halo 1.5 / 1.6 版本迁移的插件。在进行迁移之前，**有几点注意事项和要求，如果你目前无法满足，建议先暂缓迁移。**

- Halo 版本必须为 1.5.x 或 1.6.x。如果不满足，需要先升级到 1.5.x 或 1.6.x 版本。
- Halo 2.0 不兼容 1.x 的主题，建议在升级前先查询你正在使用的主题是否已经支持 2.0。你可以访问 [halo-sigs/awesome-halo](https://github.com/halo-sigs/awesome-halo) 查阅目前支持的主题。
- Halo 2.0 目前没有内置 Markdown 编辑器，如果需要重新编辑迁移后的文章，需要额外安装 Markdown 编辑器插件。目前社区已经提供了以下插件：
  - <https://github.com/halo-sigs/plugin-bytemd>
  - <https://github.com/halo-sigs/plugin-stackedit>
- 暂时不支持友情链接、日志、图库的数据迁移，如果你在 1.x 版本中使用了这些功能，建议先暂缓迁移。
- Halo 2.0 不在内置外部云存储的支持。需要安装额外的插件，目前官方已提供：
  - <https://github.com/halo-sigs/plugin-alioss>
  - <https://github.com/halo-sigs/plugin-s3>
- 关于附件，目前仅支持将本地附件代理，不支持在后台管理，也不支持迁移外部云存储的附件。如果你对外部云存储的附件有强需求，建议先暂缓迁移。
- 在迁移过程中不会保留旧版本的用户数据，迁移完成之后，关于文章等数据的关联都将改为 Halo 2.0 的新用户。
- 为了防止直接升级 2.0 导致 1.x 的数据受到破坏，我们已经将工作目录由 `~/.halo` 变更为 `~/.halo2`。
- 目前 Halo 2.0 仅提供 Docker 部署方式，没有提供可执行 JAR 包，但可以自编译，请参考 [构建](../developer-guide/core/build.md) 文档
- 可以考虑先在本地运行一个 Halo 2.0，模拟一下导入，检查导入后是否满足要求。

如果遇到了迁移过程中的问题，也可以向我们提交 Issue: <https://github.com/halo-dev/halo/issues/new/choose>，以上暂不支持的功能我们也会陆续完善。

## 备份数据

在进行迁移操作之前，我们强烈建议先**完整备份所有数据**，可以参考 [备份迁移](https://docs.halo.run/user-guide/backup-migration) 进行整站备份。

## 导出数据文件

在 Halo 1.5.x / 1.6.x 后台的小工具中提供了数据导出的功能，将最新的数据进行备份，然后下载即可。这个数据文件包含了数据库所有的数据，后续我们在 2.0 的导入插件中就是通过这个文件进行数据导入。

![halo-data-export.png](/img/halo-data-export.png)

## 部署 Halo 2.0

可以参考以下文档进行部署：

- [使用 Docker 部署](./install/docker.md)
- [使用 Docker Compose 部署](./install/docker-compose.md)

:::tip
可以考虑暂时保留旧版本的 Halo，等到迁移完成之后再移除。如果需要保留旧版本的 Halo，请注意在部署 Halo 2.0 的时候使用其他端口，然后在反向代理（Nginx）中修改为 Halo 2.0 的运行端口即可。
:::

## 移动附件

只需要将 1.x 工作目录的 `upload` 目录里面的所有文件夹移动到 2.0 工作目录下的 `attachments\migrate-from-1.x` 文件夹即可。**但需要注意的是，此操作仅为了让附件资源可以正常访问，目前暂不支持在后台进行管理。**

## 安装迁移插件

需要在 <https://github.com/halo-sigs/plugin-migrate/releases> 中下载最新版本的插件 JAR 包，然后在 Halo 2.0 的插件管理中安装即可，安装完成即可在左侧菜单中看到迁移菜单。

![Migrate Plugin](/img/migrate/halo2.0-migrate-plugin.png)

## 迁移

1. 点击左侧菜单的迁移进入迁移页面。
2. 点击 **选择文件** 按钮，选择在 Halo 1.5.x / 1.6.x 导出的数据文件（JSON 格式）。
3. 最后点击页面下方的 **执行导入** 即可。
