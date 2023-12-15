---
title: 使用 Zeabur 部署
description: 使用 Zeabur 部署
---

import DockerArgs from "./slots/docker-args.md"

:::info
在继续操作之前，我们推荐您先阅读[《写在前面》](../prepare)，这可以快速帮助您了解 Halo。
:::

:::info
在 Zeabur 部署 Halo 需要升级至开发者方案，价格为每月 US$ 5.00。除去每月固定的订阅费后，剩下的部分为用量计费，其中包含每月 US$ 5.00 的免费额度。
详情请参考：[Zeabur 定价](https://zeabur.com/pricing)
:::

## Zeabur 简介

[Zeabur](https://zeabur.com) 是一个服务部署平台，可以帮助您一键部署各种类型的服务，包括 Halo。

![Zeabur 截图](/img/install/zeabur/zeabur-website.png)

### 使用 Zeabur 的优势

- 一键部署 Halo：您只需要点击一下按钮即可自动部署 Halo ，一分钟内即可完成部署。
- 无痛升级版本：您可以在 Zeabur 的控制台中轻松升级或指定 Halo 的版本。
- 数据备份能力：您可以在 Zeabur 的控制台中手动备份 Halo 的数据。

## 注册 Zeabur 账号

首先，您需要注册一个 Zeabur 账号。您可以参考官方的指南：[开始使用 Zeabur](https://zeabur.com/docs/zh-CN/get-started)

:::info
您需要一个 GitHub 账号以注册 Zeabur 账号。
:::

## 部署 Halo

Zeabur 提供了一键部署 Halo 的能力。注册完成并升级至开发者方案后，您只需要点击下方的按钮即可自动开始部署 Halo。

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/Q6H2MA)

### 配置域名

部署完成后，大概需要等待三十秒启动 Halo 和数据库，您可以在等待期间为 Halo 配置域名。

在 Zeabur 控制台的 Halo 服务中，打开 `Networking` 选项卡，您可以在这里配置 Halo 的域名。

![Zeabur 配置域名](/img/install/zeabur/zeabur-domain.png)

Zeabur 提供了两种配置域名的选项：使用 Zeabur 提供的免费的二级域名或绑定您自己的域名

关于如何更改自定义域名的 DNS 记录，请参考 [配置自定义域名](https://zeabur.com/docs/deploy/zh-CN/domain-binding)

## 升级版本

部署完成以后，您可以随时在 Zeabur 控制台中更新 Halo 的版本。

在 Zeabur 控制台的 Halo 服务中，打开 `Settings` 选项卡，您可以在这里更新 Halo 的版本。

![Zeabur 配置域名](/img/install/zeabur/zeabur-domain.png)

输入您想要更新的版本号，点击保存，您的 Halo 服务就将自动重启以应用最新的版本，整个过程只需要几秒钟。

## 备份数据

Zeabur 同时也提供了手动备份 Halo 数据的能力，让您不需要担心数据丢失的问题。

在 Zeabur 控制台的 Halo 服务中，打开 `Backup` 选项卡，您可以在这里手动备份 Halo 的数据。

![Zeabur 备份](/img/install/zeabur/zeabur-backup.png)
