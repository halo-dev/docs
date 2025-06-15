---
title: 阿里云云市场部署
description: 使用阿里云云市场镜像部署 Halo
---

阿里云云市场提供围绕云计算产品的软件应用及服务，包括数据与 API、专业服务、基础软件、建站小程序、企业应用、安全、AI 与大数据计算、开发与运维、解决方案以及 IoT 十大类目市场，商品数量达上万种。

Halo 目前已上架至阿里云云市场，助力用户打造高效便捷的建站体验！本指南将介绍如何通过阿里云云市场购买、部署和使用 **Halo** 镜像，并提供购买服务器的优惠链接。

阿里云的 Halo 镜像不仅包括了已经部署好的 Halo 服务，还集成了 [1Panel](https://1panel.cn/) Linux 管理面板，可以更加方便地升级 Halo 和配置网站。

## 购买服务器

### 通过优惠链接

目前阿里云针对 Halo 用户推出了 5.5 折优惠，您可以通过以下链接购买服务器：[专属阿里云特价链接 5.5 折优惠](https://market.aliyun.com/common/dashi/halo?userCode=kmemb8jp)

![阿里云活动](/img/install/alibaba-cloud-market/buy-1.png)

![阿里云 ECS](/img/install/alibaba-cloud-market/buy-2.png)

### 创建 ECS 时选择 Halo 镜像

您也可以自行购买[阿里云服务器](https://ecs-buy.aliyun.com/ecs?userCode=kmemb8jp)，并在选择镜像时选择云市场镜像并搜索 **Halo**，即可快速选择镜像进行部署。

![阿里云 ECS](/img/install/alibaba-cloud-market/buy-3.jpeg)

![阿里云 ECS](/img/install/alibaba-cloud-market/buy-4.jpeg)

服务器初始化完成之后，进入 ECS 控制台即可看到服务器信息，如下图所示：

![阿里云 ECS 控制台](/img/install/alibaba-cloud-market/instance.png)

## 访问 Halo

首先需要在服务器的安全组开放 80 端口，然后就可以通过服务器的公网 IP 访问 Halo 了。

![安全组 HTTP](/img/install/alibaba-cloud-market/iptables-http.jpeg)

首次访问会进入 Halo 初始化页面，填写初始化信息即可完成 Halo 的安装。

:::info 提示
Halo 初始化文档可查阅：[初始化](../../setup.md)
:::

## 1Panel 管理

1. 登录到服务器，执行 `1pctl user-info` 即可看到 1Panel 的登录信息。

    ![1Panel 信息](/img/install/alibaba-cloud-market/get-1panel-info.png)
2. 开放 1Panel 占用的端口，进入安全组配置页面添加默认端口 8090 即可。

    ![安全组 1Panel](/img/install/alibaba-cloud-market/iptables-1panel.jpeg)
3. 然后就可以通过上面的信息访问到 1Panel 面板：

    ![1Panel](/img/install/alibaba-cloud-market/1panel.png)

## 查看预装应用

为了保证 Halo 的正常运行，1Panel 中预装了 Halo 所需的环境，可以在 **应用商店** 的 **已安装** 选项卡中查看：

![预装应用](/img/install/alibaba-cloud-market/1panel-installed-apps.png)

关于应用商店，可查阅 [1Panel 文档](https://1panel.cn/docs/user_manual/appstore/appstore/)。

## 升级 Halo

在 **应用商店** 的 **可升级** 选项卡中检查 Halo 是否有更新，如果有新的版本，点击应用卡片的 **升级** 按钮即可。

![升级 Halo](/img/install/alibaba-cloud-market/1panel-upgrade-halo.png)

## 绑定域名

:::info
该操作要求用户有一个可用的域名，并在 DNS 服务商处添加对应的解析记录。
:::

在 **网站** 页面中，此镜像默认添加了一个关联 Halo 应用的网站，你可以点击配置按钮然后添加自己的域名。

![网站](/img/install/alibaba-cloud-market/1panel-website.png)

![添加域名](/img/install/alibaba-cloud-market/1panel-add-domain.png)

除此之外，在绑定域名之后，还需要修改一下 Halo 的 **外部访问地址** 参数为实际的网站访问地址（如：[https://demo.halo.run](https://demo.halo.run)），否则 Halo 的部分功能或者插件可能会出现使用问题，只需要按照下图所示修改应用的参数然后点击确认即可。

![修改外部访问地址](/img/install/alibaba-cloud-market/1panel-update-halo-external-url.png)

关于网站管理，可查阅 [1Panel 文档](https://1panel.cn/docs/user_manual/websites/websites/)。
