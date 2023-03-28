---
title: 使用 1Panel 部署
description: 使用 1Panel 部署
---

import DockerArgs from "./slots/docker-args.md"

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare)，这可以快速帮助你了解 Halo。
:::

## 简介

[1Panel](https://1panel.cn) 是一个现代化、开源的 Linux 服务器运维管理面板。

![1Panel 截图](https://1panel.cn/docs/img/index/overview.png)

### 1Panel 功能

- **快速建站：**深度集成 Wordpress 和 Halo，域名绑定、SSL 证书配置等一键搞定；
- **高效管理：**通过 Web 端轻松管理 Linux 服务器，包括应用管理、主机监控、文件管理、数据库管理、容器管理等；
- **安全可靠：**最小漏洞暴露面，提供防火墙和安全审计等功能；
- **一键备份：**支持一键备份和恢复，备份数据云端存储，永不丢失。

### 1Panel 安装

关于 1Panel 的安装部署与基础功能介绍，请参考 [1Panel 官方文档](https://1panel.cn/docs/installation/online_installation/)。此处假设你已经完成了 1Panel 的安装部署，并对其功能有了基础了解。

## 安装 MySQL 应用

在安装 Halo 之前需要先安装 MySQL 数据库。点击 1Panel 左侧导航菜单进入应用商店，选择其中的 MySQL 数据库进行安装。

![选择 MySQL 应用](/img/install/1panel-install-mysql.png)

在应用详情页选择 MySQL 8.0.30 版本进行安装。

![选择 MySQL 版本](/img/install/1panel-mysql-version.png)

在弹出的侧边栏中依次确认 MySQL 应用的名称、root用户密码及服务端口后，点击确认按钮开始安装。

![安装 MySQL](/img/install/1panel-mysql-config.png)

开始安装后页面自动跳转到已安装应用列表，等待刚刚安装的 MySQL 应用变为已启动状态。

![等待 MySQL 启动](/img/install/1panel-mysql-status.png)

## 安装 Halo 应用

MySQL 安装成功后，再次进入应用商店应用列表，选择其中的 Halo 应用进行安装。

![选择 Halo 应用](/img/install/1panel-install-halo.png)

在应用详情页选择最新的 Halo 版本进行安装。

![选择 Halo 版本](/img/install/1panel-halo-version.png)

在弹出的侧边栏中依次确认 Halo 应用的名称，并在数据库服务中下拉选择上一步创建的数据库应用，确认其他参数信息后，点击确认按钮进行安装。

![安装 Halo](/img/install/1panel-halo-config.png)

:::info参数说明

- **名称：**要创建的 Halo 应用的名称；
- **数据库服务：**Halo 应用使用的数据库应用，支持下拉选择已安装的数据库应用，1Panel 会自动配置 Halo 使用该数据库；
- **数据库名：**Halo 应用使用的数据库名称，1Panel 会在选中的数据库中自动创建这个数据库；
- **数据库用户：**Halo 应用使用的数据库用户名，1Panel 会在选中的数据库中自动创建这个用户，并添加对应的数据库授权；
- **数据库用户密码：**Halo 应用使用的数据库用户密码，1Panel 会在选中的数据库中自动为上一步创建的用户配置该密码；
- **超级管理员用户名：**Halo 应用初始化创建的超级管理员用户名；
- **超级管理员密码：**Halo 应用初始化创建的超级管理员密码；
- **外部访问地址：**Halo 应用的最终访问地址，如果有为 Halo 规划域名，需要配置为域名格式，例如 `http://halo.example.com`；否则配置为 `http://服务器IP:PORT`，例如 `http://172.16.10.154:8090`；
- **端口：**Halo 应用的服务端口；
:::

开始安装后页面自动跳转到已安装应用列表，等待刚刚安装的 Halo 应用变为已启动状态。

![等待 Halo 启动](/img/install/1panel-halo-status.png)

此时便可以通过配置的外部访问地址来访问 Halo 了。

![访问 Halo](/img/install/1panel-access-halo.png)
