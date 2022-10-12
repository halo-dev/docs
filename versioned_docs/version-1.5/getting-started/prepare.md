---
title: 写在前面
description: 在开始前，您需要了解的事项
---

## 环境要求

这里将讲述运行 Halo 所要求的一些软硬件的配置，我们建议您在运行或者部署之前先浏览一遍此页面。

### 硬件配置

:::tip
如果您要使用服务器进行部署 Halo，您需要注意的是，Halo 目前不支持市面上的云虚拟主机，请使用云服务器或者 VPS。
:::

#### CPU

无特别要求。目前我们的 [Docker 镜像](https://hub.docker.com/r/halohub/halo) 也已经支持多平台。

#### 内存

为了获得更好的体验，我们建议至少配置 1G 的 RAM。

#### 磁盘

无特别要求，理论上如果不大量在服务器上传附件，Halo 对磁盘的容量要求并不是很高。但我们推荐最好使用 SSD 硬盘的服务器，能更快的运行 Halo。

#### 网络

Halo 目前必须在外网畅通的情况下使用，否则会导致页面异常。

### 软件环境

Halo 理论上可以运行在任何支持 Java 的平台。

#### JRE（Java Runtime Environment）

必须在运行环境安装好 JRE，这是运行 Halo 所要求的的最低软件环境要求。如果您使用 Docker 运行 Halo，可忽略此要求。

:::info
从 1.4.3 起，版本要求为 11 以上的版本。1.4.3 以下需要 1.8 以上的版本。
:::

#### MySQL（可选）

这并不是 Halo 必须依赖的，Halo 默认使用自带的 `H2 Database`，无需单独安装。如果 `H2 Database` 不能满足你的要求，您需要在系统内安装并运行好 MySQL。

具体要求：

1. 版本：5.7 +
2. 字符集（Character Set）：`utf8mb4`
3. 排序规则（Collate）：`utf8mb4_bin`
4. 存储引擎：`InnoDB`

综上，建议创建数据库采用下面的命令：

```bash
create database halodb character set utf8mb4 collate utf8mb4_bin;
```

#### Web 服务器（可选）

如果您部署在生产环境，那么你很可能需要进行域名绑定，这时候我们推荐使用诸如 [Nginx](http://nginx.org/)、[Caddy](https://caddyserver.com/) 之类的 Web 服务器进行反向代理。但需要注意的是，目前 Halo 不支持代理到子目录（如：halo.run/blog）。

#### Wget（可选）

后续的文档中，我们会使用 wget 为例，用于下载所需要的文件，所以请确保服务器已经安装好了这个软件包。当然，下载文件不限制工具，如果你对其他工具熟悉，可以忽略。

#### VIM（可选）

后续的文档中，我们会使用 vim 为例，用于修改一些必要的配置文件，所以同样请确保服务器已经安装了这个软件包。当前，修改文档也不限制工具，如果你对其他编辑软件熟悉，也可以忽略。

## 浏览器支持

1. 用户前台：视主题所支持的情况而定，由于目前的评论模块使用了 [Vuejs](https://cn.vuejs.org/v2/guide/installation.html#%E5%85%BC%E5%AE%B9%E6%80%A7) 开发，所以在 [Vuejs](https://cn.vuejs.org/v2/guide/installation.html#%E5%85%BC%E5%AE%B9%E6%80%A7) 不支持的某些浏览器中无法正常显示评论区域。
2. 管理后台：支持目前常见的现代浏览器，具体视 [Vuejs](https://cn.vuejs.org/v2/guide/installation.html#%E5%85%BC%E5%AE%B9%E6%80%A7) 框架的支持情况而定。

## 名词解释

这里将列出后续文档中一些和 Halo 相关的名词含义。

### ~（符号）

代表当前系统下的 [用户目录](https://zh.wikipedia.org/wiki/%E5%AE%B6%E7%9B%AE%E5%BD%95)。

### 运行包

指 Halo 构建所产生的 Jar 包，后缀为 `.jar`。可能与其他网站应用有所区别的是，Halo 仅仅只有这一个文件。而且所有数据统一保存在下面所说的 `工作目录`。

### 工作目录

指 Halo 所依赖的工作目录，在 Halo 运行的时候会在系统当前用户目录下产生一个 `.halo` 的文件夹，绝对路径为 `~/.halo`。由于这个工作目录是固定的，所以上面所说的 `运行包`不限制所存放的位置，里面通常包含下列目录或文件：

1. `db`：存放 H2 Database 的物理文件，如果您使用 MySQL 数据库，那么不会存在这个目录。
2. `templates/themes`：里面包含用户所下载的主题。
3. `static`：相当于网站的根目录。
4. `logs`：运行日志目录。
5. `upload`：附件目录。
6. `application.yaml`：配置文件。
