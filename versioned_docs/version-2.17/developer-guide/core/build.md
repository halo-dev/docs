---
title: 构建
description: 构建为可执行 JAR 和 Docker 镜像的文档
---

:::info
在此之前，我们推荐你先阅读[《准备工作》](./prepare)，检查本地环境是否满足要求。
:::

一般情况下，为了保证版本一致性和可维护性，我们并不推荐自行构建和二次开发。

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

cd halo

# 切换到特定的分支或标签，请替换 ${branch_name}
git checkout ${branch_name}
```

## 构建 Fat Jar

构建之前需要修改 `gradle.properties` 中的 `version` 属性（推荐遵循 [SemVer 规范](https://semver.org/)），例如：`version=2.17.0`

```bash
cd path/to/halo
```

下载预设插件（可选）：

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

构建完成之后，在 Halo 项目下产生的 `application/build/libs/halo-${version}.jar` 即为构建完成的文件。

最终部署文档可参考：[使用 JAR 文件部署](../../getting-started/install/jar-file.md)。

## 构建 Docker 镜像

在此之前，请确认已经构建好了 Fat Jar。

```bash
cd path/to/halo
```

```bash
# 请替换 ${tag_name}
docker build -t halo-dev/halo:${tag_name} .
```

```bash
# 插件构建完成的版本
docker images | grep halo
```

最终部署文档可参考：[使用 Docker Compose 部署](../../getting-started/install/docker-compose.md)。
