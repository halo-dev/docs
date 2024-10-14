---
title: 腾讯云轻量应用模板
description: 使用腾讯云轻量应用服务器的应用模板部署 Halo
---

腾讯云目前已经在轻量应用服务器的应用模板中添加了 Halo 的模板镜像，选择应用模板购买服务器之后就预装了 Halo 和 [1Panel](https://1panel.cn/)。

## 购买轻量应用服务器

购买地址：[轻量应用服务器](https://buy.cloud.tencent.com/lighthouse?blueprintType=APP_OS&blueprintOfficialId=lhbp-pjoqcja2&regionId=8&zone=ap-beijing-3&bundleId=bundle_starter_mc_med2_01&loginSet=AUTO&from=lh-console)

然后在应用模板中选择 Halo，然后选择所需地域、可用区、套餐等，点击立即购买即可。

![购买](/img/install/tencent-cloud-lighthouse/buy.png)

## 应用管理

![应用管理](/img/install/tencent-cloud-lighthouse/application.png)

服务器初始化完成之后，进入应用 **管理页面** 即可看到 Halo 和 1Panel 的相关信息。

## 访问 Halo

在 **应用管理** 页面中点击 **管理员登录地址** 即可进入 Halo 初始化页面，填写初始化信息即可完成 Halo 的安装。

![Halo 初始化](/img/install/tencent-cloud-lighthouse/halo-setup.png)

## 1Panel 管理

1. 在 **应用管理** 页面中可以看到预装的 1Panel 信息，首先需要将 1Panel 的端口开放，进入防火墙页面添加默认端口 8090 即可：

    ![防火墙](/img/install/tencent-cloud-lighthouse/firewall.png)
2. 登录到实例获取 1Panel 初始用户名和密码：

    ![1Panel 信息](/img/install/tencent-cloud-lighthouse/1panel-info.png)
3. 然后就可以通过 `http://ip:8090/tencentcloud` 进入 1Panel 的管理后台：

    ![1Panel 登录](/img/install/tencent-cloud-lighthouse/1panel-login.png)
    ![1Panel 概览](/img/install/tencent-cloud-lighthouse/1panel-overview.png)

## 查看预装应用

为了保证 Halo 的正常运行，1Panel 中预装了 Halo 所需的环境，可以在 **应用商店** 的 **已安装** 选项卡中查看：

![预装应用](/img/install/tencent-cloud-lighthouse/installed-apps.png)

关于应用商店，可查阅 [1Panel 文档](https://1panel.cn/docs/user_manual/appstore/appstore/)。

## 升级 Halo

在 **应用商店** 的 **可升级** 选项卡中检查 Halo 是否有更新，如果有新的版本，点击应用卡片的 **升级** 按钮即可。

![升级 Halo](/img/install/tencent-cloud-lighthouse/upgrade.png)

## 绑定域名

:::info
该操作要求用户有一个可用的域名，并在 DNS 服务商处添加对应的解析记录。
:::

在 **网站** 页面中，此镜像默认添加了一个关联 Halo 应用的网站，你可以点击配置按钮然后添加自己的域名。

![网站](/img/install/tencent-cloud-lighthouse/websites.png)

![添加域名](/img/install/tencent-cloud-lighthouse/domain.png)

除此之外，在绑定域名之后，还需要修改一下 Halo 的 **外部访问地址** 参数为实际的网站访问地址（如：[https://demo.halo.run](https://demo.halo.run)），否则 Halo 的部分功能或者插件可能会出现使用问题，只需要按照下图所示修改应用的参数然后点击确认即可。

![修改外部访问地址](/img/install/tencent-cloud-lighthouse/external-url.png)

关于网站管理，可查阅 [1Panel 文档](https://1panel.cn/docs/user_manual/websites/websites/)。
