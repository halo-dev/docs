---
title: 入门
description: 了解如何构建你的第一个插件并在 Halo 中使用它。
---

此文档将帮助你了解如何构建你的第一个插件并在 Halo 中安装和启用。

## 创建插件项目

1. 打开 [halo-dev/plugin-starter](https://github.com/halo-dev/plugin-starter)。

  > 这是一个插件的初始模板，你可以基于它来开发自己的插件。

2. 点击 `Use this template` -> `Create a new repository`。
3. 如图所示填写仓库名后点击 `Create repository from template`。

  ![create-repository-for-hello-world-plugin](/img/create-repository-for-hello-world-plugin.png)

你现在已经基于 Halo 插件模板创建了自己的存储库。接下来，你需要将它克隆到你的计算机上并使用 `IntelliJ IDEA` 打开它。

## 运行插件

现在有了一个空项目，我们需要让插件能最最小化的运行起来，这里提供两种运行方式。

### 方式 1（推荐）

> 此方式需要本地安装 Docker

```shell
# macOS / Linux
./gradlew pnpmInstall

# Windows
./gradlew.bat pnpmInstall
```

```shell
# macOS / Linux
./gradlew haloServer

# Windows
./gradlew.bat haloServer
```

执行此命令后，会自动创建一个 Halo 的 Docker 容器并加载当前的插件，更多文档可查阅：<https://github.com/halo-sigs/halo-gradle-plugin>

## 运行方式 2

> 此方式需要使用源码运行 Halo，请确保已经在开发环境运行了 Halo，可以参考 [Halo 开发环境运行](../core/run.md)

编译插件：

```shell
# macOS / Linux
./gradlew pnpmInstall

# Windows
./gradlew.bat pnpmInstall
```

```shell
# macOS / Linux
./gradlew build

# Windows
./gradlew.bat build
```

修改配置文件：

```yaml
# macOS / Linux
halo:
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

最后启动 Halo 即可。

然后访问 `http://localhost:8090/console`

在插件列表将能看到插件已经被正确启动，并且在左侧菜单添加了一个 `示例分组`，其下有一个名 `示例页面` 的菜单。

![hello-world-in-plugin-list](/img/plugin-hello-world.png)
