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

你现在已经基于 Halo 插件模板创建了自己的存储库。接下来，你需要将它克隆到你的计算机上。

```shell
# clone your repository
git clone https://github.com/<your-username>/halo-plugin-hello-world.git

# enter the directory
cd halo-plugin-hello-world
```

## 运行插件

现在有了一个空项目，我们需要让插件能最最小化的运行起来，这里提供两种运行方式。

### 使用 DevTools 运行（推荐）{#run-with-devtools}

Halo 提供了一个用于插件开发的 DevTools，它可以帮助你快速的运行和调试插件，在模板插件项目中已经集成了 DevTools，可查阅 [DevTools 使用说明](./basics/devtools.md)。

使用 DevTools 运行插件的前提是需要你的电脑上已经安装了 Docker 环境，这是我们推荐的用户开发时运行插件的方式，只需要执行以下命令即可。

1. 执行前端部分的依赖安装命令：

   ```shell
   # macOS / Linux
   ./gradlew pnpmInstall

   # Windows
   ./gradlew.bat pnpmInstall
   ```

2. 运行插件：

   ```shell
   # macOS / Linux
   ./gradlew haloServer

   # Windows
   ./gradlew.bat haloServer
   ```

   执行此命令后，会自动创建一个 Halo 的 Docker 容器并加载当前的插件。

3. 启动成功后，可以看到如下日志输出：

   ```shell
   Halo 初始化成功，访问： http://localhost:8090/console
   用户名：admin
   密码：admin
   ```

   然后访问 `http://localhost:8090/console`

   在插件列表将能看到插件已经被正确启动，并且在左侧菜单添加了一个 `示例分组`，其下有一个名 `示例页面` 的菜单。

   ![hello-world-in-plugin-list](/img/plugin-hello-world.png)

### 传统方式运行 {#run-with-traditional-way}

如果你的设备上无法安装 Docker 或你对 Docker 不熟悉，可以使用传统方式运行并开发插件。

但由于此方式需要先使用源码运行 Halo 才能启动插件，请确保已经在开发环境运行了 Halo，可以参考 [Halo 开发环境运行](../core/run.md)

1. 安装前端部分的依赖

   ```shell
   # macOS / Linux
   ./gradlew pnpmInstall

   # Windows
   ./gradlew.bat pnpmInstall
   ```

2. 编译插件

   ```shell
   # macOS / Linux
   ./gradlew build

   # Windows
   ./gradlew.bat build
   ```

3. 修改 Halo 配置文件：

   ```shell
   # 进入 Halo 项目根目录后，使用 cd 命令进入配置文件目录
   cd application/src/main/resources

   # 创建 application-local.yaml 文件
   touch application-local.yaml
   ```

   根据你的操作系统，将以下内容添加到 `application-local.yaml` 文件中。

   ```yaml
   # macOS / Linux
   halo:
     plugin:
       runtime-mode: development
       fixed-plugin-path:
         # 配置为插件项目目录绝对路径
         - /path/to/halo-plugin-hello-world

   # Windows
   halo:
     plugin:
       runtime-mode: development
       fixed-plugin-path:
         # 配置为插件项目目录绝对路径
         - C:\path\to\halo-plugin-hello-world
   ```

4. 启动 Halo

   ```shell
   # macOS / Linux
   ./gradlew bootRun --args="--spring.profiles.active=dev,local"

   # Windows
   gradlew.bat bootRun --args="--spring.profiles.active=dev,win,local"
   ```

   然后访问 `http://localhost:8090/console`

   在插件列表将能看到插件已经被正确启动，并且在左侧菜单添加了一个 `示例分组`，其下有一个名 `示例页面` 的菜单。

   ![hello-world-in-plugin-list](/img/plugin-hello-world.png)
