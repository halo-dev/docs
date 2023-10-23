---
title: 构建
description: 构建为可执行 JAR 和 Docker 镜像的文档
---

:::info
在此之前，我们推荐你先阅读[《准备工作》](./prepare)，检查本地环境是否满足要求。
:::

一般情况下，为了保证版本一致性和可维护性，我们并不推荐自行构建和二次开发。但考虑到我们目前仅提供 Docker 镜像的发行版本，不再提供可执行 JAR 的发行版本，因此我们提供了构建的文档，以供用户自行构建。

## 克隆项目

如果你已经 fork 了相关仓库，请将以下命令中的 halo-dev 替换为你的 GitHub 用户名。

```bash
git clone https://github.com/halo-dev/halo

# 或者使用 ssh 的方式 clone（推荐）

git clone git@github.com:halo-dev/halo.git

# 切换到最新的 tag

cd halo

git checkout v2.4.0
```

:::tip
请务必按照以上要求切换到最新的 tag，而不是直接使用 main 分支构建，main 分支是我们的开发分支。此文档以 `2.9.0` 为例，查看最新的 tag 可使用 `git tag --column` 查看。
:::

:::warning
从 2.4.0 开始，Console 项目已经合并到 Halo 主项目，所以不再需要单独克隆 Console 的项目仓库。

详情可查阅：<https://github.com/halo-dev/halo/issues/3393>
:::

## 构建 Console

```bash
cd path/to/halo
```

Linux / macOS 平台：

```bash
make -C console build
```

Windows 平台：

```bash
cd console

pnpm install

pnpm build:packages

pnpm build
```

## 构建 Fat Jar

构建之前需要修改 `gradle.properties` 中的 `version` 为当前 tag 的版本号，如：`version=2.9.0`

```bash
cd path/to/halo
```

下载预设插件：

```bash
# Windows
./gradlew.bat downloadPluginPresets

# macOS / Linux
./gradlew downloadPluginPresets
```

构建：

```bash
# Windows
./gradlew.bat clean build -x check

# macOS / Linux
./gradlew clean build -x check
```

构建完成之后，在 halo 项目下产生的 `application/build/libs/halo-2.9.0.jar` 即为构建完成的文件。

## 构建 Docker 镜像

在进行之前，请确保已经完成上述操作，最终需要确认在 halo 项目的 `application/build/libs/` 目录已经包含了 `halo-2.9.0.jar` 文件。

```bash
cd path/to/halo
```

```bash
docker build -t halo-dev/halo:2.9.0 .
```

```bash
# 插件构建完成的版本
docker images | grep halo
```

最终部署文档可参考：[使用 Docker Compose 部署](../../getting-started/install/docker-compose.md)
