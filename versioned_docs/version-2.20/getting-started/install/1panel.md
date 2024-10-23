---
title: 使用 1Panel 部署
description: 使用 1Panel 部署
---

import DockerArgs from "./slots/_docker-args.md"

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare)，这可以快速帮助你了解 Halo。
:::

## 1Panel 简介

[1Panel](https://1panel.cn) 是一个现代化、开源的 Linux 服务器运维管理面板。

![1Panel 截图](/img/install/1panel/1panel.png)

### 功能

- **快速建站**：深度集成 WordPress 和 Halo，域名绑定、SSL 证书配置等一键搞定。
- **高效管理**：通过 Web 端轻松管理 Linux 服务器，包括应用管理、主机监控、文件管理、数据库管理、容器管理等。
- **安全可靠**：最小漏洞暴露面，提供防火墙和安全审计等功能。
- **一键备份**：支持一键备份和恢复，备份数据云端存储，永不丢失。

### 安装

关于 1Panel 的安装部署与基础功能介绍，请参考 [1Panel 官方文档](https://1panel.cn/docs/installation/online_installation/)。此处假设你已经完成了 1Panel 的安装部署，并对其功能有了基础了解。

### 安装基础软件

在安装 Halo 之前，我们需要先在 1Panel 上安装好所需的软件，包括 OpenResty 和数据库（MySQL、PostgreSQL、MariaDB 都可以）。在接下来的文档中，我们会默认你已经安装好了这两个软件，并不再赘述。

![OpenResty 和 MySQL](/img/install/1panel/openresty-mysql.png)

## 安装 Halo 应用

进入应用商店应用列表，选择其中的 Halo 应用进行安装。

![选择 Halo 应用](/img/install/1panel/app-store-halo.png)

在应用详情页选择最新的 Halo 版本进行安装。

![选择 Halo 版本](/img/install/1panel/install-halo.png)

参数说明：

- **名称**：要创建的 Halo 应用的名称。
- **版本**：选择最新的版本即可。
- **数据库服务**：Halo 应用使用的数据库应用，支持下拉选择已安装的数据库应用，1Panel 会自动配置 Halo 使用该数据库。
- **数据库名**：Halo 应用使用的数据库名称，1Panel 会在选中的数据库中自动创建这个数据库。
- **数据库用户**：Halo 应用使用的数据库用户名，1Panel 会在选中的数据库中自动创建这个用户，并添加对应的数据库授权。
- **数据库用户密码**：Halo 应用使用的数据库用户密码，1Panel 会在选中的数据库中自动为上一步创建的用户配置该密码。
- **外部访问地址**：Halo 应用的最终访问地址，如果有为 Halo 规划域名，需要配置为域名格式，例如 `http://halo.example.com`。否则配置为 `http://服务器IP:PORT`，例如 `http://192.168.1.1:8090`。
- **端口**：Halo 应用的服务端口。

开始安装后页面自动跳转到已安装应用列表，等待刚刚安装的 Halo 应用变为已启动状态。

![Halo 运行状态](/img/install/1panel/halo-status.png)

## 创建网站

完成 Halo 应用的安装后，此时并不会自动创建一个网站，我们需要手动创建一个网站，然后将 Halo 应用绑定到这个网站上才能使用域名访问。

点击 1Panel 菜单的 **网站**，进入网站列表页，点击 **创建网站** 按钮。

![创建网站](/img/install/1panel/new-site.png)

1. 在已装应用中选择我们刚刚新建的 Halo 应用。
2. 正确填写主域名，需要注意的是需要提前解析好域名到服务器 IP。

最后，点击确认按钮，等待网站创建完成即可访问网站进行 [初始化](../setup.md)。

![网站列表](/img/install/1panel/site.png)
