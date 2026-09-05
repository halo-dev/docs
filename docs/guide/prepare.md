---
title: 写在前面
description: 了解 Halo、发行版本、应用生态，以及部署前所需的软硬件环境。
---

<div class="rp-project-header">
  <p align="center">
    <a href="https://www.halo.run" target="_blank" rel="noopener noreferrer"><img width="100" src="https://www.halo.run/logo" alt="Halo logo" class="no-zoom" /></a>
  </p>

  <p align="center"><b>Halo</b> [ˈheɪloʊ]，强大易用的开源建站工具。</p>

  <p align="center" class="rp-project-header__badges">
    <a href="https://github.com/halo-dev/halo/releases"><img alt="GitHub release" src="https://img.shields.io/github/release/halo-dev/halo.svg?style=flat-square&include_prereleases" class="no-zoom" /></a>
    <a href="https://hub.docker.com/r/halohub/halo"><img alt="Docker pulls" src="https://img.shields.io/docker/pulls/halohub/halo?style=flat-square" class="no-zoom" /></a>
    <a href="https://github.com/halo-dev/halo/commits"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/halo-dev/halo.svg?style=flat-square" class="no-zoom" /></a>
    <a href="https://github.com/halo-dev/halo/actions"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/halo-dev/halo/halo.yaml?branch=main&style=flat-square" class="no-zoom" /></a>
    <a href="https://codecov.io/gh/halo-dev/halo"><img alt="Codecov percentage" src="https://img.shields.io/codecov/c/github/halo-dev/halo/main?style=flat-square&token=YsRUg9fall" class="no-zoom" /></a>
  </p>
</div>

## Halo 是什么？

Halo 是一款强大易用的开源建站工具，从个人博客、知识库，到企业官网、在线商城，Halo 都能助您轻松实现，一站式满足您的多样化建站需求。

<a href="https://www.bilibili.com/video/BV15x4y1U7RU" target="_blank" rel="noopener noreferrer" class="rp-image-link" aria-label="播放 Halo 介绍视频" title="播放 Halo 介绍视频"><img src="https://www.halo.run/upload/dashboard-2026-03-26-5.png" alt="Halo 管理后台界面" class="no-zoom" /><span class="rp-image-link__play" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path fill="currentColor" d="M5.669 4.76a1.47 1.47 0 0 1 2.04-1.177c1.062.453 3.442 1.532 6.462 3.276c3.021 1.744 5.146 3.266 6.069 3.958c.788.59.79 1.763.001 2.355c-.914.687-3.013 2.191-6.07 3.956c-3.06 1.766-5.412 2.832-6.464 3.28a1.467 1.467 0 0 1-2.038-1.177c-.138-1.141-.396-3.734-.396-7.236c0-3.5.257-6.092.396-7.235" /></svg></span></a>

## 发行版本

Halo 的发行版本主要分为两个大类别，即**Halo 社区版**和 **Halo 付费版**。

