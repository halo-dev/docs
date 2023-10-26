---
title: 插件运行模式
description: 了解插件的运行方式
---

Halo 的插件可以在两种模式下运行：`development` 和 `deployment`。
`deployment`（默认）模式是插件创建的标准工作流程：为每个插件创建一个新的 Gradle 项目，编码插件（声明新的扩展点和/或添加新的扩展），将插件打包成一个 JAR 文件，部署 JAR 文件到 Halo。
这些操作非常耗时，因此引入了 `development` 运行时模式。

对于插件开发人员来说，`development` 运行时模式的主要优点是不必打包和部署插件。在开发模式下，您可以以简单快速的模式开发插件。

### 配置

如果你想以 `deployment` 运行插件则做如下配置:

```yaml
halo:
  plugin:
    runtime-mode: deployment
```

插件的 `deployment` 模式只允许通过安装 JAR 文件的方式运行插件。

而如果你想以 `development` 运行插件或开发插件则将 `runtime-mode` 修改为 `development`，同时配置 `fixed-plugin-path` 为插件项目路径，可以配置多个。

```yaml
# macOS / Linux
plugin:
  runtime-mode: development
  fixed-plugin-path:
    # 配置为插件绝对路径
    - /path/to/halo-plugin-hello-world

# Windows
halo:
  plugin:
    runtime-mode: development
    fixed-plugin-path:
      # 配置为插件绝对路径
      - C:\path\to\halo-plugin-hello-world
```

:::tip Note
插件以开发模式运行时由于插件的加载方式与部署模式不同，如果你此时在 Console 安装插件（JAR）则会提示插件文件找不到而无法启动。
:::
