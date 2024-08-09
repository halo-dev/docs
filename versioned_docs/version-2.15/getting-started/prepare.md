---
title: 写在前面
description: 在开始前，你需要了解的事项
---

## 环境要求

这里将讲述运行 Halo 所要求的一些软硬件的配置，我们建议你在运行或者部署之前先浏览一遍此页面。

### 硬件配置

:::tip
如果你要使用服务器进行部署 Halo，需要注意的是，Halo 目前不支持市面上的云虚拟主机，请使用云服务器或者 VPS。

如果你还未购买服务器，可以考虑[通过我们的推广链接购买服务器](../contribution/sponsor.md#通过我们的推广链接购买服务器)。
:::

#### CPU

无特别要求。目前我们的 [Docker 镜像](https://hub.docker.com/r/halohub/halo) 也已经支持多平台。

#### 内存

为了获得更好的体验，我们建议至少配置 1G 的 RAM。

#### 磁盘

无特别要求，理论上如果不大量在服务器上传附件，Halo 对磁盘的容量要求并不是很高。但我们推荐最好使用 SSD 硬盘的服务器，能更快的运行 Halo。

#### 网络

无特别要求，Halo 目前可以在无公网环境下使用，但部分主题由于使用了第三方资源，可能需要公网环境。

### 软件环境

Halo 理论上可以运行在任何支持 Docker 及 Java 的平台。

#### Docker（可选）

我们主要推荐使用 Docker 运行 Halo，这可以避免一些环境配置相关的问题，文档可参考：

- [使用 Docker Compose 部署](./install/docker-compose.md)
- [使用 Docker 部署](./install/docker.md)

#### JRE（可选）

如果使用 Docker 镜像部署，那么无需在服务器上安装 JRE。但目前我们也提供了 jar 文件部署的方式，文档可参考：

- [使用 JAR 文件部署](./install/jar-file.md)

:::info
当前版本（2.0）需要 JRE 17 的版本，推荐使用 OpenJDK 17。
:::

#### 数据库

Halo 目前支持以下数据库：

- PostgreSQL
- MySQL
- MariaDB
- H2

其中，H2 不需要单独运行，其他数据库需要单独安装并配置。一般情况下，推荐按照 [使用 Docker Compose 部署](./install/docker-compose.md) 文档将 Halo 和数据库容器编排在一起。

:::warning
不推荐在生产环境使用默认的 H2 数据库，这可能因为操作不当导致数据文件损坏。如果因为某些原因（如内存不足以运行独立数据库）必须要使用，建议按时[备份数据](../user-guide/backup.md)。
:::

#### Web 服务器（可选）

如果你部署在生产环境，那么你很可能需要进行域名绑定，这时候我们推荐使用诸如 [Nginx](http://nginx.org/)、[Caddy](https://caddyserver.com/) 之类的 Web 服务器进行反向代理。但需要注意的是，目前 Halo 不支持代理到子目录（如：halo.run/blog）。

#### Wget（可选）

后续的文档中，我们会使用 wget 为例，用于下载所需要的文件，所以请确保服务器已经安装好了这个软件包。当然，下载文件不限制工具，如果你对其他工具熟悉，可以忽略。

#### VIM（可选）

后续的文档中，我们会使用 vim 为例，用于修改一些必要的配置文件，所以同样请确保服务器已经安装了这个软件包。当前，修改文档也不限制工具，如果你对其他编辑软件熟悉，也可以忽略。

## 浏览器支持

1. 用户前台：视主题所支持的情况而定。
2. 管理后台（Console 和个人中心）：支持目前常见的现代浏览器，具体视 [Vue](https://vuejs.org/about/faq#what-browsers-does-vue-support) 框架的支持情况而定。

## 名词解释

这里将列出后续文档中一些和 Halo 相关的名词含义。

### ~（符号）

代表当前系统下的 [用户目录](https://zh.wikipedia.org/wiki/%E5%AE%B6%E7%9B%AE%E5%BD%95)。

### 镜像

指 Halo 构建所产生的 [Docker 镜像](https://docs.docker.com/engine/reference/commandline/images/)。用户通过该镜像启动 Halo 应用。

### 工作目录

指 Halo 所依赖的工作目录，在 Halo 运行的时候会在系统当前用户目录下产生一个 `.halo2` 的文件夹，绝对路径为 `~/.halo2`。由于这个工作目录是固定的，所以上面所说的 `运行包`不限制所存放的位置，里面通常包含下列目录或文件：

1. `db`：存放 H2 Database 的物理文件，如果你使用其他数据库，那么不会存在这个目录。
2. `themes`：里面包含用户所安装的主题。
2. `plugins`：里面包含用户所安装的插件。
5. `attachments`：附件目录。
4. `logs`：运行日志目录。
6. `application.yaml`：配置文件。

### 主题

包含了各种站点页面模板的资源包。用户访问 Halo 站点浏览到的内容及样式，由 Halo 管理端所配置使用的主题所决定。

相关使用文档：[主题管理相关功能说明](../user-guide/themes.md)

### 插件

用于扩展 Halo 功能的软件包。插件独立于 Halo 核心应用，可以单独安装、升级、卸载。

相关使用文档：[插件管理相关功能说明](../user-guide/plugins.md)
