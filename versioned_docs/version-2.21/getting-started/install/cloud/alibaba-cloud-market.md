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

## 管理 Halo

该镜像的 Halo 使用 Docker Compose 方式部署，相关文件位于 `/opt/halo` 目录中。

### 查看服务状态

```bash
cd /opt/halo
docker compose ps
```

### 升级 Halo

修改 `/opt/halo/docker-compose.yml` 中 Halo 容器使用的镜像标签为对应版本后，执行 `docker compose up -d` 命令即可进行升级。
