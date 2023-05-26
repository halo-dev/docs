---
title: 入门
description: 了解如何构建你的第一个插件并在 Halo 中使用它。
---

Halo 提供了一个模板仓库用于创建插件：

1. 打开 [plugin-starter](https://github.com/halo-dev/plugin-starter)。
2. 点击 `Use this template` -> `Create a new repository`。
3. 如图所示填写仓库名后点击 `Create repository from template`。
![create-repository-for-hello-world-plugin](/img/create-repository-for-hello-world-plugin.png)

你现在已经基于 Halo 插件模板创建了自己的存储库。接下来，你需要将它 `git clone` 到你的计算机上并使用 `IntelliJ IDEA` 打开它。

## 运行插件

现在有了一个空项目，我们需要让插件能最最小化的运行起来。

这很简单，首先你需要构建插件：只需要在 `halo-plugin-hello-world` 项目目录下执行 Gradle 命令

```shell
./gradlew build 
```

或者使用 `IntelliJ IDEA` 提供的 `Gradle build` 即可完成插件项目的构建。

第二步就是使用它。

使用 `IntelliJ IDEA` 打开 Halo，参考 [Halo 开发环境运行](../core/run.md)。
然后在 `src/main/resources` 下创建一个 `application-local.yaml` 文件并做如下配置：

```yaml
# macOS / Linux
halo:
  plugin:
    runtime-mode: development
    fixed-plugin-path:
      # 配置为插件绝对路径
      - /Users/guqing/halo-plugin-hello-world

# Windows
halo:
  plugin:
    runtime-mode: development
    fixed-plugin-path:
      # 配置为插件绝对路径
      - C:\Users\guqing\halo-plugin-hello-world
```

使用此 local profile 启动 Halo：

```shell
# macOS / Linux
./gradlew bootRun --args="--spring.profiles.active=dev,local"

# Windows
gradlew.bat bootRun --args="--spring.profiles.active=dev,win,local"
```

然后访问 `http://localhost:8090/console`

在插件列表将能看到插件已经被正确启动，并且在左侧菜单添加了一个 `示例分组`，其下有一个名 `示例页面` 的菜单。

![hello-world-in-plugin-list](/img/plugin-hello-world.png)
