---
title: 使用宝塔面板部署
description: 使用宝塔面板部署
---

::::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare)，这可以快速帮助你了解 Halo。
::::

## 宝塔面板简介

宝塔面板是一个常见的 Linux 服务器运维面板，提供网站、数据库、SSL、Docker 等可视化管理能力。通过宝塔面板的 Docker 模块和应用商店，可以比较方便地完成 Halo 的安装、运行和升级。

![宝塔 Docker 模块](/img/install/bt-panel/docker.png)

### 准备工作

在开始之前，需要确保你已经完成以下准备：

- 已安装并可以正常登录宝塔面板。
- 已在服务器上安装宝塔的 Docker 模块。
- 已放行服务器的 `80` 和 `443` 端口。
- 如果计划使用域名访问 Halo，需要提前将域名解析到当前服务器。

## 安装 Halo 应用

进入宝塔面板左侧的 **Docker**，在 **应用商店** 中搜索 `Halo`，然后点击 **安装**。

![选择 Halo 应用](/img/install/bt-panel/halo-app.png)

在安装配置页面中，按照实际情况填写参数：

![安装 Halo](/img/install/bt-panel/install-halo.png)

参数说明：

- **名称**：当前 Halo 应用的名称。
- **版本选择**：建议优先选择最新的稳定版本。
- **域名**：Halo 对外访问使用的域名，建议填写已经完成解析的域名。
- **允许外部访问**：如果希望直接通过 `IP:端口` 访问，可以启用此选项；如果只打算通过域名访问，通常不需要开启。
- **端口**：Halo 容器暴露的服务端口。
- **外部访问地址**：Halo 的最终访问地址，建议与实际访问地址保持一致，例如 `https://www.example.com`。
- **CPU 核心数限制**、**内存限制**：按服务器资源情况选填，不限制可以保持默认值。
- **编辑模板**：默认模板通常即可满足使用需求；如果需要调整镜像、挂载目录或其他编排参数，可以切换到自定义模板。

宝塔提供的 Halo 应用模板会自动创建 Halo 运行所需的容器。确认参数无误后，点击 **确定** 开始安装。

如果需要查看或调整底层的 Docker Compose 配置，可以切换到 **自定义** 模板模式：

:::info
宝塔的 Docker 应用商店的 Halo 版本可能会滞后于官方最新版本，通常建议自定义镜像版本，查看最新版本请前往 [Halo 版本发布](https://releases.halo.run/)。

此外，宝塔的默认编排是 Halo 社区版本，如果你想安装 Halo 专业版或者商城版，将镜像修改为 `registry.fit2cloud.com/halo/halo-pro` 即可。
:::

![自定义 Compose 模板](/img/install/bt-panel/custom-compose.png)

安装完成后，进入 **Docker** 的 **已安装** 列表，等待 Halo 应用变为运行中状态。

![已安装的 Halo 应用](/img/install/bt-panel/installed.png)

## 配置网站和 SSL

如果你在安装 Halo 时填写了域名，宝塔通常会同步创建对应的网站配置。你可以在已安装应用卡片中点击 **管理网站**，或者直接进入左侧菜单的 **网站** 查看站点状态。

![网站列表](/img/install/bt-panel/ssl-status.png)

如果站点的 **SSL 证书** 一栏显示未部署，可以进入站点管理页面，在 **SSL** 标签页中申请证书。

![申请 SSL 证书](/img/install/bt-panel/request-ssl.png)

证书申请成功后，即可通过你配置的域名使用 `https` 访问 Halo。首次访问时，根据页面提示完成 Halo 的[初始化](../setup.md)即可。

::::info
如果证书申请失败，建议优先检查域名解析是否生效，以及服务器的 `80`、`443` 端口是否已经正确放行。
::::

## 升级 Halo

当需要升级 Halo 时，可以进入 **Docker** 的 **容器编排**，找到当前的 Halo 项目，修改镜像版本为最新版本，然后点击 **确定** 按钮即可完成升级。

:::info
查看最新版本请前往 [Halo 版本发布](https://releases.halo.run/)。
:::

![升级 Halo](/img/install/bt-panel/update.png)

更新完成后，宝塔会重新拉取镜像并重建相关容器。建议升级前先备份 Halo 数据目录和数据库，并前往 [Halo 版本发布](https://releases.halo.run/) 查看对应版本的更新说明。

## 激活许可证

可以参考 [许可证激活](../../user-guide/activate.md) 进行激活，社区版无需此步骤。
