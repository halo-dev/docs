---
title: 许可证激活
description: 介绍如何激活 Halo 付费版
---

:::note
此文档仅适用于 **[Halo 付费版](../getting-started/prepare.md#发行版本)**（专业版 / 商业版），在开始之前需要确保已经成功部署了 Halo 付费版。

社区版无需进行许可证激活。
:::

## 购买许可证

你可以在[凌霞软件](https://www.lxware.cn/halo)官网购买 Halo 付费版的许可证，目前分为 Halo 专业版和 Halo 商业版，支持按月/按年订阅或者版本买断。

在凌霞官网购买产品后，可以在 `个人中心` > `我的许可证` ，统一管理当前账户下的全部已购产品的许可证。

![许可证列表.png](/img/user-guide/activate/lxware-licenses.png)

## 部署 Halo 付费版

可以查阅：

- [使用 Docker Compose 部署](../getting-started/install/docker-compose.md)
- [使用 1Panel 部署](../getting-started/install/1panel.md)
- [使用 JAR 文件部署](../getting-started/install/jar-file.md)

## 查看产品版本信息

部署成功后，访问 `控制台` > `概览`，可以查看 Halo 版本信息，目前还处于未激活状态，需要按照后续步骤进行激活。

![未激活状态.png](/img/user-guide/activate/overview-activate.png)

## 查看已购产品许可证

登录到凌霞官网的 [订单列表](https://lxware.cn/uc/cloud/order)，点击已完成订单条目右侧的更多按钮，点击「许可证列表」，即可跳转至 `我的许可证` 列表，可以查看该订单所购产品的许可证。

![查看订单许可证.png](/img/user-guide/activate/lxware-licenses.png)

## 下载许可证

在 `我的许可证`列表，点击许可证条目右侧的更多按钮，点击「详情」；

![查看许可证详情.png](/img/user-guide/activate/lxware-licenses-operation-detail.png)

在详情页下载许可证文件，同时支持兑换包含在产品许可证内的免赠权益。

![下载许可证.png](/img/user-guide/activate/lxware-license-detail.png)

## 激活许可证

进入 `控制台` > `概览`，导入下载的许可证文件。

![导入许可证.png](/img/user-guide/activate/overview-import-license.png)

导入完成后，可以查看到更新的版本信息。许可证显示为「有效」即为激活成功，到此即可正常使用 Halo 付费版。

![激活成功.png](/img/user-guide/activate/overview-activated.png)

## 取消激活许可证

你可以随时在当前应用中取消激活许可证，取消后付费版功能将会受限。在许可证有效期内，许可证可被重新激活至其他设备中。

![取消激活.png](/img/user-guide/activate/overview-deactivate.png)

## 使用增值权益

> 随着 Halo 付费版订阅制的上线（2024-11-12），我们更新了获取增值权益即官方付费应用的方式。目前，用户可以直接通过 Halo 付费版许可证激活付费的插件和主题。
> 此外，从 2024-11-28 开始，通过付费版激活应用将开放给全部 Halo 付费版用户，你可以重新在凌霞官网下载许可证并激活，然后就可以通过付费版许可证激活所有官方付费应用。需要保证 Halo 付费版版本为 2.20.4 以上，应用市场插件的版本为 1.9.0 以上。相关阅读：[Halo 付费版永久授权增值权益的升级说明](https://www.lxware.cn/archives/benefits-upgrade)

在进行下面的步骤之前，请确保已经正常激活 Halo 付费版。

### 查看和下载付费应用

使用 Halo 付费版许可证激活后，就可以在内置的应用市场中查看所有可下载的付费应用。

![付费应用列表](/img/user-guide/activate/app-store.png)

### 激活付费应用

下载付费应用之后，即可在许可证管理中使用 Halo 付费版许可证进行激活。

![激活付费应用](/img/user-guide/activate/app-activate.png)

:::info 提示
如果你在激活前就启动了插件，那么在激活后可能需要重启插件才会生效。
:::

### Halo 付费版增值权益内容

所有付费版可以在许可证有效期内使用所有 Halo 官方发行的付费应用，包括在许可证有效期内新增的付费应用，[点击查看最新官方付费应用列表](https://www.halo.run/store/apps?price-mode=ONE_TIME&sort=creationTimestamp%2Cdesc&tag=official)。

查看当前许可证包含的付费应用可以在 `个人中心` > `我的许可证` 中进入具体 Halo 许可证的详情页面中查看，如下图：

![许可证包含的付费应用](/img/user-guide/activate/lxware-license-detail-apps.png)
