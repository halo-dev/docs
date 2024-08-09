---
title: 开发环境运行
description: 开发环境运行的指南
---

:::info
在此之前，我们推荐你先阅读[《准备工作》](./prepare)，检查本地环境是否满足要求。
:::

## 项目结构说明

目前如果需要完整的运行 Halo，总共需要三个部分：

1. Halo 主项目（[halo-dev/halo](https://github.com/halo-dev/halo)）
2. UI，包括 Console 控制台和 UC 个人中心（托管在 Halo 主项目）
3. 主题（Halo 主项目内已包含默认主题）

:::info 说明
从 Halo 2.11 开始，Halo 项目的 `ui` 目录同时包含了 Console（管理控制台）和 UC（个人中心），以下统称为 UI。

当前 Halo 主项目并不会将 UI 的构建资源托管到 Git 版本控制，所以在开发环境是需要同时运行 UI 项目的。当然，在我们的最终发布版本的时候会在 CI 中自动构建 UI 到 Halo 主项目。
:::

## 克隆项目

如果你已经 Fork 了相关仓库，请将以下命令中的 `halo-dev` 替换为你的 GitHub 用户名。

```bash
git clone https://github.com/halo-dev/halo

# 或者使用 ssh 的方式 clone（推荐）
# git clone git@github.com:halo-dev/halo.git

# 或者使用 GitHub CLI 克隆（推荐）
# gh repo clone halo-dev/halo 

# 或者使用 GitHub CLI Fork（推荐）
# gh repo fork halo-dev/halo
```

## 运行 UI 服务

```bash
cd path/to/halo
```

Linux / macOS 平台：

```bash
./gradlew :ui:dev
```

Windows 平台：

```bash
./gradlew.bat :ui:dev
```

最终控制台打印了如下信息即代表运行正常：

```bash
VITE v4.2.3  ready in 638 ms

# Console 控制台服务
➜  Local:   http://localhost:3000/console/

# UC 个人中心服务
➜  Local:   http://localhost:4000/uc/
```

:::info 提示
请不要直接使用 UI 的运行端口（3000 / 4000）访问，会因为跨域问题导致无法正常登录，建议按照后续的步骤以 dev 的配置文件运行 Halo，在 dev 的配置文件中，我们默认代理了 UI 页面的访问地址，所以后续访问 UI 页面使用 `http://localhost:8090/console` 和 `http://localhost:8090/uc` 访问即可，代理的相关配置：

```yaml
halo:
  console:
    proxy:
      endpoint: http://localhost:3000/
      enabled: true
  uc:
    proxy:
      endpoint: http://localhost:4000/
      enabled: true
```

:::

## 运行 Halo

1. 在 IntelliJ IDEA 中打开 Halo 项目，等待 Gradle 初始化和依赖下载完成。

2. 下载预设插件（可选）

    ```bash
    # Windows
    ./gradlew.bat downloadPluginPresets

    # macOS / Linux
    ./gradlew downloadPluginPresets
    ```

3. 修改 IntelliJ IDEA 的运行配置

    - Windows

      将 Active Profiles 改为 `dev,win`，如图所示：

      ![IntelliJ IDEA Profiles](/img/developer-run/IntelliJ-IDEA-Profiles-Win.png)

    - macOS / Linux

      将 Active Profiles 改为 `dev`，如图所示：

      ![IntelliJ IDEA Profiles](/img/developer-run/IntelliJ-IDEA-Profiles-macOS.png)

4. 点击 IntelliJ IDEA 的运行按钮，等待项目启动完成。

5. 或者使用 Gradle 运行

    ```bash
    # macOS / Linux
    ./gradlew bootRun --args="--spring.profiles.active=dev"

    # Windows
    gradlew.bat bootRun --args="--spring.profiles.active=dev,win"
    ```

6. 最终提供以下访问地址：
   1. 网站首页：[http://localhost:8090](http://localhost:8090)
   2. Console 控制台：[http://localhost:8090/console](http://localhost:8090/console)
   3. UC 个人中心：[http://localhost:8090/uc](http://localhost:8090/uc)