Halo 付费版包含专业版和商城版，是[**凌霞软件**](https://www.lxware.cn/)旗下的商业产品，致力于为企业、团体或有进阶需求的个人用户提供定制化和特定场景的功能支持。

关于三个版本的详细区别，请查阅[**版本对比**](https://www.lxware.cn/halo)。

在后续的文档中，除非特别说明，将使用付费版统称 Halo 专业版和 Halo 商城版。

### Halo 社区版

Halo 社区版开源免费，遵循 GPL-3.0 协议，适合个人开发者、技术爱好者和开源项目。

- 零成本搭建博客、作品集、技术文档站
- 提供超过 100 款免费主题和插件

### Halo 专业版

Halo 专业版在社区版基础上，集成多项适用于专业场景的功能：

- 移动端 App：随时随地管理内容
- AI 智能建站：快速生成专业站点
- 手机号验证登录：提升安全性与用户体验
- 全站私有化部署：保障数据主权
- 付费主题与插件市场：提供精品主题，以及 SEO 优化、付费阅读、AI 助手等付费插件

### Halo 商城版

Halo 商城版在专业版基础上，提供在线商城功能：

- 一体化在线商城：覆盖商品管理、订单处理和支付对接流程
- 面向中国商家：集成微信支付、支付宝等本土支付方式
- 支持品牌官网、内容管理和线上店铺一站式建设

## 应用生态

- **应用市场**：提供丰富的站点主题与功能插件，前往 [Halo 应用市场](https://www.halo.run/store/apps)了解详情。
- **成为开发者**：支持自主发布并管理应用，参阅[应用市场开发者入驻及应用创建指南](https://www.halo.run/archives/halo-app-store-developer-onboarding-app-creation)。
- **社区资源**：访问 [Awesome Halo](https://github.com/halo-sigs/awesome-halo)，了解 Halo 相关的精选资源。

## 环境要求

这里将讲述运行 Halo 所要求的一些软硬件的配置，我们建议你在运行或者部署之前先浏览一遍此页面。

### 硬件配置

:::tip 云服务器要求
如果你要使用服务器进行部署 Halo，需要注意的是，Halo 目前不支持市面上的云虚拟主机，请使用云服务器或者 VPS。
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

- [使用 Docker Compose 部署](./install/docker-compose.mdx)
- [使用 Docker 部署](./install/docker.mdx)

#### JRE（可选）

如果使用 Docker 镜像部署，那么无需在服务器上安装 JRE。但目前我们也提供了 jar 文件部署的方式，文档可参考：

- [使用 JAR 文件部署](./install/jar-file.md)

:::info Java 版本要求
版本要求：

- 2.21 以上版本：**JRE 21**
- 2.20 及以下版本：**JRE 17**

:::

#### 数据库

Halo 目前支持以下数据库：

- PostgreSQL
- MySQL
- MariaDB
- H2

其中，H2 不需要单独运行，其他数据库需要单独安装并配置。一般情况下，推荐按照 [使用 Docker Compose 部署](./install/docker-compose.md) 文档将 Halo 和数据库容器编排在一起。

:::warning 不建议在生产环境使用 H2
不推荐在生产环境使用默认的 H2 数据库，这可能因为操作不当导致数据文件损坏。如果因为某些原因（如内存不足以运行独立数据库）必须要使用，建议按时[备份数据](../guide/use/backup.md)。
:::

#### Web 服务器（可选）

如果你部署在生产环境，那么你很可能需要进行域名绑定，这时候我们推荐使用诸如 [Nginx](http://nginx.org/)、[Caddy](https://caddyserver.com/) 之类的 Web 服务器进行反向代理。但需要注意的是，目前 Halo 不支持代理到子目录（如：halo.run/blog）。

#### Wget（可选）

后续的文档中，我们会使用 wget 为例，用于下载所需要的文件，所以请确保服务器已经安装好了这个软件包。当然，下载文件不限制工具，如果你对其他工具熟悉，可以忽略。

#### Vim（可选）

后续的文档中，我们会使用 Vim 为例，用于修改一些必要的配置文件，所以同样请确保服务器已经安装了这个软件包。当然，修改文档也不限制工具，如果你对其他编辑软件熟悉，也可以忽略。

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

指 Halo 所依赖的工作目录，在 Halo 运行的时候会在系统当前用户目录下产生一个 `.halo2` 的文件夹，绝对路径为 `~/.halo2`。里面通常包含下列目录或文件：

1. `db`：存放 H2 Database 的物理文件，如果你使用其他数据库，那么不会存在这个目录。
2. `themes`：里面包含用户所安装的主题。
3. `plugins`：里面包含用户所安装的插件。
4. `attachments`：附件目录。
5. `logs`：运行日志目录。
6. `application.yaml`：配置文件（可选），具体配置方式可查阅 [配置说明](./install/config.md)。
7. `backups`：备份文件目录。
8. `static`：虚拟的根文件目录，需要手动创建。

> 如果你使用的 Docker 部署，请不要忽略 `~/.halo2` 的目录映射。

### 主题

包含了各种站点页面模板的资源包。用户访问 Halo 站点浏览到的内容及样式，由 Halo 管理端所配置使用的主题所决定。

相关使用文档：[主题管理相关功能说明](../guide/use/themes.md)

### 插件

用于扩展 Halo 功能的软件包。插件独立于 Halo 核心应用，可以单独安装、升级、卸载。

相关使用文档：[插件管理相关功能说明](../guide/use/plugins.md)

## 许可证

Halo 使用 [GPL-3.0](https://github.com/halo-dev/halo/blob/main/LICENSE) 协议开源，使用和分发时请遵守开源协议。

## 贡献者

欢迎参与 Halo 项目建设，具体方式请参阅 [Halo 贡献指南](https://github.com/halo-dev/halo/blob/main/CONTRIBUTING.md)。

<a href="https://github.com/halo-dev/halo/graphs/contributors"><img src="https://opencollective.com/halo/contributors.svg?width=890&button=false" alt="Halo 项目贡献者" /></a>

## 项目状态

![Halo 项目活跃度](https://repobeats.axiom.co/api/embed/ad008b2151c22e7cf734d2688befaa795d593b95.svg "Halo 项目活跃度")
