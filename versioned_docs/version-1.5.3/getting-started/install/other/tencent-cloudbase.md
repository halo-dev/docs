---
title: 腾讯云 CloudBase
description: 使用腾讯云 CloudBase 一键部署
---

## 声明

1. 本组织与腾讯云官方无任何合作和利益关系。
2. 您在使用期间如果有腾讯云所带来的问题，均与我们无关。
3. 开始之前，我们默认认为您已经了解过 [腾讯云云开发](https://cloud.tencent.com/product/tcb)。

## 注意事项

1. 系统使用内置的 H2 Database，暂不支持使用 MySQL。
1. 工作目录保存在腾讯云提供的 CFS 上，在使用此方式创建应用的时候会要求创建 CFS。
1. 目前使用该方式部署，不支持修改 [配置文件](/getting-started/config)。
1. 费用相关请参考 <https://cloud.tencent.com/document/product/876/18864>

## 进入云开发页面

点击下方按钮即可进入到腾讯云云开发 CloudBase 创建应用界面，此按钮可在云开发页面自动选择 Halo 的配置模板。

### GitHub

[![CloudBase](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhalo-dev%2Ftencent-cloudbase-halo&branch=master)

### Gitee

[![CloudBase](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgitee.com%2Fhalo-dev%2Ftencent-cloudbase-halo&branch=master)

## 配置并部署

**填写环境名称**，这里建议把 `开启免费额度` 打开，然后点击下一步。

![tencent-cloudbase-1.png](/img/tencent-cloudbase/tencent-cloudbase-1.png)

**应用配置**，需要注意：这里需要开通 CFS，用于存储 Halo 的工作目录。

![tencent-cloudbase-2.png](/img/tencent-cloudbase/tencent-cloudbase-2.png)

**提交授权**，点击 `授权并开通`。

![tencent-cloudbase-3.png](/img/tencent-cloudbase/tencent-cloudbase-3.png)

**创建环境中**，完成之后，点击 `环境` 下面的卡片，即可进入详细配置页面。

![tencent-cloudbase-4.png](/img/tencent-cloudbase/tencent-cloudbase-4.png)

**构建应用中**，这里可能会等待较长时间。

![tencent-cloudbase-5.png](/img/tencent-cloudbase/tencent-cloudbase-5.png)

**构建应用完成**，需要注意的是，构建完成之后可能还需要等待一小段时间才能正常访问，这个期间是在等待 Halo 应用启动完毕。点击 `访问` 按钮即可进入 Halo 初始化页面。

![tencent-cloudbase-6.png](/img/tencent-cloudbase/tencent-cloudbase-6.png)

**Halo 初始化页面**：

![tencent-cloudbase-7.png](/img/tencent-cloudbase/tencent-cloudbase-7.png)

**CFS 管理页面**：[https://console.cloud.tencent.com/cfs/fs](https://console.cloud.tencent.com/cfs/fs)

![tencent-cloudbase-8.png](/img/tencent-cloudbase/tencent-cloudbase-8.png)

## 更新 Halo

> 当 Halo 有新版本更新的时候，你可以采用下面的方式进行版本升级。

### 删除旧版本

前往 [云托管](https://console.cloud.tencent.com/tcb/service) 页面，点击服务名称进入版本列表，然后删除当前使用的版本。

![tencent-cloudbase-10.png](/img/tencent-cloudbase/tencent-cloudbase-10.png)

### 重新部署

回到 [我的应用](https://console.cloud.tencent.com/tcb/apps/index) 页面，点击 `部署` 按钮并确定。

![tencent-cloudbase-11.png](/img/tencent-cloudbase/tencent-cloudbase-11.png)

## 相关链接

- [Halo 配置文件仓库](https://github.com/halo-dev/tencent-cloudbase-halo)
- [腾讯云 CloudBase](https://console.cloud.tencent.com/tcb/env/index)
- [云开发使用指南](https://cloud.tencent.com/document/product/876)
