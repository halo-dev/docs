---
title: Devtools
description: 了解 Halo 的 Devtools 插件开发工具的使用
---

Devtools 插件开发工具提供了一些 Task 用于辅助 Halo 插件的运行与调试，使用此工具的前提是需要具有 [Docker](https://docs.docker.com/get-docker/) 环境。

Devtools 还提供了一些其他的构建任务，如插件打包、插件检查等。

## 安装

Devtools 是使用 Java 开发的一个 [Gradle](https://gradle.org/) 插件，如果你使用的 [plugin-starter](https://github.com/halo-sigs/plugin-starter) 创建的插件项目，那么你无需任何操作，它已经默认集成了 Devtools 插件。

你可以在项目的 `build.gradle` 中找到它：

```groovy
plugins {
    // ...
    id "run.halo.plugin.devtools" version "0.0.7"
}
```

## 使用说明

当在项目中引入了 `devtools` 之后，就可以使用一些额外的构建任务：

- `haloServer`：此构建任务用于启动 Halo 服务并自动将依赖此 `devtools` 的 Halo 插件项目以开发模式加载到 Halo 服务中。
- `watch`：此构建任务用于监视 Halo 插件项目的变化并自动重新加载到 Halo 服务中
- `reloadPlugin`：此构建任务用于重载插件，如果你此时使用的是 `haloServer` 运行的插件，改动代码后可以运行此任务来重载插件代码使用新的改动被应用。

一个可能的使用场景：

正在开发 `plugin-starter` 插件，此时想测试插件的功能如看到默认提供的菜单项，你可以通过 `haloServer` 将插件运行起来：

```shell
./gradlew haloServer
```

看到如下日志时表示 Halo 服务已经启动成功：

```shell
Halo 初始化成功，访问： http://localhost:8090/console
用户名：admin
密码：admin
```

然后改动了某行代码需要使其生效，可以继续保持 `haloServer` 的运行，然后执行：

```shell
./gradlew reloadPlugin
```

来时新的改动应用到现有服务上。

但如果你使用的 `watch` 任务启动插件则不需要执行 `reloadPlugin` 任务，它会监听文件的改动自动重载插件。

## 配置

在 `build.gradle` 文件中作出配置可以更改 `devtools` 的行为：

```groovy
halo {
    version = '2.9.1'
    superAdminUsername = 'admin'
    superAdminPassword = 'admin'
    externalUrl = 'http://localhost:8090'
    docker {
        // windows 默认为 npipe:////./pipe/docker_engine
        url = 'unix:///var/run/docker.sock'
        apiVersion = '1.42'
    }
    port = 8090
    debug = true
    debugPort = 5005
}
```

`halo {}` 这个配置对象下面用于配置 Halo 服务器的一些信息，所有配置的默认值如上所示，你可以直接使用默认值而不进行任何配置。

- `version`：表示要使用的 Halo 版本，随着插件 API 的更新你可能需要更高的 Halo 版本来运行插件，可自行更改。
- `superAdminUsername`： Halo 的超级管理员用户名，当你启动插件时会自动根据此配置和 `superAdminPassword` 为你初始化 Halo 的超级管理员账户。
- `superAdminPassword`：Halo 的超级管理员用户密码。
- `externalUrl`：Halo 的外部访问地址，一般默认即可，但如果修改了端口号映射可能需要修改。
- `docker.url`：用于配置连接 Docker 的 url 信息，在 Mac 或 Linux 系统上默认是 `unix:///var/run/docker.sock`，在 windows 上默认是 `npipe:////./pipe/docker_engine`。
- `docker.apiVersion`：Docker 的 API 版本，使用 `docker version` 命令可以查看到，如果你的 Docker 版本过低可能需要更改此配置，示例：

  ```shell
  ➤ docker version                                                                        11:38:06
  Client:
  Version:           24.0.7
  API version:       1.43
  ```

- `port`：Halo 服务的端口号，如果你的 Halo 服务端口号不想使用默认的 `8090` 或者想使用多个 Halo 服务，可以修改此配置。
- `debug`：是否开启调试模式，开启后会在启动 Halo 服务时会自动开启调试模式，此时你可以使用 IDE 连接到 Halo 服务进行调试。
- `debugPort`：调试模式下的调试端口号，默认是自动分配端口号，你可以修改此配置来固定调试端口号。
- `suspend`：是否在启动时挂起，如果开启则会在启动时挂起直到有调试器连接到 Halo 服务。

## 调试后端代码

如果你想调试后端代码，可以在 `build.gradle` 中配置

```groovy
halo {
    debug = true
}
```

然后通过 IDEA 运行 `haloServer` 以便于配合 `IDEA` 进行调试。

![Use-Devtools](/img/developer-guide/plugin/use-devtools.png)

首先点击上图中 `1` 处的 `haloServer` 运行插件，然后点击 `2` 处的 `Attach debugger` 让 IDEA 连接到 Halo 服务，此时会打开一个调试窗口就可以开始打断点调试了。

可能会因为日志太快而点击不到 `Attach debugger`，那么你可以配置

```groovy
halo {
  debug = true
  suspend = true
}
```

这样，在点击 `haloServer` 启动插件时会挂起等待在 `Attach debugger` 处，直到你点击 `Attach debugger` 连接调试器后才会继续执行。
